const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
	firstname: {
		type: String,
		required: true,
		trim: true,
		index: true,
		validate: value => {
			if (value === '') {
				throw new Error('firstname cannot be an empty string');
			}
		},
	},
	lastname: {
		type: String,
		required: true,
		trim: true,
		index: true,
		validate: value => {
			if (value === '') {
				throw new Error('lastname cannot be an empty string');
			}
		},
	},
	username: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		index: true,
		unique: true,
		validate: async value => {
			if (value === '') {
				throw new Error('username cannot be an empty string');
			}
			const userExists = await Admin.findOne({ username: value });
			if (userExists) {
				return Promise.reject('This username already exists');
			}
		},
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		index: true,
		unique: true,
		validate: async value => {
			if (value === '') {
				throw new Error('email cannot be an empty string');
			}
			const userExists = await Admin.findOne({ email: value });
			if (userExists) {
				return Promise.reject('This email has already been taken');
			}
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
		validate: value => {
			if (value === '' || value.includes('password') || value.length < 8) {
				throw new Error(
					"Password validation failed...check if your password is an empty string or it contains the word 'password' or it has less than 8 characters"
				);
			}
		},
	},
	dateCreated: {
		type: Date,
		required: true,
		default: new Date().toString(),
	},

	tokens: [
		{
			token: {
				type: String,
				required: true,
				immutable: true,
				unique: true,
				index: true,
			},
		},
	],
});

AdminSchema.pre('save', async function(next) {
	const user = this;
	if (user.isModified('password')) {
		try {
			const hashedPassword = await bcrypt.hash(user.password, 10);
			user.password = hashedPassword;
			next();
		} catch (error) {
			throw new Error('Error hashing password');
		}
	}
});

AdminSchema.methods.confirmPassword = async function(password) {
	const user = this;
	try {
		const isMatched = await bcrypt.compare(password, user.password);
		return isMatched;
	} catch (error) {
		if (error) {
			throw new Error('Failed to compare passwords');
		}
	}
};

AdminSchema.methods.generateJWT = async function(email, user) {
	const user = this;
	const token = jwt.sign({ email, user }, process.env.JWT_SECRET, {
		expiresIn: '10h',
  });
  console.log(token);
	user.tokens = user.tokens.unshift(token);
	await user.save();
	return token;
};

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
