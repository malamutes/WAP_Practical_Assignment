const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { required } = require('joi');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userpassword: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false }
})

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;