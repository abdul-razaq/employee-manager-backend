module.exports = (req, res, next) => {
	return res
		.status(404)
		.json({ status: 'error', data: { message: 'Not found!' } });
};
