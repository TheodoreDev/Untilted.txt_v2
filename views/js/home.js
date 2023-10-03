let arrow = document.querySelectorAll(".arrow")

for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement
        console.log(arrowParent)
        arrowParent.classList.toggle("showMenu")
    })
}

let disconnect = document.querySelectorAll(".button_disconnect")
let overlay = document.querySelector(".overlay")

for(var i = 0; i < disconnect.length; i++) {
    disconnect[i].addEventListener("click", () => {
        overlay.classList.add("active")
    })
}