const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require('method-override')
const multer = require("multer")

const config = require("./config.json");
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "./Ressources/DB/profil_img")
    },
    filename : (req, file, cb) => {
        cb(null, `${req.user.username}_pp.png`)
    }
})

const initializePassport = require('./functions/passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)
const is_file_existing = require("./functions/is-file-existing")
const checkAuthenticated = require("./functions/Authenticate/checkAuthenticated")
const checkNotAuthenticated = require("./functions/Authenticate/checkNotAuthenticated")

const users = []

app.use(express.static("views/html"));
app.use(express.static("views/steelsheet"))
app.use(express.static("views/js"))
app.use(express.static("Ressources/img"))
app.use(express.static("./Ressources/DB/profil_img"))

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
        console.log(`Database ${config.dbNAME} started.`)
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
            id: row.id,
            birthday: row.birthday,
            theme: row.theme
        })
    })
})

const upload = multer({storage : storage});

var is_user_existing = " "

app.get('/', checkNotAuthenticated, (req, res) => {
    res.render("./html/index.ejs", {is_existing: is_user_existing})
    is_user_existing = " "
})

app.get('/home', checkAuthenticated, (req, res) => {
    var is_img_profile = is_file_existing(req.user.username)
    res.render("./html/home.ejs", {
        name: req.user.username, 
        user_type: req.user.admin, 
        pp_status: is_img_profile,
        theme: req.user.theme,
    })
})

app.get('/preferences', checkAuthenticated, async (req, res) => {
    var checkbox = " "
    var is_img_profile = is_file_existing(req.user.username)
    if (req.user.theme == "1") {
        checkbox = "checked"
    }
    res.render("./html/user-preferences.ejs", {
        name: req.user.username, 
        user_type: req.user.admin, 
        pp_status: is_img_profile,
        birthday: req.user.birthday,
        checkbox: checkbox,
    })
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
                        id: row.id,
                        birthday: row.birthday,
                        theme: row.theme
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
                admin: 0,
                id: id,
                birthday: null,
                theme: 0
            })
            db.all(`INSERT INTO "user" VALUES ("${req.body.username}", "${hashedPassword}", "${req.body.email}", 0, "${id}", ${null}, 0)`)
            is_user_existing = "User well created"
            res.redirect('/')
        }
    } catch {
        res.redirect('/')
    }
})

app.post('/upload_pp', checkAuthenticated, upload.single("file_upload"), (req, res) => {
    res.redirect('/preferences')
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

app.listen(config.devPort, function() {
    console.log(`Listen on port ${config.devPort}`)
})