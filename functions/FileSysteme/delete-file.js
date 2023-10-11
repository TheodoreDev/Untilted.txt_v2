const fs = require("fs")

function delete_file(username) {
    fs.unlink(`./Ressources/DB/profil_img/${username}_pp.png`, (err) => {
        if(err) {
            console.log(err)
        }
    })
}

module.exports = delete_file