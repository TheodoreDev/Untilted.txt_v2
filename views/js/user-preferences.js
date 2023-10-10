let change_pp = document.querySelector(".change_profil_img")
let overlay_pp = document.querySelector(".change_photo_overlay")

change_pp.addEventListener("mouseover", () => {
    overlay_pp.classList.add("active")
})
change_pp.addEventListener("mouseout", () => {
    overlay_pp.classList.remove("active")
})

let close_popup_pp = document.querySelector(".circle_close")
let overlay_pp_popup = document.querySelector(".overlay")

change_pp.addEventListener("click", () => {
    overlay_pp_popup.classList.add("active")
})
close_popup_pp.addEventListener("click", () => {
    overlay_pp_popup.classList.remove("active")
})

let delete_button = document.querySelector(".button_delete")
let popup_delete = document.querySelector(".overlay_delete")
let close_delete_popup = document.querySelector(".circle_close_delete")

delete_button.addEventListener("click", () => {
    popup_delete.classList.add("active")
})
close_delete_popup.addEventListener("click", () => {
    popup_delete.classList.remove("active")
})

const theme_switcher = document.querySelector('.theme-switcher');
const theme_mod = document.querySelector(".theme_mod")

if (theme_switcher.checked) {
    document.body.classList.remove("light-theme")
    document.body.classList.add("dark-theme")
} else {
    document.body.classList.remove("dark-theme")
    document.body.classList.add("light-theme")
}
theme_switcher.addEventListener("click", () => {
    if (theme_switcher.checked) {
        document.body.classList.remove("light-theme")
        document.body.classList.add("dark-theme")
        theme_mod.textContent = "Dark"

    } else {
        document.body.classList.remove("dark-theme")
        document.body.classList.add("light-theme")
        theme_mod.textContent = "Light"
    }
})


var actual_user = document.querySelector(".UserName").textContent
var profil_imgs = document.querySelectorAll(".pp_img")
var is_pp = document.querySelector(".pp-status").textContent

for (var i = 0; i < profil_imgs.length; i++) {
    const profil_img = profil_imgs[i]
    if (is_pp === "true") {
        var pp_img = `${actual_user}_pp.png`
        profil_img.src = pp_img
    } else {
        profil_img.src = 'profil-default.png'
    }
}