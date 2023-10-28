import { createWatchURL, hasVideoID, isAnyYT, isVideo } from './utils.js'
import { isPlaylistPlayer } from './utils.js';
import { extractPlaylistID } from './utils.js'
import { extractVideoID } from './utils.js';
import { hasPlaylistID } from './utils.js'
import { getCurrentTab } from './utils.js';
import { createEmbedURL } from './utils.js';
import { Content } from './types.js';
import { getBlacklisted } from './blacklist.js';
import { setBlacklisted } from './blacklist.js';
import { initBlacklist } from './blacklist.js';



// main code
(async () => {

    await initBlacklist();
    await initiateUrlDetection();

    await test_blacklist();
})();


const msgQueue = [];
var processing = false;
// function declerations
async function initiateUrlDetection() {

    async function process(message, sender) {
        processing = true;

        const videoId = extractVideoID(message.url);

        if (message.comment === "OPEN_IN_YT") {
            await setBlacklisted(videoId, true);
        }

        if (message.comment === "GO_EMBED" && await getBlacklisted(videoId) === false) {
            await switchPlayer(sender.tab, createEmbedURL);
        }
        
        if (message.comment === "NOT_PLAYABLE") {
            await setBlacklisted(videoId, true);
            await switchPlayer(sender.tab, createWatchURL);
        }       

        // keep processing until there is no more to process
        while (msgQueue.length > 0) {
            let parameters = msgQueue.shift();
            console.log('Message processed from stack: ');
            console.log({ parameters:parameters.message, sender:parameters.sender});
            await process(parameters.message, parameters.sender);
        }

        // only now signal that we stopped processing, so 
        // that messages coming in while processing get pushed
        // on the queue
        processing = false;
    }

    // On request, manage the tab according to it's content and platform
    chrome.runtime.onMessage.addListener(async (message, sender) => {
        if (message.command === "MANAGE_ME") {
            if (processing) {
                console.log('Message pushed to stack: ');
                console.log({ message:message, sender:sender});
                msgQueue.push({ message:message, sender:sender});
            }
            else {
                console.log('Message processed immediatly: ');
                console.log({ message:message, sender:sender});
                process(message, sender);
            }            
        }
    });
    

    // Notify a tab when it's URL changed
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (changeInfo.url && isAnyYT(changeInfo.url)) {
            try {
                await chrome.tabs.sendMessage(tabId, { command: "FORCE_UPDATE_URL" });
            }
            catch (e) {
                if (String(e) === "Error: Could not establish connection. Receiving end does not exist.") {
                    // known error; it's fine, the content_script will notify 
                    // itself as soon as it's loaded
                }
                else {
                    // this is an unknown error
                    throw (e);
                }
            }
        }
    });
}

async function switchPlayer(tab, urlCreator) {
    const url = tab.url;
    try {
        // we have to go back first
        await chrome.tabs.goBack(tab.id);
    }
    catch (e) {
        //oh noo, anyways...
    }
    finally {
        // then switch to the other player
        const playerUrl = urlCreator(extractVideoID(url));
        await chrome.tabs.update(tab.id, { url: playerUrl });
    }
}



// testing

async function test_messaging() {
    // TODO
}

async function test_blacklist() {
    console.log("START test_blacklist");

    await setBlacklisted('testId', true);
    let result = await getBlacklisted('testId');

    console.log(result === true
        ? "Blacklist test succesful."
        : "Blacklist test failed." +
        "\nResult: " + result +
        "\nExpected result: " + true);

    console.log("EXIT test_contentScripts");
}

async function test_contentScripts() {
    console.log("START test_contentScripts");

    const data = {};
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
    data.rare = {
        url: "https://www.youtube.com/watch?v=BQhJCS5IaaY&source_ve_path=Mjg2NjY&feature=emb_logo"
    }

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
            chrome.tabs.create({ url: url }, tab => tabs.push(tab));
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

