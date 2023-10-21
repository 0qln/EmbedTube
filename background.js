function closeTab(tabid) {
  chrome.tabs.remove(tabid, function() { });
}

function isDefaultVideoplayer(url) {  
  const regex = /(https:\/\/www.youtube.com\/watch\?v=)/gm;
  
  let m;
  let ret = false;
  while ((m = regex.exec(url)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    m.forEach((match, groupIndex) => {
      ret = true;
    });
  }
  
  return ret;
}

function getVideoID(url) {
  const regex = /((?<defaultVideoPlayer>https:\/\/www\.youtube\.com\/watch\?v=)|(?<defaultVideoTrailings>\&t*\S*))|((?<embedVideoPlayer>https:\/\/www\.youtube\.com\/embed\/)|(?<OccaisonalEmbedVideoTrailings>\?si=*\S*))/gm;  
  let output = String(url);
  let m;
  while ((m = regex.exec(url)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    
    m.forEach((match, groupIndex) => {
      output = output.replace(match, '');
    });
  }
  
  return output;
}

function createEmbedURL(videoID) {
  return "https://www.youtube.com/embed/" + videoID;
}

async function processVideo(tabid, url) {
  if (isDefaultVideoplayer(url)) {
    // close video and open embed player, if not black listed
    await chrome.storage.local.get(null).then(data => {
      let contains = false;
      for (var key in data) {
        // if the video id is blacklisted and true
        if (key === getVideoID(url) && data[key]) 
          contains = true;
      }        
      if (!contains) {
        closeTab(tabid, url);
        let playerUrl = createEmbedURL(getVideoID(url));
        chrome.tabs.create({ url: playerUrl });
      }
    });
  }  
}

chrome.runtime.onMessage.addListener(async function(request) {  
  if (request.action.includes("blacklist")) {    
    let enabled = request.action.includes("true");
    let vid = await getVideoID((await getLastValidTab()).url);
    if (!vid) return;

    if (enabled) {
      await chrome.storage.local.set({ [vid]:true });    
    }
    else {
      await chrome.storage.local.remove([vid]);
    }

    printStorage();
  }
});

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (!changeInfo.url) return;      
  processVideo(tab.id, changeInfo.url);
});

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action === "youtubeTabUpdate") {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
      let tab = tabs[0];
      if (!tab) return;
      processVideo(tab.id, tab.url);
    });
  }
});

chrome.tabs.onUpdated.addListener(onTabUpdate);
chrome.tabs.onActivated.addListener(onTabUpdate);

async function getLastValidTab() {
  let result;
  await chrome.storage.local.get(["LAST_VALID_TAB"]).then(data => {
    result = data.LAST_VALID_TAB;
  });
  return result;
}
async function onTabUpdate() {

  let tab = await getCurrentTab();
  if (tab && tab.url) {
    await chrome.storage.local.set({LAST_VALID_TAB:tab});
    console.log((await getLastValidTab()).url);
  }

  if (tab.url === undefined) throw new TypeError("`currentTab` is undefined!");
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function printStorage() {
  chrome.storage.local.get(null).then(result => {
    for (var key in result) 
      console.log(key + ": " + result[key]);
  });
}