1. The constants are currently not user-editable; work for the future.

chrome.windows.onRemoved.addListener
    This adds a listener that checks if there are 0 open tabs if a tab is closed.
    If all tabs are closed, it clears the storage of the total elapsed time on tracked
    websites.

chrome.tabs.onActivated.addListener
    This adds a listener that calls the checkAndUpdate function when the user changes tabs.


chrome.tabs.onUpdated.addListener
    This adds a listener that when a tab updates(e.g. current tab changes, or we change tabs),
    it checks the update is complete, and that the tab is active (the user isn't just alt-tabbed),
    and calls checkAndUpdate.


chrome.windows.onFocusChanged.addListener
    This adds a listener that checks whenever the Chrome tabs are in focus, 
    and if they are, to call checkAndUpdate.

chrome.storage.onChanged.addListener
    This adds a listener that checks the total elapsed time variable in local storage, calling checkAndUpdate if the variable was changed.
    If this wasn't here, the timer ticking up, does not refresh the variable in memory, DESPITE
    BEING CHANGED.

checkAndUpdate
    First gets the url using getActiveTabUrl, then iterates through all the tracked urls, and if 
    the current active tab matches one, it starts the timer for the active elapsed time.
    At the very end, it redirects the user to the extension website.

resumeIfTracking
    Restarts the timer, if the website was already being tracked, and the user tabbed away.

startTicking
    Starts the timer in seconds for how long the user has been on a tracked website, as long as it's not already running.

stopTracking
    Stops the timer.

getActiveTabUrl
    Gets the active tab url.