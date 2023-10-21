function closeVideo(tabid, url) {
  chrome.tabs.remove(tabid, function() { });
}

function isDefaultVideoplayer(url) {
  console.log("isDefaultVideoplayer");
  
  const regex = /(https:\/\/www.youtube.com\/watch\?v=)/gm;
  
  let m;
  let ret = false;
  while ((m = regex.exec(url)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    m.forEach((match, groupIndex) => {
      console.log(`Found match, group ${groupIndex}: ${match}`);
      ret = true;
    });
  }
  
  console.log(ret);
  return ret;
}

function getVideoID(url) {
  console.log("getVideoID");

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
  if (isDefaultVideoplayer(url)) {
    closeVideo(tabid, url);
    let playerUrl = createEmbedURL(getVideoID(url));
    chrome.tabs.create({ url: playerUrl });
  }
}


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!changeInfo.url) return;      
  processVideo(tab.id, changeInfo.url);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "tabUpdate") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs[0]) return;
      processVideo(tabs[0].id, tabs[0].url);
    });
  }
});

