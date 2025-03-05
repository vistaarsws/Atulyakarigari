export default {
  /**  Merchant Credentials */
  merchantId: process.env.CCAVENUE_MERCHANT_ID,

  /**  Payment Request (Encryption) */
  accessCode: process.env.CCAVENUE_ACCESS_CODE,
  workingKey: process.env.CCAVENUE_WORKING_KEY, 

  /**  Payment Failure API */
  failureAccessCode: process.env.CCAVENUE_FAILURE_ACCESS_CODE, 
  failureWorkingKey: process.env.CCAVENUE_FAILURE_WORKING_KEY, 

  /**  API Endpoints */
  redirectUrl: process.env.CCAVENUE_REDIRECT_URL, 
  cancelUrl: process.env.CCAVENUE_CANCEL_URL, 
  /**  Frontend Redirect URLs */
  frontendSuccessUrl: process.env.FRONTEND_SUCCESS_URL, 
  frontendFailureUrl: process.env.FRONTEND_FAILURE_URL, 
};
