/* 
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * Version 2, December 2004
 * 
 * Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
 * 
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 * 
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 * 
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
*/


// Use name space pleeease
// Name space patterns is from Kenneth Truyers :
// http://www.kenneth-truyers.net/2013/04/27/javascript-namespaces-and-modules/ 


// create the root namespace and making sure we're not overwriting it
var BOULET_LIVES = BOULET_LIVES || {};

// create a general purpose namespace method
// this will allow us to create namespace a bit easier
BOULET_LIVES.createNS = function (namespace) {
  var nsparts = namespace.split(".");
  var parent = BOULET_LIVES;

  // we want to be able to include or exclude the root namespace 
  // So we strip it if it's in the namespace
  if (nsparts[0] === "BOULET_LIVES") {
    nsparts = nsparts.slice(1);
  }

  // loop through the parts and create 
  // a nested namespace if necessary
  for (var i = 0; i < nsparts.length; i++) {
    var partname = nsparts[i];
    // check if the current parent already has 
    // the namespace declared, if not create it
    if (typeof parent[partname] === "undefined") {
      parent[partname] = {};
    }
    // get a reference to the deepest element 
    // in the hierarchy so far
    parent = parent[partname];
  }
  // the parent is now completely constructed 
  // with empty namespaces and can be used.
  return parent;
};

// Create the namespace for products
BOULET_LIVES.createNS("BOULET_LIVES.MODEL.PRODUCTS");



//**************************************************************************************************
// Main Spunch model is the player
// It does 3 things :
//  - retri
BOULET_LIVES.MODEL.PRODUCTS.player = function(){
  // private variables

  var DEBUG_TRACE = true;

  STOP=0;
  RUN=1;
  PAUSE=2;

  KEY_LEFT = 37;
  KEY_RIGHT = 39;
  KEY_UP = 38;
  KEY_DOWN = 40;
  //For gamers
  KEY_Q=81;
  KEY_D=68;
  KEY_S=83;
  KEY_Z=90;

  var lives_cont = {};
  var control_button = {};
	var state=STOP;
  var timer_handle = {};

  var SERVER_INFO = {
    server: 'http://app.cepcam.org/bdd',
    publisher: 'cepcam',
    collection: 'spunch'
  };

  var comicsInfo = {
    serie: 'last',
    episode: 'last',
    lang: 'FR',
    author: 'any'
  };

  var imageList=[];
  var episode={};
  var currentCase=0;
  var maxCase=0;
  var casesArray = [];

  var dimensions = {
      width: 847 ,
      height: 476
  };

  // private methods
  // creating getWidth and getHeight
  // to prevent access by reference to dimensions


//*****************************************
  /****************************************
  *
  * This function display an episode
  *
  */

  var displayComics = function()
  {

        control_button.onclick = function(event){
          printTrace('Click click');
          printTrace('Current image: '+currentCase);

		  if (state == STOP )
			{
				console.log("STOP TO RUN");
				timer_handle = setInterval(nextPage,60);
				state = RUN;
				return;
			}
		  if (state == RUN)
			{
				console.log("RUN TO PAUSE");
				clearInterval(timer_handle);
				state = PAUSE;
				return;	
			}
		  if (state == PAUSE)
			{
				state = STOP;
				resetPage();
				return
			}
        }
    
    currentCase = 0;
    maxCase = imageList.length;
    imageList.forEach(function(el,i){
      var caseImage = new Image();

      caseImage.src="./img/"+el;
      casesArray.push(caseImage);

      caseImage.onload = function(){
        lives_cont.appendChild(caseImage);
        caseImage.style.width="100%";
        if(i!=0) caseImage.style.display = "none";
        var width=caseImage.width;
      };
    })
  }

var resetPage = function()
{
	printTrace('Go start');
    casesArray[currentCase].style.display="none";
     currentCase=0;
    casesArray[currentCase].style.display="initial";
}

var nextPage = function()
{
  printTrace('Next page');
  casesArray[currentCase].style.display="none";
  currentCase = Math.floor(Math.random()*casesArray.length);
  if (currentCase == 0) currentCase = 1;
  casesArray[currentCase].style.display="initial";
}
//*****************************************
  /******************************************
   *  This function retrieve the comics from cepcam server
   *
  **/  
  var getComics = function()
  {
    printTrace('Getting Comics');

    //First build the URL from data fecthing from host page
    var comicURL="./js/img.json";

    fetchJSON(comicURL,function(data){
      imageList = data.images;
      console.log(imageList);
      displayComics();

    });

  }

//*****************************************
  /**
   *  This one get info from the host page, using data tag
   *  If none, it gets the last comics
  **/
  var processData = function ()
  {
    printTrace("Processing Datas");
    
    //Check the comics tagsa via the DOMStringMap
    lives_cont = document.querySelector('#lives');
    if(lives_cont)
    {
      printTrace(" Found lives container tag");

    }
    else
    {
      printTrace("[ERROR] Havent found comics tag");
    }
	control_button =  document.querySelector('#control');
  }

//*****************************************
  //HELPERS 
  var fetchJSON = function(url, callback){
    printTrace("Fetching JSON for "+url);

    request = new XMLHttpRequest();
    request.open('GET',url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        // Success!
        printTrace("Okay, found this episode")
        resp = request.responseText;

        try{
          data=JSON.parse(resp);
        } catch(error){
          data= {'error': 500 };
        }

        callback(data);
      } else {
        printTrace("Reach Spunch server but we did not find your episode");

      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      printTrace("Can't reach spunch server");
    };

    request.send();


  }

  var printComics = function(){
    printTrace(" * Serie is : "+comicsInfo.serie);
    printTrace(" * Episode is : "+comicsInfo.episode);
    printTrace(" * Author is : "+comicsInfo.author);
  };

  var printTrace = function(message){
    if(DEBUG_TRACE) console.log('### Spunch.js message : '+message);
  };

//*****************************************************************************************

//Main is here. It starts everythin
// main
  var launch = function(){
    printTrace("Launching spunch player");

//Pretty Self explanatory
    processData();
    getComics();

  };



  // public API
  return {
    launch: launch
  };
};

//*****************************************************************************************
// Create the namespace for the logic
BOULET_LIVES.createNS("BOULET_LIVES.LOGIC.BUSINESS");


BOULET_LIVES.LOGIC.BUSINESS.init = function () {
  var model = BOULET_LIVES.MODEL.PRODUCTS;
  var p = new model.player();

  p.launch();
};

BOULET_LIVES.LOGIC.BUSINESS.init();
