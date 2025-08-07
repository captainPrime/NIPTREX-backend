"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMessage = exports.ResponseCodeEnums = void 0;
var ResponseCodeEnums;
(function (ResponseCodeEnums) {
    // Authentication Response (PREFIX : 1??? | Last Index)
    ResponseCodeEnums[ResponseCodeEnums["AUTHORIZED_SUCCESSFUL"] = 1000] = "AUTHORIZED_SUCCESSFUL";
    ResponseCodeEnums[ResponseCodeEnums["UNAUTHORIZED_TOKEN"] = 1001] = "UNAUTHORIZED_TOKEN";
    ResponseCodeEnums[ResponseCodeEnums["USER_REGISTER_SUCCESSFUL"] = 1002] = "USER_REGISTER_SUCCESSFUL";
    ResponseCodeEnums[ResponseCodeEnums["LOGIN_VALIDATION_ERROR"] = 1003] = "LOGIN_VALIDATION_ERROR";
    ResponseCodeEnums[ResponseCodeEnums["INVALID_LOGIN_CREDENTIALS"] = 1004] = "INVALID_LOGIN_CREDENTIALS";
    ResponseCodeEnums[ResponseCodeEnums["REGISTER_VALIDATION_ERROR"] = 1005] = "REGISTER_VALIDATION_ERROR";
    ResponseCodeEnums[ResponseCodeEnums["DUPLICATE_TOKEN_ERROR"] = 1006] = "DUPLICATE_TOKEN_ERROR";
    ResponseCodeEnums[ResponseCodeEnums["INVALID_ACTIVATION_TOKEN"] = 1008] = "INVALID_ACTIVATION_TOKEN";
    ResponseCodeEnums[ResponseCodeEnums["USER_PROFILE_NOT_ACTIVATED"] = 1009] = "USER_PROFILE_NOT_ACTIVATED";
    ResponseCodeEnums[ResponseCodeEnums["USER_ACCOUNT_ACTIVATION_VALIDATION_ERROR"] = 1010] = "USER_ACCOUNT_ACTIVATION_VALIDATION_ERROR";
    ResponseCodeEnums[ResponseCodeEnums["ACCOUNT_REQUEST_ACTIVATION_VALIDATION_ERROR"] = 1011] = "ACCOUNT_REQUEST_ACTIVATION_VALIDATION_ERROR";
    ResponseCodeEnums[ResponseCodeEnums["INVALID_AUTHORIZATION"] = 1012] = "INVALID_AUTHORIZATION";
    ResponseCodeEnums[ResponseCodeEnums["USER_ACCOUNT_NOT_CONNECTED"] = 1013] = "USER_ACCOUNT_NOT_CONNECTED";
    ResponseCodeEnums[ResponseCodeEnums["CREATE_PROFILE_BIG_QUERY_REQUEST_ERROR"] = 1014] = "CREATE_PROFILE_BIG_QUERY_REQUEST_ERROR";
    ResponseCodeEnums[ResponseCodeEnums["INVALID_USER_PERMISSION"] = 1015] = "INVALID_USER_PERMISSION";
})(ResponseCodeEnums = exports.ResponseCodeEnums || (exports.ResponseCodeEnums = {}));
function responseMessage(code) {
    switch (code) {
        /*
        |--------------------------------------------------------------------------
        | Auth Response
        |--------------------------------------------------------------------------
        */
        case ResponseCodeEnums.LOGIN_VALIDATION_ERROR:
            return {
                status: 400,
                response_code: code,
                message: ResponseCodeEnums[code],
            };
        case ResponseCodeEnums.INVALID_LOGIN_CREDENTIALS:
            return {
                status: 400,
                response_code: code,
                message: ResponseCodeEnums[code],
            };
        case ResponseCodeEnums.USER_REGISTER_SUCCESSFUL:
            return {
                status: 200,
                response_code: code,
                message: ResponseCodeEnums[code],
            };
        default:
            throw new Error(`Invalid response code: ${code}`);
    }
}
exports.responseMessage = responseMessage;
//# sourceMappingURL=ResponseCodeEnums.js.map