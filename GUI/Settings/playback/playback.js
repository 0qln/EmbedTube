import { setSettingsOption, getSettingsOption } from "../../../settings.js";


document.addEventListener('DOMContentLoaded', async event => {
    initiateAutoplaySwitch();
});


async function initiateAutoplaySwitch() {    
    // get
    const value = await getSettingsOption("autoplay");
    autoplaySwitch().checked = value === true;
    // set
    autoplaySwitch().addEventListener("click", async function(event) {
        setSettingsOption("autoplay", autoplaySwitch().checked);
    });
}


function autoplaySwitch() { return document.getElementById("autoplay-switch"); }