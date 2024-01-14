document.addEventListener("DOMContentLoaded", function() {
    const emailInput = document.getElementById("email-input");
    const showButton = document.getElementById("show-button");
    const scheduleButton = document.getElementById("schedule");
    const errorMessage = document.getElementById("error-message");
    const tooltipIcon = document.getElementById("tooltip-icon");
    const tooltip = document.getElementById("tooltip");
    const emailInputField = document.getElementById("email");

    tooltipIcon.addEventListener("mouseover", function() {
        tooltip.style.display = "block";
    });

    tooltipIcon.addEventListener("mouseout", function() {
        tooltip.style.display = "none";
    });

    showButton.addEventListener("click", function() {
        const email = emailInputField.value;
        if (isValidEmail(email)) {
            console.log("email is", email);
            emailInput.style.display = "none";
            scheduleButton.style.display = "block";

            scheduleButton.addEventListener("click", function() {
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    const activeTab = tabs[0];
                    chrome.tabs.sendMessage(activeTab.id, { action: 'activateContentScript', data: email}, function(response) {
                        console.log("Message sent to content script");
                    });
                });
            });

            errorMessage.style.display = "none";
            emailInputField.classList.remove("error");
        } else {
            console.log("Invalid email:", email);
            errorMessage.style.display = "block";
            emailInputField.classList.add("error");
        }
    });

    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }
});