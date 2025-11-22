import express from "express"
import { createBus, deletebus, deleteticket,loginAdmin, signupadmin, updatebus,getCancelledBookings, getallbus, getallticket, bookingAnalyticsRoute,  } from "../controller/admin.controller.js"
import {getme} from "../controller/authu.controller.js"
import { protectRoutes } from "../middleware/protectRoutes.js"
import { adminOnly } from "../middleware/protectRoutes.js"
import { logouts } from "../token/generatedToken.js"
const router=express.Router()
router.get("/adminget",protectRoutes,adminOnly,getme)
router.post("/adminsignup",signupadmin)
router.post("/adminlogin",loginAdmin)
router.post("/adminlogout",logouts)
router.get("/getallbus",protectRoutes,adminOnly,getallbus)
router.post("/createbus",createBus)
router.post("/updatebus/:id",protectRoutes,adminOnly,updatebus)
router.get("/allticket",getallticket)
router.delete("/deleteticket/:id",deleteticket)
router.delete("/deletebus/:id",protectRoutes,adminOnly,deletebus)
router.get("/cancelled",getCancelledBookings);
router.get("/daily-sales",bookingAnalyticsRoute)
export default router