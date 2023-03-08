import express from "express";
import bcrypt from "bcrypt";
import User from "./../models/user.mjs";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
    try {
        let { name, email, password, dateOfBirth } = req.body;
        name = name.trim();
        email = email.trim();
        password = password.trim();
        dateOfBirth = dateOfBirth.trim();

        if (!name || !email || !password || !dateOfBirth) {
            return res.status(400).json({
                status: "FAILED",
                message: "Empty Input Field",
            });
        }

        if (!/^[a-zA-Z'-]+(\s[a-zA-Z'-]+)*$/.test(name)) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid username entered",
            });
        }

        if (!/^[\w\.\+\-]+@([\w-]+\.)+[\w]{2,4}$/i.test(email)) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid email entered",
            });
        }

        if (!new Date(dateOfBirth).getTime()) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid date of birth entered",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                status: "FAILED",
                message: "Password is too short",
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                status: "FAILED",
                message: "User with the provided email already exists",
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            dateOfBirth,
        });

        const savedUser = await newUser.save();
        return res.status(201).json({
            status: "SUCCESS",
            message: "Signup successful",
            data: savedUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing request",
        });
    }
});

// Signin
router.post("/signin", async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (!email || !password) {
            return res.status(400).json({
                status: "FAILED",
                message: "Empty credentials supplied",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid credentials entered",
            });
        }

        const hashedPassword = user.password;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid password entered",
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            message: "Signin successful",
            data: user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing request",
        });
    }
});

export default router;
