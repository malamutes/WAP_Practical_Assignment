const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware to check admin status
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    }
    return res.status(403).send("Access Denied: Admins only.");
}

// Admin panel
router.get('/adminPanel', isAdmin, adminController.renderAdminPanel);

// Delete a blog post
router.post('/admin/delete/:postID', isAdmin, adminController.deletePost);

module.exports = router;
