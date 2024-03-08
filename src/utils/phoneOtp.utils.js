const axios = require("axios");
const qs = require("qs");

module.exports = async (phoneNumber, otp) => {
  let data = qs.stringify({
    to: phoneNumber,
    type: "OTP",
    sender: "KLRHXA",
    body: `Dear Customer, ${otp} is your OTP (One Time Password) for the transaction.`,
  });
  let result;
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.kaleyra.io/v1/HXIN1783167421IN/messages",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "api-key": "Ac591205139c16be72ba1eed6120754a4",
    },
    data: data,
  };

  let response = await axios.request(config);
  try {
    if (response && response.data && response.data.error) {
      result = response.data.error.message;
    }
    if (response && response.data && response.data.data.length) {
      result = response.data.data[0].message_id;
    }
    return result;
  } catch (e) {
    console.log(e);
  }

  return result;
};
