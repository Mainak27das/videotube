import nodemailer from "nodemailer";

 const sendOTP = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,  // Set in .env file
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Login",
            text: `Your OTP for login is: ${otp}. This OTP will expire in 5 minutes.`
        };

        await transporter.sendMail(mailOptions);
        console.log("OTP sent successfully");
    } catch (error) {
        console.error("Error sending OTP:", error);
    }
};
export {sendOTP}