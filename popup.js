

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

    async function initiateBlackListSwitch() {
        await chrome.storage.local.get(null).then(async result => {
            for (var key in result) {
                if (key === getVideoID((await getLastValidTab()).url) && result[key]) {
                    toggle.checked = true;
                }
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
                if (key === "LAST_VALID_TAB")
                    continue;

                if (result[key]) {
                    listVideo(key);
                } 
            }
        })
    }
    
    initiateBlackListSwitch();
    updateBlackList();
    
    chrome.storage.onChanged.addListener(updateBlackList);
});


async function getLastValidTab() {
    let result;
    await chrome.storage.local.get(["LAST_VALID_TAB"]).then(data => {
        result = data.LAST_VALID_TAB;
    });
    return result;
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