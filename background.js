import { isAnyYT, isVideo } from './utils.js'
import { isPlaylistPlayer } from './utils.js';
import { extractPlaylistID } from './utils.js'
import { extractVideoID } from './utils.js';
import { hasPlaylistID } from './utils.js'
import { getCurrentTab } from './utils.js';
import { createEmbedURL } from './utils.js';
import { Content } from './types.js';


// main code
(() => {

    initiateUrlDetection();

})();


// function declerations
async function initiateUrlDetection() {
    chrome.runtime.onMessage.addListener(async (message) => {
        if (message.command === "MANAGE_ME") {

            console.log(message);
            
            if (message.content === Content.Video) {
                getCurrentTab().then(pushToEmbed);
            }
        }
    });
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (changeInfo.url && isAnyYT(changeInfo.url)) {
            try {
                await chrome.tabs.sendMessage(tabId, { command:"FORCE_UPDATE_URL" });
            }
            catch (e) {
                if (String(e) === "Error: Could not establish connection. Receiving end does not exist.") {
                    // known error; it's fine, the content_script will notify 
                    // itself as soon as it's loaded
                }
                else {
                    // this is an unknown error
                    throw(e);
                }
            }
        }
    });
}

async function pushToEmbed(tab) {
    
    const url = tab.url;
    
    try {
        // we have to go back first, as youtube openend to site faster than us
        await chrome.tabs.goBack(tab.id); 
    }
    catch (e) { 
        //oh noo, anyways...
    } 
    finally {
        // then switch to the embed player
        await new Promise(r => setTimeout(r, 200));

        const playerUrl = createEmbedURL(extractVideoID(url));
        await chrome.tabs.update(tab.id, { url:playerUrl });
    }
}


// testing
async function test_contentScripts() {
    console.log("START test_contentScripts");

    const data = { };
    let dataFinished = 0;
    let dataCount = 0;
    let tabs = [];
    data.youtube = {
        home: "https://www.youtube.com/",
        playlist: "https://www.youtube.com/playlist?list=PLlfOcCY7-RxxAGKtjCtiv4vZs_DnlVvNZ",
        video: "https://www.youtube.com/watch?v=Qd7QY_7jaOc",
        playlistPlayer: "https://www.youtube.com/watch?v=Qd7QY_7jaOc&list=PLlfOcCY7-RxxAGKtjCtiv4vZs_DnlVvNZ&index=2"
    };
    data.youtubeMusic = {
        home: "https://music.youtube.com/",
        video: "https://music.youtube.com/watch?v=Qd7QY_7jaOc",
        playlist: "https://music.youtube.com/playlist?list=PLlfOcCY7-RxxAGKtjCtiv4vZs_DnlVvNZ",
        playlistPlayer: "https://music.youtube.com/watch?v=Qd7QY_7jaOc&list=PLlfOcCY7-RxxAGKtjCtiv4vZs_DnlVvNZ&index=2"
    };
    data.embed = {
        video: "https://www.youtube.com/embed/Qd7QY_7jaOc",
    };

    console.log("TESTING_DATA: ");
    console.log(data);

    chrome.runtime.onMessage.addListener(message => {
        if (String(message).includes("CONTENT_SCRIPT_LOADED")) {
            console.log(message);
            dataFinished++;
        }
    });
    
    for (var platform in data) {
        for (var site in data[platform]) {
            let url = data[platform][site];                    
            chrome.tabs.create({url: url}, tab => tabs.push(tab));
            dataCount++;
        }
    }

    while (dataFinished < dataCount) {
        await new Promise(r => setTimeout(r, 100));    
        console.log("PROGRESS " + dataFinished + " / " + dataCount);
    }
    for (var tab in tabs) {
        chrome.tabs.remove(tabs[tab].id);
    }
    console.log("test_contentScripts SUCCESS");
}

