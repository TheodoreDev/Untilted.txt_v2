const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require('method-override')

const config = require("./config.json");

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

const users = []

app.use(express.static("views/html"));
app.use(express.static("views/steelsheet"))
app.use(express.static("views/js"))
app.use(express.static("Ressources/img"))

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

let db = new sqlite3.Database(`./Ressources/DB/${config.dbNAME}.db`, err => {
    if(err){
        throw err
    }else {
        console.log("Database started.")
    }
})
db.all('SELECT * FROM user', [], (error, rows) => {
    if(error){
        throw error
    }
    rows.forEach((row) => {
        users.push({
            username: row.username,
            password: row.password,
            email: row.email,
            admin: row.admin,
            id: row.id
        })
    })
})

var is_user_existing = " "

app.get('/', checkNotAuthenticated, (req, res) => {
    res.render("./html/index.ejs", {is_existing: is_user_existing})
    is_user_existing = " "
})

app.get('/home', checkAuthenticated, (req, res) => {
    res.render("./html/home.ejs", {name: req.user.username, user_type: req.user.admin})
})

app.get('/preferences', checkAuthenticated, (req, res) => {
    res.render("./html/user-preferences.ejs", {name: req.user.username, user_type: req.user.admin})
})

app.post('/login', checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
}))

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        db.all('SELECT * FROM user', [], (error, rows) => {
            if(error){
                throw error
            }
            rows.forEach((row) => {
                if(!users.find(user => user.username === row.username)) {
                    users.push({
                        username: row.username,
                        password: row.password,
                        email: row.email,
                        admin: row.admin,
                        id: row.id
                    })
                }
            })
        })
        if(users.find(user => user.username === req.body.username) 
           || users.find(user => user.email === req.body.email)){
            is_user_existing = "This user already exist."
            res.redirect('/')
        } else {
            const id = Date.now().toString()
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            users.push({
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
                admin: 1,
                id: id,
            })
            db.all(`INSERT INTO "user" VALUES ("${req.body.username}", "${hashedPassword}", "${req.body.email}", 1, "${id}")`)
            is_user_existing = "User well created"
            res.redirect('/')
        }
    } catch {
        res.redirect('/')
    }
})

app.delete('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        is_user_existing = " "
        res.redirect('/')
    })
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/home')
    }
    next()
}  

app.listen(config.devPort, function() {
    console.log(`Listen on port ${config.devPort}`)
})