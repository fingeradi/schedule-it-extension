document.addEventListener("DOMContentLoaded", function() {
    const emailInput = document.getElementById("email-input");
    const showButton = document.getElementById("show-button");
    const scheduleButton = document.getElementById("schedule");

    showButton.addEventListener("click", function() {
        const email = document.getElementById("email").value;
        if (isValidEmail(email)) {
            console.log("email is", email);
            emailInput.style.display = "none";
            scheduleButton.style.display = "block";

            // Add click event listener to the scheduleButton
            scheduleButton.addEventListener("click", function() {
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    const activeTab = tabs[0];
                    chrome.tabs.sendMessage(activeTab.id, { action: 'activateContentScript', data: email}, function(response) {
                        console.log("Message sent to content script");
                        // Optional: Handle the response from the content script
                    });
                });
            });
        } else {
            console.log("Invalid email:", email);
            errorMessage.style.display = "block";
        }
    });

    function isValidEmail(email) {
        // Regular expression for basic email validation
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }
});
