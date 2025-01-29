import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log(token);

    if (!token) {
      return apiError(res, 401, "Token not found");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken || !decodedToken._id) {
      return apiError(res, 401, "Invalid or expired token");
    }

    console.log("User ID from token:", decodedToken._id);

    // Find the user associated with the token
    const loggedInUser = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!loggedInUser) {
      return apiError(res, 404, "User not found");
    }

    // Attach the user to the request object
    req.user = loggedInUser;
    console.log(req.user)

    // Pass control to the next middleware or controller
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return apiError(res, 500, "Error verifying token");
  }
});

export { verifyJWT };
