"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const faker_1 = require("@faker-js/faker");
const token_types_1 = tslib_1.__importDefault(require("./token.types"));
const token_model_1 = tslib_1.__importDefault(require("./token.model"));
const config_1 = require("@/config");
const token_service_1 = tslib_1.__importDefault(require("./token.service"));
class TokenModelTest {
    constructor() {
        this.password = 'password1';
        this.tokenService = new token_service_1.default();
        this.accessTokenExpires = (0, moment_1.default)().add(config_1.JWT_ACCESS_EXPIRATION_MINUTES, 'days');
        this.userOne = {
            _id: new mongoose_1.default.Types.ObjectId(),
            name: faker_1.faker.name.findName(),
            email: faker_1.faker.internet.email().toLowerCase(),
            password: this.password,
            role: 'user',
            verified: false,
        };
        this.userOneAccessToken = this.tokenService.generateToken(this.userOne._id, this.accessTokenExpires, token_types_1.default.ACCESS);
        this.refreshTokenExpires = (0, moment_1.default)().add(config_1.JWT_REFRESH_EXPIRATION_DAYS, 'days');
        this.newToken = {
            token: this.userOneAccessToken,
            user: this.userOne._id.toHexString(),
            type: token_types_1.default.REFRESH,
            expires: this.refreshTokenExpires.toDate(),
        };
        this.testValidToken = async () => {
            await expect(new token_model_1.default(this.newToken).validate()).resolves.toBeUndefined();
        };
        this.testInvalidTypeToken = async () => {
            this.newToken.type = 'invalidType';
            await expect(new token_model_1.default(this.newToken).validate()).rejects.toThrow();
        };
    }
}
describe('Token Model', () => {
    const tokenModelTest = new TokenModelTest();
    test('should correctly validate a valid token', tokenModelTest.testValidToken);
    test('should throw a validation error if type is unknown', tokenModelTest.testInvalidTypeToken);
});
//# sourceMappingURL=token.model.test.js.map