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
    blacklistSwitch().checked = value === true;
    // set
    blacklistSwitch().addEventListener("click", async function(event) {
        const id = extractVideoID((await getCurrentTab()).url);
        await setBlacklisted(id, blacklistSwitch().checked);
        if (blacklistSwitch().checked === true) {
            // TODO: switch to watch player
        }
        else {
            // TODO: switch to embed player
        }
    });
}

function blacklistSwitch() { return document.getElementById('blacklist-switch'); }