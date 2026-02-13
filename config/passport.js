const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const isProd = process.env.NODE_ENV === 'production';
const User = require('../models/userModel');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: isProd
        ? `https://car-rental-api-d7zw.onrender.com/api/auth/google/callback`
        : `http://localhost:${process.env.PORT}/api/auth/google/callback`,
    },
    async (accesToken, refreshToken, profile, done) => {
      try {
        const ADMIN_EMAILS = [
          'chrysorx@gmail.com',
          'ajaxmilton@hotmail.com',
          'antonyochieng00@gmail.com',
          'makindeoluwatobiloba4@gmail.com',
        ];
        console.log(profile);
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const email = profile.emails[0].value.toLowerCase();
          const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'user';
          user = await User.create({
            googleId: profile.id,
            email,
            name: profile.displayName,
            role,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
