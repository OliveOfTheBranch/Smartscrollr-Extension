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

  // Select the image element
  const image = document.getElementById('saveButton');

  // Define your image source paths
  const normalSrc = 'submit.png';
  const activeSrc = 'submitHover.png';

  // Change source when mouse button is held down
  image.addEventListener('mousedown', () => {
    image.src = activeSrc;
  });

  // Revert source when mouse button is released
  image.addEventListener('mouseup', () => {
    image.src = normalSrc;
  });

  // Revert source if the user drags the mouse outside the image and releases
  image.addEventListener('mouseleave', () => {
    image.src = normalSrc;
  });