const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const user = require('./controllers/user');
const { profileGet } = require('./controllers/profile');

let CLARIFAI_API_KEY, CLARIFAI_API_USER;

try {
  const config = require('./config');
  CLARIFAI_API_KEY = config.CLARIFAI_API_KEY;
  CLARIFAI_API_USER = config.CLARIFAI_API_USER;
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') throw error;
  CLARIFAI_API_KEY = null;
  CLARIFAI_API_USER = null;
}

let db = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL || {
        host : '127.0.0.1',
        port : 5432,
        user : 'dev',
        password : 'test',
        database : 'smart-brain'
    },
    ssl: { rejectUnauthorized: false }
  });
 
const app = express();
app.use(express.json())
app.use(cors());

app.listen(process.env.PORT || 3003, ()=> {
    console.log(`app is running on ${process.env.PORT  || 3003}`)
});
app.get("/", (req, res)=> {
    res.send("this is working:!");
})
app.get("/users", (req, res)=> { user.handleUsersGet(req, res, db) })
app.get("/profile/:id", (req, res)=> { profileGet(req, res, db) })
app.post("/signin", (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.put("/imagecount", (req, res) => { image.handleImageCount(req, res, db); })
app.post("/imagepost", (req, res) => { image.handleClarifaiCall(req, res, process.env.CLARIFAI_API_KEY || CLARIFAI_API_KEY, process.env.CLARIFAI_API_USER || CLARIFAI_API_USER); })