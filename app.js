require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.set('PORT', process.env.PORT || 3000);

// Register built in middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Register developer defined middlewares which are split up as routes

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
