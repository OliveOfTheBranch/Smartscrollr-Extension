const TRACKED_URL_SUBSTRING = "https://www.youtube.com/shorts/";
// TODO: CHANGE IF THE URL CHANGES
const REDIRECT_URL = "http://localhost:5173"
const REDIRECT_TIME = 10

chrome.windows.onRemoved.addListener((tabId, removeInfo) => {
    chrome.tabs.query({}, (tabs) => {
        if (tabs.length === 0) {
            chrome.storage.local.clear(() => {
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
// =========================

resumeIfTracking();

async function checkAndUpdate() {
    const url = await getActiveTabUrl();
    const isTrackedPage = url !== null && url.includes(TRACKED_URL_SUBSTRING);
    const { startTime } = await chrome.storage.local.get("startTime");

    // start/stop timer
    if (isTrackedPage && !startTime) {
        await chrome.storage.local.set({ startTime: Date.now() });
        startTicking();
    } else if (!isTrackedPage && startTime) {
        await stopTracking();
    }

    // Redirection to new tab
    const { overallElapsedTime = 0 } = await chrome.storage.local.get("overallElapsedTime")
    if (isTrackedPage && overallElapsedTime >= REDIRECT_TIME) {
        console.log("Detected past elapsed time")
        chrome.tabs.update({url: REDIRECT_URL})
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