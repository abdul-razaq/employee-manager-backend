// Routes for the Admin Controllers
const adminRoutes = require('express').Router();
const { body } = require('express-validator');

const AdminControllers = require('../controllers/AdminControllers');

const registerValidator = [
	body('firstname', 'firstname is required')
		.notEmpty()
		.trim(),
	body('lastname', 'lastname is required')
		.notEmpty()
		.trim(),
	body('username', 'username is required')
		.notEmpty()
		.trim(),
	body('email', 'email is required')
		.notEmpty()
		.trim()
		.isEmail()
		.normalizeEmail({ all_lowercase: true })
		.withMessage('Please, enter a valid email address'),
	body('password', 'password is require')
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

adminRoutes.put('/register', registerValidator, AdminControllers.registerAdmin);

module.exports = adminRoutes;
