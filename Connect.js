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

// Function called when the "hug" command is issued:
function hug(target, context, huggee) {
    var inChat = 1;
    var i;

    currUsers.push(context.username);
    //console.log(currUsers);

    if (huggee != "") {
        inChat = 0
        for (i = 0; i < currUsers.length; i++){
            if (currUsers[i] == huggee) {
                inChat = 1;
                break;
            }
        }
        if (inChat){
            client.say(target, "@" + huggee + ", Awe, you have been hugged:)");
        }
        else {
            client.say(target, "user not huggable.");
        }
    }
    else {
        var numPersons = currUsers.length;
        var person = Math.floor(Math.random() * numPersons);

        var huggee = currUsers[person];
        client.say(target, "@" + huggee + ", Awe, you have been hugged:)");
    }
}


function commands(target, context)
{
    var cmdStrings = [];
    for(var commandName in knownCommands)
        cmdStrings[cmdStrings.length] = " !" + commandName.toString() + " ";
    client.say(target, "Commands known:" + cmdStrings)
}
