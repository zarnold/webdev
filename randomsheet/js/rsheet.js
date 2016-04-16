angular.module('rsheetApp', [])
  .controller('rsheetController', function($scope) {
    $scope.dummyVar = 3;

    $scope.persos=[
      { 'name':'Alienor','sexe':'F'},
      { 'name':'Luis','sexe':'M'},
      { 'name':'Annette','sexe':'F'},
      { 'name':'Ibrahim','sexe':'M'}
    ];

    $scope.changeVar = function(){
	$scope.dummyVar=8;
    };
 
  });
