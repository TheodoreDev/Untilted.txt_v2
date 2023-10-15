var theme_indicator = document.querySelector(".theme-indicator").textContent

if (theme_indicator == "1") {
    document.body.classList.remove("light-theme")
    document.body.classList.add("dark-theme")
} else {
    document.body.classList.remove("dark-theme")
    document.body.classList.add("light-theme")
}