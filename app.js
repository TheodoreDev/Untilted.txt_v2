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
const is_file_existing = require("./functions/FileSysteme/is-file-existing")
const rename_file = require("./functions/FileSysteme/rename-file")
const delete_file = require("./functions/FileSysteme/delete-file")
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
        var is_img_profile = is_file_existing(row.username)
        users.push({
            username: row.username,
            password: row.password,
            email: row.email,
            admin: row.admin,
            id: row.id,
            birthday: row.birthday,
            theme: row.theme,
            pp_status: is_img_profile,
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
        pp_status: req.user.pp_status,
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
        pp_status: req.user.pp_status,
        birthday: req.user.birthday,
        checkbox: checkbox,
        theme: req.user.theme,
        email: req.user.email,
    })
})

app.get('/dashboard', checkAuthenticated, async (req, res) => {
    if (req.user.admin == 1) {
        res.render("./html/dashboard.ejs", {
            name: req.user.username, 
            user_type: req.user.admin, 
            theme: req.user.theme,
            users
        })
    } else {
        res.redirect('/home')
    }
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
            var is_img_profile = is_file_existing(row.username)
            users.push({
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
                admin: 0,
                id: id,
                birthday: null,
                theme: 0,
                pp_status: is_img_profile,
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

app.post('/update-preferences', checkAuthenticated, async (req, res) => {
    const act_user = users.indexOf(users.find(user => user.username === req.user.username))

    var newUsername = req.user.username
    const oldUsername = req.user.username
    if (req.body.username) {
        newUsername = req.body.username
    }
    var newEmail = req.user.email
    if (req.body.email) {
        newEmail = req.body.email
    }
    var newBirthday = req.user.birthday
    if (req.body.birthday) {
        newBirthday = req.body.birthday
    }
    var newTheme = req.user.theme
    if (req.body.theme === "on") {
        newTheme = 1
    } else {
        newTheme = 0
    }
    var newPassword = req.user.password
    if (req.body.new_password) {
        newPassword = await bcrypt.hash(req.body.new_password, 10)
    }
    var Admin = req.user.admin
    var id = req.user.id

    if (await bcrypt.compare(req.body.password, req.user.password)) {

        const is_img_profile = is_file_existing(oldUsername)
        users[act_user] = {
            username: newUsername,
            password: newPassword,
            email: newEmail,
            admin: Admin,
            id: id,
            birthday: newBirthday,
            theme: newTheme,
            pp_status: is_img_profile,
        }
        db.run(`UPDATE "user"
                SET username = '${newUsername}', password = '${newPassword}', email = '${newEmail}', admin = ${Admin}, id = '${id}', birthday = '${newBirthday}', theme = ${newTheme} 
                WHERE id = '${id}'`)
        if (is_img_profile === "true") {
            rename_file(`./Ressources/DB/profil_img/${oldUsername}_pp.png`, `./Ressources/DB/profil_img/${newUsername}_pp.png`)
        }
        
        req.logOut((err) => {
            if (err) {
                return next(err)
            }
            is_user_existing = " "
            res.redirect('/')
        })
    } else {
        res.redirect('/preferences')
        return
    }
})

app.post('/delete-account', checkAuthenticated, async (req, res) => {
    const user_to_delete = users.indexOf(users.find(user => user.username === req.user.username))
    if (await bcrypt.compare(req.body.password_to_delete, req.user.password)) {
        if (req.body.verify_char == `${req.user.username}/${req.user.email}`) {
            users.splice(user_to_delete, 1)
            db.run(`DELETE FROM "user" WHERE username = "${req.user.username}"`)
            if (is_file_existing(req.user.username) === "true") {
                delete_file(req.user.username)
            }
            req.logOut((err) => {
                if (err) {
                    return next(err)
                }
                is_user_existing = " "
                res.redirect('/')
            })
        }
    }
})

app.delete('/logout', checkAuthenticated, (req, res, next) => {
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