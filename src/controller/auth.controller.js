const bcrypt = require("bcryptjs");
const sellerModel = require("../model/seller.model");

exports.signupSeller = async (req, res) => {
  try {
    const { email, password, phone, interested, fullName, i_am } = req.body;
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
      i_am : i_am
    });
    return res.send({
      status: 201,
      message: "Seller created successfully",
      data: createAccount,
    });
  } catch (e) {
    res.send({ status: 500, message: e.message });
  }
};
