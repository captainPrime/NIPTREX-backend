"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flw = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@/config");
const flutterwave_node_v3_1 = tslib_1.__importDefault(require("flutterwave-node-v3"));
exports.flw = new flutterwave_node_v3_1.default(config_1.FLW_PUBLIC_KEY, config_1.FLW_SECRET_KEY);
//# sourceMappingURL=flutterwave.js.map