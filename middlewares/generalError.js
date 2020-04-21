module.exports = (error, req, res, next) => {
	const { statusCode, message, data } = error;
	return res
		.status(statusCode)
		.json({ status: 'error', data: { message, data } });
};
