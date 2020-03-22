module.exports = (error, req, res, next) => {
	const { statusCode: status, message, data } = error;
	return res.status(status).json({ status: 'Error', message, data });
};
