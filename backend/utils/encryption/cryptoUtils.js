import crypto from "crypto";
import keys from "../../config/ccAvenue.js";

// Ensure workingKey exists and is a valid 16-byte key
if (!keys.workingKey || keys.workingKey.length !== 32) {
  throw new Error("Invalid Working Key: Must be a 32-character HEX string (16 bytes)");
}

// Convert HEX workingKey to Buffer
const workingKey = Buffer.from(keys.workingKey, "hex");

// ✅ Encrypt function
export const encrypt = (data) => {
  if (workingKey.length !== 16) {
    throw new Error("Invalid Working Key: Must be 16 bytes after conversion");
  }
  
  const iv = crypto.randomBytes(16); // Use a random IV for better security
  const cipher = crypto.createCipheriv("aes-128-cbc", workingKey, iv);
  
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Prepend IV to the encrypted data (needed for decryption)
  return iv.toString("hex") + encrypted;
};

// ✅ Decrypt function
export const decrypt = (data) => {
  if (data.length < 32) {
    throw new Error("Invalid encrypted data format");
  }

  // Extract IV from the first 32 characters (16 bytes)
  const iv = Buffer.from(data.slice(0, 32), "hex");
  const encryptedText = data.slice(32);
  
  const decipher = crypto.createDecipheriv("aes-128-cbc", workingKey, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
