import { setSettingsOption, getSettingsOption } from "../../../settings.js";


document.addEventListener('DOMContentLoaded', async event => {
    initiateSwitch("autoplay", autoplaySwitch);
    initiateSwitch("playlist-fetching", playlistFetchingSwitch);
    initiateSwitch("playlist-playback", playlistPlaybackswitch);
});


async function initiateSwitch(settingName, switchElement) {
    // get
    const value = await getSettingsOption(settingName);
    switchElement().checked = value === true;
    // set
    switchElement().addEventListener("click", async event => {
        setSettingsOption(settingName, switchElement().checked);
    });
}


function playlistPlaybackswitch() { return document.getElementById("playlist-playback-switch"); }
function playlistFetchingSwitch() { return document.getElementById("playlist-fetching-switch"); }
function autoplaySwitch() { return document.getElementById("autoplay-switch"); }