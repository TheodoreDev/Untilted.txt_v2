let arrow = document.querySelectorAll(".arrow")

for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement
        arrowParent.classList.toggle("showMenu")
    })
}

let disconnect = document.querySelectorAll(".button_disconnect")
let overlay = document.querySelector(".overlay")
let deco_popup = document.querySelector(".deco_popup")

for(var i = 0; i < disconnect.length; i++) {
    disconnect[i].addEventListener("click", () => {
        overlay.classList.add("active")
        deco_popup.classList.add("active")
    })
}

let close_popup = document.querySelectorAll(".close_popup")

for(var i = 0; i < close_popup.length; i++) {
    close_popup[i].addEventListener("click", () => {
        overlay.classList.remove("active")
        deco_popup.classList.remove("active")
    })
}

var actual_user = document.querySelector(".profil-name").textContent
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