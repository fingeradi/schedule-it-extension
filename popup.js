document.addEventListener("DOMContentLoaded", function() {
    const emailInput = document.getElementById("email-input");
    const showButton = document.getElementById("show-button");
    const scheduleButton = document.getElementById("schedule");
    const errorMessage = document.getElementById("error-message");
    const tooltipIcon = document.getElementById("tooltip-icon");
    const tooltip = document.getElementById("tooltip");
    const emailInputField = document.getElementById("email");

    tooltipIcon.addEventListener("mouseover", function() {
        // Show the tooltip when the mouse is over the showButton
        tooltip.style.display = "block";
    });

    tooltipIcon.addEventListener("mouseout", function() {
        // Hide the tooltip when the mouse leaves the showButton
        tooltip.style.display = "none";
    });

    showButton.addEventListener("click", function() {
        const email = emailInputField.value;
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

            // Reset error message and input border color
            errorMessage.style.display = "none";
            emailInputField.classList.remove("error");
        } else {
            console.log("Invalid email:", email);
            errorMessage.style.display = "block";
            // Add the error class to the input element
            emailInputField.classList.add("error");
        }
    });

    function isValidEmail(email) {
        // Regular expression for basic email validation
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }
});