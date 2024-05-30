/* eslint-disable no-undef */
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("./models/User");

const passport = require("passport");


const GOOGLE_CLIENT_ID = "1085766550880-6ei8fpq45049mu7qanhomutkamqj7fkj.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

GITHUB_CLIENT_ID = "Ov23liWUN2p3xF4DaynZ";
GITHUB_CLIENT_SECRET = "0e22502786454887c2f55e4918a5a004242fa87f";

FACEBOOK_APP_ID = "1187434292518609";
FACEBOOK_APP_SECRET = "fedc19761a1377472ca125224ac6ba53";



passport.use(
  new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      const newUser = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
      });
      const savedUser = await newUser.save();
      done(null, savedUser);
    } catch (err) {
      done(err, false);
    }
  })
);


passport.use(
  new GithubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/github/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ githubId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }
    const newUser = new User({
      githubId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
    });
    const savedUser = await newUser.save();
    done(null, savedUser);
  } catch (err) {
    done(err, false);
  }
})
);

passport.use(
  new FacebookStrategy({
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/facebook/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ facebookId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }
    const newUser = new User({
      facebookId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
    });
    const savedUser = await newUser.save();
    done(null, savedUser);
  } catch (err) {
    done(err, false);
  }
})
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});