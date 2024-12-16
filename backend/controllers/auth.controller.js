import {
  success,
  badRequest,
  internalServerError,
  unauthorized,
} from "../helpers/api-response.js";
import mongoose from "mongoose";
import User from "../models/user.js";
import Otp from "../models/emailOtp.js";
import SmsOtp from "../models/smsOtp.js";
import {
  ensureUniqueOtp,
  isEmail,
  isPhoneNumber,
  verifyOtp,
} from "../utils/otp/index.js";
import { createProfileForUser } from "./profile.controller.js";
import Profile from "../models/profile.js";

//  OTP generator
export const sendOtp = async (req, res) => {
  try {
    // fetch email
    const { loginId } = req.body;
    if (!loginId) {
      return badRequest(req, res, null, "fields are missing");
    }
    const isEmailLogin = isEmail(loginId);
    const isPhoneNumberLogin = isPhoneNumber(loginId);
    if (!isEmailLogin && !isPhoneNumberLogin) {
      return badRequest(req, res, null, "Invalid login Id format");
    }
    if (isEmailLogin) {
      try {
        // check if user is already exits
        const checkUserPresent = await User.findOne({ email: loginId });

        // if user already exit , return response
        if (checkUserPresent) {
          return badRequest(
            req,
            res,
            null,
            "Email already in use Please login"
          );
        }

        // generate otp
        const otp = await ensureUniqueOtp(Otp);
        console.log(`Generated OTP is: -> ${otp}`);

        // create an entry in db
        let otpBody;
        try {
          otpBody = await Otp.create({ email: loginId, otp });
        } catch (error) {
          return badRequest(req, res, error, "Unable to create OTP");
        }

        return success(req, res, "otp sent successfully", {
          email: otpBody.email,
        });
      } catch (error) {
        log(`Not able to generate OTP: ${error}`);
        return internalServerError(
          req,
          res,
          err,
          "unable to generate Email OTP"
        );
      }
    } else {
      try {
        // check if user already exists
        const checkUserPresent = await User.findOne({ phone: loginId });
        if (checkUserPresent) {
          return badRequest(
            req,
            res,
            null,
            "Phone number already in use Please login"
          );
        }

        // generate otp
        const otp = await ensureUniqueOtp(Otp);
        console.log(`Generated OTP is: -> ${otp}`);

        // create an entry in db
        let otpBody;
        try {
          otpBody = await SmsOtp.create({ phone: loginId, otp });
        } catch (err) {
          return internalServerError(req, res, err, "SMS service error");
        }
        return success(req, res, "OTP sent successfully", {
          phone: otpBody.phone,
        });
      } catch (err) {
        console.log(`Not able to generate OTP: ${err}`);
        return internalServerError(req, res, err, "unable to generate SMS OTP");
      }
    }
  } catch (err) {
    console.log(`not able to generate otp  ${err}`);
    return internalServerError(req, res, err, "unable to generate OTP");
  }
};
// Register user
export const register = async (req, res) => {
  const { fullName, loginId, accountType, otp } = req.body;

  try {
    // Check if all required fields are provided
    if (!fullName || !loginId || !otp || !accountType) {
      return badRequest(req, res, null, "All required fields must be provided");
    }
    const isEmailLogin = isEmail(loginId);
    const isPhoneNumberLogin = isPhoneNumber(loginId);
    if (!isEmailLogin && !isPhoneNumberLogin) {
      return badRequest(req, res, null, "Invalid login Id format");
    }
    if (isEmailLogin) {
      // let existingUser;
      try {
        const existingUser = await Profile.findOne({ email: loginId });
        if (existingUser) {
          return badRequest(req, res, null, "Email already in use");
        }
      } catch (err) {
        console.error("Error checking existing user:", err);
        return internalServerError(req, res, err, "Database query failed");
      }
      // Verify OTP
      const otpVerification = await verifyOtp(loginId, otp, Otp, "email");
      if (!otpVerification.isValid) {
        return badRequest(req, res, null, otpVerification.error);
      }

      // Create a new user
      const newUser = new User({
        fullName,
        email: loginId,
        accountType,
      });

      // Save the new user to the database
      try {
        await newUser.save();
      } catch (err) {
        console.error("Error saving new user to database:", err);
        return internalServerError(req, res, err, "User registration failed");
      }

      // Create a profile for the new user
      try {
        await createProfileForUser(newUser, fullName, isEmailLogin, loginId);
      } catch (err) {
        console.error("Error creating profile:", err);
        return internalServerError(req, res, err, "Profile creation failed");
      }

      // Generate auth token for the new user
      let token;
      try {
        token = await newUser.generateAuthToken();
        // console.log(`Generated token: ${token}`);
      } catch (error) {
        console.error("Token generation error:", error);
        return internalServerError(req, res, error, "Token generation failed");
      }

      // Return success response with token
      return success(req, res, "User registered successfully", {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        accountType: newUser.accountType,
        token,
      });
    } else {
      try {
        // Check if user with this phone already exists
        let existingUser;
        try {
          existingUser = await Profile.findOne({ phone: loginId });
          if (existingUser) {
            console.log(`Phone number already in use: ${loginId}`);
            return badRequest(req, res, null, "Phone number already in use");
          }
        } catch (err) {
          console.error("Error checking existing user:", err);
          return internalServerError(req, res, err, "Database query failed");
        }

        // find most recent otp stored for the user
        const recentOtp = await SmsOtp.find({ phone: loginId })
          .sort({ createdAt: -1 })
          .limit(1);

        // validate otp
        if (recentOtp.length === 0) {
          return badRequest(req, res, null, "Please generate OTP first");
        } else if (otp !== recentOtp[0].otp) {
          return badRequest(req, res, null, "Invalid OTP");
        }

        // Create a new user
        const newUser = new User({
          fullName,
          phone: loginId,
          accountType,
          isPhoneVerified: true,
        });

        // Save the new user
        try {
          await newUser.save();
        } catch (err) {
          console.error("Error saving new user to database:", err);
          return internalServerError(req, res, err, "User registration failed");
        }

        // Create a profile for the new user
        try {
          await createProfileForUser(newUser, fullName, isEmailLogin, loginId);
        } catch (err) {
          console.error("Error creating profile:", err);
          return internalServerError(req, res, err, "Profile creation failed");
        }

        // Generate auth token
        let token;
        try {
          token = newUser.generateAuthToken();
        } catch (error) {
          console.error("Token generation error:", error);
          return internalServerError(
            req,
            res,
            error,
            "Token generation failed"
          );
        }

        // Return success response
        return success(req, res, "User registered successfully", {
          _id: newUser._id,
          fullName: newUser.fullName,
          phone: newUser.phone,
          accountType: newUser.accountType,
          token,
        });
      } catch (err) {
        return internalServerError(req, res, err, "User registration failed");
      }
    }
    // Check if user with this email already exists
  } catch (err) {
    return internalServerError(req, res, err, "User registration failed");
  }
};
// login
export const login = async (req, res) => {
  try {
    const { loginId } = req.body;
    // Check if loginId is a mobile number or email
    if (isPhoneNumber(loginId)) {
      // Mobile number case
      try {
        const user = await Profile.findOne({ phone: loginId });
        if (user) {
          // Generate OTP here (this is just a placeholder)
          const otp = await ensureUniqueOtp(SmsOtp);
          console.log(`Generated OTP is: -> ${otp}`);

          // Send OTP via SMS logic goes here
          let otpBody;
          try {
            otpBody = await SmsOtp.create({ phone: loginId, otp });
          } catch (err) {
            return internalServerError(req, res, err, "SMS service error");
          }

          return success(req, res, "OTP sent successfully", {
            phone: otpBody.phone,
          });
        } else {
          return res.status(404).json({ message: "Please register first" });
        }
      } catch (error) {
        return res.status(500).json({ message: "Server error" });
      }
    } else if (isEmail(loginId)) {
      // Email case
      try {
        const user = await Profile.findOne({ email: loginId });

        if (user) {
          // Generate OTP here (this is just a placeholder)
          const otp = await ensureUniqueOtp(Otp);
          console.log(otp, "generated otp");

          let otpBody;
          try {
            otpBody = await Otp.create({ email: loginId, otp });
          } catch (err) {
            console.log(err);
            return internalServerError(req, res, err, "SMS service error");
          }

          // Send OTP via email logic goes here
          return success(req, res, "OTP sent successfully", {
            email: otpBody.email,
          });
        } else {
          return unauthorized(req, res, {}, "Please register first");
        }
      } catch (error) {
        console.log(error);

        return internalServerError(req, res, error, "server error");
      }
    } else {
      return internalServerError(req, res, null, "Invalid login Id format");
    }
  } catch (err) {
    return internalServerError(req, res, err, "Unable to Login");
  }
};
export const validateOtp = async (req, res) => {
  try {
    const { loginId, otp } = req.body;
    if (!loginId || !otp) {
      return badRequest(req, res, null, "fields are missing");
    }
    const isEmailLogin = isEmail(loginId);
    const isPhoneNumberLogin = isPhoneNumber(loginId);
    if (!isEmailLogin && !isPhoneNumberLogin) {
      return badRequest(req, res, null, "Invalid login Id format");
    }

    if (isPhoneNumberLogin) {
      const otpVerification = await verifyOtp(loginId, otp, SmsOtp, "phone");
      if (!otpVerification.isValid) {
        return badRequest(req, res, null, otpVerification.error);
      }
      // after successfully verified generate token
      const profileDetails = await Profile.findOne({ contactNumber: loginId });
      const user = await User.findOne({ additionalDetails: profileDetails._id }).populate({
        path: "additionalDetails",
      });
      const token = await user.generateAuthToken(user);
      return success(req, res, "OTP verified successfully", {
        _id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        accountType: user.accountType,
        token,
      });
    } else {
      const otpVerification = await verifyOtp(loginId, otp, Otp, "email");
      if (!otpVerification.isValid) {
        return badRequest(req, res, null, otpVerification.error);
      }
      // generate token
      const profileDetails = await Profile.findOne({ email: loginId });
      const user = await User.findOne({ additionalDetails: profileDetails._id }).populate({
        path: "additionalDetails",
      });
      console.log(user);
      const token = await user.generateAuthToken();
      return success(req, res, "OTP verified successfully", {
        _id: user._id,
        fullName: user.additionalDetails.fullName,
        email: user.additionalDetails.email,
        accountType: user.accountType,
        token,
      });
    }
  } catch (err) {
    return internalServerError(req, res, err, "Unable to validate OTP");
  }
};
export const backup = async (req, res) => {
  try {
    const { BACKUP_ATLAS_URI } = req.body
    // Connect to the backup database
    const backupConnection = await mongoose.createConnection(BACKUP_ATLAS_URI,);

    // Get collections from the current database
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      const collectionName = collection.collectionName;

      // Fetch data from the current database
      const data = await collection.find({}).toArray();

      // Create a collection in the backup database and insert the data
      const backupCollection = backupConnection.collection(collectionName);
      if (data.length > 0) {
        await backupCollection.insertMany(data);
      }
    }

    // for (const collection of collections) {
    //   await collection.deleteMany({});
    // }

    res.status(200).send({ message: 'Backup completed successfully in Atlas.' });
  } catch (error) {
    console.error('Error during backup:', error);
    res.status(500).send({ error: 'Backup failed.' });
  }
} 
