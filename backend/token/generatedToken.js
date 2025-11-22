import jwt from "jsonwebtoken";


export const generatedToken = (userId, role, res) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });
};

export const logouts = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      expires: new Date(0),
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logout:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};
