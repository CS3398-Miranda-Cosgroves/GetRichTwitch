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
For this sprint completed the gamble function and I helped debug code.

Eric Ross: "I plan on finishing my research for the Spotify API, at which point I will start the code relating to the Spotify API."
I wrote the !hug and !haiku functions, along with researching the Spotify API.

Cody Jandt: "I will be working on getting !givepts more functionality, such as storing points gained and a timer that only will allow 
users to call !givepts only once every 10-15 minutes."
I wrote the !givepts and !doom function and help coordinate whether or not we should implement Spotify third-party extensions.

Levi Stalsworth: "I will research back end options for creating a way to not have to use JavaScript for data managment,
and implementing it as I gain the knowledge and availability."
I wrote the !coinflip and !slap functions and helped research the spotify and youtube APIs. !status was not able to be implemented
correctly without the back end working, so it's under jurisdiction of my part of the next sprint. I learned JavaScript is terrible.

Michael Griffith: "I will work with the Google API and HTML files to take data from users in the IRC and convert it
into useable API calls on Google services such as Youtube."

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
6. Type npm i tmi.js haikudos get-video-id youtube-iframe-player http fs //this will install the js files needed to run 
GetRichtwitch
7. Run connect.js by typing node connect.js
8. Open a browser and go to https://www.twitch.tv/mirandacosgrovebot
9. Type !commands in the chat box to see list of available commands.


Retrospective: 
o What Went Well? (4 pts–Team) Four or more teambullets (4 pts)
1. Great teamwork on Slack
2. Sufficient communication between the team members
3. Efficient collaboration for expansion of basic features, lots of communication and quick changes/updates
4. Team got to work quickly, no one lagging behind on pushes

o What Might Be Impeding Us from Performing Better? One or more team bullets (1pts)
1. Roadmap with obtainable goals.
2. Lack of complex Twitch bot API knowledge
3. JavaScript does not easily conform to OOP design, designing and re-designing sucks up more time
4. Lack of "end-game" vision for bot features
 
o What Can We do to Improve? (5pt–Team) One or more team bullets
1. We need to come together to efficiently go over exactly what we can do with our Twitch bot
2. Communicate more about each other's code, a lot of obfuscation for other modules at the moment could cause issues later
3. Repeat 1. and 2.
4. Accurately guage the complexity of functions we want to implement

(5pts– Individual) One bullet per team member 
Cody- Use a calender or set dates on Zenhub.
Levi- Once We understand JavaScript functionality, we can make a working UML, making code cleaner and more efficient to code.
Eric- Better communication on my part.
Joel- Research what resources are available online to help my coding
Michael- Create a convention for how our code is formatted, and more documentation on pre/post conditions of functions

(5pts–Indvidual) With specific, measurable improvement action described 
Cody- I know that I have a problem with spacing out projects, I need to spread out my time more efficiently by spacing my 
projects out and using Zenhub more effectively would help.
Levi- Further understanding JavaScript and backends working with JavaScript will increase productivity. Once my desktop is 
built, I will be able to increase productivity as it wont take 10 minuets to turn on my computer and 5 minuets to open an IDE. 
Better weekend time managment. 
Eric- Since i'm not the only one working on the Spotify API, it might be good for me to reach out to other team mates and
discuss what i've learned, and see what they've learned, and approach this more cooperatively. And this applies to all 
aspects of the project, not just the Spotify API.
Joel- I need to start looking at other Twitch bot API's so that I can see what goals I can achieve in regards to the functionality of the Twitch bot code.
Michael- Need to implement "fail fast", try to get small working pieces in progress to find roadblocks/issues faster instead of 
planning all resources and libraries aheaad of time
