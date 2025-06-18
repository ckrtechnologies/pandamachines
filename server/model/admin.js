const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['admin', 'sub-admin'],
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Admin', adminSchema);
