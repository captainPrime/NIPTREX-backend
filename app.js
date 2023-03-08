import express from "express";
import bodyParser from "body-parser";
import connectMongoDB from "./config/db.mjs";
import UserRouter from "./api/userRoutes.mjs";

const app = express(),
    port = process.env.PORT || 3003;

connectMongoDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/user", UserRouter);

app.listen(port, () => {
    console.table(`Express server is running & listening on port ${port}`);
});
