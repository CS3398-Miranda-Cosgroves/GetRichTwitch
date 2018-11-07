Haikudos
======

A fairly simplistic Node.js module I created for a chatbot to allow it to write Haikus on request and at specific times throughout the day.  It uses preset word patterns to ensure the result makes sense to the reader.

To add to your node, run the following
```
npm install haikudos --save
```

And then it can be used in your code as follows
```javascript
var Haikudos = require('haikudos');

Haikudos(function(haiku) {
  console.log(haiku);
});
```

If you'd like to see how the resulting Haikus look, [my bot tweets them quite often](https://twitter.com/oceanibot).
