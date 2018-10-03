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