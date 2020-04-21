// Routes for the Admin Controllers
const adminRoutes = require('express').Router();
const { body } = require('express-validator');

const AdminControllers = require('../controllers/AdminControllers');
const authenticate = require('../middlewares/authenticate');

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

adminRoutes.put('/register', registerValidator, AdminControllers.registerAdmin);

adminRoutes.post('/login', AdminControllers.loginAdmin);

adminRoutes.patch(
	'/password/update',
	[
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
	],
	authenticate,
	AdminControllers.updatePassword
);

adminRoutes.post('/logout', authenticate, AdminControllers.logoutAdmin);

adminRoutes.post(
	'/logout/all',
	authenticate,
	AdminControllers.logoutAdminSessions
);

adminRoutes.patch('/', authenticate, AdminControllers.updateAdminAccount);

adminRoutes.delete('/', authenticate, AdminControllers.deleteAdminAccount);

module.exports = adminRoutes;
