angular.module('starter.controllers', [])

.controller('LiveCtrl', function($scope, $http, $ionicLoading, $ionicPopup) {
  $scope.lives = [];
  $scope.logging = $ionicLoading.show({
    content: '掃描中...',
  });
  $scope.title = '直播';

  $http({
    method: 'GET',
    url: 'https://livelink.firebaseio.com/live/.json',
    cache: false
  })
  .success(function(data, status, headers, config) {
      $scope.logging.hide();
      if (typeof data === 'object') {
        for (key in data) {
          $scope.lives.push(data[key]);
        }
      }
  })
  .error(function(data, status, headers, config) {
  });
})

.controller('ChannelCtrl', function($scope, $http, $location, $ionicLoading, $ionicPopup) {
  $scope.channels = [];
  $scope.logging = $ionicLoading.show({
    content: '更新中...',
  });
  $scope.title = '頻道';
  $scope.rightButtons = [
    {
      content: '直播',
      type: 'icon-right ion-social-rss',
      tap: function(e) {
        $location.path("#/tab/live");
      }
    }
  ];
  $http({
    method: 'GET',
    url: 'https://g0v.github.io/liveext/channel.json',
    cache: false
  })
  .success(function(data, status, headers, config) {
    $scope.logging.hide();
    $scope.channels = data;
  })
  .error(function(data, status, headers, config) {
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
          data[key].sortKey = new Date(data[key].start).getTime();
          temp.push(data[key]);
        }
      }
      temp.sort(function(x,y){
        return x.sortKey > y.sortKey ? 1 : -1;
      });
      $scope.events = temp;
    }).
    error(function(data, status, headers, config) {
    });
})

.controller('SettingCtrl', function($scope, $http, $ionicLoading, $ionicPopup, PushService) {
  $scope.push = {
    'live': PushService.getLive(),
    'event': PushService.getEvent(),
    'message': PushService.getMessage()
  };
  $scope.$watch('push.live', PushService.setLive);
  $scope.$watch('push.event', PushService.setEvent);
  $scope.$watch('push.message', PushService.setMessage);
});