console.log("content here");
// Listen for messages from the popup

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "activateContentScript") {
        const userEmail = request.data
        console.log(userEmail)
        // Perform your action in response to the popup message
        console.log("Performing action in content script based on popup message");
        document.body.style.backgroundColor = "green";
        sendResponse({ message: "Action performed in content script based on popup message" });

        // Find the iframe
        const iframe = document.querySelector("iframe#jordan");
        
        if (iframe) {
            
            // Access the iframe's content document
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            // Find the table inside the iframe
            const targetTable = iframeDocument.querySelector("table");
            const rows = targetTable.querySelectorAll("tr");
            const objectsArray = [];

            // Iterate through each row starting from the first row
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const cells = row.querySelectorAll("td");
            
                // Check if the row has at least 2 cells
                if (cells.length >= 2) {
                    const courseNum = cells[1].textContent.trim();
                    const courseName = cells[3].textContent.trim();
                    const courseType = cells[4].textContent.trim();
                    const Lecturer = cells[6].textContent.trim();
                    const Semester = cells[7].textContent.trim();
                    const Day = cells[8].textContent.trim();
                    const Hours = cells[9].textContent.trim();
                    const building = cells[10].textContent.trim();
                    const Room = cells[11].textContent.trim();
                    const syllabusLink = cells[12].querySelector("a").getAttribute("href");
                    const [startTime, endTime] = Hours.split("-");

                    // Create an object for the row
                    const rowData = {
                        courseNum: courseNum,
                        courseName: courseName, 
                        courseType: courseType,
                        Lecturer: Lecturer,
                        Semester: Semester,
                        Day: Day,
                        startTime: startTime,
                        endTime: endTime, 
                        building: building,
                        room: Room,
                        syllabusLink: syllabusLink
                    };

                    // Push the object to the array
                    objectsArray.push(rowData);
                }
            }
            let studentId, studentName;

            const studentInfoElement = iframeDocument.querySelectorAll(".msgsmal2");
            studentInfoElement.forEach(studentInfoElement => {
                const studentInfoText = studentInfoElement.textContent;
                const studentIdMatch = studentInfoText.match(/\((\d+)\)/);
                studentId = studentIdMatch ? studentIdMatch[1] : null;
                // Extract student name
                const studentNameMatch = studentInfoText.match(/^\s*(.+)\s+\(\d+\)/);
                studentName = studentNameMatch ? studentNameMatch[1] : null;

                console.log("Student ID:", studentId); 
                console.log("Student Name:", studentName);
            
            });
    

           

            // Log the array of objects
            console.log(objectsArray);
            chrome.runtime.sendMessage({ action: 'messageFromContentScript', data: {objectsArray, studentId, userEmail, studentName} });

            
        
        } else {
            console.log("Iframe not found.");
        }





    }document.addEventListener("DOMContentLoaded", function() {
        // Add a click event listener to the "Add to my calendar" button
        const addclndr = document.getElementById("addclndr");
        addclndr.addEventListener("click", function() {
            console.log("hi");
            const targetURL = "https://localhost:8000"; // Replace with your desired URL
            chrome.tabs.create({ url: targetURL });
        });
    
        // Add a click event listener to the "My holy time schedule" button
        const schedule = document.getElementById("schedule");
        schedule.addEventListener("click", function() {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "performActionInContent" }, function(response) {
                    console.log(response.message); // Log the response from the content script
                });
            });
        });
    });
    
    
});
