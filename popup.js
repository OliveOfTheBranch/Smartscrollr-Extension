document.getElementById("smartscrollr_url").addEventListener('click', function() {
    chrome.tabs.create({url: "https://twitch.tv/osunzstreams"}); //replace url
    window.close();
})