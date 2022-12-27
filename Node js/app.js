const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
//autentisering passport
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;


const url = ('mongodb://localhost/forumDb');
mongoose.connect(url, {
    useNewUrlParser: true,
   useUnifiedTopology: true 
});
const con = mongoose.connection;

con.on('open', () => {
    console.log('connected...')
});
//
const app = express();
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded 
app.use(cors());
app.use(bodyParser.json());// parse application/json

app.use(passport.initialize());
//threads
app.use('/threads', require('./routes/thread-route'))
///users
app.use('/users', require('./routes/users-route'))


app.listen(3000, () => {
    console.log("listening on port 3000");
})