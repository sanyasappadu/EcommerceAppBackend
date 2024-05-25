const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    cart: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }]
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;


// const mongoose  = require("mongoose")

// const UserSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true,
//     },
//     email:{
//         type:String,
//         required:true,
//         unique:true,
//     },
//     password:{
//         type:String,
//         required:true,
//     },
//     img:{
//         type:String,
//     },
//     phonenumber:{
//         type:String,
//         // required:true
//     }
// },{
//     timestamps:true
//     }
// )
// const User = mongoose.model("User", UserSchema)
// module.exports = User;

// remove package-lock-json 
// brew -> install pnpm
// install package in the server folder using pnpm
// harikrath singh coding and non coding






// {
//     "username": "john_doe",
//     "email": "john@example.com",
//     "password": "securepassword123",
//     "default_address": 1,
//     "orders": 3,
//     "wallet_amount": 100.00,
//     "phone_number": "123-456-7890"
// }