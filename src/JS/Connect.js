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
var session_playlist_id; //Holds playlist ID for this session

/**Initialize GoogleAuth2 before connecting
*/

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/google-apis-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('src/JSON/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    //See full code sample for authorize() function code.
    authorize(JSON.parse(content), {'params': {'part': 'snippet,status',
            'onBehalfOfContentOwner': ''}, 'properties': {'snippet.title': 'STREAM ' + datetime.toString(),
            'snippet.description': '',
            'snippet.tags[]': '',
            'snippet.defaultLanguage': '',
            'status.privacyStatus': ''
        }}, playlistsInsert);
});


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
}

// These are the commands the bot knows (defined below):
let knownCommands = { echo, haiku, doom, givepts, slap, coinflip, hug, showHugs, discipline, gamble, purge, commands, clear, playvideo, showpts, trade, stats} //add new commands to this list

// Create a client with our options:
let client = new tmi.client(opts)

// Register our event handlers (defined below):
client.on('message', onMessageHandler)
client.on("subscription", onSubHandler)
client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)
var IRCCONNECT = false;
// Connect to Twitch:
function connectIRC(){
    client.connect()
    IRCCONNECT = true;
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
    console.log(`Disconnected: ${reason}`)
    process.exit(1)
}

// Function called when the "echo" command is issued:
// Function created by
function echo (target, context, params) {
    // If there's something to echo:
    if (params.length) {
        // Join the params into a string:
        const msg = params.join(' ')
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
    if(context['mod'] === true) {
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
    if(context['mod'] === true) {
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
    client.say(target, "Commands known:" + cmdStrings)
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function playvideo(target, context, videoID) {
    let ID = getVideoId(videoID.toString());
    let requestinfo = {SongID : ID, Name : context['username'], UserID : context['user-id']};
    console.log(requestinfo);
    let data = JSON.stringify(requestinfo, null, 2);
    fs.writeFile('src/JSON/song-request-update.json', data, 'utf8', function(err) {
            if (err) throw err;
            console.log('complete');
        });

    console.log("Playlist ID: " + session_playlist_id);
    playlistItemInsertNow(ID['id'], target);
}



function playlistsInsert(auth, requestData) {
    if(!IRCCONNECT){
        connectIRC();
    }
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
            getNewToken(oauth2Client, requestData, callback);
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
function getNewToken(oauth2Client, requestData, callback) {
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
            callback(oauth2Client, requestData);
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

function playlistItemInsertNow(id, target)
{

// Load client secrets from a local file.
    fs.readFile('src/JSON/client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        console.log(id);

        fetchVideoInfo(id).then(function (videoInfo) {
            if(videoInfo.duration < 400)
            {
                authorize(JSON.parse(content), {'params': {'part': 'snippet',
                        'onBehalfOfContentOwner': ''}, 'properties': {'snippet.playlistId': session_playlist_id,
                        'snippet.resourceId.kind': 'youtube#video',
                        'snippet.resourceId.videoId': id,
                        'snippet.position': ''
                    }}, playlistItemsInsert);
                client.say(target, videoInfo.title + " has been added to the request queue");
            }
            else
            {
                client.say(target, "Hey jabroni your video is too long");
            }
        });
        // Authorize a client with the loaded credentials, then call the YouTube API.

    });
}






