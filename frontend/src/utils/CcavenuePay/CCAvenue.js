import bcrypt from "bcryptjs";
import aes from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
const CCAVENUE_WORKING_KEY = import.meta.env.VITE_CCAVENUE_WORKING_KEY;
const CCAVENUE_MERCHANT_ID = import.meta.env.VITE_CCAVENUE_MERCHANT_ID;
let initOptions = {};

class Configure {
  constructor(options) {
    initOptions = options || {};
  }

  validate(key) {
    return initOptions && initOptions[key] ? true : false;
  }

  throwError(requirement) {
    throw new Error(`${requirement} is required to perform this action`);
  }

  async encrypt(plainText) {
    if (this.validate("working_key") && plainText) {
      const { working_key } = initOptions;
      const key = await bcrypt.hash(working_key, 10);
      return aes.encrypt(plainText, key.substring(0, 16)).toString();
    } else if (!plainText) {
      this.throwError("Plain text");
    } else {
      this.throwError("Working Key");
    }
  }

  async decrypt(encText) {
    if (this.validate("working_key") && encText) {
      const { working_key } = initOptions;
      const key = await bcrypt.hash(working_key, 10);
      const bytes = aes.decrypt(encText, key.substring(0, 16));
      return bytes.toString(Utf8);
    } else if (!encText) {
      this.throwError("Encrypted text");
    } else {
      this.throwError("Working Key");
    }
  }

  redirectResponseToJson(response) {
    if (response) {
      return this.decrypt(response).then((ccavResponse) => {
        const responseArray = ccavResponse.split("&");
        const responseObject = responseArray.reduce((obj, pair) => {
          const [key, value] = pair.split("=");
          obj[key] = value;
          return obj;
        }, {});
        return responseObject;
      });
    } else {
      this.throwError("CCAvenue encrypted response");
    }
  }

  async getEncryptedOrder(orderParams) {
    if (this.validate("merchant_id") && orderParams) {
      let data = `merchant_id=${initOptions.merchant_id}`;
      data += Object.entries(orderParams)
        .map(([key, value]) => `&${key}=${value}`)
        .join("");
      return await this.encrypt(data);
    } else if (!orderParams) {
      this.throwError("Order Params");
    } else {
      this.throwError("Merchant ID");
    }
  }
}

const CCAvenue = new Configure({
  working_key: CCAVENUE_WORKING_KEY,
  merchant_id: CCAVENUE_MERCHANT_ID,
});

export default CCAvenue;
