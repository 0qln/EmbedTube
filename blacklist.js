

export async function initBlacklist() {
    await chrome.storage.local.get("blacklist").then(result => {
        if (!result.blacklist) {
            chrome.storage.local.set({"blacklist":{ }});
        }
    });
}


export async function toggleBlacklisted(videoId) {
    const value = await getBlacklisted(videoId);
    await setBlacklisted(videoId, !value);
}


export async function setBlacklisted(videoId, value) {
    // retrieve blacklist from the storage    
    const result = await new Promise((resolve, reject) => {
        chrome.storage.local.get("blacklist", result => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result);
            }
        });
    });

    // change the value of the entry
    result.blacklist[videoId] = value;

    // push the new blacklist back onto the storage    
    await new Promise((resolve, reject) => {
        chrome.storage.local.set({ "blacklist": result.blacklist }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}


export async function getBlacklisted(videoId) {    
    // return `video`Id
    if (videoId) {
        return await new Promise((resolve, reject) => {
            chrome.storage.local.get("blacklist", result => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result.blacklist[videoId] ?? false);
                }
            })
        })
    }
    // return all
    else {
        return await new Promise((resolve, reject) => {
            chrome.storage.local.get("blacklist", result => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result.blacklist);
                }
            })
        })
    }
}