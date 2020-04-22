const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
	firstname: {
		type: String,
		required: true,
		trim: true,
		index: true,
	},
	lastname: {
		type: String,
		required: true,
		trim: true,
		index: true,
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
	dateAdded: {
		type: Date,
		default: new Date().toUTCString(),
		required: true,
	},
	department: {
		type: String,
		required: true,
		trim: true,
		index: true,
	},
	phoneNumber: {
		type: String,
		required: true,
		trim: true,
	},
});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
