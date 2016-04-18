angular.module('rsheetApp', [])
  .controller('rsheetController', function($scope) {
// Pour tester le setup uniquement
    $scope.dummyVar = 3;

    $scope.changeVar = function(){
	$scope.dummyVar=8;
    };

// rsheet classe
    //local random generator
    var r=new Random(231087);
    $scope.nbPersos=9;
    function genPerso()
    {
      var name = "Omnomnom";

      //Sexe
      // Juste parce que c'est classe d'ecrire p(E) pour voir une proba
      var p=function(E)
      {
	var stats = {
	  'F' : .47,
	  'M' : .47,
	  'cisgenre' : 0.8,
	  'agenre' : 0.05,
	  'hetero': 0.85,
	  'homo' : 0.1,
	  'bi' : 0.5
	};
	return stats[E];
      }

      // Stats d'apres l'etude la plus poussé que j'ai trouvé
      // http://williamsinstitute.law.ucla.edu/research/census-lgbt-demographics-studies/how-many-people-are-lesbian-gay-bisexual-and-transgender/
      var m=Math.random();

      var birthsex = 
	m < p('F') ? 'F' :
	m < p('F')+p('M')  ? 'M' : 'U'
      ;

      m = Math.random();

      var gender = 
      m < p('cisgenre') ?  ( birthsex == 'U' ? (Math.random()<.5 ? 'M':'F' ) : birthsex) : 
      ( m < p('cisgenre') + p('agenre') ? 'agenre' : 
      birthsex == 'M' ? 'F':'M' ) 
      ;

      m = Math.random();
      var love = 
	gender =='agenre' ? ( Math.random() <.5 ? 'M' : 'F' ) :
	m < p('hetero') ? (gender == 'M' ? 'F':'M') :
	m < p('hetero')+p('homo') ? (gender):'deux'
      ;	

      //Corpulence    
      var bodyStats = {
	size : {
	      'M' : {'mean':175, 'var':20},  
	      'F' : {'mean':163, 'var':20}
	  },
	imc: {'mean':25,'var' : 5 } 
      };

      var bodySex = birthsex == 'U' ? (Math.random() > .5 ? 'M':'F') : birthsex;
      var size = Math.floor(r.normal(bodyStats['size'][bodySex]['mean'], bodyStats['size'][bodySex]['var'])); 
      var imc = r.normal(bodyStats['imc']['mean'],bodyStats['imc']['var']);
      var weight = Math.floor(imc * Math.pow((size / 100 ) ,2 ));
      

      //résumé
      var sheet = { 
	'birthsex' : birthsex,
	'gender' : gender,
	'love' : love,
	'name' : name,
	'imc' : imc,
	'weight':weight,
	'size' : size
      }; 

      return sheet;
    };

    function genRoaster()
    {
      var t=[];
      for (i=0;i<$scope.nbPersos; i++)
	t.push(genPerso());

      return t;
    };

    $scope.incPerso = function(){
      $scope.nbPersos++;
      $scope.persos.push(genPerso());
    };

    $scope.decPerso = function(){
      if ( $scope.nbPersos > 2 ) 
      {
	$scope.nbPersos--;
	$scope.persos.pop();
      }
    };

    $scope.regen = function(){
      $scope.persos=genRoaster();
    };
  
    $scope.regen(); 
  });
