const sellerModel = require("./../model/seller.model");
module.exports = async (req, res, next) => {
  try {
    let { email } = req.body;

    // check if email and phone already exists
    let data = await sellerModel
      .findOne({ email: email })
      .select({ _id: 1 })
      .lean();

    if (data) {
      return res.send({ status: 403, message: "Seller already exists" });
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
    return res.send({ status: 500, message: e.message });
  }
};
