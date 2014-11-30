'use strict';

angular.module('soap-proxy-sample', [])
  .controller('ConvertCtrl', function($scope, $http) {
    $scope.units = [
      {value: 'Kilometers', label: 'Kilometry'},
      {value: 'Miles', label: 'Mile'}
    ];

    $scope.convert = function() {
      $http({url: '/api/convert', method: 'GET', params: {
        from: $scope.from.value,
        to: $scope.to.value,
        value: $scope.value
      }}).then(function(result) {
        $scope.convertedValue = result.data[0];
      }, function error() {
        alert('something went wrong');
      });
    }
  });
