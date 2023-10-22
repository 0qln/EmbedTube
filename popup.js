

async function addBlacklistEntry(url) {
    let vid = document.createElement('li');
    vid.className = "listOption";
    vid.innerText = url;
    document.getElementById('blacklist').appendChild(vid);
}
async function initiateBlacklistSwitch() {
    const blacklistSwitch = document.getElementById('blacklistSwitch');
    await chrome.storage.local.get(null).then(async result => {
        for (var key in result) {
            if (key === getVideoID((await getCurrentTab()).url) && result[key]) 
                blacklistSwitch.checked = true;                
        }
    })
}
async function clearBlacklist() {
    let list = document.getElementById('blacklist');
    while ((list.firstChild)) {
        list.removeChild(list.firstChild);
    }
}
async function updateBlacklist() {
    await clearBlacklist();
    await fillBlacklist();
}
async function fillBlacklist() {
    await chrome.storage.local.get(null).then(async result => {
        for (var key in result) {
            if (result[key]) {
                addBlacklistEntry(key);
            } 
        }
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    
    const blacklistSwitch = document.getElementById('blacklistSwitch');
    blacklistSwitch.addEventListener("click", async function(event) {
        if (event.target.id === "blacklistSwitch") {            
            chrome.runtime.sendMessage({ action:"blacklist" + String(blacklistSwitch.checked) });
        }
    });

    chrome.storage.onChanged.addListener(updateBlacklist);
    
    initiateBlacklistSwitch();
    updateBlacklist();
});


// Get the current active tab in the lastly focused window
async function getCurrentTab() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.assert(tab);
    return tab;
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