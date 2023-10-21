

document.addEventListener("click", function(event) {
    if (event.target.classList.value === "ytp-youtube-button ytp-button yt-uix-sessionlink") {
        console.log('open in youtube');
        chrome.runtime.sendMessage({ action: "openInYoutube" });
    }
});