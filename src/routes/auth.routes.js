const router = require("express").Router();
const ctrl = require("./../controller/auth.controller");
const { checkIfSellerExists } = require("./../middleware");

// seller sign up
router.post("/seller/signup", checkIfSellerExists, ctrl.signupSeller);
// seller login
router.post("/login",()=> {
    res.send({status:200, message:'Logged in successfully'}); 
});
module.exports = router;
