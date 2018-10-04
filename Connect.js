const tmi = require('tmi.js');
const haikudos = require('haikudos');

//channel variables
var currUsers;
var chanName;

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
client.on("names", updateUsersHandler)

// Connect to Twitch:
client.connect()

//called repeatedly at a set time to update users
function updateUsersHandler (channel, users) {
    currUsers = users;
	chanName = channnel;
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

// Function called when the "slap" command is issued:
function slap(target, context) {
	var numPersons = currUsers.length;
	var person = Math.floor(Math.random() * numPersons);
	
	var slapee = currUsers[person];
	sendMessage(target, slapee + ", YOU HAVE BEEN SLAPPED!");	
}

// Function called when the "slap *user" command is issued:
function slap(target, context, slapee) {
	var inChat = 0;
	var i;
		
	for (i = 0; i < currUsers.length; i++){
		if (currUsers[i] == target) {
			inChat = 1;
			break;
		}
	}
		
	if (inChat){
		sendMessage(target, slapee + ", YOU HAVE BEEN SLAPPED!");
	}
	else {
		sendMessage(target, "user not in chat.");
	}
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
