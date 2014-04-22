angular.module('starter.controllers', [])

.controller('LiveCtrl', function($scope, $http, $ionicLoading, $ionicPopup) {
  $scope.lives = [];
  $scope.logging = $ionicLoading.show({
    content: '掃描中...',
  });
  $http({
    method: 'GET',
    url: 'https://livelink.firebaseio.com/live/.json',
    cache: false
  }).
    success(function(data, status, headers, config) {
      $scope.logging.hide();
      for (key in data) {
        $scope.lives.push(data[key]);
      }
    }).
    error(function(data, status, headers, config) {
    });
})

.controller('ChannelCtrl', function($scope, $http, $ionicLoading, $ionicPopup) {
  $scope.channels = [];
  $scope.logging = $ionicLoading.show({
    content: '更新中...',
  });
  $http({
    method: 'GET',
    url: 'https://g0v.github.io/liveext/channel.json',
    cache: false
  }).
    success(function(data, status, headers, config) {
      $scope.logging.hide();
      console.log(data);
      $scope.channels = data;
    }).
    error(function(data, status, headers, config) {
    });
})


.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.leftButtons = [{
    type: 'button-icon icon ion-navicon',
    tap: function(e) {
      $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
    }
  }];
  $scope.toggleMenu = function () {
    $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
  }
});