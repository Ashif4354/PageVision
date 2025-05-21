chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in content script:", message);
    if (message.action === 'getTextContent') {
        console.log("HTML sent to background script");
        sendResponse({ text: document.body.innerText });
    }
})


