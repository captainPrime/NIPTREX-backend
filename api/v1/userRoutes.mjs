import express from "express";
import swaggerDoc from "swagger-ui-express";
import swaggerDocs from "../../helper/docs.mjs";
import bcrypt from "bcrypt";
import User from "../../models/user.mjs";
import bodyParser from "body-parser";

const router = express.Router();
router.use(bodyParser.json());

router.use("/docs", swaggerDoc.serve);
router.use("/docs", swaggerDoc.setup(swaggerDocs));

// Trims string fields and returns an object with trimmed values
const trimFields = (obj) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (typeof value === "string") {
            acc[key] = value.trim();
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});
};

router.get("/", (req, res) => {
    res.send("Hello Devs");
});

// Signup
router.post("/user/signup", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });

    try {
        let { firstName, lastName, email, password, country } = req.body;

        if (!firstName || !lastName || !email || !password || !country) {
            return res.status(400).json({
                status: "FAILED",
                message: "Empty Input Field",
                response_code: 400,
            });
        }

        // Trim input fields
        const trimmedFields = trimFields(req.body);
        firstName = trimmedFields.firstName;
        lastName = trimmedFields.lastName;
        email = trimmedFields.email;
        password = trimmedFields.password;
        country = trimmedFields.country;

        if (!/^[a-zA-Z'-]+(\s[a-zA-Z'-]+)*$/.test(firstName) || !/^[a-zA-Z'-]+(\s[a-zA-Z'-]+)*$/.test(lastName)) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid name entered",
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
            firstName,
            lastName,
            email,
            password: hashedPassword,
            country,
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
router.post("/user/signin", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });

    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "FAILED",
                message: "Empty Input Field",
                response_code: 400,
            });
        }

        // Trim input fields
        const trimmedFields = trimFields(req.body);
        email = trimmedFields.email;
        password = trimmedFields.password;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid credentials entered",
                response_code: 400,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid credentials entered",
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
