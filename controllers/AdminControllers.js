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
			admin.username,
			admin.email,
			admin._id
		);
		res.status(201).json({
			status: 'success',
			data: {
				message: 'Admin account created successfully!',
				token,
				email: admin.email,
				username: admin.username,
				id: admin._id,
			},
		});
	} catch (error) {
		if (error) return next(error);
	}
};

exports.loginAdmin = async (req, res, next) => {
	const { username, email, password } = req.body;
	let admin;
	if (username && !email) {
		admin = await Admin.findOne({ username });
	} else if (!username && email) {
		admin = await Admin.findOne({ email });
	} else if (!username && !password && !email) {
		return next(new AppError('Login credentials required', 422));
	}
	if (!admin) {
		return next(new AppError('User does not exist', 403));
	}
	const isMatched = await admin.confirmPassword(password);
	if (!isMatched) {
		return next(new AppError('Invalid username or password', 403));
	}
	const token = await admin.generateJWT(admin.username, admin.email, admin._id);
	res.status(200).json({
		status: 'success',
		data: {
			message: 'Admin logged in successfully!',
			token,
			email: admin.email,
			username: admin.username,
			id: admin._id,
		},
	});
};

exports.updatePassword = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new AppError('Validation error', 422, (data = errors.array())));
	}
	const { old_password, new_password } = req.body;
	const { username, email, userId } = req;
	try {
		const authAdmin = await Admin.findOne({ _id: userId, username, email });
		if (!authAdmin) {
			throw new AppError('User does not exist', 403);
		}
		const isMatched = await authAdmin.confirmPassword(old_password);
		if (!isMatched) {
			throw new AppError("That doesn't work, try again", 403);
		}
		authAdmin.password = new_password;
		await authAdmin.save();
		res.status(201).json({
			status: 'success',
			data: { message: 'Admin Password changed successfully!' },
		});
	} catch (error) {
		if (error) return next(error);
	}
};

exports.logoutAdmin = async (req, res, next) => {
	const { userId, username, email, token } = req;
	try {
		const authAdmin = await Admin.findOne({
			_id: userId,
			username,
			email,
			'tokens.token': token,
		});
		if (!authAdmin) {
			throw new AppError('Please authenticate!', 403);
		}
		authAdmin.tokens = authAdmin.tokens.filter((token) => {
			return token.token === token;
		});
		await authAdmin.save();
		res.status(200).json({
			status: 'success',
			data: { message: 'Admin logged out successfully!' },
		});
	} catch (error) {
		if (error) return next(error);
	}
};

exports.logoutAdminSessions = async (req, res, next) => {
	const { userId, email, username, token } = req;
	try {
		const authAdmin = await Admin.findOne({
			_id: userId,
			email,
			username,
			'tokens.token': token,
		});
		if (!authAdmin) {
			throw new AppError('Please authenticate!', 403);
		}
		authAdmin.tokens = [];
		await authAdmin.save();
		res.status(200).json({
			status: 'success',
			data: { message: 'Logged out of all sessions successfully!' },
		});
	} catch (error) {
		if (error) return next(error);
	}
};

exports.deleteAdminAccount = async (req, res, next) => {
	const { username, email, userId } = req;
	try {
		const authAdmin = Admin.findOne({ _id: userId, username, email });
		if (!authAdmin) {
			throw new AppError('Please authenticate!', 403);
		}
		await Admin.deleteOne({ _id: userId, username, email });
		res.status(200).json({
			status: 'success',
			data: { message: 'Admin account deleted successfully!' },
		});
	} catch (error) {
		if (error) return next(error);
	}
};

exports.updateAdminAccount = async (req, res, next) => {
	const { username, firstname, lastname, email } = req.body;
	try {
		const authAdmin = await Admin.findOne({
			_id: req.userId,
			email: req.email,
			username: req.username,
		});
		if (!authAdmin) {
			throw new AppError('Please authenticate!', 403);
		}
		authAdmin.firstname = firstname || authAdmin.firstname;
		authAdmin.lastname = lastname || authAdmin.lastname;
		authAdmin.username = username || authAdmin.username;
		authAdmin.email = email || authAdmin.email;
		await authAdmin.save();
		res.status(200).json({
			status: 'success',
			data: { message: 'Account updated successfully!' },
		});
	} catch (error) {
		if (error) return next(error);
	}
};
