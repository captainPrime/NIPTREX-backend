"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("@/services/users.service"));
const HttpException_1 = require("@/exceptions/HttpException");
const wallet_service_1 = tslib_1.__importDefault(require("@/services/wallet.service"));
const flutterwave_1 = require("@/modules/flutterwave");
const matchPercentage_1 = require("@/utils/matchPercentage");
const config_1 = require("@/config");
const axios_1 = tslib_1.__importDefault(require("axios"));
const email_service_1 = tslib_1.__importDefault(require("@/modules/email/email.service"));
const bid_service_1 = tslib_1.__importDefault(require("@/services/bid.service"));
const job_service_1 = tslib_1.__importDefault(require("@/services/job.service"));
const job_inteface_1 = require("@/interfaces/job.inteface");
const bid_model_1 = require("@/models/bid.model");
const about_service_1 = tslib_1.__importDefault(require("@/services/about.service"));
class WalletController {
    constructor() {
        this.bidService = new bid_service_1.default();
        this.jobService = new job_service_1.default();
        this.userService = new users_service_1.default();
        this.aboutService = new about_service_1.default();
        this.emailService = new email_service_1.default();
        this.walletService = new wallet_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Bio
        |--------------------------------------------------------------------------
        */
        this.createWallet = async (req, res, next) => {
            try {
                // const userData = req.body;
                const user = await this.userService.findUserById(req.user.id);
                console.log('USER', user);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                // const wallet = await this.walletService.getWalletByUserId(req.user.id);
                // if (wallet) throw new HttpException(400, 6002, 'WALLET_ALREAD_CREATED');
                //   const headers = {
                //     'Content-Type': 'application/json',
                //     Accept: 'application/json',
                //     Authorization: `Bearer ${FLW_SECRET_KEY}`,
                //   };
                //   const response = await axios.post(
                //     'https://api.flutterwave.com/v3/payout-subaccounts',
                //     {
                //       account_reference: generateAlphaNumeric(20),
                //       email: user.email,
                //       mobilenumber: user.phone_number,
                //       country: 'NG',
                //       account_name: `${user.first_name} ${user.last_name}`,
                //       bank_code: 232,
                //       barter_id: '00874000',
                //     },
                //     { headers },
                //   );
                //   console.log('SUB_ACCOUNT', response);
                const result = await flutterwave_1.flw.VirtualAcct.create({
                    tx_ref: (0, matchPercentage_1.generateUUID)(),
                    email: user.email,
                    bvn: '19218268983',
                    is_permanent: true,
                    // firstname: user.first_name,
                    // lastname: user.last_name,
                    narration: 'Niptrix Wallet',
                });
                console.log(result);
                if (result.status !== 'success' && result.data.response_code !== '02')
                    throw new HttpException_1.HttpException(400, 6002, 'ERROR_CREATING_WALLET');
                const payload = {
                    user_id: req.user.id,
                    currency: req.body.currency,
                    expiry_date: result.data.expiry_date,
                    account_number: result.data.account_number,
                    account_status: result.data.account_status,
                    bank_name: result.data.bank_name,
                    order_ref: result.data.order_ref,
                    flw_ref: result.data.flw_ref,
                    amount: result.data.amount === 'NaN' ? '0' : result.data.amount,
                };
                const data = await this.walletService.createWallet(payload);
                res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Bio
        |--------------------------------------------------------------------------
        */
        this.getUserTransaction = async (req, res, next) => {
            try {
                const data = await this.walletService.getTransactionByUserId(req.user.id);
                res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Bio
        |--------------------------------------------------------------------------
        */
        this.getTransactions = async (req, res, next) => {
            try {
                const data = await this.walletService.getTransactions();
                res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Bio By Id
        |--------------------------------------------------------------------------
        */
        this.getTransactionById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.walletService.getTransactionById(id);
                res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Bio
        |--------------------------------------------------------------------------
        */
        this.updateWallet = async (req, res, next) => {
            try {
                const body = req.body;
                const data = await this.walletService.updateWallet(req.params.id, body);
                res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Create Bio
        |--------------------------------------------------------------------------
        */
        this.createTransaction = async (req, res, next) => {
            try {
                const payloadData = req.body;
                const data = await this.walletService.createTransaction(payloadData);
                res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
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
        this.chargeCard = async (req, res, next) => {
            try {
                const { card_number, cvv, expiry_month, expiry_year, currency, amount } = req.body;
                const payload = {
                    card_number,
                    cvv,
                    expiry_month,
                    expiry_year,
                    currency,
                    amount,
                    redirect_url: 'https://www.google.com',
                    fullname: `${req.user.first_name} ${req.user.last_name}`,
                    email: req.user.email,
                    phone_number: req.user.phone_number,
                    enckey: config_1.ENCRYPTION_KEY,
                    tx_ref: (0, matchPercentage_1.generateTripleDESKey)(),
                };
                const response = await flutterwave_1.flw.Charge.card(payload);
                console.log('RESPONSE', response);
                if (response.meta.authorization.mode === 'pin') {
                    const payload2 = Object.assign(Object.assign({}, payload), { authorization: {
                            mode: 'pin',
                            fields: ['pin'],
                            pin: 3310,
                        } });
                    const reCallCharge = await flutterwave_1.flw.Charge.card(payload2);
                    const callValidate = await flutterwave_1.flw.Charge.validate({
                        otp: '12345',
                        flw_ref: reCallCharge.data.flw_ref,
                    });
                    console.log(callValidate); // uncomment for debugging purposes
                }
                if (response.meta.authorization.mode === 'redirect') {
                    const url = response.meta.authorization.redirect;
                    console.log(url);
                    // open(url);
                }
                console.log(response); // uncomment for debugging purposes
                res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data: response });
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
        this.makePayment = async (req, res, next) => {
            try {
                const { amount, currency, proposal_id } = req.body;
                const data = await this.bidService.getBidById(proposal_id);
                if (!data)
                    throw new HttpException_1.HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');
                console.log('PROPOSAL', data);
                const proposalAmount = data.milestone_stage.reduce((total, stage) => total + stage.amount, 0);
                // if (amount < proposalAmount) throw new HttpException(400, 2002, 'AMOUNT_LESS_THAN_PROPOSAL_AMOUNT');
                const paymentData = {
                    tx_ref: (0, matchPercentage_1.generateUUID)(),
                    amount,
                    currency,
                    redirect_url: `http://localhost:3001/client/proposals/${data.job_id}`,
                    meta: {
                        consumer_id: req.user.id,
                        consumer_mac: proposal_id,
                    },
                    customer: {
                        email: req.user.email,
                        phonenumber: req.user.phone_number,
                        name: `${req.user.first_name} ${req.user.last_name}`,
                    },
                };
                console.log('PAYMENT_DATA', paymentData);
                const response = await axios_1.default.post('https://api.flutterwave.com/v3/payments', paymentData, {
                    headers: {
                        Authorization: `Bearer ${config_1.FLW_SECRET_KEY}`,
                    },
                });
                res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data: response.data.data });
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
                // if (status === 'successful' || status === 'completed') {
                // const transactionDetails = await flw.Transaction.find({ ref: tx_ref });
                const response = await flutterwave_1.flw.Transaction.verify({ id: transaction_id });
                // return res.status(200).json({ status: 400, response_code: 6000, message: 'PAYMENT_REQUEST_ERROR', data: response });
                // console.log('TRANSACTION_DETAILS', transactionDetails);
                console.log('TRANSACTION_VERIFY', response);
                if (response) {
                    // Success! Confirm the customer's payment
                    const user = await this.userService.findUserById(response.data.meta.consumer_id);
                    const proposal = await this.bidService.getBidById(response.data.meta.consumer_mac.toString());
                    if (!proposal)
                        throw new HttpException_1.HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');
                    console.log('PROPOSAL', proposal);
                    const job = await this.jobService.getJobByJobId(proposal.job_id.toString());
                    if (!job)
                        throw new HttpException_1.HttpException(400, 2002, 'JOB_NOT_FOUND');
                    const transactionData = {
                        user_id: user.id,
                        proposal_id: (_a = response.data.meta) === null || _a === void 0 ? void 0 : _a.consumer_mac,
                        tx_ref: response.data.tx_ref,
                        flw_ref: response.data.flw_ref,
                        amount: response.data.amount,
                        currency: response.data.currency,
                        status: response.data.status,
                        payment_type: response.data.payment_type,
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
                        proposalId: proposal.id,
                        jobTitle: job.job_title,
                    };
                    if (response.data.status === 'successful') {
                        this.emailService.sendPaymentConfirmationEmail(user.email, emailPayload, user.first_name);
                    }
                    this.emailService.sendFailedPaymentConfirmationEmail(user.email, emailPayload, user.first_name);
                    if (job.status === job_inteface_1.JobStatus.ACTIVE && response.data.status === 'successful') {
                        const payload = {
                            user_id: proposal.user_id,
                            job_id: job._id.toString(),
                            client_id: job.user_id.toString(),
                            proposal: proposal.id,
                        };
                        await this.jobService.hireFreelancer(payload);
                        // update job
                        await this.jobService.updateJobById(job._id.toString(), {
                            status: job_inteface_1.JobStatus.TAKEN,
                            freelancer_id: proposal.user_id.toString(),
                            activities: { invites_sent: +1, interviewing: +1, unanswered_invites: +1 },
                        });
                        // return user nips
                        const bidders = await this.bidService.getAllBidders(job._id.toString());
                        const userIds = bidders
                            .filter((bidder) => bidder.user_id.toString() !== proposal.user_id.toString())
                            .map((bidder) => bidder.user_id.toString());
                        await this.bidService.updateBid(proposal.user_id, job._id.toString(), { status: bid_model_1.BiddingStatus.IN_PROGRESS });
                        userIds.forEach(async (userId) => {
                            await this.aboutService.updateAboutById(userId, { nips: +5 });
                            await this.bidService.updateBid(userId, job._id.toString(), { status: bid_model_1.BiddingStatus.CLOSED });
                        });
                    }
                    res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data: transaction });
                }
                else {
                    res.status(200).json({ status: 400, response_code: 6000, message: 'PAYMENT_REQUEST_ERROR', data: [] });
                }
                // }
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
        this.paymentWebhook = async (req, res, next) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            try {
                // If you specified a secret hash, check for the signature
                const secretHash = 'niptrex-webhook';
                const signature = req.headers['verif-hash'];
                if (!signature || signature !== secretHash) {
                    // This request isn't from Flutterwave; discard
                    res.status(200).json({ status: 400, response_code: 6000, message: 'PAYMENT_REQUEST_ERROR', data: [] });
                }
                const payload = req.body;
                const transactionData = {
                    user_id: payload.data.customer.id,
                    proposal_id: payload.data.tx_ref,
                    tx_ref: payload.data.tx_ref,
                    flw_ref: payload.data.flw_ref,
                    amount: payload.data.amount,
                    currency: payload.data.currency,
                    status: payload.data.status,
                    payment_type: payload.data.payment_type,
                    created_at: new Date(payload.data.created_at),
                    customer_id: (_a = payload.data.customer) === null || _a === void 0 ? void 0 : _a.id,
                    customer_name: (_b = payload.data.customer) === null || _b === void 0 ? void 0 : _b.name,
                    customer_email: (_c = payload.data.customer) === null || _c === void 0 ? void 0 : _c.email,
                    nuban: (_d = payload.data.account) === null || _d === void 0 ? void 0 : _d.nuban,
                    bank: (_e = payload.data.account) === null || _e === void 0 ? void 0 : _e.bank,
                    card_first_6digits: (_f = payload.data.card) === null || _f === void 0 ? void 0 : _f.first_6digits,
                    card_last_4digits: (_g = payload.data.card) === null || _g === void 0 ? void 0 : _g.last_4digits,
                    card_issuer: (_h = payload.data.card) === null || _h === void 0 ? void 0 : _h.issuer,
                    card_country: (_j = payload.data.card) === null || _j === void 0 ? void 0 : _j.country,
                    card_type: (_k = payload.data.card) === null || _k === void 0 ? void 0 : _k.type,
                    card_expiry: (_l = payload.data.card) === null || _l === void 0 ? void 0 : _l.expiry,
                };
                const transaction = await this.walletService.createTransaction(transactionData);
                res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data: transaction });
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
        this.disbursePayment = async (req, res, next) => {
            try {
                const { amount, currency, narration, account_number, user_id, proposal_id } = req.body;
                const payload = {
                    account_bank: '044',
                    account_number,
                    user_id,
                    amount,
                    narration,
                    currency,
                    reference: (0, matchPercentage_1.generateUUID)(),
                    callback_url: 'https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d',
                    debit_currency: 'NGN',
                };
                const user = await this.userService.findUserById(user_id);
                if (!user)
                    throw new HttpException_1.HttpException(400, 2002, 'USER_NOT_FOUND');
                const response = await axios_1.default.post('https://api.flutterwave.com/v3/transfers', payload, {
                    headers: {
                        Authorization: `Bearer ${config_1.FLW_SECRET_KEY}`,
                    },
                });
                console.log(response.data);
                const transactionData = {
                    user_id: req.user.id,
                    proposal_id,
                    tx_ref: (0, matchPercentage_1.generateUUID)(),
                    flw_ref: (0, matchPercentage_1.generateUUID)(),
                    amount: amount,
                    currency: currency,
                    status: response.data.status,
                    payment_type: 'bank_transfer',
                    created_at: new Date(),
                    customer_id: user_id,
                    customer_name: `${user.first_name} ${user.last_name}`,
                    customer_email: user.email,
                    nuban: account_number,
                    bank: response.data.data.bank_name,
                    bank_name: response.data.data.full_name,
                };
                const transaction = await this.walletService.createTransaction(transactionData);
                res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data: transaction });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
    }
}
exports.default = WalletController;
//# sourceMappingURL=wallet.controller.js.map