let change_pp = document.querySelector(".change_profil_img")
let overlay_pp = document.querySelector(".change_photo_overlay")

change_pp.addEventListener("mouseover", () => {
    overlay_pp.classList.add("active")
})
change_pp.addEventListener("mouseout", () => {
    overlay_pp.classList.remove("active")
})