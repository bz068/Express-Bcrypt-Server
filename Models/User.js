const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true, 
    },
    lastName:{
        type: String,
        required: true, 
    },
    email:{
        type: String,
        required: true, 
        unique: true
    },
    passwordHash:{
        type: String,
        required: true, 
    },
   
});

const User = mongoose.model('user', UserSchema);
module.exports = User;