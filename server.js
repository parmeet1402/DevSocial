const express = require('express');
const mongoose = require('mongoose');

// Routes are included in this file
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// DB Config
const db = require('./config/keys').mongoURI;

// Connect with mongoDB
mongoose.connect(db).then(()=>console.log('MongoDB Connected!')).catch(err => conosle.log(err));

// Basic Routing
app.get('/',(req,res)=> res.send('hellosssss'));


// routes are set up
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


// Port number
const port = process.env.PORT || 5000;

// Setting up server port and callback func
app.listen(port, ()=>console.log(`Server is running on ${port}`));