
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
    var pts = Math.floor((Math.random()+1 ) * 10);
    sendMessage(target, context, context.username + ' got ' + pts + ' points. YAY!');
    //sendMessage(target, context, user.username );
}

