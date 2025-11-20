import express from "express"
import { createBus, deletebus, deleteticket, login, signupadmin, updatebus,getCancelledBookings, getallbus, getallticket, bookingAnalyticsRoute, Admingetme, logout } from "../controller/admin.controller.js"

import protectAdminRoutes from "../middleware/protectadminRoutes.js"
const router=express.Router()
router.get("/adminget",protectAdminRoutes,Admingetme)
router.post("/adminsignup",signupadmin)
router.post("/adminlogin",login)
router.post("/adminlogout",logout)
router.get("/getallbus",protectAdminRoutes,getallbus)
router.post("/createbus",createBus)
router.post("/updatebus/:id",protectAdminRoutes,updatebus)
router.get("/allticket",getallticket)
router.delete("/deleteticket/:id",deleteticket)
router.delete("/deletebus/:id",protectAdminRoutes,deletebus)
router.get("/cancelled",getCancelledBookings);
router.get("/daily-sales",bookingAnalyticsRoute)
export default router