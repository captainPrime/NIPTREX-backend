"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jimp_1 = tslib_1.__importDefault(require("jimp"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const flutterwave_1 = require("@/modules/flutterwave");
const cloudinary_1 = tslib_1.__importDefault(require("@/utils/cloudinary"));
const users_service_1 = tslib_1.__importDefault(require("@/services/users.service"));
const HttpException_1 = require("@/exceptions/HttpException");
const photography_service_1 = tslib_1.__importDefault(require("@/services/photography.service"));
const path_1 = tslib_1.__importDefault(require("path"));
const photography_validation_1 = require("@/validations/photography.validation");
const matchPercentage_1 = require("@/utils/matchPercentage");
const axios_1 = tslib_1.__importDefault(require("axios"));
const config_1 = require("@/config");
const wallet_service_1 = tslib_1.__importDefault(require("@/services/wallet.service"));
const email_service_1 = tslib_1.__importDefault(require("@/modules/email/email.service"));
class PhotographyController {
    constructor() {
        this.userService = new users_service_1.default();
        this.emailService = new email_service_1.default();
        this.walletService = new wallet_service_1.default();
        this.photographyService = new photography_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Photography
        |--------------------------------------------------------------------------
        */
        this.createPhotography = async (req, res, next) => {
            var _a;
            try {
                // return req.file;
                const { title, price, category, tags, licence, listAsNFT } = req.body;
                const { error } = photography_validation_1.photographySchemaValidation.validate({
                    title,
                    price,
                    image: req.file,
                    category,
                    tags,
                    licence,
                    listAsNFT,
                });
                if (error)
                    throw new HttpException_1.HttpException(400, 9002, 'PHOTOGRAPHY_VALIDATION_ERROR', [error.details[0].message]);
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                // The uploaded image can be accessed as req.file
                if (req.file) {
                    // Handle the uploaded file, for example, save it to Cloudinary
                    const image = req.file.path;
                    // Load the image using Jimp
                    const loadedImage = await jimp_1.default.read(image);
                    // Add a text watermark to the image
                    const watermarkText = req.user.first_name + req.user.last_name;
                    const textWidth = jimp_1.default.measureText(await jimp_1.default.loadFont(jimp_1.default.FONT_SANS_32_BLACK), watermarkText);
                    const textHeight = jimp_1.default.measureTextHeight(await jimp_1.default.loadFont(jimp_1.default.FONT_SANS_32_BLACK), watermarkText, 80);
                    const x = (loadedImage.getWidth() - textWidth) / 2;
                    const y = (loadedImage.getHeight() - textHeight) / 2;
                    // Add the text watermark at the calculated position
                    loadedImage.print(await jimp_1.default.loadFont(jimp_1.default.FONT_SANS_32_BLACK), x, y, watermarkText);
                    // Define the path to save the modified image in a "pictures" folder within the current directory
                    const modifiedImageTempPath = path_1.default.join(__dirname, 'pictures', `${new Date()}-${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}.png`);
                    await loadedImage.writeAsync(modifiedImageTempPath);
                    // Upload the temporary file to Cloudinary
                    const cloudinaryResponse = await this.uploadToCloudinary(modifiedImageTempPath);
                    // You can use the cloudinaryResponse here as needed
                    // Delete the temporary file after uploading it to Cloudinary
                    // eslint-disable-next-line security/detect-non-literal-fs-filename
                    fs_1.default.unlinkSync(modifiedImageTempPath);
                    // You can use the cloudinaryResponse here as needed
                    const data = await this.photographyService.createPhotography({
                        user_id: req.user.id,
                        title,
                        price,
                        cloudinary_id: cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.public_id,
                        image: cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url,
                        category: Array.isArray(category) ? category : (category === null || category === void 0 ? void 0 : category.split(',')) || [],
                        tags: Array.isArray(tags) ? tags : (tags === null || tags === void 0 ? void 0 : tags.split(',')) || [],
                        licence,
                        listAsNFT: listAsNFT === 'true' || listAsNFT === true,
                    });
                    return res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data });
                }
                throw new HttpException_1.HttpException(400, 1004, 'ERROR_UPLOADING_IMAGE');
                // Continue with the rest of your code for creating a photography record
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Preference
        |--------------------------------------------------------------------------
        */
        this.getUserPhotography = async (req, res, next) => {
            var _a;
            try {
                const userId = (_a = req.query.id) !== null && _a !== void 0 ? _a : req.user.id;
                const user = await this.userService.findUserById(userId);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const options = {
                    sortBy: req.query.sortBy || 'created_at:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                    search: req.query.search || '',
                    populate: 'user_id',
                };
                const filter = { user_id: userId };
                const data = await this.photographyService.getUserPhotography(options, filter);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Preference
        |--------------------------------------------------------------------------
        */
        this.getAllPhotography = async (req, res, next) => {
            try {
                const options = {
                    sortBy: req.query.sortBy || 'created_at:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    search: req.query.search || '',
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                    populate: 'user_id',
                };
                const data = await this.photographyService.getAllPhotography(req.query, options);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Photography By Id
        |--------------------------------------------------------------------------
        */
        this.getPhotographyById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.photographyService.getPhotographyById(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Photography
        |--------------------------------------------------------------------------
        */
        //   public updatePhotography = async (req: Request, res: Response, next: NextFunction) => {
        //     try {
        //       const body: IUpdatePreference = req.body;
        //       const data = await this.photographyService.updatePhotography(req.user.id, body);
        //       res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data });
        //     } catch (error) {
        //       next(error);
        //     }
        //   };
        /*
        |--------------------------------------------------------------------------
        | Delete Photography
        |--------------------------------------------------------------------------
        */
        this.deletePhotography = async (req, res, next) => {
            try {
                const id = req.params.id;
                const photography = await this.photographyService.getPhotographyById(id);
                await cloudinary_1.default.v2.uploader.destroy(photography.cloudinary_id);
                const data = await this.photographyService.deletePhotography(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Charge Card
        |--------------------------------------------------------------------------
        */
        this.makePayment = async (req, res, next) => {
            try {
                const { currency, photography_id } = req.body;
                const photographyService = await this.photographyService.getPhotographyById(photography_id);
                if (!photographyService)
                    throw new HttpException_1.HttpException(400, 1102, 'PHOTOGRAPHY_NOT_FOUND');
                const paymentData = {
                    tx_ref: (0, matchPercentage_1.generateUUID)(),
                    amount: photographyService.price,
                    currency,
                    redirect_url: 'http://localhost:3000/photography/verify-payment',
                    meta: {
                        consumer_id: req.user.id,
                        consumer_mac: photography_id,
                    },
                    customer: {
                        email: req.user.email,
                        phonenumber: req.user.phone_number,
                        name: `${req.user.first_name} ${req.user.last_name}`,
                    },
                };
                const response = await axios_1.default.post('https://api.flutterwave.com/v3/payments', paymentData, {
                    headers: {
                        Authorization: `Bearer ${config_1.FLW_SECRET_KEY}`,
                    },
                });
                res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data: response.data.data });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Charge Card
        |--------------------------------------------------------------------------
        */
        this.paymentCallback = async (req, res, next) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            try {
                const { status, transaction_id } = req.body;
                if (status === 'successful' || status === 'completed') {
                    // const transactionDetails = await flw.Transaction.find({ ref: tx_ref });
                    const response = await flutterwave_1.flw.Transaction.verify({ id: transaction_id });
                    // console.log('TRANSACTION_DETAILS', transactionDetails);
                    console.log('TRANSACTION_VERIFY', response);
                    if (response.data.status === 'successful') {
                        // Success! Confirm the customer's payment
                        const user = await this.userService.findUserById(response.data.meta.consumer_id);
                        const photography = await this.photographyService.getPhotographyById(response.data.meta.consumer_mac.toString());
                        if (!photography)
                            throw new HttpException_1.HttpException(400, 7002, 'PROPOSAL_NOT_FOUND');
                        console.log('photography', photography);
                        const transactionData = {
                            user_id: user.id,
                            proposal_id: (_a = response.data.meta) === null || _a === void 0 ? void 0 : _a.consumer_mac,
                            tx_ref: response.data.tx_ref,
                            flw_ref: response.data.flw_ref,
                            amount: response.data.amount,
                            currency: response.data.currency,
                            status: response.data.status,
                            payment_type: response.data.payment_type,
                            photography: photography.image,
                            created_at: new Date(response.data.created_at),
                            customer_id: (_c = (_b = response.data.customer) === null || _b === void 0 ? void 0 : _b.id.toString()) !== null && _c !== void 0 ? _c : (_d = response.meta) === null || _d === void 0 ? void 0 : _d.consumer_id.toString(),
                            customer_name: (_e = response.data.customer) === null || _e === void 0 ? void 0 : _e.name,
                            customer_email: (_f = response.data.customer) === null || _f === void 0 ? void 0 : _f.email,
                            nuban: (_g = response.data.meta) === null || _g === void 0 ? void 0 : _g.originatoraccountnumber,
                            bank: (_h = response.data.meta) === null || _h === void 0 ? void 0 : _h.bankname,
                            bank_name: (_j = response.data.meta) === null || _j === void 0 ? void 0 : _j.originatorname,
                            card_first_6digits: (_k = response.data.card) === null || _k === void 0 ? void 0 : _k.first_6digits,
                            card_last_4digits: (_l = response.data.card) === null || _l === void 0 ? void 0 : _l.last_4digits,
                            card_issuer: (_m = response.data.card) === null || _m === void 0 ? void 0 : _m.issuer,
                            card_country: (_o = response.data.card) === null || _o === void 0 ? void 0 : _o.country,
                            card_type: (_p = response.data.card) === null || _p === void 0 ? void 0 : _p.type,
                            card_expiry: (_q = response.data.card) === null || _q === void 0 ? void 0 : _q.expiry,
                        };
                        const transaction = await this.walletService.createTransaction(transactionData);
                        const emailPayload = {
                            photographyId: photography.id,
                            photographyTitle: photography.title,
                            imageUrl: photography.image,
                        };
                        this.emailService.sendPhotographyPaymentConfirmationEmail(user.email, emailPayload, user.first_name);
                        res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data: transaction });
                    }
                    else {
                        res.status(200).json({ status: 400, response_code: 3002, message: 'PHOTOGRAPHY_REQUEST_ERROR', data: [] });
                    }
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
    }
    // This function uploads the file to Cloudinary
    async uploadToCloudinary(file) {
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };
        try {
            // Upload the image
            const result = await cloudinary_1.default.v2.uploader.upload(file, options);
            console.log(result);
            return result;
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.default = PhotographyController;
//# sourceMappingURL=photography.controller.js.map