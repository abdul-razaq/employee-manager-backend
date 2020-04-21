const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
	let token = req.get('authorization');
	if (!token) {
		return next(new AppError('Please authenticate!', 401));
	}
	token = token.split(' ')[1];
	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const { username, email, userId } = decodedToken;
		const authUser = await Admin.findOne({
			_id: userId,
			username,
			email,
			'tokens.token': token,
		});
		if (!authUser) {
			throw new AppError('Could not authenticate admin!', 401);
		}
		req.username = username;
		req.email = email;
		req.token = token;
		req.userId = userId;
		next();
	} catch (error) {
		if (error) return next(error);
	}
};
