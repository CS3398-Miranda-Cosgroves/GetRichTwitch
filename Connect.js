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



function commands(target, context)
{
    var cmdStrings = [];
    for(var commandName in knownCommands)
        cmdStrings[cmdStrings.length] = " !" + commandName.toString() + " ";
    client.say(target, "Commands known:" + cmdStrings)
}
