import crypto from "crypto";
import config from "../../config/ccAvenue.js";

const workingKey = Buffer.from(config.workingKey, "hex");

console.log("📏 Initial HEX Working Key Length:", Buffer.from(config.workingKey, "hex").length);
console.log("📏 Final Working Key Length (After Conversion):", workingKey.length);

const getAlgorithm = (key) => {
  if (key.length === 16) return "aes-128-cbc";
  if (key.length === 32) return "aes-256-cbc";
  throw new Error(`Invalid key length: ${key.length}`);
};

export const encrypt = (data) => {
  console.log("🔒 Encrypting with Working Key Length:", workingKey.length);

  const iv = Buffer.alloc(16);
  const cipher = crypto.createCipheriv(getAlgorithm(workingKey), workingKey, iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
};

export const decrypt = (data) => {
  console.log("🔑 Decrypting with Working Key Length:", workingKey.length);  

  const iv = Buffer.alloc(16);
  const decipher = crypto.createDecipheriv(getAlgorithm(workingKey), workingKey, iv);

  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
