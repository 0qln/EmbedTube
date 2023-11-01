import { getBlacklisted, toggleBlacklisted } from "../../../blacklist.js";
import { setBlacklisted } from "../../../blacklist.js";
import { couldBeVideoID, extractVideoID, hasVideoID } from "../../../utils.js";


document.addEventListener('DOMContentLoaded', async event => {
    await updateList();
    chrome.storage.local.onChanged.addListener(() => {
        updateList();
    });
});

async function updateList() {
    await clearList();
    await fillList();
}

async function fillList() {
    let blacklist = await getBlacklisted();
    for (var entry in blacklist) {
        if (couldBeVideoID(entry) && blacklist[entry] === true) {
            addListEntry(entry);
        }
    }
}

async function clearList() {
    const list = document.getElementById("sites-list");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

async function addListEntry(videoID) {
    // Get the <ul> element by its id
    const ulElement = document.getElementById("sites-list");

    // Create a new <li> element with the appropriate classes and structure
    const liElement = document.createElement("li");
    liElement.className = "list-entry";

    const listEntryContainer = document.createElement("div");
    listEntryContainer.className = "list-entry-container";

    const listEntryControls = document.createElement("div");
    listEntryControls.className = "list-entry-controls";

    const removeIcon = document.createElement("button");
    removeIcon.className = "list-entry-remove-icon";
    removeIcon.textContent = "x";
    removeIcon.onclick = () => toggleBlacklisted(videoID);

    const listEntryText = document.createElement("div");
    listEntryText.className = "list-entry-text";
    listEntryText.textContent = videoID;

    // Build the structure by appending child elements
    listEntryControls.appendChild(removeIcon);
    listEntryContainer.appendChild(listEntryControls);
    listEntryContainer.appendChild(listEntryText);
    liElement.appendChild(listEntryContainer);

    // Append the new <li> element to the <ul>
    ulElement.appendChild(liElement);
}