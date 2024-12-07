import otpGenerator from "otp-generator"

export const generateOtp = () => {
    return otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });
};

export const ensureUniqueOtp = async (OtpModel) => {
    let otp = generateOtp();
    let existingOtp = await OtpModel.findOne({ otp });

    // Keep generating new OTP until we find a unique one
    while (existingOtp) {
        otp = generateOtp();
        existingOtp = await OtpModel.findOne({ otp });
    }

    return otp;
};

export const verifyOtp = async (identifier, otp, OtpModel, identifierType) => {
    try {
        //  validation
        if (!identifier || !otp || !OtpModel || !identifierType) {
            return {
                isValid: false,
                error: "Missing required parameters"
            };
        }

        // Find most recent OTP for the identifier
        const query = { [identifierType]: identifier };

        const recentOtp = await OtpModel.find(query)
            .sort({ createdAt: -1 })
            .limit(1);

        // Check if OTP exists
        if (recentOtp.length === 0) {
            return {
                isValid: false,
                error: "Please generate OTP first"
            };
        }

        // Verify OTP
        if (otp !== recentOtp[0].otp) {
            return {
                isValid: false,
                error: "Invalid OTP"
            };
        }

        return {
            isValid: true
        };
    } catch (error) {
        console.error("OTP verification error:", error);
        return {
            isValid: false,
            error: "OTP verification failed"
        };
    }
};
export const isEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};
export const isPhoneNumber = (loginId) => {
    return loginId.startsWith('+91') && loginId.length === 13;
}
