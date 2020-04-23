require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.set('PORT', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/admin', require('./routes/AdminRouters'));
app.use('/employees', require('./routes/EmployeeRouters'));
app.use(require('./middlewares/error404'));
app.use(require('./middlewares/generalError'));

mongoose
	.connect(process.env.MONGODB_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => {
		console.log('Connected to the database');
		app.listen(app.get('PORT'), () => {
			console.log('Application started on port ' + app.get('PORT'));
		});
	})
	.catch(() => {
		console.log("Application didn't connect!");
	});
