import crypto from "crypto";
import keys from "../../config/ccAvenue.js";

// Convert HEX workingKey to Buffer
const workingKey = Buffer.from(keys.workingKey, "hex"); // ✅ Ensure correct format
const iv = Buffer.alloc(16, 0); // 16-byte IV (all zeros)

// ✅ Encrypt function
export const encrypt = (data) => {
  if (workingKey.length !== 16) {
    throw new Error("Invalid Working Key: Must be 16 bytes");
  }
  const cipher = crypto.createCipheriv("aes-128-cbc", workingKey, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// ✅ Decrypt function
export const decrypt = (data) => {
  const decipher = crypto.createDecipheriv("aes-128-cbc", workingKey, iv);
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
