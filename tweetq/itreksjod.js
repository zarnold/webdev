var marvel = require('marvel-characters')

var Twitter = require('twitter');

/**
 * Dunjeon Master that  listen to request
 * and answer
 * @constructor
 * @param {string} name - A name to follow the dude
 */

var DunjonMaster = function (name)
{
  
  if (name == undefined) name = "randomDude";

  this.name = name;
  this.client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  // Bind or loose ref
  var t=36000-(17000*Math.random())
  this.timer =  setInterval(this.talk.bind(this), t);
}

/**
 * Make a random general statement on twitter
 */

DunjonMaster.prototype.talk = function() {

	var self = this;

	var  post_cb = function(err,tweet,resp){
		if(err){
		  console.log(err);
		   throw err;
		}
	};

	var generateText=function()
	{
	  var a=marvel();
	
	  if(Math.random()<0.3) return self.name+" does not like "+a;
	  if(Math.random()<0.6) return self.name+" likes "+a;
	   return self.name+" does not care about "+a;
	}

	var param={
	  'status':generateText(),
	  'possibly_sensitive':false,
	  'lat':2.333444,
	  'long':12.333333,
	  'place':'df51dec6f4ee2b2c'
	};

	console.log(this.name+" said");
	this.client.post('statuses/update', param,  post_cb);

};


/**
 * Listen to the status of someone
 * @param {string} dude - Who to listen to 
 */

DunjonMaster.prototype.listenTo = function(dude)
{
	if (dude == undefined ) dude = 'cepcam';
	var params = {'screen_name': dude};
	this.client.get('statuses/user_timeline', params, function(error, tweets, response){
		if (!error) {
		  //console.log(tweets);
		  console.log("Nuff said");
		}
		else {
		  console.log(error);
		}
	});
}

bob=new DunjonMaster('Carl');
alice=new DunjonMaster('Ines');
charly=new DunjonMaster('Ibrahim');

