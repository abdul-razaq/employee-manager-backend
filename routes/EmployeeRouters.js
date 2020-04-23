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

employeeRoutes.delete('/:id', authenticate, EmployeeControllers.deleteEmployee);

employeeRoutes.get('/:id', authenticate, EmployeeControllers.getAnEmployee);

employeeRoutes.patch('/:id', authenticate, EmployeeControllers.editAnEmployee);

employeeRoutes.get('/', authenticate, EmployeeControllers.getAllEmployees);

module.exports = employeeRoutes;
