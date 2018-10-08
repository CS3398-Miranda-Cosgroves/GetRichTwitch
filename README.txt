# GetRichTwitch
GetRichTwitch

Description: GetRichTwitch is an automated system, commonly known as a “bot”, made by the Miranda Cosgroves team at Texas State
that monitors activity on the Twitch.tv site and aggregates the data in an easily digestible format. It monitors the chat content 
for trigger strings to drive input and responses to control things such as games, moderator controls, donation tracking, etc. 
This project aims to use image processing and machine learning to track donations and subscribers of users on twitch to estimate
their income over different time frames, as well as to estimate the potential and mean values for incomes streams of different 
times and games played.

Currently the code can be built and runs without errors.

Joel Martinez: "I plan on implementing subscriper detection and part of the Youtube API."
Eric Ross: "I plan on finishing my research for the Spotify API, at which point I will start the code relating to the Spotify API."

-Michael Griffith
-Cody Jandt
-Eric Ross
-Levi Stalsworth
-Joel Martinez

********************************************************************************************************************************
                                                 RUNNING GETRICHTWITCH

********************************************************************************************************************************
1. Install Node.js here https://nodejs.org/en/
2. Once installed run Node.js commmand prompt
3. Create folder on desktop (for easy access)
4. Navigate to new folder directory in the Node.js command prompt
5. Move connect.js into this new folder
6. Type npm i tmi.js haikudos  //this will install the js files needed to run GetRichtwitch
7. Run connect.js by typing node connect.js
8. Open a browser and go to https://www.twitch.tv/mirandacosgrovebot
9. Type !commands in the chat box to see list of available commands.
