const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const user = require('./controllers/user');
const { profileGet } = require('./controllers/profile');


// PGPASSWORD=process.env.DBPASS 
// psql -h pcontainers-us-west-182.railway.app
// -U postgres 
// -p 7080 
// -d railway


const db = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
    // connection: {
    //   host : 'pcontainers-us-west-182.railway.app',//'127.0.0.1',
    //   port : 7080,//5432,
    //   user : 'postgres',//'dev',
    //   password : 'process.env.DBPASS',//'test',
    //   database : 'railway'//'smart-brain'
    // }
  });

const app = express();
app.use(express.json())
app.use(cors());

app.listen(3003, ()=> {
    console.log('app is running on 3003')
});
app.get("/", (req, res)=> {
    res.send("this is working:!");
})
app.get("/users", (req, res)=> { user.handleUsersGet(req, res, db) })
app.get("/profile/:id", (req, res)=> { profileGet(req, res, db) })
app.post("/signin", (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.put("/imagecount", (req, res) => { image.handleImageCount(req, res, db); })
app.post("/imagepost", (req, res) => { image.handleClarifaiCall(req, res); })