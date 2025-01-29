import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiSuccess } from "../utils/apiSuccess.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


//      create access and refresh tokens

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw apiError(
      res,
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};


//       {user registartion}

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    return apiError(res, 400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    return apiError(res, 409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  console.log("Avatar Local Path:", avatarLocalPath);

  let coverImageLocalPath = null;
  if (req.files?.coverImage?.[0]?.path) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  console.log("Cover Image Local Path:", coverImageLocalPath);

  // Validate that avatar file is provided
  if (!avatarLocalPath) {
    return apiError(res, 400, "Avatar file is required");
  }

  // Upload avatar to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    return apiError(res, 500, "Failed to upload avatar file");
  }
  console.log("Avatar Uploaded to Cloudinary:", avatar.url);

  // Upload cover image to Cloudinary (optional)
  let coverImage = null;
  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (coverImage) {
      console.log("Cover Image Uploaded to Cloudinary:", coverImage.url);
    } else {
      console.warn("Failed to upload cover image, proceeding without it");
    }
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return apiError(
      res,
      500,
      "Something went wrong while registering the user"
    );
  }

  return apiSuccess(res, 201, "User registered successfully", createdUser);
});


//               {user login}

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // Validate input
  if (!username && !email) {
    return apiError(res, 400, "Username or email is required");
  }

  // Find the user by email or username
  const user = await User.findOne({ $or: [{ username }, { email }] });

  // If user not found
  if (!user) {
    return apiError(res, 404, "User does not exist");
  }

  // Check if the password is valid
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return apiError(res, 401, "Invalid user credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  // Fetch user details excluding sensitive fields
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Set secure cookies for tokens
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)    // you are sending cookies here and setting the tokens in the cookies so they are also getting send in headers
                                                    //so you dont need to send token in auth manually only do this when you are sending
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
    });
});

//          {user logout}

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res.clearCookie("accessToken", options).clearCookie("refreshToken", options);

  return apiSuccess(res, 200, "User logged out successfully");
});


//              {generate new refershtoken}
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      return apiError(res, 401, "No refresh token provided");
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      return apiError(res, 404, "user not found");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      return apiError(res, 401, "Invalid refresh token");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user?._id);

    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options);
    return apiSuccess(
      res,
      200,
      { accessToken, refreshToken: newRefreshToken },
      "Access token refreshed"
    );
  } catch (error) {
    return apiError(404, "no refresh token or user found");
  }
});


//          {change and update password}

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const { newPassword, oldPassword , confrmPassword} = req.body;

    // Check if both passwords are provided
    if (!newPassword || !oldPassword) {
      return apiError(res, 400, "Both old and new passwords are required");
    }
    if(!(newPassword===confrmPassword)){
      return apiError(res, 400, "please re confirm your new password");
    }

    // Find the user in the database
    const user = await User.findById(req.user?._id);
    if (!user) {
      return apiError(res, 404, "User not found");
    }

    // Validate old password
    const isMatch = await user.isPasswordCorrect(oldPassword);
    if (!isMatch) {
      return apiError(res, 400, "Old password is incorrect");
    }

    // Check if the new password is the same as the old password
    if (newPassword === oldPassword) {
      return apiError(
        res,
        400,
        "New password cannot be the same as the old password"
      );
    }

    // Update the password (hashed automatically by the pre-hook)
    user.password = newPassword;
    await user.save({validateBeforeSave:false});

    return apiSuccess(res, 200, "Password updated successfully");
  } catch (error) {
    return apiError(res, 500, "An unexpected error occurred");
  }
});


//       {get user profile}

const  getUserProfile= asyncHandler(async(req,res)=>{
    
  try {
    const loggedInuserProfile= req.user;
    return apiSuccess(res, 200, "user detials fectched successfuly",loggedInuserProfile);
  } catch (error) {
    return apiError(res,404,"Unable to get user details")
  }


})


//      {update user profile}

const updateAccountDetails= asyncHandler(async(req,res)=>{
   
 try {
   const {username,fullName,email}= req.body
  //    req.user.username= username          //this is also an way of updating user details using pre save miidleware
  //    req.user.fullName= fullName
  //    req.user.email= email
  //    await req.user.save({validateBeforeSave:false})


     const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
          $set: {
              fullName:fullName,
              email: email,
              username: username
          }
      },
      {new: true}
      
  ).select("-password")

     return apiSuccess(res, 200, "Account details updated successfully",updatedUser);
 } catch (error) {
     return apiError(res,404,"unable to update account details")
 }
   
})

//                 {update avatar image file}

const updateAvatar= asyncHandler(async(req,res)=>{

try {
  const avatarLocalPath= req.file?.path
  if(!avatarLocalPath){
    return apiError(res,404,"image is not found on server")
  }
  
   // Get the current user's avatar before updating
  //  const user = await User.findById(req.user?._id);
  //  const oldAvatarUrl = user.avatar;


  const cloudinaryAvatarImage= await uploadOnCloudinary(avatarLocalPath)
  if(!cloudinaryAvatarImage.url){
    return apiError(res,400,"failed to upload on coludinary")
  }
  console.log(cloudinaryAvatarImage.url)
  const updateAvatarUser=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar:cloudinaryAvatarImage.url  
    }
    },
    {new:true}
  
  ).select("-password")

   // Delete old avatar from Cloudinary (if it exists)
  //  if (oldAvatarUrl) {
  //   const publicId = oldAvatarUrl.split("/").pop().split(".")[0]; // Extract public ID
  //   await cloudinary.uploader.destroy(publicId);
  // }

  return apiSuccess(res, 200, "Account details updated successfully",updateAvatarUser);
} catch (error) {
  return apiError(res,404,"failed to update avatar")
  
}

})



export { registerUser, loginUser, logoutUser, refreshAccessToken,updatePassword,getUserProfile,updateAccountDetails,updateAvatar};
