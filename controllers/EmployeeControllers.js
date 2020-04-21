const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const AppError = require('../utils/AppError');
const { validationResult } = require('express-validator');

exports.createEmployee = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorsToSend = [];
		errors.array().forEach((error) => {
			errorsToSend.push(error.msg);
		});
		return next(new AppError('Validation error', 400, errorsToSend));
	}
	const { username, email: authAdminEmail, userId } = req;
	const {
		firstname,
		lastname,
		email,
		salary,
		department,
		phoneNumber,
	} = req.body;
	try {
		const authAdmin = await Admin.findOne({
			_id: userId,
			username,
			email: authAdminEmail,
		});
		if (!authAdmin) {
			return next(new AppError('Please Authenticate!', 401));
		}
		const employeeExists = Employee.findOne({ email });
		if (employeeExists) {
			return next(new AppError('Employee already exists!'), 409);
		}
		const employee = new Employee({
			firstname,
			lastname,
			email,
			salary,
			department,
			phoneNumber,
			creator: userId,
		});
		await employee.save();
		authAdmin.createdEmployees = authAdmin.createdEmployees.push(employee._id);
		await authAdmin.save();
		res.status(201).json({
			status: 'success',
			data: {
				message: 'Employee created successfully!',
				id: employee._id,
			},
		});
	} catch (error) {
		if (error) return next(error);
	}
};
