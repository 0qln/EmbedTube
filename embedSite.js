

console.log('script present');

document.addEventListener("click", async function(event) {
    if (event.target.classList.value === "ytp-youtube-button ytp-button yt-uix-sessionlink") {
        await chrome.runtime.sendMessage({ action: "openInYoutube" });
    }
});