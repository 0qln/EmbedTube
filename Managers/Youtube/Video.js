export async function manage(document) {
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));

    return "GO_EMBED";
}