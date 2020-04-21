const { body } = require('express-validator');

const employeeValidator = [
	body('firstname', 'firstname field is required').notEmpty().trim(),
	body('lastname', 'lastname field is required').notEmpty().trim(),
	body('email', 'email address field is required')
		.notEmpty()
		.trim()
		.isEmail()
		.normalizeEmail()
		.withMessage('please provide a valid email address'),
	body('salary', 'salary field is required').notEmpty().trim(),
	body('department', 'department field is required').notEmpty().trim(),
];

const registerValidator = [
	body('firstname', 'firstname is required').notEmpty().trim(),
	body('lastname', 'lastname is required').notEmpty().trim(),
	body('username', 'username is required').notEmpty().trim(),
	body('email', 'email is required')
		.notEmpty()
		.trim()
		.isEmail()
		.normalizeEmail()
		.withMessage('Please, enter a valid email address'),
	body('password', 'password is required')
		.notEmpty()
		.trim()
		.isLength({ min: 8 })
		.custom((value, { req }) => {
			return !value.toLowerCase().includes('password');
		})
		.withMessage("Password cannot contain the word 'password'"),
	body('confirm_password', 'please confirm your password')
		.custom((value, { req }) => {
			return value !== req.password;
		})
		.withMessage('Passwords do not match'),
];

const updateValidator = [
	body('old_password', 'password is required')
		.notEmpty()
		.trim()
		.isLength({ min: 8 })
		.custom((value, { req }) => {
			return !value.toLowerCase().includes('password');
		})
		.withMessage("Password cannot contain the word 'password'"),
	body('new_password', 'New password is required')
		.notEmpty()
		.trim()
		.isLength({ min: 8 })
		.custom((value, { req }) => {
			return !value.toLowerCase().includes('password');
		})
		.withMessage("Password cannot contain the word 'password'"),
	body('confirm_new_password', 'please confirm your password')
		.custom((value, { req }) => {
			return value !== req.new_password;
		})
		.withMessage('Passwords do not match'),
];

module.exports = {
	employeeValidator,
	registerValidator,
	updateValidator,
};
