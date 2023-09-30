const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

app.use(express.static("views/html"));
app.use(express.static("views/steelsheet"))
app.use(express.static("views/js"))

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extented : false}))

const config = require("./config.json");

let db = new sqlite3.Database(`./Ressources/DB/${config.dbNAME}.db`, err => {
    if(err){
        throw err
    }else {
        console.log("Database started.")
    }
})

const users = []

app.get('/', (req, res) => {
    res.render("./html/index.ejs")
})

app.post('/login', (req, res) => {
    try {
        db.get('SELECT * FROM user', (err, data) => {
            if(err){
                throw err
            } else {
                console.log(data)
            }
        })
    } catch (error) {
        throw error
    }
})

app.post('/register', async (req, res) => {
    
})

app.listen(config.devPort, function() {
    console.log(`Listen on port ${config.devPort}`)
});