

document.addEventListener("DOMContentLoaded", async function () {
    let btn = document.getElementById('changePopup');
    btn.addEventListener('click', event => {
        chrome.tabs.create({url: '../GUI/Settings/settings.html'});
    });
});