angular.module('rsheetApp', [])
  .controller('rsheetController', function($scope) {
// Pour tester le setup uniquement
    $scope.dummyVar = 3;

    $scope.changeVar = function(){
	$scope.dummyVar=8;
    };

// rsheet classe
    //local random generator
    var r=new Random(190779);
    $scope.nbPersos=5;
    function genPerso()
    {
      var weight = Math.floor(r.normal(70,20));
      var size = Math.floor(r.normal(170,50));
      var name = "Omnomnom";
      var sex = Math.random() > 0.5 ? 'F' :'M';

      var p = { 
	'sex' : sex,
	'name' : name,
	'weight':weight,
	'size' : size
      }; 

      return p;
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
