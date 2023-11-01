

export async function initBlacklist() {
    await chrome.storage.local.get("blacklist").then(result => {
        if (!result.blacklist) {
            chrome.storage.local.set({"blacklist":{ }});
        }
    });
}


export async function toggleBlacklisted(videoId) {
    const value = await getBlacklisted(videoId);
    setBlacklisted(videoId, !value);
}


export async function setBlacklisted(videoId, value) {
    await chrome.storage.local.get("blacklist").then(async result => {
        // Write value
        result.blacklist[videoId] = value;

        // Important: `result` is a copy of the data in storage. Thus 
        // we have to save the data explicitly.
        await chrome.storage.local.set({ "blacklist": result.blacklist });
    });
}


export async function getBlacklisted(videoId) {    
    if (videoId) {
        var output = false;
        await chrome.storage.local.get("blacklist").then(result => {
            if (result.blacklist[videoId]) {
                output = result.blacklist[videoId];
            }
        });
        return output;
    }
    else {
        var output;
        await chrome.storage.local.get("blacklist").then(result => {
            output = result.blacklist ?? [ ];
        });
        return output;
    }
}