// contains middleware request handler logic for the Admin routes
const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const AppError = require('../utils/AppError');

exports.registerAdmin = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new AppError('Validation error', 422, (data = errors.array())));
	}
	const { firstname, lastname, email, username, password } = req.body;
	try {
		const userExists = await Admin.findOne({ username, email });
		if (userExists) {
			return next(new AppError('User already exists', 421));
		}
		const admin = new Admin({ firstname, lastname, email, username, password });
		const token = await admin.generateJWT(admin.email, admin);
		res.status(201).json({
			status: 'Success',
			message: 'Admin account created successfully!',
			token,
		});
	} catch (error) {
		if (error) return next(error);
	}
};

exports.loginAdmin = async (req, res, next) => {
	const { username, email, password } = req.body;
	let userExists;
	try {
		if (username && !email) {
			userExists = await Admin.findOne({ username });
		} else if (!username && email) {
			userExists = await Admin.findOne({ email });
		} else if (!username && !password && !email) {
			throw new AppError('Login credentials required', 422);
		}
		if (!userExists) {
			throw new AppError('User does not exist', 403);
		}
		const user = userExists;
		const isMatched = await user.confirmPassword(password);
		if (!isMatched) {
			throw new AppError('Invalid username or password', 403);
		}
		const token = await user.generateJWT(user.email, user);
		res.status(200).json({
			status: 'Success',
			message: 'User logged in successfully!',
			token,
		});
	} catch (error) {
		if (error) return next(error);
	}
};
