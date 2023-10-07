const fs = require("fs")

function is_file_existing(username) {
    let directory_name = "./Ressources/DB/profil_img";

    let filenames = fs.readdirSync(directory_name);

    let verify = filenames.find(file => file === `${username}_pp.png`)
    if (verify) {
        return "true"
    } else {
        return "false"
    }
}

module.exports = is_file_existing