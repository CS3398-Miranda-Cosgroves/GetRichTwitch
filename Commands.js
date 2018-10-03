module.exports = {
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

	// Function called when the "coinflip" command is issued:
	function coinflip(target, context) {
		var coin = Math.floor(Math.random() * 2);

		// Print coin;
		if (coin == 0)
			sendMessage(target, context, 'The coin landed on Tails');
		else if (coin == 1)
			sendMessage(target, context, 'The coin landed on Heads');
	}

	// Function called when the "slap" command is issued:
	function slap(target, context) {
		var numPersons = users.length;
		var person = Math.floor(Math.random() * numPersons);
		
		target = users[person];
		client.whisper(target, "YOU HAVE BEEN SLAPPED!");	
	}

	// Function called when the "slap *user" command is issued:
	function slap(sender, context, target) {
		var inChat = 0;
		var i;
		
		for (i = 0; i < users.length; i++){
			if (users[i] == target) {
				inChat = 1;
				break;
			}
		}
		
		if (inChat){
			client.whisper(target, "YOU HAVE BEEN SLAPPED!");
		}
		else {
			client.whisper(sender, "cannot find user in chat.");
		}
	}
};
