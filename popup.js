async function addBlacklistEntry(vidid) {
    let vid = document.createElement('li');
    vid.className = "listOption";
    vid.innerText = String(vidid).slice("blacklist_".length);
    document.getElementById('blacklist').appendChild(vid);
}
async function initiateBlacklistSwitch() {
    const blacklistSwitch = document.getElementById('blacklistSwitch');
    let enable = false;
    await chrome.storage.local.get(null).then(async result => {
        for (var key in result) {
            if (key === getVideoID((await getCurrentTab()).url && key.includes("blacklist_")) && result[key]) 
                enable = true;                
        }
    })
    blacklistSwitch.checked = enable;
}
async function initiateAutoPlaySwitch() {
    const autoplaySwitch = document.getElementById('autoPlaySwitch');
    let enable = false;
    await chrome.storage.local.get(null).then(async result => {
        for (var key in result) {
            if (key === "settings_doAutoPlay" && result[key]) 
                enable = true;                
        }
    })
    autoplaySwitch.checked = enable;
}
async function clearBlacklistGui() {
    let list = document.getElementById('blacklist');
    while ((list.firstChild)) {
        list.removeChild(list.firstChild);
    }
}
async function updateBlacklist() {
    await clearBlacklistGui();
    await fillBlacklist();
}
async function fillBlacklist() {
    await chrome.storage.local.get(null).then(async result => {
        for (var key in result) {
            console.log(key);
            if (result[key] && key.includes("blacklist_")) {
                addBlacklistEntry(key);
            } 
        }
    });
}
async function clearBlacklist() {
    await chrome.storage.local.get(null).then(async result => {
        for (var key in result) {
            if (key.includes("blacklist_")) chrome.storage.local.remove([key]); 
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
    const clearAllButton = document.getElementById('clearAllButton');
    clearAllButton.addEventListener("click", async function(event) {
        if (event.target.id === "clearAllButton") {            
            await clearBlacklist();
            initiateBlacklistSwitch();
        }
    });
    const autoplaySwitch = document.getElementById('autoPlaySwitch');
    autoplaySwitch.addEventListener("click", async function(event) {
        if (event.target.id === "autoPlaySwitch") {
            await chrome.storage.local.set({"settings_doAutoPlay":autoplaySwitch.checked});
        }
    });

    chrome.storage.onChanged.addListener(updateBlacklist);
    
    initiateBlacklistSwitch();
    initiateAutoPlaySwitch();
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