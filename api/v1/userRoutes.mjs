import express from "express";
import bcrypt from "bcrypt";
import User from "../../models/user.mjs";
import bodyParser from "body-parser";

const router = express.Router();
router.use(bodyParser.json());

router.get("/", (req, res) => {
    res.send("Hello Devs");
});

// Signup
router.post("/signup", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });

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
                response_code: 400,
            });
        }

        if (!/^[a-zA-Z'-]+(\s[a-zA-Z'-]+)*$/.test(name)) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid username entered",
                response_code: 400,
            });
        }

        if (!/^[\w\.\+\-]+@([\w-]+\.)+[\w]{2,4}$/i.test(email)) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid email entered",
                response_code: 400,
            });
        }

        if (!new Date(dateOfBirth).getTime()) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid date of birth entered",
                response_code: 400,
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                status: "FAILED",
                message: "Password is too short",
                response_code: 400,
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                status: "FAILED",
                message: "User with the provided email already exists",
                response_code: 400,
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
            data: savedUser,
            status: "SUCCESS",
            message: "Signup successful",
            response_code: 201,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing request",
            response_code: 500,
        });
    }
});

// Signin
router.post("/signin", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });

    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (!email || !password) {
            return res.status(400).json({
                status: "FAILED",
                message: "Empty credentials supplied",
                response_code: 400,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid credentials entered",
                response_code: 400,
            });
        }

        const hashedPassword = user.password;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid password entered",
                response_code: 400,
            });
        }

        return res.status(200).json({
            data: user,
            status: "SUCCESS",
            message: "Signin successful",
            response_code: 200,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing request",
            response_code: 500,
        });
    }
});

export default router;
