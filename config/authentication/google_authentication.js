const passport = require("passport");
const User = require("../../models/User");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/user/googleauth/callback",
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const query = {
        $or: [
          { googleId: profile.id }, // First query condition
          { emailId: profile._json.email } // Second query condition (replace 'otherField' and 'someValue' with your actual field and value)
        ]
      };
      const currentUser = await User.findOne(query);
      if (currentUser) {
        done(null, currentUser);
      } else {
        const newUser = new User({
          googleId: profile.id,
          fullName: profile.displayName,
          emailId: profile._json.email,
          profilePicture: profile._json.picture
        });
        await newUser.save();
        done(null, newUser);
      }
    }
  )
);
