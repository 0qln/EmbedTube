

console.log("content script")

chrome.runtime.sendMessage({ action: "tabUpdate" });

function closeVideo() {
  console.log("pause video");
  // let pauseButton = document.getElementsByClassName("ytp-play-button ytp-button")[0];
  // pauseButton.click();
}

console.log("add listener");
chrome.runtime.addListener(function(request, sender, sendResponse) {
  console.log("listen");
  if (request.action === "pauseVideo") {
    closeVideo();
  }
});

