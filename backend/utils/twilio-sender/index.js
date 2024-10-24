import twilio from 'twilio';
import "dotenv/config"
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;


const client = twilio(accountSid, authToken);

const twilioSender = async (to, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            to: to,
            from: twilioNumber
        });
        return response;
    } catch (error) {
        console.log("Error in sending SMS:", error);
        throw error;
    }
};

export default twilioSender;