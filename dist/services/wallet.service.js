"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("../exceptions/HttpException");
const util_1 = require("../utils/util");
const wallet_model_1 = require("../models/wallet.model");
const payment_validation_1 = require("../validations/payment.validation");
class WalletService {
    constructor() {
        this.wallet = wallet_model_1.WalletModel;
        this.transaction = wallet_model_1.TransactionModel;
        /*
        |--------------------------------------------------------------------------
        | Add Transaction to Wallet
        |--------------------------------------------------------------------------
        */
        // public async chargeCard(payload: IChargeCard): Promise<ITransaction | null> {
        //   if (isEmpty(payload)) throw new HttpException(400, 6002, 'bodycannot be empty');
        //   try {
        //     const response = await flw.Charge.card(payload);
        //     console.log(response);
        //     if (response.meta.authorization.mode === 'pin') {
        //       const payload2 = {
        //         ...payload,
        //         authorization: {
        //           mode: 'pin',
        //           fields: ['pin'],
        //           pin: 3310,
        //         },
        //       };
        //       const reCallCharge = await flw.Charge.card(payload2);
        //       const callValidate = await flw.Charge.validate({
        //         otp: '12345',
        //         flw_ref: reCallCharge.data.flw_ref,
        //       });
        //       console.log(callValidate); // uncomment for debugging purposes
        //     }
        //     if (response.meta.authorization.mode === 'redirect') {
        //       const url = response.meta.authorization.redirect;
        //       open(url);
        //     }
        //     res.status(200).json(response);
        //     // console.log(response); // uncomment for debugging purposes
        //   } catch (error) {
        //     console.log(error);
        //   }
        //   return transaction;
        // }
    }
    /*
    |--------------------------------------------------------------------------
    | Create Wallet
    |--------------------------------------------------------------------------
    */
    async createWallet(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 6002, 'All fields cannot be empty');
        const wallet = await this.wallet.create(body);
        return wallet;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Transaction by User ID
    |--------------------------------------------------------------------------
    */
    async getTransactionByUserId(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 6002, 'User ID cannot be empty');
        const transaction = await this.transaction.find({ user_id: userId });
        return transaction;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Transaction by User ID
    |--------------------------------------------------------------------------
    */
    async getTransactions() {
        const transaction = await this.transaction.find({});
        return transaction;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Transaction by User ID
    |--------------------------------------------------------------------------
    */
    async getTransactionById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 6002, 'ID cannot be empty');
        const wallet = await this.transaction.findOne({ _id: id });
        return wallet;
    }
    /*
    |--------------------------------------------------------------------------
    | Add Transaction to Wallet
    |--------------------------------------------------------------------------
    */
    async createTransaction(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 6002, 'body cannot be empty');
        const { error } = payment_validation_1.transactionValidationSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'PAYMENT_VALIDATION_ERROR', [error.details[0].message]);
        const transaction = await this.transaction.create(body);
        return transaction;
    }
    /*
    |--------------------------------------------------------------------------
    | Update Wallet Balance
    |--------------------------------------------------------------------------
    */
    async updateWallet(walletId, data) {
        if ((0, util_1.isEmpty)(walletId))
            throw new HttpException_1.HttpException(400, 6002, 'Wallet ID cannot be empty');
        const wallet = await this.wallet.findByIdAndUpdate(walletId, data, { new: true });
        return wallet;
    }
}
exports.default = WalletService;
//# sourceMappingURL=wallet.service.js.map