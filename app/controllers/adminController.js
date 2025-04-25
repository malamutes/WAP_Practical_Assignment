const { User } = require('../models/User');
const { Post } = require('../models/Post');

exports.renderAdminPanel = async (req, res) => {
    try {
        const users = await User.find();
        const posts = await Post.find()
        console.log(users);
        res.render('adminPanel', { users, posts });
    } catch (err) {
        console.error("ADMIN ERROR:", err);
        res.status(500).send("Error loading admin panel.");
    }
};

exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.postID);
        res.redirect('/adminPanel');
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete post.");
    }
};
