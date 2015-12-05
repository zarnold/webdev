var Twitter = require('twitter');
 
 var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


var generateText=function()
{
  var a=Math.random();
  var b=a.toString(2);
  return b;
}

function post_cb(err,tweet,resp){
    if(err){
      console.log(err);
       throw err;
    }
    console.log(resp);  // Raw response object. 
};


// Basic status of a user
var params = {screen_name: 'cepcam'};
client.get('statuses/user_timeline', params, function(error, tweets, response){
    if (!error) {
      console.log(tweets);
    }
    else {
      console.log(error);
    }
    });

// Say something 
var param={
  'status':generateText(),
  'possibly_sensitive':false,
  'lat':2.333444,
  'long':12.333333,
  'place':'df51dec6f4ee2b2c'
};

client.post('statuses/update', param,  post_cb);

