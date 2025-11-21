
import jwt from "jsonwebtoken";

export const generatedAdminToken = (adminId, res) => {
  const token = jwt.sign(
    { userId: adminId, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );

  res.cookie("adminjwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
       path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
};
