import jwt from "jsonwebtoken";
import { User } from "./user.model";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.assessToken

    if(!token){
      throw new Error("Session Expired")
    }

    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if(!user){
      throw new Error("Invalid Token")
    }

    req.user = user;

    next();
    
  } catch (error) {
    throw new Error(error?.message || "Session Expired")
  }
}