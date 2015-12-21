var fs=require('fs');
var querystring = require('querystring');
var http = require('http');
var Twitter = require('twitter');

var TWEET_COUNT=100;
var REQ_PER_INTERVAL=4;
var REQ_PERIOD_MIN=5
var INTERVAL=REQ_PERIOD_MIN*REQ_PER_INTERVAL*1000;

var APP_PORT=1979;

var top_buzz={};
var memory={
"FN":{"scores":0,"rate":0,"derivate":0,"terms":["marine","le pen","fn","front national"]},
"anxiogene":{"scores":0,"rate":0,"derivate":0,"terms":["attentat","meurtre","braquage","immigration"]},
"politique":{"scores":0,"rate":0,"derivate":0,"terms":["hollande","sarkozy","le pen","juppe","bayrou","election"]},
"science":{"scores":0,"rate":0,"derivate":0,"terms":["decouverte","science","physique","chimie","mathematique","nobel"]}
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

console.log(' -------------------------- Query is :');
console.log(words);
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
    for(var k in memory){
    console.log(memory[k]);
		var q=[];
    for(var key_i in memory[k]["terms"])
		{
				q.push(memory[k]["terms"][key_i]);	
		};
		q.push(k);
		makeStats(q);
	};
};

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
				top_ch=memory[key];
			var k=key;
			}	
			console.log(key + " -> " + memory[key]);
		}
	};
   var a={};
	a[k]=top_ch;
   top_buzz=a;
console.log(top_buzz);
	saveToJson(memory,'derivee.json');
};


//-------------------------------------------
//------ START HERE ------------------------

updateStats();
setInterval(updateStats,INTERVAL);
setInterval(computeBuz,6000);

