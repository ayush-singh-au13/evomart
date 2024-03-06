const router = require("express").Router();

router.get('/seller',(req,res) => {
    res.send({message:"success"})
})
module.exports = router;