# Schedule it server

Schedule it is an app consisted of a chrome extension, an expres.js server and a Google Appscript project. The Server serves as an agent that connects the web extension and the spreadsheet database.

The extension reads the student's information directly from his schedule and send the initialy processed information to the schedule it server. 

## Installation

there are  no special local installation guidelines. 
After cloning the repo from github, simply add the extension to the Chrome browser.    

Go to Chrome -> Extensions -> Manage Extensions. Make sure "developer mode" toggle is ON. Click "Load Unpacked" and select the schedule it extension folder saved on your local computer.
## Usage

After importing the extension to the Chrome browser -> Add the extension to the extension bar by clicking "Extensions" -> Select the schedule it extension. Then, go to the [TAU personal website](https://www.ims.tau.ac.il/).  
  
After logging into your account -> Go to schedule (מערכת שעות) -> Select a specific Semester.  

 Open the extension, type your calendar's email address and click "continue" -> The click "View Schedule".


## Main files
#### manifest.json
This file is a json format file that holds all of the important information and settings of the extension, such as permissions, google api scopes.

#### popup.js
This file is responsible of the functionality of the extension's popup. 

First, the user input's data processing happens in this file. In addition, it holds the actions activated by clicking the extension buttons and is responsible of sending crucial information from the web browser and the input inserted b the user to the rest of the extension's parts.

#### popup.html
An html file which holds all the visual elements of the extension's popup.

#### utils.js
This file receives the processed input data from the user. It initiates the permissions to connect  the extension to the Appscript's project.

#### content.js 
This script parses the html data usign HTML DOM and send it to the background script.

#### background.js
Received and passes information from different parts of the app to the schedule it server.

## Owners

Yarin Turner & Adi Finger
