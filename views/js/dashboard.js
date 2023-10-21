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

var actual_user = document.querySelectorAll(".new-username")
var profil_imgs = document.querySelectorAll(".pp_img")