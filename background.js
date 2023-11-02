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
import { initSettings } from './settings.js';
import { test_fail } from './utils.js';
import { test_success} from './utils.js';



// main code
(async () => {

    // initiations
    await initBlacklist();
    await initSettings();
    await initiateUrlDetection();

    // testing
})();


const msgQueue = [];
var processing = false;
// function declerations
async function initiateUrlDetection() {

    async function process(message, sender) {
        processing = true;
        
        
        // We manage the tab's behaviour here, as content scripts
        // do not update correctly on youtube sites. Because of that
        // content scripts could not get removed or added at their targeting
        // url, which could cause unexpected behaivour in the future.
        console.log('manage');
        switch (message.comment) {
            case "OPEN_IN_YT":
                console.log(message);
                await setBlacklisted(extractVideoID(message.url), true);
                await switchPlayer(sender.tab, createWatchURL);
                break;

            case "GO_EMBED":
                if (await getBlacklisted(extractVideoID(message.url)) !== false) break;
                console.log(message);
                await switchPlayer(sender.tab, createEmbedURL);
                break;

            case "NOT_PLAYABLE":
                console.log(message);
                await setBlacklisted(extractVideoID(message.url), true);
                await switchPlayer(sender.tab, createWatchURL);
                break;
        
            default:
                console.log(message);
                break;
        }

        // keep processing until there is no more to process
        while (msgQueue.length > 0) {
            let parameters = msgQueue.shift();
            //#region Debug message
            if (false) {
                console.log('Message processed from queue: ');
                console.log({ message:parameters.message, sender:parameters.sender});
            }
            //#endregion
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
                //#region Debug message
                if (false) {
                    console.log('Message pushed to queue: ');
                    console.log({ message:message, sender:sender});
                }
                //#endregion
                msgQueue.push({ message:message, sender:sender});
            }
            else {
                //#region Debug message
                if (false) {
                    console.log('Message processed immediatly: ');
                    console.log({ message:message, sender:sender});
                }
                //#endregion
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

async function test_settings() {
    console.log("START test_settings");

    let expected = {
        boolean: true,
        integer: -1,
        string: "some string",
    };
    await setBlacklisted('testBoolean', expected.boolean);
    await setBlacklisted('testInteger', expected.integer);
    await setBlacklisted('testString', expected.string);
    let result = {
        boolean: await getBlacklisted('testBoolean'),
        integer: await getBlacklisted('testInteger'),
        string: await getBlacklisted('testString'),
    };

    var iterations = 0, fails = 0;
    for (var key in expected) {
        console.log("Key: " + key);
        console.log("Value: " + result[key]);
        console.log("Expected: " + expected[key]);
        if (result[key] === expected[key]) {
            console.log("SUCCESS");
        }
        else {
            console.log("FAIL");
            fails++;
        }
        ++iterations;
    }

    if (fails === 0) {
        test_success("test_settings");
    }
    else {
        test_fail("test_settings");
        console.log(fails  + "/" + iterations + " (fails/tests)");
    }

    console.log("EXIT test_settings");
}

async function test_blacklist() {
    console.log("START test_blacklist");

    await setBlacklisted('testId', true);
    let result = await getBlacklisted('testId');

    if (result === true) {
        test_success("test_blacklist");
    }
    else {
        test_fail("test_blacklist");
        console.log("Result: " + result);
        console.log("Expected: " + true);
    }

    console.log("EXIT test_contentScripts");
}

