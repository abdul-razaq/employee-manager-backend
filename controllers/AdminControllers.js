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
			return next(new AppError('User already exists', 422));
		}
		const admin = new Admin({ firstname, lastname, email, username, password });
		const token = await admin.generateJWT(
			admin.email,
			admin.username,
			admin._id
		);
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
	let user;
	if (username && !email) {
		user = await Admin.findOne({ username });
	} else if (!username && email) {
		user = await Admin.findOne({ email });
	} else if (!username && !password && !email) {
		return next(AppError('Login credentials required', 422));
	}
	if (!user) {
		return next(AppError('User does not exist', 403));
	}
	const isMatched = await user.confirmPassword(password);
	if (!isMatched) {
		return next(AppError('Invalid username or password', 403));
	}
	const token = await user.generateJWT(user.email, user.username, user._id);
	res.status(200).json({
		status: 'Success',
		message: 'User logged in successfully!',
		token,
	});
};

exports.updatePassword = async (req, res, next) => {
	const { old_password, new_password } = req.body();
	const { username, email, userId } = req;
	try {
		const authAdmin = await Admin.findOne({ _id: userId, username, email });
		if (!authAdmin) {
			throw new AppError('User does not exist', 404);
		}
		const isMatched = authAdmin.confirmPassword(old_password);
		if (!isMatched) {
			throw new AppError('Enter correct password', 403);
		}
		authAdmin.password = new_password;
		await authAdmin.save();
		res
			.status(200)
			.json({ status: 'Success', message: 'Password changed successfully!' });
	} catch (error) {
		if (error) return next(error);
	}
};
