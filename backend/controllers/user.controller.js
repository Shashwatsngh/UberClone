const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');


module.exports.registerUser = async (req, res, next) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);

    const { fullname, email, password } = req.body;
    const hashedPassword = await userModel.hashPassword(password);

    const user= await userService.createUser({
        fullname: {
            firstname: fullname.firstname,
            lastname: fullname.lastname
        },
        email,
        password: hashedPassword,
    });
    console.log("User created:", user);

    const token = user.generateAuthToken();
    
    res.status(201).json({
        message: 'User registered successfully',
        user,
        token,
    });


    
};


module.exports.loginUser = async (req, res, next) =>
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user)
    {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
    {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.status(200).json({
        message: 'Login successful',
        user,
        token,
    });
}; 