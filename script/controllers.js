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
      if (typeof data === 'object') {
        for (key in data) {
          $scope.lives.push(data[key]);
        }
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
      $scope.channels = data;
    }).
    error(function(data, status, headers, config) {
    });
})

.controller('EventCtrl', function($scope, $http, $ionicLoading, $ionicPopup) {
  $scope.events = [];
  $scope.logging = $ionicLoading.show({
    content: '更新中...',
  });
  $http({
    method: 'GET',
    url: 'https://livelink.firebaseio.com/event/.json',
    cache: false
  }).
    success(function(data, status, headers, config) {
      $scope.logging.hide();
      var temp = [];

      if (typeof data === 'object') {
        for (key in data) {
          temp.push(data[key]);
        }
      }
      for (var i = temp.length / 2; i >= 0; i--) {
        temp.sort(function(x,y){
          return new Date(x.start).getTime() > new Date(y.start).getTime();
        });
      };
      window.x = temp;
      $scope.events = temp;
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