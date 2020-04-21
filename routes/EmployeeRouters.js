const authenticate = require('../middlewares/authenticate');
const EmployeeControllers = require('../controllers/EmployeeControllers');

const { employeeValidator } = require('../utils/validations');

const employeeRoutes = require('express').Router();

employeeRoutes.put(
	'/',
	authenticate,
	employeeValidator,
	EmployeeControllers.createEmployee
);

module.exports = employeeRoutes;
