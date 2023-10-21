var theme_indicator = document.querySelector(".theme-indicator").textContent

if (theme_indicator == "1") {
    document.body.classList.remove("light-theme")
    document.body.classList.add("dark-theme")
} else {
    document.body.classList.remove("dark-theme")
    document.body.classList.add("light-theme")
}

Orders.forEach(order => {
    const tr = document.createElement('tr');
    const trContent = `
        <td>${order.uploadName}</td>
        <td>${order.uploadNumber}</td>
        <td>${order.User}</td>
        <td class="${order.status === 'Declined' ? 'danger' : order.status === 'Pending' ? 'warning' : 'primary'}">${order.status}</td>
        <td class="primary">Details</td>
    `;
    tr.innerHTML = trContent;
    document.querySelector('table tbody').appendChild(tr);
});

const percentage_analyctics = document.querySelectorAll(".percentage")

for(var i = 0; i < percentage_analyctics.length; i++) {
    const analyctic = percentage_analyctics[i].parentElement
    const circle = analyctic.querySelector('circle')
    const percentage = parseInt(percentage_analyctics[i].textContent)
    circle.style.strokeDashoffset = `${226 - percentage/100*226}`
}

var new_users = document.querySelectorAll(".user")

new_users.forEach((new_user) => {
    const pp_status = new_user.querySelector(".user-pp-status").textContent
    const profil_img = new_user.querySelector(".new_user_pp")
    const username = new_user.querySelector(".new-username").textContent
    if (pp_status === "true") {
        var pp_img = `/${username}_pp.png`
        profil_img.src = pp_img
    } else {
        profil_img.src = '/profil-default.png'
    }
})