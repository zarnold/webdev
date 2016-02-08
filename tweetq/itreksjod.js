var marvel = require('marvel-characters')
var Twitter = require('twitter');



var quotes= [
'Pour conserver l\'élégance de cette métaphore, je propose qu\'on oublie Jean-Paul.',
'Nous sommes la part du Monde qui est invisible à Dieu',
'Il n\'y a plus rien entre la noosphère et moi. Je suis un pur esprit créatif.',
'Nouvel épisode: Roubignole et Pâtisson contre le cartel cubain',
'Parce que les héros sont des connards.',
'Je connais assez peu d\'histoires où une loutre maîtrise la pyrokinésie.',
'Pourquoi pas un condylure à nez étoilé garou? c\'est pas plus con qu\'un loup.',
'Poudlar, c\'est un peu les amish qui s\'inscrivent à la N.R.A.',
'J\'ai insisté, genre "pas chez Poufsouffle!", mais j\'imagine qu\'il faut équilibrer.',
'J\'ai jamais été précoce dans la vie, sauf lorsqu\'il s\'est agi de devenir un vieux con.',
'Whoo putain je vais le retweeter! Hashtag "LesGens"!',
'Je vais avoir à peine le temps d\'instagramer mon mocha.',
'La séduction est le pédiluve de l\'amour',
'Pourquoi des gens portent-ils soudain des casquettes en peau de sac à main de vieille?',
'Dans un autre Univers, vous êtes une petite crevette grise nommée Aristide.',
'Bois du sucre, comme un jeune qui fait du skateboard!',
'Bonjour, j\'ai une tête de pompier en plastique et je vais te parler de ma voiture.',
'C\'est à la gastronomie ce que le bulldozer est à la chirurgie esthétique: pas utile.',
'Je crois que j\'ai un cerveau basse-définition',
'À lire bientôt sur 9gag, avec la signature effacée',
'Moi je vois une biche, spontanément, je me dis pas "Tiens, je vais la traire".',
'Non mais commence par les coins, bon sang!',
'C\'était pas des olives?',
'L\'amour est-il soluble dans le numérique?',
'Amédée! Rodriguo! Que mon cul reluise, presto!',
'"Maman de Fanchon" vous a ajouté à ses contacts.',
'Ce qui ne nous tue pas a fait une grosse erreur.',
'Bon sang, ce taudis tombe en morceaux.',
'Mon "Moi" est négligent. Il sait qu\'il n\'est que locataire dans son logement de chair.',
'L\'imagination est une ivresse, la réalité est sa gueule de bois',
'Moi, je voulais juste avoir le pion en forme de chien.',
'Ça me fend le cœur, parce que t\'es un putain d\'artiste, Marcello.',
'Sérieusement: ma pizza elle n\'est pas très bonne.',
'Les endives crues j\'aime bien, mais cuites je trouve ça dégueu',
'Je te hais et je voudrais que tu crèves avec ta musique',
'Le lapin! Le lapin!',
'La patate est à la fois onde et particule. Potentiellement patate, frite ou purée',
'Rouquin, à l\'eau! Rouquin, à l\'eau!',
'Comme ça on y colle le bouchon au cul et on en parle plus',
'Nous ne pouvions inquiéter nos actionnaires',
'Il n\'y a pas de petites victoires',
'Adorable et effrayant',
'Je maintiens mon taux de monde réel en dessous de 10%',
'Arrêtez de m\'appeler.',
'Maintenant, le petit slip en poils ça n\'est pas trop dans l\'esprit du royaume.',
'Le corps n\'est pas une chose honteuse',
'Peut-être que c\'est de l\'Art, qu\'il y a toute une réflexion derrière',
'La bande olfactive de ma vie',
'Ai-je envie de m\'investir autant pour des putains d\'endives ?',
'Je veux juste bouffer du gras jusqu\'à me haïr moi-même',
'Il maîtrise le requin de son sourire',
'Ce gluon ne veut rien savoir',
'La grâce de la feuille dans le vent',
'Je n\'ai même pas vomi',
'Notez la prolifération des petits traits',
'Je viens de me faire larguer par mon fantasme',
'C\'est pas de ma faute, je ne suis déjà pas foutu d\'entretenir un ficus',
'Si à 50 ans tu rêves encore de Rolex, alors tu as raté ta vie',
'Pthuluh wants HUGZ (and your immortal soul)',
'I am dolphin-intolerant',
'On y mettait notre sueur, notre coeur et nos couilles',
'Sinon nous avons le "kit psychopathe", avec un carton de chatons morts.',
'I iz on your carpet, can I haz some delicious beer pliz ?',
'Parfois on va ramasser des cailloux. C\'est aussi ça, la science.',
'Patron ! Y\'aurait moyen d\'avoir un slip ?',
'Il faut des petits traits. C\'est ce qui donne le volume.',
'Ça a fait comme un gros Slurp',
'Sans vouloir me mettre en avant, j\'aimerais qu\'on rebaptise l\'ununoctiun "bouletium". Ça sonne mieux.',
'Les kangourous sont bipèdes, et cons comme des balais.',
'Le Monde est en train de devenir kawaii !',
'Sang et Tripaille !',
'Tu es un mâle alpha ! Tu aurais dû le tuer et uriner sur son corps !',
'C\'est peut-être au fond de mon caveau que je danserai le mortel tango',
'C\'est peut-être seul devant l\'ADSL que je danserai le tango mortel',
'C\'est peut-être au fond d\'une poubelle que je danserai le tango mortel',
'L\'application vie-sociale.exe a quitté inopinément votre système',
'La cocasserie de ces pages secouera d\'hilarité la Terre entière',
'Ma fulgurante destinée dans la figuration narrative',
'L\'aura des ténèbres',
'C\'est parce que je suis tendre et viril à la fois',
'Ce n\'est pas un rêve. Ce n\'est JAMAIS un putain de rêve',
'Range cette encyclopédie et utilise Wikipédia ! Tu veux être kické du cours, ou quoi ?',
'Fuck Peter Pan',
'Un ou deux dinosaures en plus, ça n\'aurait pas été du luxe, quand même',
'Une intéressante source de protéines',
'Peut-être que ce paradoxe temporel va détruire l\'univers entier, mais ça valait le coup',
'Je ne suis pas vieux, je suis formica-punk',
'C\'est peut-être gras comme un falafel que je danserai le tango mortel',
'Nul n\'échappe à Bibi Laberlue',
'Encore un jour ordinaire…',
'En 2008 j\'ai failli conquérir le monde',
'Mes bulles limpides font pétiller l\'amère liqueur de vos vies',
'Lourd est le parpaing de la réalité sur la tartelette aux fraises de nos illusions',
'Est-ce que j\'ai une gueule à bouffer des putains de sardines ?',
'Je ne suis pas misanthrope, je pense juste que la plupart des eucaryotes sont des connards',
'Plus fougueux qu\'un espadon sauvage',
'Noël au balcon, pack de protons',
'Dans ton cul, Pythagore !',
'Debout mes globules !',
'J\'ai un problème avec l\'alcool: je n\'en ai presque plus.'
];

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
  this.timeline="itreksjod";

  this.listOfReply=[];

  this.client = new Twitter({
	consumer_key: '',
	consumer_secret: '',
	access_token_key: '',
	access_token_secret:'' 
  });

  // Bind or loose ref
  var t=36000-(17000*Math.random())
  t=t*60;
  this.timer =  setInterval(this.talk.bind(this), t);
  this.timer =  setInterval(this.watch.bind(this), 35000);
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

	console.log(this.name+" replied  "+myTweet +' to ' + id );
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

	console.log(this.name+" says "+myTweet );
	this.client.post('statuses/update', param,  post_cb);
}

/**
 * watch a mention
 */
DunjonMaster.prototype.watch = function()
{
	var self=this;

	var param={
		'count': 30,
	};

	var whatsAbout = function(err,tweet,resp){
		if(err){
			console.log('watch : ');
			console.log(err);
		}
		else
		{
			
			//console.log(tweet);
			tweet.forEach(function(el){
				var to=el.user.name;
				var tId=el.id_str;
				
				if ( self.listOfReply.indexOf(tId) === -1 )
				{
					self.listOfReply.push(tId);
					var quote =  quotes[Math.floor(Math.random()*quotes.length)];
					self.replyTo(tId,to,quote);
				}
				else
					console.log('will NOT reply to '+tId+' ' +to);
			});
		}	
	}

	this.client.get('statuses/mentions_timeline', param,  whatsAbout);
	
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

bob=new DunjonMaster('Ronald');
bob.talk();
