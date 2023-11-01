import { getBlacklisted, setBlacklisted } from "../../blacklist.js";
import { extractVideoID, getCurrentTab } from "../../utils.js";


document.addEventListener("DOMContentLoaded", async function () {
    let btn = document.getElementById('changePopup');
    btn.addEventListener('click', event => {
        chrome.tabs.create({url: '../GUI/Settings/settings.html'});
    });
    initiateBlacklistSwitch();
});


async function initiateBlacklistSwitch() {    
    // get
    const value = await getBlacklisted(extractVideoID((await getCurrentTab()).url));
    blacklistSwitch().checked = value ?? false;
    // set
    blacklistSwitch().addEventListener("click", async function(event) {
        const id = extractVideoID((await getCurrentTab()).url);
        setBlacklisted(id, blacklistSwitch().checked);
    });
}

function blacklistSwitch() { return document.getElementById('blacklist-switch'); }