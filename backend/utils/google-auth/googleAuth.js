import { OAuth2Client } from "google-auth-library";
const User = require("../../models/user");

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.VITE_GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

async function googleAuthHandler(token) {
  const payload = await verifyGoogleToken(token);
  if (!payload) throw new Error("Invalid Google token");

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
    });
  }

  return user;
}

module.exports = googleAuthHandler;
