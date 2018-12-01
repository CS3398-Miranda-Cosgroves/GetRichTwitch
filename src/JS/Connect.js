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
var chatObj = [];
var slapPermObj = [];
let black_list = {users: [], songID: []};
var session_playlist_id = ''; //Holds playlist ID for this session
let VIDEO_ALLOWED;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/google-apis-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';



// Valid commands start with:
let commandPrefix;
// Define configuration options:
let opts = {
    identity: {
        username: '',
        password: ''
    },
    channels: [
        ''
    ]
};

// These are the commands the bot knows (defined below):
let knownCommands = { echo, haiku, doom, givepts, slap, coinflip, hug, showchats, showhugs, discipline, gamble, purge, commands,
    clear, showpts, trade, stats, requestsong, allowrequests, blockrequests, shopMenu, buyCommand, blacklist, givePermission}; //add new commands to this list

let client;

initAuth();

function bootLoader()
{
    exitListen();
    readUserData();
}
// Connect to Twitch:
function connectIRC(){
    client.connect()
}

function readUserData()
{
    //Read song blacklist into memory
    fs.readFile("src/JSON/blacklist.json", 'utf8', function (err, data) {
        if (err)
        {
            console.log("ERROR READING BLACKLIST - REMOVING CURRENT LIST")
        }
        else{
            if(!(Object.keys(data).length === 0))
            {
                black_list = JSON.parse(data);
            }
        }
    });

    //Read bot login details and channel target into memory
    fs.readFile("src/JSON/connection_settings.json" , 'utf8' , function(err, data){
       if(err)
       {
           console.log(err);
           console.log("Error reading settings, defaulting to test channel (MirandaCosgroveBot)");
           opts = {
               identity: {
                   username: "MirandaCosgroveBot",
                   password: "oauth:l8ec68snfdwehzsug2ekcoaza7hvkn"
               },
               channels: [
                   "MirandaCosgroveBot"
               ]
           };
           //Start client through TMI using login from settings file
           client  = new tmi.client(opts);
           client.on('message', onMessageHandler);
           client.on("subscription", onSubHandler);
           client.on('connected', onConnectedHandler);
           client.on('disconnected', onDisconnectedHandler);
           client.connect()
       }
       else
       {
           if(!(Object.keys(data).length === 0))
           {
               //Set login details
               opts = JSON.parse(data);
               //Start client through TMI using login from settings file
               client  = new tmi.client(opts);
               client.on('message', onMessageHandler);
               client.on("subscription", onSubHandler);
               client.on('connected', onConnectedHandler);
               client.on('disconnected', onDisconnectedHandler);
               client.connect()
           }
           else
           {
               console.log("Settings file empty, please check README 'Settings' section for format and add src/JSON/connection_settings.json");
           }

       }
    });

    //Read general settings into memory
    fs.readFile("src/JSON/general_settings.json", 'utf8', function (err, data) {
        if (err)
        {
            console.log("ERROR READING SETTINGS - GOING TO DEFAULTS (see README 'Settings' section for defaults)");
            VIDEO_ALLOWED = false;
            commandPrefix = '!';
        }
        else{
            if(!(Object.keys(data).length === 0))
            {
                let settings = JSON.parse(data);
                console.log(settings);
                VIDEO_ALLOWED = settings['VIDEO_REQUEST_ON_BY_DEFAULT']
                commandPrefix = settings['COMMAND_PREFIX'];
            }
        }
    });
    
        //viewerObj
    fs.readFile("src/JSON/viewerArr.json", 'utf8', function (err, viewerArr) {
        if (err)
        {
            console.log("ERROR READING VIEWER ARRAY - REMOVING CURRENT LIST")
        }
        else{
            if(!(Object.keys(viewerArr).length === 0))
            { 
                for(var i in viewerObj) {
                    viewerObj.push([i, viewerArr [i]]);
                    console.log(viewerObj[i]);
                }
            }
        }
    });

    //ptsObj
    fs.readFile("src/JSON/ptsArr.json", 'utf8', function (err, ptsArr) {
        if (err)
        {
            console.log("ERROR READING PTS ARRAY - REMOVING CURRENT LIST")
        }
        else{
            if(!(Object.keys(ptsArr).length === 0))
            { 
                for(var i in ptsObj) {
                    ptsObj.push([i, ptsArr [i]]);
                    console.log(ptsObj[i]);
                }
            }
        }
    });

    //coinObj
    fs.readFile("src/JSON/coinArr.json", 'utf8', function (err, coinArr) {
        if (err)
        {
            console.log("ERROR READING VIEWER ARRAY - REMOVING CURRENT LIST")
        }
        else{
            if(!(Object.keys(coinArr).length === 0))
            { 
                for(var i in coinObj) {
                    coinObj.push([i, coinArr [i]]);
                    console.log(coinObj[i]);
                }
            }
        }
    });



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
            /*
            INSERT CODE TO STORE DATA YOU WANT TO KEEP BETWEEN SESSIONS HERE
            ALL FILE WRITES/READS SHOULD BE SYNCHRONIZED VERSION OR THEY WILL NOT COMPLETE CORRECTLY
            PLEASE LEAVE COMMENTS FOR WHAT IS BEING STORED TO DISK AT EXIT TIME
             */

            /**
             *Stores black_list data into JSON to be read into memory on next boot
             */
            let data = JSON.stringify(black_list,  null, 2);
            fs.writeFileSync('src/JSON/blacklist.json', data, 'utf8', function (err) {
                if (err){
                    console.log("ERROR STORING BLACKLIST TO FILE");
                }
                console.log('BLACKLIST STORED TO DISK');
            });

            //viewObj
            let viewerArr = JSON.stringify(viewerObj, null, 2);
            fs.writeFileSync('src/JSON/viewerArr.json', viewerArr, 'utf8', function (err) {
                if (err){
                    console.log("ERROR STORING VIEWER ARRAY TO FILE");
                }
                console.log('VIEWEROBJ STORED TO DISK');
            });

            //ptsObj
            let ptsArr = JSON.stringify(ptsObj,  null, 2);
            fs.writeFileSync('src/JSON/ptsArr.json', ptsArr, 'utf8', function (err) {
                if (err){
                    console.log("ERROR STORING PTS ARRAY TO FILE");
                }
                console.log('PTSOBJ STORED TO DISK');
            });

            //coinObj
            let coinArr = JSON.stringify(coinObj,  null, 2);
            fs.writeFileSync('src/JSON/coinArr.json', coinArr, 'utf8', function (err) {
                if (err){
                    console.log("ERROR STORING COIN ARRAY TO FILE");
                }
                console.log('COINOBJ STORED TO DISK');
            });

            process.exit();
        }
    });
}

// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {
    if (self) { return } // Ignore messages from the bot
    console.log("message type: " + context['message-type']);
    var chats = 1;
    // This isn't a command since it has no prefix:
    if (msg.substr(0, 1) !== commandPrefix) {
        console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
        return
    }

    var viewer = context.username;
    //console.log(viewer);
    
    var i = 0;
    while (i <= viewerObj.length) {
        if (viewerObj[i] == viewer) {
            chatObj[i] += chats;
            console.log(viewer + " is already in array");
            console.log(chatObj[i]);
            break;
        }
        else if (i == viewerObj.length) {
            viewerObj.push(viewer);
            chatObj.push(chats);
            console.log(viewer + " has been added to array");
            console.log(chatObj[i]);
            break;
        }
        i++;
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

function onSubHandler () {
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


//Function called when "showhugs" command is issued:
//Function created by Eric Ross
function showhugs(target, context) {
    var viewer = context.username;

    var i = 0;
    while (i <= viewerObj.length) {
        if (viewerObj[i] == viewer) {
            sendMessage(target, context, context.username + ' has ' + hugsObj[i] + ' total  hugs!');
            //console.log("viewer is in showpts array")
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
            sendMessage(target, context, context.username + ' has ' + ' been disciplined!');
            console.log(viewer + " is already in array");
            console.log(discObj[i]);
            break;
        }
        else if (i == viewerObj.length) {
            console.log(viewer + " is not in array");
            sendMessage(target, context, context.username + ' was given a stern talking to.');
            break;
        }
        i++;
    }
}


//Function called when the "showchats" command is used
//Function created by Eric Ross
function showchats(target, context) {
    var viewer = context.username;

    var i = 0;
    while (i <= viewerObj.length) {
        if (viewerObj[i] == viewer) {
            sendMessage(target, context, context.username + ' has chatted ' + chatObj[i] + ' times!');
            console.log("viewer is in hugs array")
            break;
        }
        else if (i == viewerObj.length) {
            console.log(viewer + " is not in array");
            sendMessage(target, context, context.username + ' has not chatted!');
            break;
        }
        i++;
    }    
}

// Function called when the "gamble" command is issued:
// Function created by JoelMartinez0404
function gamble(target, context, params) {
    var coin = Math.floor(Math.random() * 2);
    var viewer = context.username;

    var i = 0;
    while (i <= viewerObj.length) {
        if (viewerObj[i] == viewer) {
            console.log("user is already in array")
            if (params.length)
                var msg = params.join(' ');

            if (coin == 0)
                coin = 'tails';
            else
                coin = 'heads';

            if (coinObj[i] >= 10) {
                coinObj[i] -= 10;

                // Prints gamble messages;
                if (msg != 'tails' && msg != 'heads') {
                    sendMessage(target, context, 'You did not enter either tails or heads loser...smh.');
                    break;
                }
                else if (coin == 'tails' && coin == msg) {
                    sendMessage(target, context, 'You bet on Tails and you won the bet (somehow). You won 20 coins');
                    coinObj[i] += 30;
                }
                else if (coin == 'heads' && coin == msg) {
                    sendMessage(target, context, 'You bet on Heads and you won the bet (somehow). You won 20 coins');
                    coinObj[i] += 30;
                }
                else if (coin == 'tails' && coin != msg) {
                    sendMessage(target, context, 'You bet on Heads and you lost the bet. You lost 10 coins..boohoo');
                }
                else if (coin == 'heads' && coin != msg) {
                    sendMessage(target, context, 'You bet on Tails and you lost the bet. You lost 10 coins..boohoo');
                }
            }
            else if (coinObj[i] < 10) {
                sendMessage(target, context, 'You need at least 10 coins to gamble with.')
            }

            break;
        }
        else if (i == viewerObj.length) {
            viewerObj.push(viewer);
            ptsObj.push(0);
            coinObj.push(0);
            sendMessage(target, context, 'You have no coins to gamble, try using !givepts first.')
            console.log("user has been added to array")
            break;
        }
        i++;
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
    var inArray = false;

    for(x = 0; x < slapPermObj.length; x++){
        if(context['user-id'] == slapPermObj[x]){
            var inChat = 1;
            var i;
            inArray = true;
            x = slapPermObj.length;

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
    }

    if(!inArray)
        client.say(target, "You have not bought this command yet. GIVE US YOUR COINS!!");
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
            while(ptsObj[i] >= 10) {
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
        cmdStrings[cmdStrings.length] = " " + commandPrefix + commandName.toString() + " ";

    client.say(target, "@" + context.username + " Commands known:" + cmdStrings);
}

/**
 * Add song to request queue if song requests have been activated
 * @param target - channel info
 * @param context - user info
 * @param videoID - String of requested URL
 //  */

function requestsong(target, context, videoID) {
    var viewer = context.username;
    var i = 0;
    while (i <= viewerObj.length) {
        if (viewerObj[i] == viewer) {
            if(coinObj[i] > 5) {
                if(VIDEO_ALLOWED === true) {
                    if(session_playlist_id == '')
                    {
                        fs.readFile('src/JSON/most_recent_playlist.json', function (err, data)
                        {
                            if (err)
                            {//If you get an error on the read, create a new playlist and overwrite previous file
                                console.log(err + "\nError fetching playlist, discarding data in most_recent_playlist.json");
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
                            let current_time = datetime.getTime();
                            console.log(last_ID);
                            if ((current_time - time_created) < 86700000)
                            {
                                console.log("Playlist from within 24 hours found, grabbing playlist ID: " + last_ID);
                                session_playlist_id = last_ID;
                            }
                            else{
                                console.log("Playlist does not exist, creating new playlist");
                                // Authorize a client with the loaded credentials, then call the YouTube API to create a playlist
                                fs.readFile('src/JSON/client_secret.json', function processClientSecrets(err, content) {
                                    if (err) {
                                        console.log('Error loading client secret file: ' + err);
                                        return;
                                    }
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
                        });
                    }
                    let ID = getVideoId(videoID.toString());
                    console.log(ID);
                    if(checkBlacklist(context.username) || checkBlacklist(ID['id']))
                    {
                        client.say(target, "@" + context.username + " song or viewer has been blocked from song requests");
                        return;
                    }
                    if(Object.keys(ID).length === 0 && ID.constructor === Object) {
                        client.say(target, "@" + context.username + " That ID is not a valid youtube URL")
                    }
                    else {
                        let requestinfo = {SongID: ID, Name: context['username'], UserID: context['user-id']};
                        let data = JSON.stringify(requestinfo, null, 2);
                        fs.writeFile('src/JSON/song-request-update.json', data, 'utf8', function (err) {
                            if (err) throw err;
                            console.log('complete');
                        });
                        console.log("Playlist ID: " + session_playlist_id);
                        playlistItemInsertNow(ID['id'], target);
                        coinObj[i] -= 5;
                    }
                }
                else {
                    client.say(target, "Song requests are not currently allowed, get a moderator to use !allowrequests");
                }

            }
            else {
                sendMessage(target, context, context.username + ' has no coins to spend on fancy things!');
            }
            break;
        }
        else if (i == viewerObj.length) {
            console.log(viewer + " is not in array");
            sendMessage(target, context, context.username + ' needs to get points first!');
            break;
        }
        i++;
    }
}

/**
 *Turns on song request functionality for all users, only usable by moderators
 */
function allowrequests(target, context)
{
    //only allow mods to turn requests on
    let badge = context['badges-raw'].split(",")[0];
    if(context['mod'] === true || badge === "broadcaster/1")
    {
        if(session_playlist_id == '')
        {
            fs.readFile('src/JSON/most_recent_playlist.json', function (err, data)
            {
                if (err)
                {//If you get an error on the read, create a new playlist and overwrite previous file
                    console.log(err + "\nError fetching playlist, discarding data in most_recent_playlist.json");
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
                let current_time = datetime.getTime();
                console.log(last_ID);
                if ((current_time - time_created) < 86700000)
                {
                    console.log("Playlist from within 24 hours found, grabbing playlist ID: " + last_ID);
                    session_playlist_id = last_ID;
                }
                else{
                    console.log("Playlist does not exist, creating new playlist");
                    // Authorize a client with the loaded credentials, then call the YouTube API to create a playlist
                    fs.readFile('src/JSON/client_secret.json', function processClientSecrets(err, content) {
                        if (err) {
                            console.log('Error loading client secret file: ' + err);
                            return;
                        }
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
                VIDEO_ALLOWED = true;
            });
        }
        else
        {
            VIDEO_ALLOWED = true;
        }

    }
    else {
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
 *Deletes playlist item currently playing
 */




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
        if (err.code != 'EEXIST')
            throw err;
    }

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
    bootLoader();
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
            console.log('PLAYLIST ITEM REQUEST NOT PROCESSED');
            return;
        }
    });

}

/**
 * Parent function for playlist requests, gets video ID and sets up playlist ID to add to and passes it to
 * the insert function
 */
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

function playlistItemsDelete(auth, requestData) {
    var service = google.youtube('v3');
    var parameters = removeEmptyParameters(requestData['params']);
    parameters['auth'] = auth;
    service.playlistItems.delete(parameters, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        console.log(response);
    });
}

function blacklist(target, context, parameters)
{
    let x = parameters.slice(' ');
    let type = x[0];
    let content = x[1];
    //only allow mods to turn requests on
    let badge = context['badges-raw'].split(",")[0];
    if(context['mod'] === true || badge === "broadcaster/1")
    {
        if(type === "viewer")
        {
            if(checkBlacklist(content))
            {
                client.say(target, "@" + context['username'] + " viewer already blocked from requests");
            }
            else
            {
                black_list.users.push(content);
                console.log(black_list);
            }

        }
        else if(type === "song")
        {
            let ID = getVideoId(content.toString());
            if(Object.keys(ID).length === 0 && ID.constructor === Object) {
                client.say(target, "@" + context.username + " That is not a valid blacklist song")
            }
            else if(checkBlacklist(ID['id']))
            {
                client.say(target, "@" + context.username + " song already blocked");
            }
            else
            {
                black_list.songID.push(ID);
                console.log(ID['id'] + " has been blocked from requests");
            }
        }
        else
        {
            context.say(target, "@" + context.username + " incorrect command format")
        }
    }
    else
    {
        context.say(target, "@" + context.username + " this command is moderator only.")
    }
}

function checkBlacklist(name)
{
    for(let i in black_list.users)
    {
        if(black_list.users[i] === name)
        {
            return true;
        }
    }
    for(let i in black_list.songID)
    {
        if(black_list.songID[i].id === name)
        {
            return true;
        }
    }
    return false;
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
                bootLoader();
            }
        });
    });
}

function shopMenu(target)
{
    var cmdStrings = [];

    client.say(target, "***WELCOME TO THE FUNCTION SHOP MENU***");

    for(var commandName in knownCommands)
        cmdStrings[cmdStrings.length] = "-!" + commandName.toString() + " = 5 coins";

    for(i = 0; i < cmdStrings.length; i++)
        client.say(target, cmdStrings[i]);
}

function buyCommand(target, context, commandToBuy)
{
    // If the command is known, let's execute it:
    if (commandToBuy in knownCommands){
        var viewer = context.username;

        var i = 0;
        while (i <= viewerObj.length)
            if (viewerObj[i] == viewer){
                if(coinObj[i] >= 5) {
                    coinObj[i] -= 5;
                    client.say(target, "WOW! You bought the " + commandToBuy + " command. Are you happy with yourself now?");
                    givePermission(target, context, commandToBuy);
                    break;
                }
            }
            else {
                client.say(target, "Haha you don't have enough coins to buy that command x)")
                break;
            }
    }
    else
        client.say(target, "You did not enter a correct command name. Use !shopMenu to see them available commands.")
}

function givePermission(target, context, commandToBuy)
{
    if(commandToBuy == "slap")
        slapPermObj.push(context['user-id']);
    /** ADD REST OF COMMANDS THAT CAN BE BOUGHT*/
}
