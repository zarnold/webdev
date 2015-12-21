var fs=require('fs');
var querystring = require('querystring');
var http = require('http');
var Twitter = require('twitter');

var TWEET_COUNT=100;
var REQ_PER_INTERVAL=15;
var REQ_PERIOD_MIN=5
var INTERVAL=REQ_PERIOD_MIN*REQ_PER_INTERVAL*1000;
var COOKIE="7c43fc994ca5b5a807bbeaca3606a653817a11a4fc6a356bc7420155620f371f"

var APP_PORT=1979

var top_buzz={};
var memory={
"TF1":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"France 2":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"France 3":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"France 5":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"M6":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"Arte":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"D8":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"W9":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"TMC":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"NT1":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"NRJ 12":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"France 4":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"BFMTV":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"D17":{"scores":0,"rate":0,"derivate":0,"terms":[]},
"Gulli":{"scores":0,"rate":0,"derivate":0,"terms":[]}
};
//----------------------------------------------------------------------
 
 var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//------------------------------------------------
var saveToJson=function(obj,name)
{
	fs.appendFile(name,JSON.stringify(obj,null,4), function(err){
		if(err){
			console.log('Error While Saving json to file '+name);
			console.log(err);	
		}
	});
	fs.appendFile(name,',\n', function(err){
		if(err){
			console.log('Error While Saving json to file '+name);
			console.log(err);	
		}
	});
}

function displayTweetCB(err,tw,resp)
{
    var t=[];

	if(err) {
		console.log('Error on search');
		console.log(err);
		return err;
		};

	var timeline=[];
    var text="";
	answersCount=tw.statuses.length
	terms=tw.search_metadata.query;
	
		
	tw.statuses.forEach(function(el){
		if(el.hasOwnProperty('hashtags'))
		{
			console.log("Hashtags :"+el.hashtags);	
			el.hashtags.forEach(function(hasht){
				t.push[hasht.text];
			});
		}
        text+=el.txt;
		timeline.push(new Date(el.created_at));	
			});


	oldest=Math.min.apply(null,timeline)
    var now=new Date();
    var rate=1000*TWEET_COUNT/(now-oldest);

	var resp={
	'computed_at':now,
    'terms':terms,
    'rate':rate
	};
	term_array=resp.terms.split("+OR+");

	ch=term_array[term_array.length-1];
	var re =/\+/gi;
	channel=ch.replace(re,' ');
    t.push(term_array[0]);
    t.push(term_array[1]);
    t.push(channel);
	var dr=1000*(rate-memory[channel]['rate'])/(rate+memory[channel]['rate']);
    if (isNaN(dr)) dr=0;
	memory[channel]['derivate']=dr;
	memory[channel]['rate']=rate;
	memory[channel]['terms']=t;

    saveToJson(resp,'stats.json');
	var line=now+','+terms+','+rate+'\n';
	fs.appendFile('stats.csv',line, function(err){
		if(err){
			console.log('Error While Saving to csv');
			console.log(err);	
		}
	});
}


var makeStats=function(words)
{
var since_date="2015-12-01";
var till_date="2015-09-30";
var ref="@cepcam";

/*
console.log(' -------------------------- Query is :');
console.log(words);
*/
query=words[0];
words.slice(1).forEach(function(el){
	query+=' OR '+el;
});

//query+=" since:"+since_date;
//query+=" till:"+till_date;
//console.log("Querying : "+query);

var param={
	'q':query,
    'count': TWEET_COUNT,
    'result_type':'recent',
	'lang':'fr'
};

client.get('search/tweets', param,displayTweetCB);
}

