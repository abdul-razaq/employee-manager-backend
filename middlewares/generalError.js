module.exports = (error, req, res, next) => {
	const { statusCode = 500, message = "Internal server error", data } = error;
	return res
		.status(statusCode)
		.json({ status: 'error', data: { message, data } });
};
