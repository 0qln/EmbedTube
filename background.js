function closeVideo(tabid) {
  chrome.tabs.remove(tabid, function() { });
}

function shouldExtractVideoID(url) {
  return String(url).includes("youtube.com/watch?v=");
}

function getVideoID(url) {
  const regex = /(https:\/\/www\.youtube\.com\/watch\?v=)|(\&t*\S*)/gm;  
  
  // example input: 
  // const str = `https://www.youtube.com/watch?v=A6iFdhnf1Ac&t=18s`;
  
  let output = String(url);
  let m;
  while ((m = regex.exec(url)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      console.log(`Found match, group ${groupIndex}: ${match}`);
      output = output.replace(match, '');
    });
  }

  return output;
}

function createEmbedURL(videoID) {
  return "https://www.youtube.com/embed/" + videoID;
}

function processVideo(tabid, url) {
  if (!shouldExtractVideoID(url))
    return;
  
  closeVideo(tabid);
  chrome.tabs.create({ url: createEmbedURL(getVideoID(url)) });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!changeInfo.url) return;      
  processVideo(tabs[0].id, changeInfo.url);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "tabUpdate") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs[0]) return;
      processVideo(tabs[0].id, tabs[0].url);
    });
  }
});
