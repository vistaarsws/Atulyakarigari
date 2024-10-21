import otpGenerator from "otp-generator"
import { success, badRequest, internalServerError, unauthorized } from "../../helpers/api-response.js";
import User from "../../models/user.js";
import Otp from "../../models/otp.js";

// otp generator
export const sendOtp = async (req, res) => {
    try {
        // fetch email
        const { email } = req.body

        // check if user is already exits
        const checkUserPresent = await User.findOne({ email })

        // if user already exit , return response
        if (checkUserPresent) {
            return badRequest(req, res, null, "Email already in use");
        }

        // generate otp
        let otp = otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log(`generated otp are  : - > ${otp}`);

        // check unique otp or not
        let result = await Otp.findOne({ otp: otp })
        while (result) {
            otp = otpGenerator.generate(4, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await Otp.findOne({ otp: otp })
        }

        // create an entry in db
        const otpBody = await Otp.create({ email, otp })
        return success(req, res, "otp sent successfully", {
            email: otpBody.email,
        })

    } catch (err) {
        console.log(`not able to generate otp  ${err}`)
        return internalServerError(req, res, err, "unable to generate OTP")
    }
}

export const register = async (req, res) => {
    const { fullName, email, password, accountType, otp } = req.body;

    try {
        // Check if all required fields are provided
        if (!fullName || !email || !password || !otp) {
            return badRequest(req, res, null, "All required fields must be provided");
        }

        // Check if user with this email already exists
        let existingUser;
        try {
            existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log(`Email already in use: ${email}`);
                return badRequest(req, res, null, "Email already in use");
            }
        } catch (err) {
            console.error("Error checking existing user:", err);
            return internalServerError(req, res, err, "Database query failed");
        }

        // find most resent otp stored for the user 
        const resentOtp = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1)
        console.log(`resentOtp : -> ${resentOtp}`);

        // validate otp 
        if (resentOtp.length === 0) {
            return res.status(400).json({
                success: false,
                message: "otp not found"
            })
        } else if (otp != resentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "invalid otp"
            })
        }

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            password, // password will be hashed in the pre-save middleware
            accountType,
        });

        // Save the new user to the database
        try {
            await newUser.save();
            console.log("User registered successfully:", newUser);
        } catch (err) {
            console.error("Error saving new user to database:", err);
            return internalServerError(req, res, err, "User registration failed");
        }
        // Generate auth token for the new user
        let token
        try {
            token = newUser.generateAuthToken();
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
            token
        });
    } catch (err) {
        return internalServerError(req, res, err, "User registration failed");
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if both email and password are provided
        if (!email || !password) {
            return badRequest(req, res, null, "Email and password must be provided");
        }

        // Check if the user exists
        let user;
        try {
            user = await User.findOne({ email });
            if (!user) {
                console.log(`User not found for email: ${email}`);
                return unauthorized(req, res, null, "Invalid email ");
            }
        } catch (err) {
            console.error("Error querying user from database:", err);
            return internalServerError(req, res, err, "Database query failed");
        }

        // Compare the provided password with the hashed password in the database
        let isPasswordValid;
        try {
            isPasswordValid = await user.comparePassword(password, user.password);
            if (!isPasswordValid) {
                console.log("Invalid password attempt for user:", email);
                return unauthorized(req, res, null, "Invalid password");
            }
        } catch (err) {
            console.error("Error comparing passwords:", err);
            return internalServerError(req, res, err, "Password comparison failed");
        }

        // Generate JWT token
        let token;
        try {
            token = user.generateAuthToken();
        } catch (err) {
            console.error("Error generating JWT token:", err);
            return internalServerError(req, res, err, "Token generation failed");
        }

        // Return success response with token
        return success(req, res, "successfully login", {
            user: {
                _id: user?._id,
                fullName: user?.fullName,
                email: user?.email,
                accountType: user?.accountType,
                token
            }
        });
    } catch (err) {
        console.error("Unexpected error in login:", err);
        return internalServerError(req, res, err, "Login failed");
    }
};