angular.module('starter.controllers', [])

.controller('LiveCtrl', function($scope, $ionicLoading, $ionicPopup, Live) {
  $scope.lives = [];
  $scope.title = '直播';

  $scope.setLocation = function (live) {
    if ( live.location ) {
        $ionicPopup.confirm({
          'title': live.location + ' 正確嗎？',
          'cancelText': '錯誤',
          'okText': '正確'
        }).then(function(res) {
          if ( res === true ) {
            Live.setLocation(live.vuid, live.location);
          }else{
            live.location = null;
            $scope.setLocation(live);
          }
        });
    }else{
      $ionicPopup.prompt({
        'title': '知道在哪直播嗎？',
        'inputType': 'text',
        'inputPlaceholder': '地標 / 地址 / 行動',
        'cancelText': '取消',
        'okText': '設定'
      }).then(function(res) {
        if ( res !== false ) {
            Live.setLocation(live.vuid, res);
            live.location = res;
        }
      });
    }
  }

  var fetch;
  (fetch = function () {
    var logging = $ionicLoading.show({
      'content': '掃描中...'
    });
    Live.fetch(function (err, list) {
      $scope.lives = list;
      logging.hide();
      if (err) {
        $ionicPopup.confirm({
          'title': '連線異常, 是否重試？',
          'cancelText': '取消',
          'okText': '重試'
        }).then(function(res) {
          if (res) {
            fetch();
          }
        });
      }
    });
  })();
})

.controller('ChannelCtrl', function($scope, $location, $ionicLoading, $ionicPopup, Channel) {
  $scope.channels = [];
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

  var fetch;
  ( fetch = function () {
    var logging = $ionicLoading.show({
      'content': '更新中...'
    });
    Channel.fetch(function (err, list) {
      $scope.channels = list;
      logging.hide();
      if (err) {
        var confirmPopup = $ionicPopup.confirm({
          'title': '連線異常, 是否重試？',
          'cancelText': '取消',
          'okText': '重試'
        });
        confirmPopup.then(function(res) {
          if (res) {
            fetch();
          }
        });
      }
    });
  })();
})

.controller('EventCtrl', function($scope, $http, $ionicLoading, $ionicPopup) {
  $scope.events = [];
  var fetchList = function () {
    var logging = $ionicLoading.show({
      content: '載入中...'
    });
    $http({
      method: 'GET',
      url: 'https://livelink.firebaseio.com/event/.json',
      cache: false
    })
    .success(function(data, status, headers, config) {
      logging.hide();
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
    })
    .error(function(data, status, headers, config) {
      logging.hide();
      var confirmPopup = $ionicPopup.confirm({
        'title': '連線異常, 是否重試？',
        'cancelText': '取消',
        'okText': '重試'
      });
      confirmPopup.then(function(res) {
        if(res) {
          fetchList();
        }
      });
    });
  }

  fetchList();

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