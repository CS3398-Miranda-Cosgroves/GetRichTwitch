const tmi = require('tmi.js');
const haikudos = require('haikudos');

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
let knownCommands = { echo, haiku, doom, givepts } //add new commands to this list
// Create a client with our options:
let client = new tmi.client(opts)

// Register our event handlers (defined below):
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)

// Connect to Twitch:
client.connect()

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

//Function called when the "doom" command is issued:
function doom(target, context, params) {
    var thing = (context);

    if(params.length)
        var msg = params.join(' ');
    
    //Prints return message
    sendMessage(target, context, 'Yes, Doom will run on anything, even on a ' + msg );
}

//Function called when "givepts" command is issued:
function givepts(target, context) {
    var pts = Math.floor((Math.random()+1 ) * 10);
    sendMessage(target, context, context.username + ' got ' + pts + ' points. YAY!');
    //sendMessage(target, context, user.username );
}

// Helper function to send the correct type of message:
//Know that Commands do not run in Whisper
function sendMessage (target, context, message) { 
    if (context['message-type'] === 'whisper') {
       client.whisper(target, message)
    } else {
        client.say(target, message)
    }
}