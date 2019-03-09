// Import Express and create app variable to use express
const express = require('express');
const mongoose = require('mongoose');

// Importing Routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();


// DB config
const db = require('./config/keys').mongoURI;

// Connect to mongodb
mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//Origin Route
app.get('/', (req, res) => res.send('HI!'));

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

//Port Variable Heroku port || local
const port = process.env.PORT || 5000;

//Set Up Port to run app(aka express)
app.listen(port, () => console.log(`Server running on port ${port}`));