import { success, badRequest, internalServerError, unauthorized } from "../../helpers/api-response.js";
import User from "../../models/user.js";
import Otp from "../../models/emailOtp.js";
import SmsOtp from "../../models/smsOtp.js";
import { ensureUniqueOtp } from "../../utils/otp/index.js";



// EMAIL OTP generator
export const sendEmailOtp = async (req, res) => {
    try {
        // fetch email
        const { email } = req.body
        if (!email) {
            badRequest(req, res, null, "Please Provide Email")
        }
        // check if user is already exits
        const checkUserPresent = await User.findOne({ email })

        // if user already exit , return response
        if (checkUserPresent) {
            return badRequest(req, res, null, "Email already in use");
        }

        // generate otp
        const otp = await ensureUniqueOtp(Otp);
        console.log(`Generated OTP is: -> ${otp}`);

        // create an entry in db
        let otpBody
        try {
            otpBody = await Otp.create({ email, otp })
        } catch (error) {
            return badRequest(req, res, error, "Email service error");
        }

        return success(req, res, "otp sent successfully", {
            email: otpBody.email,
        })

    } catch (err) {
        console.log(`not able to generate otp  ${err}`)
        return internalServerError(req, res, err, "unable to generate OTP")
    }
}
// Register with EMAIL OTP
export const registerWithEmail = async (req, res) => {
    const { fullName, email, accountType, otp } = req.body;

    try {
        // Check if all required fields are provided
        if (!fullName || !email || !otp || !accountType) {
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
            return badRequest(req, res, null, "please generate otp first");
        } else if (otp != resentOtp[0].otp) {
            return badRequest(req, res, null, "invalid OTP");
        }

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            accountType,
        });

        // Save the new user to the database
        try {
            await newUser.save();
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
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const login = async (req, res) => {
    try {
        const { loginId } = req.body;

        // Check if loginId is a mobile number or email
        if (loginId.startsWith('+91') && loginId.length === 13) {
            // Mobile number case
            try {
                const user = await User.findOne({ phone: loginId });
                if (user) {
                    // Generate OTP here (this is just a placeholder)
                    const otp = await ensureUniqueOtp(SmsOtp);
                    // Send OTP via SMS logic goes here
                    let otpBody
                    try {
                        otpBody = await SmsOtp.create({ phone, otp });
                    } catch (err) {
                        return internalServerError(req, res, err, "SMS service error");
                    }

                    return success(req, res, "OTP sent successfully", {
                        phone: otpBody.phone,
                    });
                } else {
                    return res.status(404).json({ message: 'Please register first' });
                }
            } catch (error) {
                return res.status(500).json({ message: 'Server error' });
            }
        } else if (validateEmail(loginId)) {
            // Email case
            try {
                const user = await User.findOne({ email: loginId });
                console.log(user);

                if (user) {
                    // Generate OTP here (this is just a placeholder)
                    const otp = await ensureUniqueOtp(Otp);
                    try {
                        otpBody = await Otp.create({ loginId, otp });
                    } catch (err) {
                        console.log(err);

                        return internalServerError(req, res, err, "SMS service error");
                    }
                    // Send OTP via email logic goes here
                    return success(req, res, "OTP sent successfully", {
                        email: otpBody.email,
                    });
                } else {
                    return unauthorized(req, res, error, 'Please register first');
                }
            } catch (error) {
                console.log(error);

                return internalServerError(req, res, error, "server error");
            }
        } else {
            return internalServerError(req, res, null, "Invalid login Id format")
        }
    } catch (err) {
        return internalServerError(req, res, err, "Unable to Login");
    }

}


// SMS OTP generator
export const sendSmsOtp = async (req, res) => {
    try {
        // fetch phone number
        const { phone } = req.body;
        if (!phone) {
            return badRequest(req, res, null, "Please Provide Phone Number");
        }

        // check if user already exists
        const checkUserPresent = await User.findOne({ phone });
        if (checkUserPresent) {
            return badRequest(req, res, null, "Phone number already in use");
        }

        // generate otp
        const otp = await ensureUniqueOtp(Otp);
        console.log(`Generated OTP is: -> ${otp}`);

        // create an entry in db
        let otpBody
        try {
            otpBody = await SmsOtp.create({ phone, otp });
        } catch (err) {
            return internalServerError(req, res, err, "SMS service error");
        }

        return success(req, res, "OTP sent successfully", {
            phone: otpBody.phone,
        });

    } catch (err) {
        console.log(`Not able to generate OTP: ${err}`);
        return internalServerError(req, res, err, "Unable to generate OTP");
    }
};

// Register with SMS OTP
export const registerWithPhone = async (req, res) => {
    const { fullName, phone, accountType, otp } = req.body;

    try {
        // Check if all required fields are provided
        if (!fullName || !phone || !otp || !accountType) {
            return badRequest(req, res, null, "All required fields must be provided");
        }

        // Check if user with this phone already exists
        let existingUser;
        try {
            existingUser = await User.findOne({ phone });
            if (existingUser) {
                console.log(`Phone number already in use: ${phone}`);
                return badRequest(req, res, null, "Phone number already in use");
            }
        } catch (err) {
            console.error("Error checking existing user:", err);
            return internalServerError(req, res, err, "Database query failed");
        }

        // find most recent otp stored for the user
        const recentOtp = await SmsOtp.find({ phone }).sort({ createdAt: -1 }).limit(1);
        console.log(`Recent OTP: -> ${recentOtp}`);

        // validate otp
        if (recentOtp.length === 0) {
            return badRequest(req, res, null, "Please generate OTP first");
        } else if (otp !== recentOtp[0].otp) {
            return badRequest(req, res, null, "Invalid OTP");
        }

        // Create a new user
        const newUser = new User({
            fullName,
            phone,
            accountType,
            isPhoneVerified: true
        });

        // Save the new user
        try {
            await newUser.save();
        } catch (err) {
            console.error("Error saving new user to database:", err);
            return internalServerError(req, res, err, "User registration failed");
        }

        // Generate auth token
        let token;
        try {
            token = newUser.generateAuthToken();
        } catch (error) {
            console.error("Token generation error:", error);
            return internalServerError(req, res, error, "Token generation failed");
        }

        // Return success response
        return success(req, res, "User registered successfully", {
            _id: newUser._id,
            fullName: newUser.fullName,
            phone: newUser.phone,
            accountType: newUser.accountType,
            token
        });
    } catch (err) {
        return internalServerError(req, res, err, "User registration failed");
    }
};