import Bus from "../models/bus.js"
import Booking from "../models/Booking.js"
import Review from "../models/Review.js"
import { sendTicketEmail } from "./emai.controllers.js"

export const searchBusByDate = async (req, res) => {
  try {
    const { from, to, date, bustype, minPrice, maxPrice } = req.body;

    if (!from || !to || !date) {
      return res.status(400).json({
        error: "Fields 'from', 'to', and 'date' are required",
      });
    }

    const minP = minPrice ? Number(minPrice) : undefined;
    const maxP = maxPrice ? Number(maxPrice) : undefined;

    //  Normalize date (important for timezone consistency)
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const dayStart = new Date(normalizedDate);
    const dayEnd = new Date(normalizedDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Find buses for route and date
    const query = {
      $or: [
        {
          from: { $regex: new RegExp(`^${from}$`, "i") },
          to: { $regex: new RegExp(`^${to}$`, "i") },
          startDate: { $lte: dayEnd },
          endDate: { $gte: dayStart },
        },
        {
          from: { $regex: new RegExp(`^${to}$`, "i") },
          to: { $regex: new RegExp(`^${from}$`, "i") },
          startDate: { $lte: dayEnd },
          endDate: { $gte: dayStart },
        },
      ],
    };

    const buses = await Bus.find(query);

    if (!buses || buses.length === 0) {
      return res.status(404).json({
        message: "No buses found for this route on the selected date",
      });
    }

    //  Get booked seats for the *exact* travel date
    const bookedSeats = await Booking.find({
      travelDate: normalizedDate,
      status: "booked",
    }).select("bus seatNumber");

    // Create lookup map: { busId: [seatNumbers] }
    const bookedMap = {};
    bookedSeats.forEach((b) => {
      const busId = b.bus.toString();
      if (!bookedMap[busId]) bookedMap[busId] = [];
      bookedMap[busId].push(b.seatNumber);
    });

    //  Filter buses and available seats
    const filteredBuses = buses
      .map((bus) => {
        const seatsInDb = Array.isArray(bus.seats) ? bus.seats : [];
        const bookedForBus = bookedMap[bus._id.toString()] || [];

        let availableSeats = seatsInDb.filter(
          (s) => !bookedForBus.includes(s.seatNumber)
        );

        //  Bustype filter
        if (bustype) {
          const bustypeLower = bustype.toLowerCase().trim();
          const busMatches =
            bus.bustype && bus.bustype.toLowerCase().includes(bustypeLower);

          if (!busMatches) {
            availableSeats = availableSeats.filter(
              (seat) =>
                seat.seatType &&
                seat.seatType.toLowerCase().includes(bustypeLower)
            );
          }
        }

        //  Price filter
        if (minP !== undefined || maxP !== undefined) {
          availableSeats = availableSeats.filter((seat) => {
            const price = Number(seat.price);
            if (minP !== undefined && price < minP) return false;
            if (maxP !== undefined && price > maxP) return false;
            return true;
          });
        }

        const availableSeatsCount = availableSeats.length;
        const totalSeats = bus.totalSeats || seatsInDb.length;

        if (availableSeatsCount > 0) {
          return {
            ...bus.toObject(),
            seats: availableSeats,
            availableSeatsCount,
            totalSeats,
          };
        }
        return null;
      })
      .filter(Boolean);

    if (filteredBuses.length === 0) {
      return res.status(404).json({
        message: "No available seats match the selected filters",
      });
    }

    return res.status(200).json({
      total: filteredBuses.length,
      buses: filteredBuses,
    });
  } catch (error) {
    console.error("Error in searchBusByDate:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const ticketBook = async (req, res) => {
  try {
    const {
      busId,
      passengers, // [{ seatNumber, passengerName, passengerAge }]
      phoneNumber,
      email,
      pickupLocation,
      pickupTime,
      dropLocation,
      dropTime,
      date,
    } = req.body;

    if (
      !busId ||
      !Array.isArray(passengers) ||
      passengers.length === 0 ||
      !phoneNumber ||
      !email ||
      !pickupLocation ||
      !dropLocation ||
      !pickupTime ||
      !dropTime ||
      !date
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
        //Normalize travel date to midnight (prevents timezone issues)
    const travelDate = new Date(date);
    travelDate.setHours(0, 0, 0, 0);

    //  Find the bus operating on that date
    const bus = await Bus.findOne({
      _id: busId,
      startDate: { $lte: travelDate },
      endDate: { $gte: travelDate },
    });

    if (!bus) {
      return res.status(404).json({ message: "No bus found on this date" });
    }

    // Validate pickup/drop
    if (
      bus.pickupLocation !== pickupLocation ||
      bus.pickupTime !== pickupTime ||
      bus.dropLocation !== dropLocation ||
      bus.dropTime !== dropTime
    ) {
      return res
        .status(400)
        .json({ message: "Pickup/Drop details do not match bus schedule" });
    }

    //  Check for existing bookings for this normalized date
    const seatNumbers = passengers.map((p) => p.seatNumber);
    const existingBookings = await Booking.find({
      bus: busId,
      seatNumber: { $in: seatNumbers },
      travelDate,
      status: "booked",
    });

    if (existingBookings.length > 0) {
      const bookedSeats = existingBookings.map((b) => b.seatNumber).join(", ");
      return res.status(400).json({
        message: `Seats already booked for this date: ${bookedSeats}`,
      });
    }

    //  Create new bookings
    const newBookings = [];
    for (const passenger of passengers) {
      const seat = bus.seats.find((s) => s.seatNumber === passenger.seatNumber);
      if (!seat) {
        return res
          .status(400)
          .json({ message: `Invalid seat: ${passenger.seatNumber}` });
      }

      const booking = new Booking({
        bus: bus._id,
        user: req.user?._id || null,
        seatNumber: passenger.seatNumber,
        passengerName: passenger.passengerName,
        passengerAge: passenger.passengerAge,
        phoneNumber,
        email,
        pricePaid: seat.price || 0,
        pickupLocation,
        pickupTime,
        dropLocation,
        dropTime,
        travelDate, 
        busName: bus.busName,
        busNumber: bus.busNumber,
        route: `${bus.from} → ${bus.to}`,
        status: "booked",
      });

      await booking.save();
      newBookings.push(booking);
    }

    //  Send confirmation email
    const seatSummary = newBookings
      .map(
        (b) => `${b.seatNumber} (${b.passengerName}, Age ${b.passengerAge})`
      )
      .join(", ");

    await sendTicketEmail({
      to: email,
      passengerName: passengers[0].passengerName,
      journeyDate: travelDate.toDateString(),
      seatSummary,
      pickupLocation,
      pickupTime,
      dropLocation,
      dropTime,
      busName: bus.busName,
      busNumber: bus.busNumber,
      route: `${bus.from} → ${bus.to}`,
    });

    return res.status(201).json({
      success: true,
      message: "🎉 Tickets booked successfully and email sent.",
      route: `${bus.from} → ${bus.to}`,
      bookings: newBookings,
    });
  } catch (error) {
    console.error("Error in ticketBook:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};



export const getTicket=async(req,res)=>{
  try{
const {id}=req.params
const getticket=await Booking.findById(id)
if(!getticket){
  return res.status(404).json({error:"ticket not found"})
}
res.status(200).json(getticket)
  }catch(error){
    console.error("Error in getticketBook:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    //  Find booking
    const booking = await Booking.findById(bookingId).populate("bus");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    //  Check if already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "This booking is already cancelled." });
    }

    //  Calculate journey start time
    const journeyDateTime = new Date(booking.travelDate);
    const [pickupHour, pickupMinute] = booking.pickupTime.split(":");
    const isPM = booking.pickupTime.toLowerCase().includes("pm");
    let hours = parseInt(pickupHour);
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0; 

    journeyDateTime.setHours(hours);
    journeyDateTime.setMinutes(parseInt(pickupMinute));

    //  Check time difference
    const now = new Date();
    const diffHours = (journeyDateTime - now) / (1000 * 60 * 60); 

    if (diffHours < 3) {
      return res.status(400).json({
        message: "Tickets can only be cancelled at least 3 hours before departure.",
      });
    }

    //  Update booking status
    booking.status = "cancelled";
    await booking.save();

  
    await Bus.updateOne(
      { _id: booking.bus._id, "seats.seatNumber": booking.seatNumber },
      { $set: { "seats.$.isBooked": false } }
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully. Seat is now available.",
    });
  } catch (error) {
    console.error("Error in cancelBooking:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//post the review after the droptime end
export const review =async(req,res)=>{
  try{
    const userId = req.user.id;
    const { busId, bookingId } = req.params;
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Verify booking exists and belongs to this bus and user
    const booking = await Booking.findOne({ _id: bookingId, bus: busId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    if ( new Date() < booking.dropTime ) {
      return res.status(400).json({ message: "Journey not completed yet — cannot review now" });
    }

    const review = await Review.create({
      bus: busId,
      booking: bookingId,
       user: userId,
      rating,
      comment
    });

  
    const bus = await Bus.findById(busId);
    const reviews = await Review.find({ bus: busId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    bus.numReviews = reviews.length;
    bus.rating = avgRating;
    await bus.save();

    return res.status(201).json({ success: true, review });
  }catch(error){
     console.error("Error in review:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id; // comes from authMiddleware
    const myBookings = await Booking.find({ user: userId })
      //.populate("bus", "busName busNumber ")
      //.sort({ createdAt: -1 });

    if (!myBookings || myBookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    res.status(200).json(myBookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
