# GetRichTwitch
GetRichTwitch

Description: GetRichTwitch is an automated system, commonly known as a “bot”, made by the Miranda Cosgroves team at Texas State
Its goal is to monitor chat activity and assist moderators and broadcasters in managing their channel, engaging their viewers, and shifting work from the broadcaster to an event based system that can detect and respond to common needs and requests automatically without broadcaster input. This allows the broadcaster to focus on other areas without worrying about managing their own chat environment as closely.

Currently the code can be built and runs without errors.
********************************************************************************************************************************
						COMMAND FORMATS
********************************************************************************************************************************
If the command is not shown here it takes no extra input besides the command itself (!<command>)
'*' denotes that this command has an optional input but also will accept if no extra parameters are passed.

This is the format for all available commands:
!echo <message>
!doom <message>
!givepts <user>*
!slap <user>*
!coinflip <heads/tails>
!hug <user>*
!discipline <user>*
!purge <user>
!requestsong <YouTube link or Video ID>
!buyCommand <command name>
!blacklist viewer <viewer name>
!blacklist song <YouTube link or Video ID>
!givePermission <command name>

********************************************************************************************************************************
                                                 RUNNING GETRICHTWITCH

********************************************************************************************************************************



1. Install Node.js here https://nodejs.org/en/
2. Once installed run Node.js commmand prompt
3. Change your active directory to where GetRichTwitch is saved (cd C:\...GetRichTwitch)
4. Copy this: npm i tmi.js haikudos get-video-id googleapis google-auth-library youtube-info //this will install the js files needed to run GetRichTwitch
	And paste it into your Node.js command prompt
5. Run connect.js by typing node src/JS/connect.js while your working directory is set to the GetRichTwitch folder
6. Open a browser and go to https://www.twitch.tv/mirandacosgrovebot
7. Type !commands in the chat box to see list of available commands.

**For !playvideo and other features that require youtube API you will be required to create your own client_secrets.json file with your youtube account info
or you will be prompted to authorize MirandaCosgroveBOT to access your YouTube account data**

********************************************************************************************************************************
						SETTINGS AND SETTINGS FILES
********************************************************************************************************************************
general_settings.json- This file currently holds the abilty to change if song requests are enabled on boot or if a moderator has
to !allowrequests first (VIDEO_REQUEST_ON_BY_DEFAULT in general_settings.json) as well as the ability to change the prefix for commands
e.g. !commands (COMMAND_PREFIX in general_settings.json).

DEFAULT VALUES:
VIDEO_REQUEST_ON_BY_DEFAULT = true
COMMAND_PREFIX = !

connection_settings.json - This file holds the authentication key for the bot, the bot username, and the channel the bot will connect to.
You should probably only change the channels list unless you are a power user and understand the consequences of changing the others

FORMAT FOR CONNECTION SETTINGS:
{
    "identity": {
        "username": "MirandaCosgroveBot",
        "password": "oauth:l8ec68snfdwehzsug2ekcoaza7hvkn"
    },
    "channels": [
        "Channel1",
	"Channel2",
	"Channel3"
    ]
}

To connect to multiple channels at a time simply add the name where Channel1, Channel2, Channel3 are in that format example, default value
before being changed is to connect to the bot's own channel (twitch.tv/MirandaCosgroveBot). Make sure you are separating each channel name with a comma
and leaving the name of the channel in quotes or you could run into errors loading which would force it to go to the default channel (Keep an eye on
the console for errors).

********************************************************************************************************************************
                                                 RETROSPECTIVE 
												 SPRINT 3
******************************************************************************************************************************** 



o What Went Well? (4 pts–Team) Four or more teambullets (4 pts)
1. Great teamwork on Slack
2. 
3. 
4. 

o What Might Be Impeding Us from Performing Better? One or more team bullets (1pts)
1. 
2. 
3. 
4. 
 
o What Can We do to Improve? (5pt–Team) One or more team bullets
1. 
2. 
3. 
4. 

(10 pts –Individual) Team member reports on the results of their Sprint 2 “measurable improvement action.”
Cody- 
Levi-  
Eric- 
Joel- 
Michael-   

(40pts-Individual) Feature/Accomplishments
Cody-
Levi-
Eric-
Joel-
Michael-
