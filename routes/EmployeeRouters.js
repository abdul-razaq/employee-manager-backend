const employeeRoutes = require('express').Router();
const { body } = require('express-validator');

const EmployeeControllers = require('../controllers/EmployeeControllers');
const authenticate = require('../middlewares/authenticate');

const employeeValidation = [
	body('firstname', 'firstname is required')
		.notEmpty()
		.trim(),
	body('lastname', 'lastname is required')
		.notEmpty()
		.trim(),
	body('email', 'email address is required')
		.notEmpty()
		.trim()
		.isEmail()
		.normalizeEmail(),
	body('salary', 'salary is required')
		.notEmpty()
		.trim()
		.isNumeric(),
	body('department', 'department is required')
		.notEmpty()
		.trim(),
];

employeeRoutes.put(
	'/',
	authenticate,
	employeeValidation,
	EmployeeControllers.createEmployee
);

module.exports = employeeRoutes;
