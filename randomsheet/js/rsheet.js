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
    $scope.nbPersos=6;

    $scope.genPerso = function()
    {
      var weight = Math.floor(r.normal(70,20));
      var size = Math.floor(r.normal(170,50));

      var p = { 'weight':weight,'size' : size}; 

      return p;
    };

    $scope.genRoaster = function ()
    {
      var t=[];
      for (i=0;i<$scope.nbPersos; i++)
	t.push($scope.genPerso());

      return t;
    };

    $scope.regen = function(){
      $scope.persos=$scope.genRoaster();
    };
  
    $scope.regen(); 
  });
