console.log("background script running");
let messageFromContentScriptReceived = false;
let activeTab;

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === 'messageFromContentScript') {
        console.log('Received message in background script:', request.data);

        // Create an AbortController instance
        const controller = new AbortController();
        const signal = controller.signal;

        // Set a timeout in milliseconds (e.g., 10 seconds)
        const timeoutDuration = 30000; // 60 seconds

        // Start the fetch request with the AbortController's signal
        const fetchPromise = fetch('http://localhost:8000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.data), // Replace with your data
            signal, // Attach the signal to the request
        });

        // Set a timeout using setTimeout
        const timeoutId = setTimeout(() => {
            // If the timeout is reached, abort the fetch request
            controller.abort();
            console.error('Fetch request timed out');
        }, timeoutDuration);

        try {
            // Handle the fetch response
            const response = await fetchPromise;
            clearTimeout(timeoutId); // Clear the timeout if the request succeeds
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}. ${JSON.stringify(response.data)}`);
            }
            const data = await response.json();
            console.log('Response from localhost server:', data);
        } catch (error) {
            clearTimeout(timeoutId); // Clear the timeout if an error occurs
            if (error.name === 'AbortError') {
                console.error('Fetch request aborted due to timeout');
            } else {
                console.error('Error sending POST request:', error);
            }
        }

        messageFromContentScriptReceived = true;
        sendResponse({ responseMessage: 'Message received by background script' });

        // Send a message to the content script
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        activeTab = tabs[0];
        console.log(activeTab);

        try {
            const response = await new Promise((resolve) => {
                chrome.tabs.sendMessage(activeTab.id, { action: 'messageFrombckg' }, function (response) {
                    if (chrome.runtime.lastError) {
                        console.error('Error sending message to content script:', chrome.runtime.lastError);
                        // Handle the error case or resolve with a specific value
                        resolve(/* handle error case */);
                    } else {
                        console.log("Message sent from backlog to content script");
                        resolve(response);
                    }
                });
            });

            // Continue with the rest of your code
            console.log('checking communication with background');

            console.log('Sending message to utils now:');
            // Usage
            const utilsResponse = await sendMessageToUtils();
            console.log("Received response from utils:", utilsResponse);

        } catch (error) {
            // Handle the error appropriately
            console.error("Error in the main process:", error);
        }
    }
});

function sendMessageToUtils() {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(activeTab.id, { action: 'messageToUtilsFromBck' }, function (response) {
            if (chrome.runtime.lastError) {
                // Handle any errors that occurred during the sendMessage call
                reject(chrome.runtime.lastError);
            } else {
                console.log("Message sent to utils from background successfully");
                resolve(response);
            }
        });
    });
}
