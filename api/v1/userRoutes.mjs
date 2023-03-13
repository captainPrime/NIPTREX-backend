import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../models/user.mjs";
import UserVerification from "../../models/userVerification.mjs";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import swaggerDoc from "swagger-ui-express";
import swaggerDocs from "../../helper/docs.mjs";

dotenv.config();

const router = express.Router();
router.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// router.set("view engine", "ejs");

// router.use(express.static(`public`));

router.use("/docs", swaggerDoc.serve);
router.use("/docs", swaggerDoc.setup(swaggerDocs));

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_APP_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error(error);
    } else {
        console.log("Ready for Messages");
        console.log(success);
    }
});

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

// Signup
router.post("/user/signup", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });

    try {
        let { first_name, last_name, email, password, country } = req.body;

        if (!first_name || !last_name || !email || !password || !country) {
            return res.status(400).json({
                status: "FAILED",
                message: "Empty Input Field",
                response_code: 2002,
            });
        }

        // Trim input fields
        const trimmedFields = trimFields(req.body);
        first_name = trimmedFields.first_name;
        last_name = trimmedFields.last_name;
        email = trimmedFields.email;
        password = trimmedFields.password;
        country = trimmedFields.country;

        if (!/^[a-zA-Z'-]+(\s[a-zA-Z'-]+)*$/.test(first_name) || !/^[a-zA-Z'-]+(\s[a-zA-Z'-]+)*$/.test(last_name)) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid name entered",
                response_code: 2003,
            });
        }

        if (!/^[\w\.\+\-]+@([\w-]+\.)+[\w]{2,4}$/i.test(email)) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid email entered",
                response_code: 2004,
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                status: "FAILED",
                message: "Password is too short",
                response_code: 2005,
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                status: "FAILED",
                message: "User with the provided email already exists",
                response_code: 2006,
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            country,
            verified: false,
        });

        const savedUser = await newUser.save();
        sendVerificationEmail(savedUser, res);
        return res.status(202).json({
            // data: savedUser,
            status: "PENDING",
            message: "Verification email sent",
            response_code: 2002,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing request",
            response_code: 3005,
        });
    }
});

// Send Verification Email
const sendVerificationEmail = ({ _id, email }) => {
    return new Promise((resolve, reject) => {
        const currentURL = "https://niptrex-endpoint.cyclic.app/v1/";

        const unique_string = uuidv4() + _id;

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify your Email",
            html: `
                <p>You are receiving this email because your email has not been verified.</p>
                <p>This link <b>expires in 30 days</b>.</p>
                <p>Press <a href="${currentURL}user/verify/${_id}/${unique_string}">here</a> to proceed</p>
            `,
        };

        // Hash Unique String
        const saltRounds = 10;
        bcrypt
            .hash(unique_string, saltRounds)
            .then((hashedUniqueString) => {
                const newVerification = new UserVerification({
                    user_id: _id,
                    unique_string: hashedUniqueString,
                    created_at: Date.now(),
                    expires_at: Date.now() + 2592000000,
                });

                newVerification
                    .save()
                    .then(() => {
                        transporter
                            .sendMail(mailOptions)
                            .then(() => {
                                // Email sent and Verification record saved
                                resolve();
                            })
                            .catch((err) => {
                                console.error("Error: " + err);
                                reject(new Error("Could not send verification email"));
                            });
                    })
                    .catch((err) => {
                        console.error("Error: " + err);
                        reject(new Error("Could not save verification email data"));
                    });
            })
            .catch((err) => {
                console.error("Error:" + err);
                reject(new Error("Error occurred while hashing email data"));
            });
    });
};

