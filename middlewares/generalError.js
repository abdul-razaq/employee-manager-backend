module.exports = (error, req, res, next) => {
	const { statusCode = 500, message = 'Internal server error', data } = error;
	if (data) {
		return res
			.status(statusCode)
			.json({ status: 'error', data: { message, data } });
	}
	return res.status(statusCode).json({ status: 'error', message });
};
