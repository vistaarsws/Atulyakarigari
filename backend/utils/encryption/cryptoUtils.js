import crypto from "crypto";
import config from "../../config/ccAvenue.js";

const key = crypto.createHash("sha256").update(config.workingKey).digest(); 

// IV should be exactly 16 bytes (128-bit)
const iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
]);

export const encrypt = (data) => {
   
    try {
        const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
        let encrypted = cipher.update(data, "utf8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
    } catch (error) {
        console.error("Encryption Error:", error);
        throw new Error("Encryption failed");
    }
};

export const decrypt = (data) => {
    try {
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
        let decrypted = decipher.update(data, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    } catch (error) {
        console.error("Decryption Error:", error);
        throw new Error("Decryption failed");
    }  
};
