module.exports = class AppError extends Error {
	constructor(
		message = 'An error has occurred',
		statusCode = 500,
		data = null
	) {
		super();
		this.message = message;
		this.statusCode = statusCode;
		this.data = data;
	}
};
