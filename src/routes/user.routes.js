import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken,
    updatePassword,
    getUserProfile,
    updateAccountDetails,
    updateAvatar,
    channelFullProfile,
    verifyOtp
    
    
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/register",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

router.post("/login", loginUser);  // Step 1: Generate OTP
router.post("/verify-otp", verifyOtp);  // Step 2: Verify OTP & Log In

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,updatePassword)
router.route("/user-profile").get(verifyJWT,getUserProfile)
router.route("/update-profile").patch(verifyJWT,updateAccountDetails) // use patch or all fileds will get updated
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"),updateAvatar)// use patch or all fileds will get updated
router.route("/channel/:username").post(verifyJWT,channelFullProfile)// getting values from params(urls)



export default router