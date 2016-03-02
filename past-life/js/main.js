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

  KEY_LEFT = 37;
  KEY_RIGHT = 39;
  KEY_UP = 38;
  KEY_DOWN = 40;
  //For gamers
  KEY_Q=81;
  KEY_D=68;
  KEY_S=83;
  KEY_Z=90;

  var comic = {};

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
    //TODO bind  click event to hide/display case

    //wahterver the error, getout
    if (episode.error) return;

    
    //At this step, episode object must contain the 'cases' url

    /*
    var screen=document.createElement("h6");
    screen.innerHTML='Retrouvez un épisode de '+ episode.serie+' offert par <a href="http://spunchcomics.com">Spunchcomics</a>. Cliquez à droite de l\'image pour avancer, à gauche pour reculer';
    comic.appendChild(screen);
      */
    currentCase = 0;
    maxCase = episode.cases.length;
    episode.cases.forEach(function(el,i){
      var caseImage = new Image();

      caseImage.src=el.url;
      casesArray.push(caseImage);

      caseImage.onload = function(){
        comic.appendChild(caseImage);
        caseImage.style.width="100%";
        if(i!=0) caseImage.style.display = "none";

        var width=caseImage.width;

        caseImage.onclick = function(event){
          printTrace('Click click');
          printTrace('Current image: '+currentCase);

          var x;
          if (event.offsetX !== undefined && event.offsetY !== undefined)
            x = event.offsetX;
          else
            x = event.layerX;

          printTrace("X click is :"+x+' to '+width);

          if(x>width/2) nextPage();
          else previousPage();
        }
      };
    })



  }


var nextPage = function()
{
  printTrace('Next page');

  if(currentCase<maxCase-1){
    casesArray[currentCase].style.display="none";
     currentCase++;
    casesArray[currentCase].style.display="initial";
  }
  else
  {
    window.open('http://www.lafautealamanette.org', '_blank');
  }
}
var previousPage = function()
{
  printTrace('Previous page');

  if(currentCase>0){
    casesArray[currentCase].style.display="none";
     currentCase--;
    casesArray[currentCase].style.display="initial";
  }
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
    var comicURL;

    comicsInfo.author = comicsInfo.author.toLowerCase();
    comicsInfo.serie = comicsInfo.serie.toLowerCase();

    comicsInfo.author = comicsInfo.author.replace(" ","-","gi");
    comicsInfo.serie = comicsInfo.serie.replace(" ","-","gi");
    comicsInfo.author = comicsInfo.episode.replace(" ","-","gi");
    comicsInfo.lang= comicsInfo.lang.replace(" ","-","gi");

    printComics();

    if(comicsInfo.serie === 'last')
    {
      comicURL = SERVER_INFO.server + '/' + SERVER_INFO.publisher + '/' + SERVER_INFO.collection + '/last_fr/index.json' ;
    }
    else if(comicsInfo.episode === 'last' )
    {
      comicURL = SERVER_INFO.server + '/' + SERVER_INFO.publisher + '/' + SERVER_INFO.collection + '/sharable/'+comicsInfo.serie+'/index.json' ;
    }
    else
    {
      comicURL = SERVER_INFO.server + '/' + SERVER_INFO.publisher + '/' + SERVER_INFO.collection + '/sharable/'+comicsInfo.serie+'/'+comicsInfo.episode+'/index.json' ;
    }
    fetchJSON(comicURL,function(data){

      episode={'error':500};
      //this ugly cause of a bad server API
      if(data.episodes)  episode = data.episodes[data.episodes.length-1] ;
      if(data.series) episode = data.series[0];
      if(data.authors ) episode = data;


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
    comic = document.querySelector('#manganese');

    if(comic)
    {
      printTrace(" Found comic tag");

      comic.dataset.author ? comicsInfo.author=comic.dataset.author : printTrace("No author attribute");
      comic.dataset.serie ? comicsInfo.serie=comic.dataset.serie : printTrace("No serie attribute");
      comic.dataset.episode ? comicsInfo.episode=comic.dataset.episode : printTrace("No episode attribute");
      comic.dataset.lang ? comicsInfo.lang=comic.dataset.lang : printTrace("No lang attribute");
      //So now get the attributes

    }
    else
    {
      printTrace("[ERROR] Havent found comics tag");
    }
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
