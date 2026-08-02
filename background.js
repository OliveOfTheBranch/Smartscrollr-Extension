//const TRACKED_URL_SUBSTRING = "https://www.youtube.com/shorts/";
// TODO: CHANGE IF THE URL CHANGES
const TRACKED_URLS = ["https://www.youtube.com/shorts/", "https://www.instagram.com/reels/"];
const REDIRECT_URL = "http://localhost:5173";
const REDIRECT_TIME = 5;

chrome.windows.onRemoved.addListener((tabId, removeInfo) => {
    chrome.tabs.query({}, (tabs) => {
        if (tabs.length === 0) {
            chrome.storage.local.remove("overallElapsedTime", () => {
                console.log("All tabs were closed, clear data!")
            });
        }
    });
});

let tickIntervalId = null;


// Listeners for tabs
chrome.tabs.onActivated.addListener(() => checkAndUpdate());

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active) {
        checkAndUpdate();
    }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
    // check if chrome in focus
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        stopTracking();
    } else {
        checkAndUpdate();
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    // Redirection to new tab
    if ("overallElapsedTime" in changes) {
        checkAndUpdate();
    }

})
// =========================

resumeIfTracking();

async function checkAndUpdate() {
    const url = await getActiveTabUrl();
    //const isTrackedPage = url !== null && url.includes(TRACKED_URL_SUBSTRING);
    console.log(TRACKED_URLS)
    isTrackedPage = false;
    for (const item of TRACKED_URLS) {
        console.log(item)
        console.log(`url includes ${url.includes(item)}`)
        if (url != null && url.includes(item)) {
            console.log("Tracked site")
            isTrackedPage = true;
            break;
        }
    }
    const { startTime } = await chrome.storage.local.get("startTime");

    // start/stop timer
    if (isTrackedPage && !startTime) {
        await chrome.storage.local.set({ startTime: Date.now() });
        startTicking();
    } else if (!isTrackedPage && startTime) {
        await stopTracking();
    }
    const { overallElapsedTime = 0 } = await chrome.storage.local.get("overallElapsedTime")
    if (isTrackedPage && overallElapsedTime >= REDIRECT_TIME) {
        console.log("Detected past elapsed time");
        chrome.tabs.update({url: REDIRECT_URL});
        chrome.storage.local.remove("overallElapsedTime");
    }
}

async function resumeIfTracking() {
    const { startTime } = await chrome.storage.local.get("startTime");
    if (startTime) {
        startTicking();
    }
}

function startTicking() {
    if (tickIntervalId !== null) return; // already ticking
    tickIntervalId = setInterval(async () => {
        const { overallElapsedTime = 0 } = await chrome.storage.local.get("overallElapsedTime");
        await chrome.storage.local.set({ overallElapsedTime: overallElapsedTime + 1 });
    }, 1000);
}

async function stopTracking() {
    if (tickIntervalId !== null) {
        clearInterval(tickIntervalId);
        tickIntervalId = null;
    }
    await chrome.storage.local.set({ startTime: null });
}

async function getActiveTabUrl() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab ? tab.url ?? null : null;
}