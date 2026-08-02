/*document.getElementById("smartscrollrUrl").addEventListener('click', function() {
    chrome.tabs.create({url: "https://twitch.tv/osunzstreams"}); //replace url
    window.close();
})*/

document.getElementById("saveButton").addEventListener('click', function() {
    const input = document.getElementById('userInput').value;
    if (input !== null && input.match(/.\S/gm)) {
        chrome.tabs.create({url: "http://localhost:5173/?subject=" + input}); //replace url
        //alert('Data saved successfully!');
        window.close();
    }
})