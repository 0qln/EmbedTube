

/* TODO
    This has to be ported to the new website partitioning system.
*/

let startedPlay = false;


document.addEventListener("DOMContentLoaded", async function () {
    console.log('embed site');
    if (await doAutoPlay() === true)
        await startPlay();    
}, false);



document.addEventListener("click", async function(event) {
    if (event.target.classList.value === "ytp-large-play-button ytp-button ytp-large-play-button-red-bg") {
        startedPlay = true;        
    }
    if (event.target.classList.value === "ytp-youtube-button ytp-button yt-uix-sessionlink") {
        await chrome.runtime.sendMessage({ action: "openInYoutube" });
    }
});

async function startPlay() {
    if (startedPlay) return;
    
    const [startButton] = document.getElementsByClassName("ytp-large-play-button ytp-button ytp-large-play-button-red-bg");
    const [bgImage] = document.getElementsByClassName("ytp-cued-thumbnail-overlay");

    while (bgImage.getAttribute("style") !== "display: none;" && startedPlay === false) {
        await new Promise(r => setTimeout(r, 100));
        startButton.click();
    }
}

async function doAutoPlay() {
    let output = false;
    await chrome.storage.local.get(["settings_doAutoPlay"]).then(async result => {
        if (result.settings_doAutoPlay) {
            output = result.settings_doAutoPlay;
        }
    });
    return output;
}