// Verify Email
router.get("/user/verify/:user_id/:unique_string", (req, res) => {
    let { user_id, unique_string } = req.params;

    UserVerification.find({ user_id })
        .then((result) => {
            let hashedUniqueString;

            if (result.length > 0) {
                // User Verification exist so we Proceed
                const { expires_at } = result[0];
                hashedUniqueString = result[0].unique_string;

                // Checking for Expiry date
                if (expires_at < Date.now()) {
                    UserVerification.deleteOne({ user_id })
                        .then((result) => {
                            User.deleteOne({ _id: user_id })
                                .then(() => {
                                    let message = "Link has expired. Please Signup again";
                                    res.redirect(`/user/verified/?error=true&message=${message}`);
                                })
                                .catch((err) => {
                                    let message = "Clearing user with expired unique string failed";
                                    res.redirect(`/user/verified/?error=true&message=${message}`);
                                });
                        })
                        .catch((err) => {
                            console.error("Error: " + err);
                            let message = "An error occured while clearing expired user verification record";
                            res.redirect(`/user/verified/?error=true&message=${message}`);
                        });
                } else {
                    // Valid record exists, So we validate the User String
                    bcrypt
                        .compare(unique_string, hashedUniqueString)
                        .then((result) => {
                            if (result) {
                                // strings match
                                User.updateOne({ _id: user_id }, { verified: true })
                                    .then(() => {
                                        UserVerification.deleteOne({ user_id })
                                            .then(() => {
                                                res.sendFile(path.join(__dirname, "../../views/verified.html"));
                                            })
                                            .catch((err) => {
                                                console.error("Error: " + err);
                                                let message = "An error while finalizing successful verification";
                                                res.redirect(`/user/verified/?error=true&message=${message}`);
                                            });
                                    })
                                    .catch((err) => {
                                        console.error("Errror: " + err);
                                        let message = "An error occured while updating user record to show verified";
                                        res.redirect(`/user/verified/?error=true&message=${message}`);
                                    });
                            } else {
                                let message = "Invalid verification details passed. Check your Inbox";
                                res.redirect(`/user/verified/?error=true&message=${message}`);
                            }
                        })
                        .catch((err) => {
                            let message = "An error while comparing unique strings";
                            res.redirect(`/user/verified/?error=true&message=${message}`);
                        });
                }
            } else {
                let message = "Account record does not exist or has been previously verified. Please Signup or Signin";
                res.redirect(`/user/verified/?error=true&message=${message}`);
            }
        })
        .catch((err) => {
            console.error("Error:" + err);

            let message = "An error occured while checking for existing user verification";
            res.redirect(`/user/verified/?error=true&message=${message}`);
        });
});

router.get("/v1/user/verified", (req, res) => {
    res.sendFile(path.join(__dirname, "../../views/verified.html"));
});

// Signin

router.post("/user/signin", (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });

    let { email, password } = req.body;

    if (!email || !password) {
        return Promise.resolve(
            res.status(400).json({
                status: "FAILED",
                message: "Empty Input Field",
                response_code: 2002,
            })
        );
    }

    // Trim input fields
    const trimmedFields = trimFields(req.body);
    email = trimmedFields.email;
    password = trimmedFields.password;

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    status: "FAILED",
                    message: "Invalid credentials entered",
                    response_code: 3001,
                });
            }

            if (!user.verified) {
                console.log(user.length);

                return res.status(400).json({
                    status: "FAILED",
                    message: "Email has not been verified yet. Check your Inbox",
                    response_code: 3001,
                });
            } else {
                bcrypt
                    .compare(password, user.password)
                    .then((isMatch) => {
                        if (!isMatch) {
                            return res.status(400).json({
                                status: "FAILED",
                                message: "Invalid credentials entered",
                                response_code: 3002,
                            });
                        }
                        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
                        return res.status(200).json({
                            data: { user, token },
                            status: "SUCCESS",
                            message: "Signin successful",
                            response_code: 2001,
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        return res.status(500).json({
                            status: "FAILED",
                            message: "An error occurred while processing request",
                            response_code: 3005,
                        });
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                status: "FAILED",
                message: "An error occurred while checking for existing user",
                response_code: 3005,
            });
        });
});

export default router;
