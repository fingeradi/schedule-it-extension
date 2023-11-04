console.log("utils");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'messageToUtilsFromBck') {
        console.log('Listening from utils')
        const CLIENT_ID = '888686870033-3grhna0rln149bqs13r20s2j6vs3hff1.apps.googleusercontent.comm';
        const API_KEY = 'AIzaSyCD-DWZTxpbD9gl7ZShIHUvSsHU7BASDeI'; // Replace with your actual API key
        const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
        const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
        console.log(`API KEY: ${API_KEY}, CLIENT ID: ${CLIENT_ID}`)

        let tokenClient;
        let gapiInited = false;
        let gisInited = false;

        const gapiScript = document.createElement('script');
        gapiScript.src = 'https://apis.google.com/js/api.js';
        gapiScript.async = true;
        gapiScript.defer = true;
        gapiScript.onload = gapiLoaded;
        // document.head.appendChild(gapiScript);

        const gisScript = document.createElement('script');
        gisScript.src = 'https://accounts.google.com/gsi/client';
        gisScript.async = true;
        gisScript.defer = true;
        gisScript.onload = gisLoaded;
        // document.head.appendChild(gisScript);

        console.log('Received message in utils:', request.data);
  
        sendResponse({ responseMessage: 'Message received by utils' });
    }
});

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

function gisLoaded() {
    gisInited = true;
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
}

function handleAuth() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        await listMajors();
        await addToSpreadSheet();
    };

    // if (gapi.client.getToken() === null) {
    //     // Prompt the user to select a Google Account and ask for consent to share their data
    //     // when establishing a new session.
    //     tokenClient.requestAccessToken({prompt: 'consent'});
    // } else {
    //     // Skip display of account chooser and consent dialog for an existing session.
    //     tokenClient.requestAccessToken({prompt: ''});
    // }
}

async function listMajors() {
    let response;
    try {
        // Fetch first 10 files
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1rMYWr_X-PJBW7SPVeX_3bYAXTQ6B9UZXWr-rXVN_WIY',
            range: 'students!A2:E',
        });
    } catch (err) {
        console.log(err)
        return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        console.log('No values found')
        return;
    }
    console.log(range)
    // Flatten to string to display
    const output = range.values.reduce(
        (str, row) => `${str}${row[0]}, ${row[1]}\n`,
        'Name, Major:\n');
    console.log(output)
}
