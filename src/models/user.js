const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('./product');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (validator.isEmpty(value)) {
                throw new Error('Please enter your password!')
            }
        }
    },
    profilePicture: {
        type: String,
    },
    tokens: [{
        token: {
            type: String,
        }
    }],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.statics.checkValidCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        throw new Error('Unable to login 2')
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login 2')
    }

    return user
};

UserSchema.path('name').index({text: true});

UserSchema.methods.newAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user.id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token
};

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;

    return userObj
};

//hash the plain text password before saving
UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
});

UserSchema.pre('remove', async function (next) {
    const user = this;
    await Post.deleteMany({author: user._id});
    next()
});

UserSchema.set('toObject', { virtuals: true });
const User = mongoose.model('User', UserSchema);

module.exports = User;
