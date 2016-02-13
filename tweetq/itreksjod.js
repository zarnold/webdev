var marvel = require('marvel-characters');
var Twitter = require('twitter');
var jsonfile = require('jsonfile');
var boulet=require('./bouletquote');
// I won't git commit it. You should create it by yourself.
// or use any method you want
var mycredentials=require('./mycredentials')





/**
 * Dunjeon Master that  listen to request
 * and answer
 * @constructor
 * @param {string} name - A name to follow the dude
 */

var DunjonMaster = function (name)
{
  
  if (name == undefined) name = "randomDude";

  this.context={};
  this.context.name = name;
  this.timeline="itreksjod";
  this.context.lastReplyId=14927799;
  this.client = new Twitter({
	consumer_key: mycredentials.consumer_key,
	consumer_secret: mycredentials.consumer_secret,
	access_token_key: mycredentials.access_token_key,
	access_token_secret:mycredentials.access_token_secret 
  });

  console.log("loading");
  var self=this;

  var file = 'data.json';
  obj = jsonfile.readFileSync(file)
		  if(!obj){ 
			  console.log("error.did not find "+file);
			}
		  else{
			  console.log(obj.name + " found its saved game");
			  console.log(obj)
			  this.context=obj;
			};
  // Bind or loose ref
  var t=36000-(17000*Math.random())
  t=t*60;
  this.timer =  setInterval(this.talk.bind(this), t);
  this.timer =  setInterval(this.watch.bind(this), 1*30*1000);
}

/**
 * Make a random general statement on twitter
 */

DunjonMaster.prototype.talk = function() {

	var self = this;

	var  post_cb = function(err,tweet,resp){
		if(err){
		  console.log(err);
		}
		else console.log("tweet sent");
	};

	var generateText=function()
	{
	  var a=marvel();
	
	  if(Math.random()<0.3) return self.context.name+" does not like "+a;
	  if(Math.random()<0.6) return self.context.name+" likes "+a;
	   return self.context.name+" does not care about "+a;
	}

	var param={
	  'status':generateText(),
	  'possibly_sensitive':false,
	  'lat':2.333444,
	  'long':12.333333,
	  'place':'df51dec6f4ee2b2c'
	};

	console.log(this.context.name+" said");
	this.client.post('statuses/update', param,  post_cb);

};


DunjonMaster.prototype.replyTo = function(id,dude,blabla) {

	if (id == undefined ) return;
	if (dude == undefined ) return;
	if (blabla== undefined ) blabla = 'Wanna talk ? I\'m a bot, I do not understand a lot :/';
 
	var myTweet ='@'+dude+' '+blabla;

	var self=this;

	var  post_cb = function(err,tweet,resp){
		if(err){
		  console.log(err);
		}
	};

	var param={
	  'status':myTweet,
	  'in_reply_to_status_id' : id,
	  'possibly_sensitive':false,
	  'lat':2.333444,
	  'long':12.333333,
	  'place':'df51dec6f4ee2b2c'
	};

	console.log(this.context.name+" replied  "+myTweet +' to ' + id );
	this.client.post('statuses/update', param,  post_cb);
}

/**
 * Talk to someone
 * @param {string} dude - Who to talk to
 * @param {string} blabla - what to say
 */

DunjonMaster.prototype.talkTo = function(dude,blabla) {
	if (dude == undefined ) dude = 'cepcam';
	if (blabla== undefined ) blabla = 'hey, how are you ?';
 
	var myTweet = '@'+dude+' '+blabla;
	var self=this;

	var  post_cb = function(err,tweet,resp){
		if(err){
			console.log(' Talk to : ');
			console.log(err);
		}
	};

	var param={
	  'status':myTweet,
	  'possibly_sensitive':false,
	  'lat':2.333444,
	  'long':12.333333,
	  'place':'df51dec6f4ee2b2c'
	};

	console.log(this.context.name+" says "+myTweet );
	this.client.post('statuses/update', param,  post_cb);
}

/**
 * watch a mention
 */
DunjonMaster.prototype.watch = function()
{
	var self=this;

	var param={
		'count': 200,
		'since_id': self.context.lastReplyId
	};

	console.log(param);
	var whatsAbout = function(err,tweet,resp){
		if(err){
			console.log('watch : ');
			console.log(err);
		}
		else
		{
			console.log("Got "+tweet.length);
			
			//console.log(tweet);
			tweet.forEach(function(el){
				var to=el.user.name;
				var tId=el.id_str;
				if(self.context.lastReplyId < tId) self.context.lastReplyId = tId;

				var quote =  boulet.quotes[Math.floor(Math.random()*boulet.quotes.length)];
				self.replyTo(tId,to,quote);
				});

		  self.save();
		}	
	}

	this.client.get('statuses/mentions_timeline', param,  whatsAbout);
	
}

/**
 * save the context
 */
DunjonMaster.prototype.save = function()
{
	var obj={};
	console.log("Saving...");
	var file = 'data.json'
	var obj=this.context; 
    console.log(obj);
	jsonfile.writeFile(file, obj, {spaces: 2}, function(err) {
			console.error(err)
			})
	console.log("Done.");
}
/**
 * Listen to the status of someone
 * @param {string} dude - Who to listen to 
 */

DunjonMaster.prototype.listenTo = function(dude)
{
	if (dude == undefined ) dude = 'cepcam';
	var params = {'screen_name': dude};

	this.client.post('statuses/user_timeline', params, function(error, tweets, response){
		if (!error) {
		  //console.log(tweets);
		  console.log("Nuff said");
		}
		else {
		  console.log(error);
		}
	});
}

bob=new DunjonMaster('Ruckus');
bob.talk();
bob.watch();
