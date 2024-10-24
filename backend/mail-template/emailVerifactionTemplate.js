import "dotenv/config"
const FRONTEND_URL = process.env.FRONTEND_URL

const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html>
	<head>
		<title>OTP Verification Email</title>
	</head>
	<body>
		<div >
			<div>OTP Verification Email</div>
			<div>
				<p>Dear User,</p>
				<p>Thank you for registering with Atulya Karigiri. To complete your registration, please use the following OTP
					(One-Time Password) to verify your account:</p>
				<h2>${otp}</h2>
				<p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
				Once your account is verified, you will have access to our platform and its features.</p>
			</div>
		</div>
	</body>
	
	</html>`;
};
export default otpTemplate;