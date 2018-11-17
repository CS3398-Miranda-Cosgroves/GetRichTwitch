const tmi = require('tmi.js');
const haikudos = require('haikudos');
const getVideoId = require('get-video-id');
const fs = require('fs');
const {google} = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const readline = require('readline');
const fetchVideoInfo = require('youtube-info');

let datetime = new Date();

//channel variables
let currUsers = [ 'MirandaCosgroveBot' ];
var viewerObj = [];
var ptsObj = [];
var coinObj = [];
var hugsObj = [];
var discObj = [];
var session_playlist_id = ''; //Holds playlist ID for this session
let VIDEO_ALLOWED = false;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/google-apis-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';



// Valid commands start with:
let commandPrefix = '!';
// Define configuration options:
let opts = {
    identity: {
        username: 'MirandaCosgroveBot',
        password: 'oauth:' + 'l8ec68snfdwehzsug2ekcoaza7hvkn'
    },
    channels: [
        'MirandaCosgroveBot'
    ]
};

// These are the commands the bot knows (defined below):
let knownCommands = { echo, haiku, doom, givepts, slap, coinflip, hug, showHugs, discipline, gamble, purge, commands,
    clear, showpts, trade, stats, requestsong, allowrequests, blockrequests}; //add new commands to this list

// Create a client with our options:
let client = new tmi.client(opts);

// Register our event handlers (defined below):
client.on('message', onMessageHandler);
client.on("subscription", onSubHandler);
client.on('connected', onConnectedHandler);
client.on('disconnected', onDisconnectedHandler);

initAuth();

// Connect to Twitch:
function connectIRC(){
    client.connect()
}

function exitListen()
{
    var stdin = process.openStdin();

    stdin.addListener("data", function (d) {
        // note:  d is an object, and when converted to a string it will
        // end with a linefeed.  so we (rather crudely) account for that
        // with toString() and then trim()
        if(d.toString().trim() == "exit")
        {
            process.exit();
        }
    });
}

// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {
    if (self) { return } // Ignore messages from the bot
    console.log("message type: " + context['message-type']);
    // This isn't a command since it has no prefix:
    if (msg.substr(0, 1) !== commandPrefix) {
        console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
        return
    }

    // Split the message into individual words:
    const parse = msg.slice(1).split(' ')
    // The command name is the first (0th) one:
    const commandName = parse[0]
    // The rest (if any) are the parameters:
    const params = parse.splice(1)

    // If the command is known, let's execute it:
    if (commandName in knownCommands) {
        // Retrieve the function by its name:
        const command = knownCommands[commandName]
        // Then call the command with parameters:
        command(target, context, params)
        console.log(`* Executed ${commandName} command for ${context.username}`)
    } else {
        console.log(`* Unknown command ${commandName} from ${context.username}`)
    }
}

