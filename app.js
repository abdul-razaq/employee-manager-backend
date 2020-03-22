require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/AdminRouters');
const error404 = require('./middlewares/error404');
const generalError = require('./middlewares/generalError');

const app = express();

app.set('PORT', process.env.PORT || 3000);

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/admin', adminRoutes);
app.use(error404);
app.use(generalError);

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
	.catch(err => {
		console.log("Application didn't connect!");
	});
