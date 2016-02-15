var marvel = require('marvel-characters');
var fs=require('fs');
var Twitter = require('twitter');
var jsonfile = require('jsonfile');

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

  this.game={};
  this.game.name = name;
  this.game.lastReplyId=14927799;
  this.game.position='case_0';
  this.game.orientation='nord';
  this.game.currentLevel='niveau_1';

  this.map={};

  
  this.timeline="itreksjod";
  this.client = new Twitter({
	consumer_key: mycredentials.consumer_key,
	consumer_secret: mycredentials.consumer_secret,
	access_token_key: mycredentials.access_token_key,
	access_token_secret:mycredentials.access_token_secret 
  });
  this.watchTimer={};

  console.log("loading");
  var self=this;

  
  var file = 'data.json';
  obj = jsonfile.readFileSync(file);
  if(!obj){ 
	  console.log("error.did not find "+file);
	}
  else{
	  console.log(obj.name + " found its saved game");
	  this.game=obj;
	  this.say("ah. J'ai trouvé une vieille sauvegarde. utilisons là.");
	};

  var file = this.game.currentLevel+'.json';
  console.log("Loading "+file+"...");
  obj = jsonfile.readFileSync(file);
  if(!obj){ 
	  console.log("error.did not find "+file);
	}
  else{
	  this.map=obj
	  console.log("File found !");
	};
}

/**
 * Launch every timer
 */
DunjonMaster.prototype.launch = function(tWatch)
{
  if ( tWatch == undefined ) tWatch = 1*60*1000;
  this.watchTimer=  setInterval(this.round.bind(this), tWatch);

}
/**
 * Say something
 */

DunjonMaster.prototype.say = function(msg) {

	var self = this;
	if ( msg == undefined ) msg='.';

	var  post_cb = function(err,tweet,resp){
		if(err){
		  console.log(err);
		}
		else console.log("tweet sent");
	};


	var param={
	  'status':msg,
	  'possibly_sensitive':false,
	  'lat':2.333444,
	  'long':12.333333,
	  'place':'df51dec6f4ee2b2c'
	};

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

	console.log(this.game.name+" replied  "+myTweet +' to ' + id );
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

	console.log(this.game.name+" says "+myTweet );
	this.client.post('statuses/update', param,  post_cb);
}
/**
 * save the game
 */
