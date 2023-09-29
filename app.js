const express = require("express");
const app = express();

const users = []

app.use(express.static("views/html"));
app.use(express.static("views/steelsheet"))
app.use(express.static("views/js"))

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extented : false}))

const {connect, get} = require("mongoose");
const config = require("./config.json");
connect(config.dbURL, {}).then(() => console.log("Connected to the database"));
const UserInformationSchema = require("./Schemas/UserInformations");

app.get('/', (req, res) => {
    res.render("./html/index.ejs")
})

app.post('/login', (req, res) => {
    
})

app.post('/register', (req, res) => {
    
})

app.listen(4000)