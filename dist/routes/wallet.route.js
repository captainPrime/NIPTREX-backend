"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_middleware_1 = tslib_1.__importDefault(require("../middlewares/auth.middleware"));
const wallet_controller_1 = tslib_1.__importDefault(require("../controllers/wallet.controller"));
class WalletRoute {
    constructor() {
        this.path = '/payment';
        this.router = (0, express_1.Router)();
        this.walletController = new wallet_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // this.router.post(`${this.path}`, authMiddleware(['freelancer', 'client']), this.walletController.createWallet);
        this.router.post(`${this.path}`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.walletController.makePayment);
        this.router.post(`${this.path}/webhook`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.walletController.paymentWebhook);
        this.router.post(`${this.path}/callback`, this.walletController.paymentCallback);
        this.router.post(`${this.path}/transaction`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.walletController.createTransaction);
        this.router.get(`${this.path}/getTransactions`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.walletController.getTransactions);
        this.router.get(`${this.path}/getUserTransaction`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.walletController.getUserTransaction);
        this.router.get(`${this.path}/getTransactionById/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.walletController.getTransactionById);
        this.router.put(`${this.path}/updateWallet/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.walletController.updateWallet);
        this.router.post(`${this.path}/disburse`, (0, auth_middleware_1.default)(['client']), this.walletController.disbursePayment);
    }
}
exports.default = WalletRoute;
//# sourceMappingURL=wallet.route.js.map