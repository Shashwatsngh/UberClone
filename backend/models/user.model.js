const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    socketId: {
        type: String,
    }
});

// select false ensures that the password field is not returned in queries by default₹

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    return token;
};

userSchema.methods.comparePassword=async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.hashPassword=async function(password ) {
    return await bcrypt.hash(password,10);
};

module.exports = mongoose.model('User', userSchema);
   