import express from "express";
import connectMongoDB from "./config/db.mjs";
import v1UserRouter from "./api/v1/userRoutes.mjs";
import cors from "cors";

const app = express(),
    PORT = process.env.PORT || 3000;

app.use(cors());

app.use("/v1/user", v1UserRouter);

connectMongoDB().then(() => {
    app.listen(PORT, () => {
        console.table(`Express server is running & listening on port ${PORT}`);
    });
});
