import express from 'express';
import bcrypt from "bcryptjs";
import {createRequire } from 'module';
import User from '../models/User.js';

const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/users/login', async (req, res) => {
    
    try {
        // Get data from request
        const {email, password} = req.body;

        // Validate no filed is empty
        if (!(email && password)) {
            return res.status(401).send('All fields are mandatory');
        }

        // Check if user exist in DB
        const getUser = await User.findOne({email});
        if (!getUser) {
            return res.status(404).send('User not exist!');
        }
        
        // Check is password is correct
        const match = await bcrypt.compare(password, getUser.password);
        if (!match) {
            return res.status(401).send('Wrong Password');
        }


        // generate a token for user
        const accessToken = jwt.sign(
            {id: getUser._id, email},
            process.env.SECRET_KEY,
            {expiresIn: '1h'}
        );  

        const refreshToken = jwt.sign(
            {id: getUser._id, email},
            process.env.SECRET_KEY,
            {expiresIn: '1d'}
        );  

        // Set the refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,                     // Not accessible to JavaScript
            secure: true,                       // Only over HTTPS in prod
            maxAge: 1 * 24 * 60 * 60 * 1000     // 1 day in milliseconds
        });

        console.log('User logged in');
        res.status(201).json({message: 'User successfully logged in', accessToken});

    } catch (err) {
        console.log(err);
    }

});

router.post('/users/register', async (req, res) => {

    try {

        // Get data from request
        const {name, email, userID, password} = req.body;
        console.log(`name = ${name}`);
        console.log(`email = ${email}`);
        console.log(`userID = ${userID}`);
        console.log(`password = ${password}`);

        // Validate no filed is empty
        if (!(name && email && userID && password)) {
            return res.status(400).send('All fields are mandatory');
        }

        // Check if user already exists
        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            console.log('User already exists with same email');
            return res.status(200).send('User already exists with same email');
        }

        const existingUserID = await User.findOne({ userID });
        if (existingUserID) {
            console.log('User ID already in use');
            return res.status(200).send('User ID already in use');
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user in DB
        const user = await User.create({
            name,
            email,
            userID,
            password: hashedPassword
        });
        
        // generate a token for user
        const accessToken = jwt.sign(
            {id: user._id, email},
            process.env.SECRET_KEY,
            {expiresIn: '1h'}
        );  

        user.token = accessToken;
        user.password = undefined;

        const refreshToken = jwt.sign(
            {id: user._id, email},
            process.env.SECRET_KEY,
            {expiresIn: '1d'}
        );  

        // Set the refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,                      // Not accessible to JavaScript
            secure: true,                        // Only over HTTPS in prod
            maxAge: 1 * 24 * 60 * 60 * 1000      // 1 day in milliseconds
        });

        console.log('Account successfully registered');
        console.log(user);
        res.status(201).json({message: 'USer saved to DB', user});
    } catch (err) {
        console.log(err);   
    }
});

router.post('/users/logout', (req, res) => {

    res.clearCookie('refreshToken');
    res.status(400).send('logout rout accessed');
});

export default router;
