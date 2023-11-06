
export async function manage(document) {
    // imports
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));
    const settings = await import(chrome.runtime.getURL('settings.js'));
    const blacklist = await import(chrome.runtime.getURL('blacklist.js'));

    // vars
    let output = "";

    // main
    document.addEventListener("click", async function(event) {
        // open in youtube
        if (event.target.classList.value === "ytp-youtube-button ytp-button yt-uix-sessionlink") {
            utils.MANAGE_ME("OPEN_IN_YT", types.Content.Embed, types.Platform.Youtube, document.location.href);
        }
    });

    if (isPlayable(document) === false) {
        output = "NOT_PLAYABLE";
    }
    
    if (await blacklist.getBlacklisted(utils.extractVideoID(location.href)) === true) {
        output = "OPEN_IN_YT";
    }
    
    if (await settings.getSettingsOption("autoplay") === true) {
        await autoPlay(document); 
    }

    return output;
}

function isPlayable(document) {        
    // check wether an error popped up on the site, suggesting that this video
    // is not playable by an embed player
    return document.getElementsByClassName('ytp-error').length === 0;
}   

// testing required
function hasStarted(document) {
    const [bgImage] = document.getElementsByClassName("ytp-cued-thumbnail-overlay");
    return bgImage.style.display === "none";
}

async function autoPlay(document, maxTries = 20) {
    function startButton() { 
        return document.getElementsByClassName("ytp-large-play-button ytp-button ytp-large-play-button-red-bg")[0]; 
    }

    while (hasStarted(document) === false && --maxTries > 0) {
        startButton().click();
        await new Promise(r => setTimeout(r, 100));
    }
    
    console.log("Auto play success: " + (maxTries > 0));
}