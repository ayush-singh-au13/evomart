const router = require("express").Router();
const { signupValidator,getOtpValidator,verifyOtpValidator } = require("../validators/auth.validation");
const ctrl = require("./../controller/auth.controller");
const { checkIfSellerExists } = require("./../middleware");

// seller sign up
router.post(
  "/signup",
  [signupValidator],
  checkIfSellerExists,
  ctrl.signupSeller
);
// seller login
router.post("/otp", [getOtpValidator],ctrl.sendOtp);

// verify login
router.post("/verifyOTP", [verifyOtpValidator],ctrl.verifyPhoneOtp);

module.exports = router;
