const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Register route
router.post('/register', async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    console.log(username, password, confirmPassword);

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.render('register', { message: 'Username already taken.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ username, userpassword: hashedPassword });

        await newUser.save();

        req.session.user = {
            username: newUser.username,
            userId: newUser._id
        };

        res.locals.user = req.session.user;
        req.session.message = `${username} has logged in`
        res.redirect('/');
    } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).send('Error saving user');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {

            const isMatch = await bcrypt.compare(password, existingUser.userpassword);
            if (isMatch) {
                // Password is correct, log the user in
                req.session.user = {
                    username: existingUser.username,
                    userId: existingUser._id
                };

                res.locals.user = req.session.user;

                req.session.message = `${username} has logged in`
                res.redirect('/');
            } else {
                res.render('login', { message: 'Invalid credentials.' });
            }
        } else {
            res.render('login', { message: 'User not found.' });
        }
    } catch (err) {
        console.error("Error logging in", err);
        res.status(500).send('Error logging in');
    }
});

router.post('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out');
        }

        res.redirect('/');
    });
})

module.exports = router;
