import jwt from "jsonwebtoken"

export const generatedToken=(userId,res)=>{
    const token =jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"15d"
     
    })
        
    res.cookie("jwt",token,{
        httpOnly:true,
       secure: true,         // 🔥 required for Render (HTTPS)
    sameSite: "none", 
         maxAge:15*24*60*60*1000,
        
    })
    
}    