DunjonMaster.prototype.save = function()
{
	var obj={};
	console.log("Saving...");
	var file = 'data.json'
	var obj=this.game; 
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

/**
 * Show an image
 */
DunjonMaster.prototype.show = function(image,msg,dude,repId)
{

    console.log("Trying to post "+image); 
	var self = this;
	if ( msg == undefined ) msg='.';
	if (dude) msg='@'+dude+' '+msg;
	if ( image == undefined ) 
	{
		image='plan';
		msg="Voici la plan";
	}
	// Load your image
	var data = fs.readFileSync('./img/'+image+'.jpg');
	if (data != null )
	{
		// Make post request on media endpoint. Pass file data as media parameter
		self.client.post('media/upload', {media: data}, function(error, media, response){

		if (!error) {

			// Lets tweet it
			var status = {
				status: msg,
				media_ids: media.media_id_string // Pass the media id string
			};
            if(repId) status.in_reply_to_status_id = repId;

			self.client.post('statuses/update', status, function(error, tweet, response){
				if(!error) console.log("Image sent");
			});
		  }
		  else {
			console.log(" Show error :");
			console.log(error);
		}
		});
	}
}
//---------------------------------------------------------

/**
 * Play a round
 * This function is quite messy because of
 * keeping the scope.
 * regexp map to functions only if
 * scope is the same.
 */
DunjonMaster.prototype.round = function()
{
	this.game.round++;
    console.log("================ Round "+this.game.round);
	var self=this;

	// Init votes fpr this round to 0
    var votes={
			'nord':0,
			'sud':0,
			'est':0,
			'ouest':0
		};

  // ------------------------------------------------------------------------------
    var move = function(){
		
		// ------ Majority vote
        var direction='none';
		var previousVote=0

		for (var key in votes){
			if(votes[key]> previousVote)
			{	
				direction=key;
				previousVote=votes[key];
			}
		};
		
		if (direction != 'none')
		{
			console.log("direction choisit : "+direction);
			var w=self.map[self.game.position][direction];
			console.log(w);	
			self.game.orientation=direction;
			if(w == 'rien'){
				var msg="Il y a un mur. Je ne peux pas avancer dans cette direction ("+direction+").";
			}	
			else {
				self.game.position = w;
				console.log("Now into "+w);
				var msg="== Round " + self.game.round +" : La majorité a parlé, j avance vers : "+direction;
				self.say(msg);
				var mg = self.map[self.game.position].vue[self.game.orientation];
				if (mg != 'rien' )
				{
					var msg=self.map[self.game.position]['description'];
					self.show(mg, msg);
				}
				else
				{
					var msg="Vous êtes face au mur. Vous ne voyez rien.";
					self.say(msg);
				}
			}
		}
	};

    var moveDown = function(){
		console.log('+1 vote pour sud');
		votes['sud']+=1;
	};

    var moveUp = function(){
		console.log('+1 vote pour nord');
		votes['nord']+=1;
	};
    var moveWest = function(){
		console.log('+1 vote pour ouest');
		votes['ouest']+=1;
	};
    var moveEast = function(){
		console.log('+1 vote pour est');
		votes['est']+=1;
	};
  // ------------------------------------------------------------------------------

	var showMonster =function(p){
        console.log(p);
		self.show('streumA', 'En voila un par exemple',p.dude,p.id);
	};
	
	var showHere = function(p){
        console.log(self.game.position);
        var mg = self.map[self.game.position].vue[self.game.orientation];
		if (mg != 'rien' )
		{
			var msg=self.map[self.game.position]['description'];
			self.show(mg, msg,p.dude,p.id);
		}
		else
		{
			var msg="Vous êtes face au mur. Vous ne voyez rien.";
			self.replyTo(p.id,p.dude,msg);
		}
	};

	var showMap = function(p){
		self.show('plan', 'Bonne route',p.dude,p.id);
	};
  
	var showHelp = function(p){
		var msg="Envoyez vos instructions à itreksjod.";
		self.replyTo(p.id,p.dude,msg);
		msg="Les rounds durent 5mn";
		self.replyTo(p.id,p.dude,msg);
		msg="Exemple de message : bouge vers le nord, help, attaque, montre carte, inspecte, ...";
		self.replyTo(p.id,p.dude,msg);
		msg="Pour les déplacements,c est le vote majoritaire qui est choisit.";
		self.replyTo(p.id,p.dude,msg);
	};

  var basicIA = [
	{
	  're':/nor[dt]h*|haut|monte/gi,
	  'func':moveUp
	},
	{
	  're':/droit|[' ]ea*st/gi,
	  'func':moveEast
	},
	{
	  're':/descend|bas|so*u[dt]h*/gi,
	  'func':moveDown
	},
	{
	  're':/gauch|o*[uw]est/gi,
	  'func':moveWest
	},
	{
	  're':/monstre/gi,
	  'func':showMonster
	},
  {
	  're':/o[uù].*suis/gi,
	  'func':showHere
	},
  {
	  're':/inspect/gi,
	  'func':showHere
	},
  {
	  're':/aide/gi,
	  'func':showHelp
	},
  {
	  're':/instruction/gi,
	  'func':showHelp
	},
  {
	  're':/help/gi,
	  'func':showHelp
	},
	{
	  're':/plan/gi,
	  'func':showMap
	},
	{
	  're':/carte/gi,
	  'func':showMap
	},
  {
	  're':/map/gi,
	  'func':showMap
	}
	];
	var param={
		'since_id': self.game.lastReplyId
	};

	var whatsAbout = function(err,tweet,resp){
		if(err){
			console.log('round: ');
			console.log(err);
		}
		else
		{
			console.log("Got "+tweet.length);
			
			//console.log(tweet);
			tweet.forEach(function(el){
				var to=el.user.screen_name;
				var tId=el.id_str;
				if(self.game.lastReplyId < tId) self.game.lastReplyId = tId;

				var params={};
				params.dude=to;
				params.id=tId;
				console.log('- Got Tweet : ');
				console.log(el.text);

				m=basicIA
				.filter(function(el,i, arr){
				  var test= el.re.test(this);
				  return test;
				},el.text)
				.map(function(el){el.func(params)});

				});
		  
		  move();
		  self.save();
		}	
	}

	this.client.get('statuses/mentions_timeline', param,  whatsAbout);
	
}



bob=new DunjonMaster('Ruckus');

//bob.say('Jouons à un jeu.');
bob.round();
bob.launch(50*1000);
