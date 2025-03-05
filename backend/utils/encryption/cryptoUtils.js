import crypto from "crypto";
import config from "../../config/ccAvenue.js";

const workingKey = Buffer.from(config.workingKey, "hex");

export const encrypt = (data) => {
  if (workingKey.length !== 16) {
    throw new Error("Invalid Working Key: Must be 16 bytes");
  }

  const iv = Buffer.alloc(16);
  const cipher = crypto.createCipheriv("aes-128-cbc", workingKey, iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
};

export const decrypt = (data) => {
  const iv = Buffer.alloc(16);
  const decipher = crypto.createDecipheriv("aes-128-cbc", workingKey, iv);

  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
