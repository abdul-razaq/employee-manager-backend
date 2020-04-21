// Routes for the Admin Controllers
const authenticate = require('../middlewares/authenticate');
const AdminControllers = require('../controllers/AdminControllers');

const { registerValidator, updateValidator } = require('../utils/validations');

const adminRoutes = require('express').Router();

adminRoutes.put('/register', registerValidator, AdminControllers.registerAdmin);

adminRoutes.post('/login', AdminControllers.loginAdmin);

adminRoutes.post('/logout', authenticate, AdminControllers.logoutAdmin);

adminRoutes.post(
	'/logout/all',
	authenticate,
	AdminControllers.logoutAdminSessions
);

adminRoutes.patch(
	'/password/update',
	authenticate,
	updateValidator,
	AdminControllers.updatePassword
);

adminRoutes.delete('/', authenticate, AdminControllers.deleteAdminAccount);

adminRoutes.patch('/', authenticate, AdminControllers.updateAdminAccount);

module.exports = adminRoutes;
