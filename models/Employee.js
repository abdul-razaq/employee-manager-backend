const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema(
	{
		firstname: {
			type: String,
			required: true,
			trim: true,
			index: true,
			lowercase: true,
		},
		lastname: {
			type: String,
			required: true,
			trim: true,
			index: true,
			lowercase: true,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			index: true,
			unique: true,
		},
		salary: {
			type: String,
			required: true,
		},
		department: {
			type: String,
			required: true,
			trim: true,
			index: true,
			lowercase: true,
		},
		phoneNumber: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
