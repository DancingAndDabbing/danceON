const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});
userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});
const User = mongoose.model("User",userSchema);

module.exports = User;