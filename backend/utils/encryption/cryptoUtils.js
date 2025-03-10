import crypto from "crypto";
import config from "../../config/ccAvenue.js";

const md5 = crypto.createHash("md5").update(config.workingKey).digest();
const keyBase64 = Buffer.from(md5).toString("base64");

const ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
]).toString("base64");

const getAlgorithm = (key) => {
    const keyBuffer = Buffer.from(key, "base64");
    if (keyBuffer.length === 16) return "aes-128-cbc";
    if (keyBuffer.length === 32) return "aes-256-cbc";
    throw new Error(`Invalid key length: ${keyBuffer.length}`);
};

export const encrypt = (data) => {
    const key = Buffer.from(keyBase64, "base64");
    const iv = Buffer.from(ivBase64, "base64");
    const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted;
};

export const decrypt = (data) => {
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");
  const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);

  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};