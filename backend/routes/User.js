const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const Todo = require('../models/Todo');

//signinToken
const signToken = userID => {
    return JWT.sign({
        iss: "Chethu",
        sub: userID
    }, "Chethu", { expiresIn: "12h" });
}


//register
userRouter.post('/register', (req, res) => {
    const { username, password, role, email } = req.body;
    User.findOne({ username }, (err, user) => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occurred", msgError: true } });
        if (user)
            res.status(400).json({ message: { msgBody: "Username is already taken", msgError: true } });
        else {
            const newUser = new User({ username, password, role, email });
            newUser.save(err => {
                if (err)
                    res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
                else
                    res.status(201).json({ message: { msgBody: "Account successfully created", msgError: false } });
            });
        }
    });
});


//login
userRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const { _id, username, role } = req.user;
        const token = signToken(_id);
        res.cookie('access_token', token, { httpOnly: true, sameSite: true });
        res.status(200).json({ isAuthenticated: true, user: { username, role } });
    }
});


//logout
userRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.clearCookie('access_token');
    res.json({ user: { username: "", role: "" }, success: true });
});


//Create Todo
userRouter.post('/todo', passport.authenticate('jwt', { session: false }), (req, res) => {
    const todo = new Todo(req.body);
    todo.save(err => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        else {
            // req.user.todos.push(todo);
            req.user.save(err => {
                if (err)
                    res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
                else
                    res.status(200).json({ message: { msgBody: "Successfully created todo", msgError: false } });
            });
        }
    })
});


//Get all data in todo
userRouter.get('/todos', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById({ _id: req.user._id }).populate('todos').exec((err, document) => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        else {
            res.status(200).json({ todos: document.todos, authenticated: true });
        }
    });
});

//User Roles
//admin user role 
userRouter.get('/admin', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.role === 'admin') {
        res.status(200).json({ message: { msgBody: 'You are an admin', msgError: false } });
    }
    else
        res.status(403).json({ message: { msgBody: "You're not an admin,go away", msgError: true } });
});


//Supervisor user role 
userRouter.get('/Supervisor', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.role === 'Supervisor') {
        res.status(200).json({ message: { msgBody: 'You are Supervisor', msgError: false } });
    }
    else
        res.status(403).json({ message: { msgBody: "You're not Supervisor, go away", msgError: true } });
});


//CoSupervisor user role 
userRouter.get('/CoSupervisor', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.role === 'CoSupervisor') {
        res.status(200).json({ message: { msgBody: 'You are CoSupervisor', msgError: false } });
    }
    else
        res.status(403).json({ message: { msgBody: "You're not CoSupervisor,go away", msgError: true } });
});


//PanelMember user role 
userRouter.get('/PanelMember', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.role === 'PanelMember') {
        res.status(200).json({ message: { msgBody: 'You are PanelMember', msgError: false } });
    }
    else
        res.status(403).json({ message: { msgBody: "You're PanelMember,go away", msgError: true } });
});


userRouter.get("/alldata", (req, res) => {
    User.find()
        .then(User => res.json(User))
        .catch(err => res.status(400).json(`${err}`));
});


//All account login authenticated 
userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { username, role } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { username, role } });
});


module.exports = userRouter;

