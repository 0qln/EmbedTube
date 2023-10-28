


export async function initSettings() {
    await chrome.storage.local.get("settings").then(result => {
        if (!result.settings) {
            chrome.storage.local.set({"settings":{ }});
        }
    });
}


export async function setSettingsOption(option, value) {
    await chrome.storage.local.get("settings").then(async result => {
        // Write value
        result.settings[option] = value;

        // Important: `result` is a copy of the data in storage. Thus 
        // we have to save the data explicitly.
        await chrome.storage.local.set({ "settings": result.settings });
    });
}


export async function getSettingsOption(option) {    
    var output;
    await chrome.storage.local.get("settings").then(result => {
        if (result.settings[option]) {
            output = result.settings[option];
        }
    });
    return output;
}

