const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./models/User');
const { Post } = require('./models/Post');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const adminRoutes = require('./routes/admin');
const Joi = require('@hapi/joi');

mongoose.connect('MONGODB URL')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));


const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/bootstrap', express.static(path.join(__dirname, '..', 'node_modules', 'bootstrap', 'dist')));
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});
app.use(authRoutes);
app.use(postRoutes);
app.use(adminRoutes);

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
}, async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false, { message: 'Incorrect username.' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Serialize and deserialize user to maintain session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Route: Homepage
app.get('/', async function (req, res) {
    try {
        let message = "";
        if (!req.session.user) {
            message = "Welcome to my blog website";
        } else {
            message = req.session.message;
        }

        const posts = await Post.find().sort({ date: -1 }).limit(10);

        res.render('index', { title: "hello pug", message, posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).render('error', { message: "Unable to load posts" });
    }
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.use((req, res, next) => {
    res.status(404).render('error', { message: 'Page not found!' });
});

app.listen(3000, function () {
    console.log('Server running at http://localhost:3000');
});
