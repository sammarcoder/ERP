require("dotenv").config();
console.log("Enviorment variables loaded", process.env.EMAIL_USER, process.env.EMAIL_PASS)

const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Op, DATE } = require("sequelize");

const signUp = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User.create({ name, email, password, role });
        res.status(200).json({
            sucess: true,
            // user: { id: user.id, name: user.name, email: user.email, },
            user,
        });
    } catch (err) {
        res.status(500).json({ sucess: false, error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email,
            },
        });
        console.log(user.role);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res
                .status(401)
                .json({ sucess: false, mesage: `invalid email or password` });
        }
        // console.log(req.user)
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );
        res.status(200).json({ success: true, token, user });
    } catch (err) {
        res.status(500).json({ sucess: false, error: err.message });
    }
};

// Password Rest Request and rest the password
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({
                sucess: false,
                message: `User ${email} Not found try to signup first`,
            });
        }
        // res.status(200).json({ mesage: "ok" });
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

        user.resetToken = resetToken;
        user.resetTokenExpires = resetTokenExpires;
        await user.save();

        // send email
        // const transporter = nodemailer.createTransport({
        //     service: "gmail",
        //     host: "smtp.gmail.com",
        //     port: 465,
        //     secure: true,
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS,
        //     },
        // });


        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });



        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await transporter.sendMail({
            to: email,
            subject: "password Reset Request",
            html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
        });
        // console.log("Email sent successfully");
        res
            .status(200)
            .json({ message: true, message: "password reset email sent", user });
    }
    catch (err) {
        res.status(500).json({ sucess: false, message: err.message });
        console.log(err.message)
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpires: { [Op.gt]: new Date() },
            },
        });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        res
            .status(200)
            .json({ success: true, message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Verification for Email Api's

const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({
            where: {
                email,
            },
        });

        console.log(user.password);
        if (!user) {
            return res.status(500).json({
                sucess: false,
                message: "User not found",
            });
        }
        if (user.isVerified) {
            return res
                .status(400)
                .json({ sucess: false, message: "Your Email is already Verified" });
        }
        const verificationToken = crypto.randomBytes(32).toString("hex");
        // const resetTokenExpires = new Date(Date.now() + 5 * 60 * 1000)

        user.verificationToken = verificationToken;
        await user.save();
        console.log(
            `this is verifaction token generated by crypto ${verificationToken}`
        );
        console.log(`this is verifaction token in table ${user.verificationToken}`);

        // const transporter = nodemailer.createTransport({
        //     service: "Gmail",
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS,
        //     },
        // });

        console.log(process.env.EMAIL_USER);
        console.log(process.env.EMAIL_PASS);

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

        await transporter.sendMail({
            to: email,
            subject: "Verify Email",
            html: `<P>Please Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
        });

        // const mailOptions = {
        //     from: process.env.EMAIL_USER,
        //     to: email,
        //     subject: "Test Email",
        //     text: "This is a test email from Nodemailer!",
        // };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error("Error sending email:", error);
            }
            console.log("Email sent:", info.response);
        });

        res.status(200).json({
            success: true,
            message: "Verification email sent",
            token: user.verificationToken,
        });
    } catch (err) {
        res.status(500).json({ sucess: false, message: err.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({
            where: {
                verificationToken: token,
            },
        });
        if (!user) {
            return res
                .status(500)
                .json({ sucess: false, message: "Invalid or Expired token" });
        }
        user.isVerified = true;
        user.verificationToken = null;
        await user.save();
        res
            .status(200)
            .json({ sucess: true, message: "Verified Sucessfully", user });
    } catch (err) {
        res.status(500).json({ sucess: false, mesage: err.message });
    }
};

module.exports = {
    signUp,
    login,
    requestPasswordReset,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
};
