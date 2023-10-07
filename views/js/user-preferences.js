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