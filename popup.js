

document.addEventListener("DOMContentLoaded", async function () {
    const toggle = document.getElementById('blacklistSwitch');
    
    toggle.addEventListener("click", async function(event) {
        if (event.target.id === "blacklistSwitch") {            
            chrome.runtime.sendMessage({ action:"blacklist" + String(toggle.checked) });
        }
    });

    async function listVideo(url) {
        let vid = document.createElement('li');
        vid.className = "listOption";
        vid.innerText = url;
        document.getElementById('blacklist').appendChild(vid);
    }

    async function updateBlackListSwitch() {
        toggle.checked = false;
        await chrome.storage.local.get(null).then(async result => {
            for (var key in result) {
                if (getVideoID(result) === await getCurrentTab().url && 
                    result[key]) 
                    toggle.checked = true;
            }
        })
    }
    async function clearBlacklist() {
        let list = document.getElementById('blacklist');
        while ((list.firstChild)) {
            list.removeChild(list.firstChild);
        }
    }
    async function updateBlackList() {
        await chrome.storage.local.get(null).then(async result => {

            await clearBlacklist();

            for (var key in result) {
                if (result[key]) {
                    listVideo(key);
                } 
            }
        })
    }
    
    updateBlackListSwitch();
    updateBlackList();
    
    chrome.storage.onChanged.addListener(updateBlackList);
});



async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
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