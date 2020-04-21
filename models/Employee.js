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
		type: mongoose.Schema.Types.Decimal128,
		required: true,
	},
	dateAdded: {
		type: Date,
		default: new Date(),
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
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
