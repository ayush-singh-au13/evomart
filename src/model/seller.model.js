const {model, Schema} = require('mongoose');
const sellerSchema = new Schema({
    fullName : {
        type:String,
        required: true
    },
    email : {
        type:String,
        required: true
    },
    phone:{
        type:String,
        required: true
    },
    password: String,
    interested : {
        type:String,
        enum : ["buy","sell"]
    },
    i_am :String,
    city : String,
    companyName : String,
    about : String,
    logo:String,
    address: String,
    totalProjects:String,
    ongoingProjects:String,
    completedProjects:String,
    website:String,
    phoneOtp:String,
    isAccountVerified:{
        type:Boolean,
        default:false
    }
});

module.exports = model('sellers',sellerSchema);