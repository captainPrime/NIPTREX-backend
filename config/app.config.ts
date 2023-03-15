import express, { Application } from "express"
import dotenv from "dotenv"
import connectDB from "./db.config";
import { ProductRoute } from "../routes/product.routes";
import { globalErrorHandler } from "../middleware/global-error-handler.middleware";

// Load environment variables
dotenv.config();

export class App {
    app: Application
    private route: ProductRoute = new ProductRoute()

    constructor() {
        this.app = express()
        connectDB()
        this.config()
    }

    config() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use("/product", this.route.router)
        this.app.use(globalErrorHandler)
    }
}