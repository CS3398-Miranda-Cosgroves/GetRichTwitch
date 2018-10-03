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
let knownCommands = { echo, haiku, coinflip, gamble, slap} //add new commands to this list
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

// Function called when the "gamble" command is issued:
function gamble(target, context, params) {
    var coin = Math.floor(Math.random() * 2);

    //takes in bet input
    if (params.length)
        var msg = params.join(' ');

    if (coin == 0)
        coin = 'tails';
    else
        coin = 'heads';

    // Prints gamble messages;
    if (coin == 'tails' && coin == msg)
        sendMessage(target, context, 'You bet on Tails and you won the bet (somehow). You won 50 coins');
    else if (coin == 'heads' && coin == msg)
        sendMessage(target, context, 'You bet on Heads and you won the bet (somehow). You won 50 coins');
    else if (coin == 'tails' && !(coin == msg))
        sendMessage(target, context, 'You bet on Heads and you lost the bet. You lost 100 coins..boohoo');
    else if (coin == 'heads' && !(coin == msg))
        sendMessage(target, context, 'You bet on Tails and you lost the bet. You lost 100 coins..boohoo');
}

// Helper function to send the correct type of message:
function sendMessage (target, context, message) {
    if (context['message-type'] === 'whisper') {
        client.whisper(target, message)
    } else {
        client.say(target, message)
    }
}
