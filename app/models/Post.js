const { string } = require('joi');
const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tags: [String],
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.String, ref: 'User', required: true }
})

const postValidationSchema = Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required()
});

const Post = mongoose.model('Post', postSchema);

module.exports = { Post, postValidationSchema };