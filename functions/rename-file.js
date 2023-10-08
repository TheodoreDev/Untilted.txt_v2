const fs = require("fs")

function rename_file(old_name, new_name) {
    let directory_name = "./Ressources/DB/profil_img";

    let filenames = fs.readdirSync(directory_name);
    fs.rename(old_name, new_name, (err) => {
        if (err) {
            throw err
        }
    })
}

module.exports = rename_file