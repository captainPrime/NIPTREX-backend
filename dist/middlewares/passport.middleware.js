"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const token_service_1 = tslib_1.__importDefault(require("../modules/token/token.service"));
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
const matchPercentage_1 = require("../utils/matchPercentage");
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userService = new users_service_1.default();
const tokenService = new token_service_1.default();
// Define Passport serialization and deserialization functions
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    // Retrieve the user from the database based on the id (assuming an asynchronous operation)
    try {
        const user = await userService.findUserById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
});
// Configure the Google OAuth2.0 strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: 'https://niptrex.onrender.com/auth/oauth', // Update with your actual callback URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await userService.findUserByEmail(profile._json.email);
        if (!user) {
            // Create a new user here (pseudo-code)
            const newUser = await userService.createUser({
                email: profile._json.email,
                first_name: profile._json.given_name,
                last_name: profile._json.family_name,
                password: 'quadri201',
                referral_code: (0, matchPercentage_1.generateReferralCode)(8),
                user: 'freelancer',
                country: 'Nigeria',
                profile_picture: profile._json.picture,
            });
            // Generate auth tokens (assuming an asynchronous operation)
            const tokens = await tokenService.generateAuthTokens(newUser);
            return done(null, tokens.access);
        }
        // Generate auth tokens (assuming an asynchronous operation)
        const tokens = await tokenService.generateAuthTokens(user);
        return done(null, tokens.access);
    }
    catch (err) {
        return done(err);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.middleware.js.map