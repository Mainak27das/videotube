import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken,
    updatePassword,
    getUserProfile,
    updateAccountDetails,
    updateAvatar
    
    
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,updatePassword)
router.route("/user-profile").get(verifyJWT,getUserProfile)
router.route("/update-profile").post(verifyJWT,updateAccountDetails)
router.route("/update-avatar").post(verifyJWT, upload.single("avatar"),updateAvatar)



export default router