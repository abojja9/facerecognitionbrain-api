const express = require("express");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const cors = require("cors");

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = require('knex')({
    client: 'pg',
    connection: {
        host :  'postgresql-flat-37061',
        user : 'postgres',
        password : '',
        database : 'smart-brain'
    }
  });

// const postgres = require('knex')({
//     client: 'pg',
//     connection: process.env.PG_CONNECTION_STRING,
//     searchPath: ['knex', 'public'],
//   });

db.select('*').from('users').then(
    data => {console.log(data);
    })
// console.log()

const app = express();
app.use(express.json());
app.use(cors());

// const database ={
//     users : [
//         {
//             id: '123',
//             name: 'John',
//             email: 'john@gmail.com',
//             password: 'abhi',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Sally',
//             email: 'sally@gmail.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date()
//         }
//     ]
// }

app.get('/', (req, res) => {
    res.send('It is working!')
})

app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt));

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
    


app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db));


app.put("/image", (req, res) => image.handleImage(req, res, db));

app.post("/imageurl", (req, res) => image.handleApiCall(req, res));


// Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
//     // result == true
// });

app.listen(process.env.PORT || 3000, () => {
   console.log(`app is running on port ${process.env.PORT}`) 
})

/*
/ ---> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user




*/