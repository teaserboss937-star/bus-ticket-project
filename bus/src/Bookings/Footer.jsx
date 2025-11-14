import React from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#f8f8f8] text-gray-700 border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">

        
        <div>
          <h2 className="text-xl font-bold text-[#d84e55] mb-3">KR Travels</h2>
          <p className="text-sm leading-relaxed">
            KR Travels is a trusted travel partner, providing safe, comfortable, and
            affordable bus journeys across India. Travel made easy with Rajesh’s KR Travels.
          </p>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-3">Head Office</h3>
          <div className="flex items-start gap-2 mb-2">
            <MapPin size={18} className="text-[#d84e55]" />
            <p className="text-sm">
              12, Gandhipuram , Near Central Bus Stand,<br />
              Coimbatore, Tamil Nadu – 600002
            </p>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Phone size={18} className="text-[#d84e55]" />
            <p className="text-sm">+91 98765 43210</p>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-[#d84e55]" />
            <p className="text-sm">support@krtravels.in</p>
          </div>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-[#d84e55]">Home</a></li>
            <li><a href="/my-bookings" className="hover:text-[#d84e55]">My Bookings</a></li>
            <li><a href="/about" className="hover:text-[#d84e55]">About Us</a></li>
            <li><a href="/contact" className="hover:text-[#d84e55]">Contact Us</a></li>
            <li><a href="/terms" className="hover:text-[#d84e55]">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:text-[#d84e55]">Privacy Policy</a></li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#d84e55]">
              <Facebook size={22} />
            </a>
            <a href="#" className="hover:text-[#d84e55]">
              <Instagram size={22} />
            </a>
            <a href="#" className="hover:text-[#d84e55]">
              <Twitter size={22} />
            </a>
          </div>
          <p className="text-sm mt-4 text-gray-600">
            Follow us for latest travel offers and updates.
          </p>
        </div>
      </div>

      {/* === Bottom Bar === */}
      <div className="bg-[#d84e55] text-white text-center text-sm py-3">
        © {new Date().getFullYear()} KR Travels by Rajesh | All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
