const bcrypt = require("bcryptjs");
const sellerModel = require("../model/seller.model");
const { validationResult } = require("express-validator");
const { otpGenerator } = require("../utils/otp.utils.js");
const sendEmail = require("./../utils/sendEmail.utils.js");
const sendOtp = require("./../utils/phoneOtp.utils.js");
const { htmlToText } = require("html-to-text");
const { createJwtToken } = require("../utils/token.utils.js");
const { response } = require("express");

// sign up a seller
exports.signupSeller = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({ status: 422, errors: errors.array()[0] });
    }
    let { email, password, phone, interested, fullName, i_am } = req.body;
    email = email.toLowerCase();

    // hashing the password for storing it in db
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
    const hashPassword = bcrypt.hashSync(password, salt);

    const createAccount = await sellerModel.create({
      email: email,
      password: hashPassword,
      fullName: fullName,
      phone: phone,
      interested: interested,
      i_am: i_am,
    });
    return res.send({
      status: 201,
      message: "Seller created successfully",
      data: createAccount,
    });
  } catch (e) {
    console.log(e);
    res.send({ status: 500, message: e.message });
  }
};

// sending otp for verification
exports.sendOtp = async (req, res) => {
  try {
    let { phone } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({ status: 422, errors: errors.array()[0] });
    }
    let phoneNumber = phone.split("91")[1];

    // let seller = await sellerModel.findOne({ phone });
    // if (!seller) {
    //   return res.send({
    //     status: 400,
    //     message: "Please pass a valid email",
    //   });
    // }
    let otp = await otpGenerator(process.env.OTP_LENGTH);

    const isOtpSend = await sendOtp(phone, otp);
    if (isOtpSend) {
      await sellerModel.findOneAndUpdate(
        { phone: phoneNumber },
        { $set: { phoneOtp: otp } }
      );
      return res.send({ status: 200, message: "Otp sent successfully" });
    } else {
      return res.send({ status: 422, message: "Failed to send the otp" });
    }
  } catch (e) {
    return res.status(500).send({ status: 500, message: e.message });
  }
};

// ---------------------- Verify Phone OTP ------------------------

exports.verifyPhoneOtp = async (req, res, next) => {
  try {
    let { otp, phone } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({ status: 422, errors: errors.array()[0] });
    }

    const user = await sellerModel.findOne({ phone }).lean();

    if (user.phoneOtp !== otp) {
      return res.send({
        status: 403,
        message: "Invalid OTP",
      });
    }
    const token = createJwtToken({
      userId: user._id,
      interested: user.interested,
      i_am: user.i_am,
    });

    //updating the phoneOtp of user to " "
    await sellerModel.findOneAndUpdate(
      { phone },
      { $set: { phoneOtp: "", token: token, isAccountVerified: true } },
      { new: true }
    );

    return res.send({
      status: 200,
      message: "OTP verified successfully !",
      data: {
        userId: user._id,
        token,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};
