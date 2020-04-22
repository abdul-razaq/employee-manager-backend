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
			throw new AppError('Please Authenticate!', 401);
		}
		const employeeExists = await Employee.findOne({ email });
		if (employeeExists) {
			throw new AppError('Employee already exists!', 409);
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
		authAdmin.createdEmployees.push(employee._id);
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

exports.deleteEmployee = async (req, res, next) => {
	const { userId, username, email } = req;
	try {
		const authAdmin = await Admin.findOne({ _id: userId, username, email });
		if (!authAdmin) {
			throw new AppError('Admin does not exist', 401);
		}
		const employee = await Employee.findByIdAndDelete({ _id: req.params.id });
		if (!employee) {
			throw new AppError('This Employee does not exist!', 404);
		}
		authAdmin.createdEmployees = authAdmin.createdEmployees.filter(
			(employee) => {
				return employee._id.toString() !== req.params.id.toString();
			}
		);
		await authAdmin.save();
		res.status(200).json({
			status: 'success',
			data: {
				message: 'Employee deleted successfully!',
				id: employee._id,
			},
		});
	} catch (error) {
		if (!error.statusCode || !error.message) {
			error.statusCode = 500;
			error.message = 'An internal error has occurred!';
		}
		next(error);
	}
};