function onSubHandler (target, context) {
    console.log(`/*/*/*/*/*Subscriber has been detected/*/*/*/*/*`)
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`)
}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
    console.log(`Disconnected: ${reason}`);
    process.exit(1)
}

// Function called when the "echo" command is issued:
// Function created by
function echo (target, context, params) {
    // If there's something to echo:
    if (params.length) {
        // Join the params into a string:
        const msg = params.join(' ');
        // Send it back to the correct place:
        sendMessage(target, context, msg)
    } else { // Nothing to echo
        console.log(`* Nothing to echo`)
    }
}

// Function called when the "haiku" command is issued:
// Function created by Eric Ross
function haiku (target, context) {
    // Generate a new haiku:
    haikudos((newHaiku) => {
        // Split it line-by-line:
        newHaiku.split('\n').forEach((h) => {
            // Send each line separately:
            sendMessage(target, context, h)
        })
    })
}

// Function called when the "hug" command is issued:
//Function created by Eric Ross
function hug(target, context, huggee) {
    var viewer = context.username;
    //console.log(viewer);
    var hugs = 1;
    var hugCoins = 5;

    var i = 0;
    while (i <= viewerObj.length) {
        if (viewerObj[i] == viewer) {
            hugsObj[i] += hugs;
            console.log(viewer + " is already in array");
            console.log(hugsObj[i]);
            break;
        }
        else if (i == viewerObj.length) {
            viewerObj.push(viewer);
            hugsObj.push(hugs);
            console.log(viewer + " has been added to array");
            console.log(hugsObj[i]);
            break;
        }
        i++;
    }

    sendMessage(target, context, context.username + ' has ' + ' been HUGGED!');
}


//Function called when "showHugs" command is issued:
//Function created by Eric Ross
function showHugs(target, context) {
    var viewer = context.username;

    var i = 0;
    while (i <= viewerObj.length) {
        if (viewerObj[i] == viewer) {
            sendMessage(target, context, context.username + ' has ' + hugsObj[i] + ' total  hugs!');
            console.log("viewer is in showpts array")
            break;
        }
        else if (i == viewerObj.length) {
            console.log(viewer + " is not in array");
            sendMessage(target, context, context.username + ' has no hugs!');
            break;
        }
        i++;
    }    
}

//Function called when the "discipline command is issued:
//Function created by Eric Ross
function discipline(target, context, disciplinee) {
	    var viewer = context.username;
	    //console.log(viewer);
	    var discs = 1;

	    var i = 0;
	    while (i <= viewerObj.length) {
	        if (viewerObj[i] == viewer) {
	            discObj[i] += discs;
	            hugsObj[i] -= discs;
	            console.log(viewer + " is already in array");
	            console.log(discObj[i]);
	            break;
	        }
	        else if (i == viewerObj.length) {
	            viewerObj.push(viewer);
	            discObj.push(discs);
	            hugsObj[i] -= discs;
	            console.log(viewer + " has been added to array");
	            console.log(discObj[i]);
	            break;
	        }
	        i++;
	    }

	   	sendMessage(target, context, context.username + ' has ' + ' been disciplined!');
}


// Function called when the "gamble" command is issued:
// Function created by JoelMartinez0404
function gamble(target, context, params) {
    var coin = Math.floor(Math.random() * 2);
    var viewer = context.username;
    //console.log(viewer);

    var i = 0;
    while (viewerObj[i] != viewer) {
        if (viewerObj == viewer) {
            //var oldPts = viewerObj.viewerPts;
            console.log("user is already in array")
            break;
        }
        else {
            viewerObj.push(viewer);
            ptsObj.push(0);
            coinObj.push(0);
            console.log("user has been added to array")
            break;
        }
        i++;
    }

    console.log(viewerObj);

    //takes in bet input
    if (params.length)
        var msg = params.join(' ');

    if (coin == 0)
        coin = 'tails';
    else
        coin = 'heads';

    // Prints gamble messages;
    if (msg != 'tails' && msg != 'heads') {
        sendMessage(target, context, 'You did not enter either tails or heads loser...smh');
    }
    else if (coin == 'tails' && coin == msg) {
        sendMessage(target, context, 'You bet on Tails and you won the bet (somehow). You won 50 coins');
        //userpoints + 50 (Java backend)
    }
    else if (coin == 'heads' && coin == msg) {
        sendMessage(target, context, 'You bet on Heads and you won the bet (somehow). You won 50 coins');
        //userpoints + 50 (Jb)
    }
    else if (coin == 'tails' && coin != msg) {
        sendMessage(target, context, 'You bet on Heads and you lost the bet. You lost 100 coins..boohoo');
        //userpoints - 100 (Jb)
    }
    else if (coin == 'heads' && coin != msg) {
        sendMessage(target, context, 'You bet on Tails and you lost the bet. You lost 100 coins..boohoo');
        //userpoints - 100 (Jb)
    }
}

// Function called when the "coinflip" command is issued:
// Function created by lts25
function coinflip(target, context) {
    var coin = Math.floor(Math.random() * 2);

    // Print coin;
    if (coin == 0)
        sendMessage(target, context, 'The coin landed on Tails');
    else if (coin == 1)
        sendMessage(target, context, 'The coin landed on Heads');
}

// Function called when the "slap" command is issued:
// Function created by lts25
function slap(target, context, slapee) {
    var inChat = 1;
    var i;

    currUsers.push(context.username);
    //console.log(currUsers);

    if (slapee != "") {
        inChat = 0
        for (i = 0; i < currUsers.length; i++){
            if (currUsers[i] == slapee) {
                inChat = 1;
                break;
            }
        }
        if (inChat){
            client.say(target, "@" + slapee + ", YOU HAVE BEEN SLAPPED!");
        }
        else {
            client.say(target, "user not in slapable.");
        }
    }
    else {
        var numPersons = currUsers.length;
        var person = Math.floor(Math.random() * numPersons);

        var slapee = currUsers[person];
        client.say(target, "@" + slapee + ", YOU HAVE BEEN SLAPPED!");
    }

}

//Function called when the "doom" command is issued:
//function created by wcj1
function doom(target, context, params) {
    var thing = (context);

    if(params.length)
        var msg = params.join(' ');

    //Prints return message
    sendMessage(target, context, 'Yes, Doom will run on anything, even on a ' + msg );
}

//Function called when "givepts" command is issued:
//Function created by wcj1
function givepts(target, context) {

    var viewer = context.username;
    //console.log(viewer);
    var pts = Math.floor((Math.random()+1 ) * 10);

    var i = 0;
    while (i <= viewerObj.length) {
        if (viewerObj[i] == viewer) {
            ptsObj[i] += pts;
            console.log(viewer + " is already in array");
            console.log(ptsObj[i]);
            break;
        }
        else if (i == viewerObj.length) {
            viewerObj.push(viewer);
            ptsObj.push(pts);
            coinObj.push(0);
            console.log(viewer + " has been added to array");
            console.log(ptsObj[i]);
            break;
        }
        i++;
    }

    sendMessage(target, context, context.username + ' got ' + pts + ' points. YAY!');
}

//Function called when "showpts" command is issued:
//Function created by wcj1
function showpts(target, context) {
    var viewer = context.username;

    var i = 0;
    while (i <= viewerObj.length) {
        if (viewerObj[i] == viewer) {
            sendMessage(target, context, context.username + ' has ' + ptsObj[i] + ' total  points!');
            console.log("viewer is in showpts array")
            break;
        }
        else if (i == viewerObj.length) {
            console.log(viewer + " is not in array");
            sendMessage(target, context, context.username + ' has no points!');
            break;
        }
        i++;
    }
}

//Function called when "trade" command is issued:
//Function created by wcj1
function trade(target, context) {
    var viewer = context.username;

    var i = 0;
    while (i <= viewerObj.length) {
        if (viewerObj[i] == viewer) {
            if(ptsObj[i] >= 100) {
                ptsObj[i] -= 100;
                coinObj[i] += 10;
            }
            else if(ptsObj[i] >= 50) {
                ptsObj[i] -= 50;
                coinObj[i] += 5;
            }
            else if(ptsObj[i] >= 10) {
                ptsObj[i] -= 10;
                coinObj[i] += 1;
            }
            sendMessage(target, context, context.username + ' has ' + ptsObj[i] + ' total  points and ' + coinObj[i] + ' total coins now!');
            break;
        }
        else if (i == viewerObj.length) {
            console.log(viewer + " is not in array");
            sendMessage(target, context, context.username + ' has no points!');
            break;
        }
        i++;
    }
}


// Helper function to send the correct type of message:
// Know that Commands do not run in Whisper
function sendMessage (target, context, message) {
    if (context['message-type'] === 'whisper') {
        client.whisper(target, message)
    } else {
        client.say(target, message)
    }
}

//Bans and then unbans user to purge their messages from chat
function purge(target, context, purgedUser)
{
    let badge = context['badges-raw'].split(",")[0];
    if(context['mod'] === true || badge === "broadcaster/1"){
        if (purgedUser.toString().length > 2) {
            client.say(target, "/timeout " + purgedUser + " 1");
            client.say(target, "Not just the " + purgedUser + " but the women and children too...");
        }
    }
    else if(context['mod'] === false)
    {
        client.say(target, context['display-name'] + " your magic holds no power here.")
    }

    if(context['user-id'] === '194986251')
    {
        console.log("What did the Leprechaun say to the bald guy?");
        console.log("Ah damn Griff's here shut up");
    }
}

function clear(target, context)
{
    let badge = context['badges-raw'].split(",")[0];
    if(context['mod'] === true || badge === "broadcaster/1") {
        client.say(target, "/clear")
        client.say(target, "Alright ya'll gettin' a little too nasty.")
    }
    else
    {
        client.say(target, "You do not have access to this command because your clothes are out of style.");
    }
}

function commands(target, context)
{
    var cmdStrings = [];

    for(var commandName in knownCommands)
        cmdStrings[cmdStrings.length] = " !" + commandName.toString() + " ";

    client.say(target, "@" + context.username + " Commands known:" + cmdStrings);
}

/**
 * Add song to request queue if song requests have been activated
 * @param target - channel info
 * @param context - user info
 * @param videoID - String of requested URL
 */
function requestsong(target, context, videoID) {
    if(VIDEO_ALLOWED === true) {
        let ID = getVideoId(videoID.toString());
        if(Object.keys(ID).length === 0 && ID.constructor === Object) {
            console.log(videoID);
            playlistItemTimeCheck(videoID, target);
        }
        else {
            console.log("Playlist ID to add to: " + session_playlist_id);
            playlistItemTimeCheck(ID['id'], target);
        }
        }
    else
    {
        client.say(target, "Song requests are not currently allowed, get a moderator to use !allowrequests");
    }
}

/**
 *Turns on song request functionality for all users, only usable by moderators
 */
function allowrequests(target, context)
{
    //only allow mods to turn requests on
    let badge = context['badges-raw'].split(",")[0];
    if(context['mod'] === true || badge === "broadcaster/1") {
        VIDEO_ALLOWED = true;
        //Check if there is a playlist less than 24hrs old, if so then use that one to prevent playlist pollution
        fs.readFile('src/JSON/most_recent_playlist.json', function(err, data){
            if(err)
            {//If you get an error on the read, create a new playlist and overwrite previous file
                console.log(err + "\nError fetching playlist, creating new most_recent_playlist.json");
                fs.readFile('src/JSON/client_secret.json', function processClientSecrets(err, content) {
                    if (err) {
                        console.log('Error loading client secret file: ' + err);
                        return;
                    }
                    console.log("Playlist does not exist, creating new playlist");
                    // Authorize a client with the loaded credentials, then call the YouTube API to create a playlist
                    authorize(JSON.parse(content), {
                        'params': {
                            'part': 'snippet,status',
                            'onBehalfOfContentOwner': ''
                        }, 'properties': {
                            'snippet.title': 'STREAM ' + datetime.toString(),
                            'snippet.description': '',
                            'snippet.tags[]': '',
                            'snippet.defaultLanguage': '',
                            'status.privacyStatus': ''
                        }
                    }, playlistsInsert);
                });
                return;
            }
            //Otherwise check time to see if a recent playlist exists, otherwise create a new one and overwrite file
            data = (data.toString()).split(' ');
            let time_created = parseInt(data[1], 10);
            let last_ID = data[0];
            if((datetime.getTime() - time_created) < 86700000)
            {
                console.log("Playlist from within 24 hours found, grabbing playlist ID: " + last_ID);
                session_playlist_id = last_ID;
            }
            else if(session_playlist_id === '')
            {
                fs.readFileSync('src/JSON/client_secret.json', function processClientSecrets(err, content) {
                    if (err) {
                        console.log('Error loading client secret file: ' + err);
                        return;
                    }
                    console.log("Playlist does not exist, creating new playlist");
                    // Authorize a client with the loaded credentials, then call the YouTube API to create a playlist
                    authorize(JSON.parse(content), {
                        'params': {
                            'part': 'snippet,status',
                            'onBehalfOfContentOwner': ''
                        }, 'properties': {
                            'snippet.title': 'STREAM ' + datetime.toString(),
                            'snippet.description': '',
                            'snippet.tags[]': '',
                            'snippet.defaultLanguage': '',
                            'status.privacyStatus': ''
                        }
                    }, playlistsInsert);
                });
            }
            else
            {
                console.log("Playlist already exists - ID is " + session_playlist_id);
            }
        });
        //If playlist does not exist yet make a new one with name STREAM + time
        if (session_playlist_id === '') {


        }

    }
    else{
        client.say(target, "Command !allowrequests is only available to moderators");
    }

}

/**
 * Block playlist requests by turning the boolean to false, should be checked in requestsong function
 * and block any more videos going into the queue or creation of a playlist
 */
function blockrequests(target, context)
{
    let badge = context['badges-raw'].split(",")[0];
    if(context['mod'] === true || badge === "broadcaster/1") {
        VIDEO_ALLOWED = false;
    }
    else
    {
        client.say(target, "@" + context.username + " Only moderators can use this command");
    }
}

/**
 * Adds a new playlist to insert data into using the requestData to get channel and playlist ID
 * Also sets session playlist ID
 */
function playlistsInsert(auth, requestData) {
    var service = google.youtube('v3');
    var parameters = removeEmptyParameters(requestData['params']);
    parameters['auth'] = auth;
    parameters['resource'] = createResource(requestData['properties']);
    service.playlists.insert(parameters, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        console.log(response.data.id);
        session_playlist_id = response.data.id.toString();
        fs.writeFile('src/JSON/most_recent_playlist.json', session_playlist_id + " " + datetime.getTime(), function()
        {
            console.log("Playlist created at " + datetime.getTime());
        });
    });

}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
function authorize(credentials, requestData, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
            getNewToken(oauth2Client);
            console.log("New token had to be authorized, command not processed");
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client, requestData);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 */
function getNewToken(oauth2Client) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
        });
    });
}

/**
 * Store token to disk
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
    connectIRC();
    exitListen();
}

/**
 * Remove parameters that do not have values.
 */
function removeEmptyParameters(params) {
    for (var p in params) {
        if (!params[p] || params[p] == 'undefined') {
            delete params[p];
        }
    }
    return params;
}

/**
 * Create a JSON object, representing an API resource, from a list of
 * properties and their values.
 */
function createResource(properties) {
    var resource = {};
    var normalizedProps = properties;
    for (var p in properties) {
        var value = properties[p];
        if (p && p.substr(-2, 2) == '[]') {
            var adjustedName = p.replace('[]', '');
            if (value) {
                normalizedProps[adjustedName] = value.split(',');
            }
            delete normalizedProps[p];
        }
    }
    for (var p in normalizedProps) {
        // Leave properties that don't have values out of inserted resource.
        if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
            var propArray = p.split('.');
            var ref = resource;
            for (var pa = 0; pa < propArray.length; pa++) {
                var key = propArray[pa];
                if (pa == propArray.length - 1) {
                    ref[key] = normalizedProps[p];
                } else {
                    ref = ref[key] = ref[key] || {};
                }
            }
        };
    }
    return resource;
}

function stats(target, context) {
	client.say(target, context['display-name'] + " Here's your status")
	if (context['mod'] === true) {
		client.say(target, context['display-name'] + " is a mod")
	}
	client.say(target, "Your badges are: " + context['badges-raw']);
}

/**
 * Insert playlist item into playlist, both given in requestData from calling function
 */
function playlistItemsInsert(auth, requestData) {
    var service = google.youtube('v3');
    var parameters = removeEmptyParameters(requestData['params']);
    parameters['auth'] = auth;
    parameters['resource'] = createResource(requestData['properties']);
    service.playlistItems.insert(parameters, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
    });

}

/**
 * Parent function for playlist requests, gets video ID and sets up playlist ID to add to and passes it to
 * the insert function
 */
function playlistItemTimeCheck(id, target)
{
// Load client secrets from a local file.
    fs.readFile('src/JSON/client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        try
        {
        fetchVideoInfo(id).then(function (videoInfo) {
            if(videoInfo.duration < 400) {// Authorize a client with the loaded credentials, then call the YouTube API.
                authorize(JSON.parse(content), {
                    'params': {
                        'part': 'snippet',
                        'onBehalfOfContentOwner': ''
                    }, 'properties': {
                        'snippet.playlistId': session_playlist_id,
                        'snippet.resourceId.kind': 'youtube#video',
                        'snippet.resourceId.videoId': id,
                        'snippet.position': ''
                    }
                }, playlistItemsInsert);
                client.say(target, videoInfo.title + " has been added to the request queue");
            }
            else {
                client.say(target, "Hey jabroni your video is too long");
                }
            });
        }
        catch
        {
            console.log(err);
            console.log("Error fetching youtube ID");
            client.say(target, "That is not a valid youtube URL or video ID");
        }


    });
}


/**
 * Start google auth process, ask for new AuthKey if it is not saved
 * Once auth key is saved connect to chat and listen for exit command
 */
function initAuth() {
    let credentials;
    fs.readFile('src/JSON/client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        credentials = JSON.parse(content);
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function(err, token) {
            if (err) {
                getNewToken(oauth2Client);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                connectIRC();
                exitListen();
            }
        });
    });
}



