import express from "express"
import { getme, login, signup } from "../controller/authu.controller.js"
import {protectRoutes} from "../middleware/protectRoutes.js"
import { logouts } from "../token/generatedToken.js"


const router=express.Router()
router.get("/getme",protectRoutes,getme)
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logouts)
export default router