var updateStats=function(){

console.log('**** Update stats ***');
var options = {
  host: '192.168.1.33',
  port:1234,
  path: '/keewiiword'
};

var req = http.get(options, function(res) {

  // Buffer the body entirely for processing as a whole.
  var bodyChunks = [];
  res.on('data', function(chunk) {
    // You can process streamed parts here...
    bodyChunks.push(chunk);
  }).on('end', function() {
    var body = Buffer.concat(bodyChunks);
	epg=JSON.parse(body);
	epg.forEach(function(el){
		memory[el.channel]['scores']=el.score;
		var q=[];
		el.words.forEach(function(w)
		{
				q.push(w.term);	
		});
		q.push(el.channel);
		makeStats(q);
	});

    // ...and/or process the entire body here.
  })
});

req.on('error', function(e) {
  console.log('ERROR: ' + e.message);
});

/*
http.request(options, function (res) {
		if (err) {
			return  console.log(err);
			}
		else
		{
			console.log('**** Got Request *****');
			console.log(data.body);
			epg=JSON.parse(data.body);
			epg.forEach(function(el){
				var q=[];
				el.words.forEach(function(w)
				{
					q.push(w.term);	
				});
                q.push(el.channel);
				console.log(q);
				makeStats(q);
			});
		}
	  });
*/

}
//--------- POST ------------------
function sendTweet(str)
{
	console.log("post tweet")
  // Build the post string from an object
  var postData = querystring.stringify({
	'message':str
  });

console.log(postData);
  // An object of options to indicate where to post to
  var options = {
      host: '192.168.1.33',
      port: '1234',
      path: '/keewiibuzz',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
      }
  };

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
  res.on('end', function() {
    console.log('No more data in response.')
  })
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(postData);
req.end();
}

//--------- SERVER ----------------
function channelTopResp(request, response){
	console.log('Stats');
    response.end(JSON.stringify(top_buzz));
}


serveBuzz= function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    //respJson=JSON.parse(str);
    console.log(str);
  });
}


var computeBuz=function(){
	console.log("Watch BUG");
    var max=0;
    var top_ch={};
	for (var key in memory) {
	  if (memory.hasOwnProperty(key)) {
			if( ( memory[key]['derivate']>max) && (memory[key]['derivate']<800) && (memory[key]['derivate']>14))
			{
				max=memory[key]['rate'];
				console.log("We got buzz !!!!!!!!!!!!!!!!!!!!!!! on "+key);
				changeLight();
				other_color();
				top_ch=memory[key];
			var k=key;
			}	
			console.log(key + " -> " + memory[key]);
		}
	};
changeLight();
random_color();
   var a={};
	a[k]=top_ch;
   top_buzz=a;
console.log(top_buzz);
	saveToJson(memory,'derivee.json');
};

//Create a server
var server = http.createServer(channelTopResp);

//Lets start our server
server.listen(APP_PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", APP_PORT);
});
function turnOff(){
var postData = JSON.stringify({
    "propertyFunction": 1,
    "propertyName": 1,
    "value": false
});

console.log('---- Change light');
console.log(postData);
var options = {
  host: "192.168.1.100",
  port: 8080,
  headers:{
    "x-sessionid": COOKIE
},
  path: "/api.bbox.lan/v0/iot/properties/btF4B85E63D973",
  method:"PUT"
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(postData);
req.end();
}
function other_color(){
var postData = JSON.stringify({
    "propertyFunction":5,
    "propertyName": 14,
    "value": 1888888888
});

console.log('---- Change light');
console.log(postData);
var options = {
  host: "192.168.1.100",
  port: 8080,
  headers:{
    "x-sessionid": COOKIE
},
  path: "/api.bbox.lan/v0/iot/properties/btF4B85E63D973",
  method:"PUT"
};

var req = http.request(options, function(res) {
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(postData);
req.end();
}
function random_color(){
var postData = JSON.stringify({
    "propertyFunction":5,
    "propertyName": 14,
    "value": 1222222
});

console.log('---- Change light');
console.log(postData);
var options = {
  host: "192.168.1.100",
  port: 8080,
  headers:{
    "x-sessionid": COOKIE
},
  path: "/api.bbox.lan/v0/iot/properties/btF4B85E63D973",
  method:"PUT"
};

var req = http.request(options, function(res) {
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(postData);
req.end();
}

function changeLight()
{
var postData = JSON.stringify({
    "propertyFunction": 1,
    "propertyName": 1,
    "value": true
});

console.log('---- Change light');
console.log(postData);
var options = {
  host: "192.168.1.100",
  port: 8080,
  headers:{
    "x-sessionid": COOKIE
},
  path: "/api.bbox.lan/v0/iot/properties/btF4B85E63D973",
  method:"PUT"
};

var req = http.request(options, function(res) {
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(postData);
req.end();
}

//-------------------------------------------
//------ START HERE ------------------------
turnOff();

updateStats();
setInterval(updateStats,INTERVAL);
setInterval(computeBuz,6000);

