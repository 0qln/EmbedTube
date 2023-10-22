
function isDefaultVideoplayer(url) {
  return /https:\/\/www\.youtube\.com\/watch\?v=/gm.test(url);
}

function getVideoID(url) {
  const regex = /(\S*((\?v\=)|(\&v\=)|(embed\/)))|\&=*\S*/gm;
  let output = String(url), m;
  while (m = regex.exec(url)) {
    // This is necessary to avoid infinite loops with zero-width matches
    regex.lastIndex += m.index === regex.lastIndex ? 1 : 0;
    
    m.forEach((match, groupIndex) => {
      output = output.replace(match, '');
    });
  }
  return output;
}

function createEmbedURL(videoID) {
  return "https://www.youtube.com/embed/" + videoID;
}


async function embedPlayer(tabid, url) { 
  if (!isDefaultVideoplayer(url) || await isBlacklisted(url)) return;

  // we have to go back first, as youtube openend to site faster than us
  await chrome.tabs.goBack(); 
  // then switch to the embed player
  let playerUrl = createEmbedURL(getVideoID(url));
  await chrome.tabs.update(tabid, { url:playerUrl });
}

async function isBlacklisted(url) {
  var output = false;
  await chrome.storage.local.get(null).then(result => {
    for (var key in result) 
      if (key === getVideoID(url) && result[key]) {
        output = true;
        return;
      }    
  });
  return output;
}

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action === "openInYoutube") {

    let tab = sender.tab;
    if (!tab) return;

    let vid = getVideoID(tab.url); 
    await chrome.storage.local.set({[vid]:true});
  }
});

chrome.runtime.onMessage.addListener(async function(request) {  
  if (request.action.includes("blacklist")) {    
    let enabled = request.action.includes("true");
    let tab = await getCurrentTab();
    if (!tab || !tab.url) return;

    let vid = getVideoID(tab.url); 
    console.assert(vid);

    if (enabled) await chrome.storage.local.set   ({[vid]:true});
    else         await chrome.storage.local.remove( [vid]);    
  }
});

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (!changeInfo.url) return;      
  console.assert(changeInfo.url);
  embedPlayer(tab.id, changeInfo.url);
});

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action === "youtubeTabUpdate") {
    let tab = await getCurrentTab();
    if (!tab || !tab.url) return;
    embedPlayer(tab.id, tab.url);
  }
});

chrome.tabs.onUpdated.addListener(onTabUpdate);
chrome.tabs.onActivated.addListener(onTabUpdate);

async function onTabUpdate() { }


// Get the current active tab in the lastly focused window
async function getCurrentTab() {
  let [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
  console.assert(tab);
  return tab;
}

async function printStorage() {
  chrome.storage.local.get(null).then(result => {
    for (var key in result) 
      console.log(key + ": " + result[key]);
  });
}