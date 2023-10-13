import TokenService from '@/modules/token/token.service';
import UserService from '@/services/users.service';
import { generateReferralCode } from '@/utils/matchPercentage';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const userService = new UserService();
const tokenService = new TokenService();

// Define Passport serialization and deserialization functions
passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done: any) => {
  // Retrieve the user from the database based on the id (assuming an asynchronous operation)
  try {
    const user = await userService.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Configure the Google OAuth2.0 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:3000/auth/oauth', // Update with your actual callback URL
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        console.log('PROFILE', profile._json);
        const user = await userService.findUserByEmail(profile._json.email);

        console.log('USER', user);

        if (!user) {
          // Create a new user here (pseudo-code)
          const newUser = await userService.createUser({
            email: profile._json.email,
            first_name: profile._json.given_name,
            last_name: profile._json.family_name,
            password: 'quadri201',
            referral_code: generateReferralCode(8),
            user: 'freelancer',
            country: 'Nigeria',
            profile_picture: profile._json.picture,
          });
          console.log('NEW USER', newUser);
          return done(null, newUser);
        }

        // Generate auth tokens (assuming an asynchronous operation)
        const tokens = await tokenService.generateAuthTokens(user);

        console.log('TOKEN', tokens);
        console.log('ACCESS TOKEN', accessToken);
        return done(null, tokens.access);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

export default passport;
