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