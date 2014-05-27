angular.module('starter.controllers', [])

.controller('LiveCtrl', function($scope, $ionicLoading, $ionicPopup, Live) {
  $scope.lives = [];
  $scope.title = '直播';
  $scope.rightButtons = [
    {
      type: 'icon-right ion-refresh',
      tap: function(e) {
        fetch('reload');
      }
    }
  ];

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
  ($scope.fetch = fetch = function (cmd) {
    var logging = $ionicLoading.show({
      'content': '掃描中...'
    });
    Live[cmd](function (err, list) {
      $scope.lives = list;
      logging.hide();
      if (err) {
        $ionicPopup.confirm({
          'title': '連線異常, 是否重試？',
          'cancelText': '取消',
          'okText': '重試'
        }).then(function(res) {
          if (res) {
            fetch('reload');
          }
        });
      }
    });
  })('fetch');
})

.controller('ChannelCtrl', function($scope, $location, $ionicLoading, $ionicPopup, Channel) {
  $scope.channels = [];
  $scope.title = '頻道';
  $scope.leftButtons = [
    {
      content: '直播',
      type: 'icon-left ion-ios7-arrow-left',
      tap: function(e) {
        $location.path("#/tab/live");
      }
    }
  ];
  $scope.rightButtons = [
    {
      type: 'icon-right ion-refresh',
      tap: function(e) {
        fetch('reload');
      }
    }
  ];

  var fetch;
  ( $scope.fetch = fetch = function (cmd) {
    var logging = $ionicLoading.show({
      'content': '更新中...'
    });
    Channel[cmd](function (err, list) {
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
            fetch('reload');
          }
        });
      }
    });
  })('fetch');
})
.controller('NewsCtrl', function($scope, $location, $ionicLoading, $ionicPopup, News) {
  $scope.news = [];

  $scope.rightButtons = [
    {
      type: 'icon-right ion-refresh',
      tap: function(e) {
        fetch('reload');
      }
    }
  ];

  $scope.report = function (newsId) {
      $location.path("#/tab/news/"+newsId);
  }
  
  var fetch;
  ( $scope.fetch = fetch = function (cmd) {
    var logging = $ionicLoading.show({
      'content': '連線中...'
    });
    News[cmd](function (err, data) {
      var news = [];
      for (key in data) {
        news.push(data[key]);
      };
      $scope.news = news;
      logging.hide();
      if (err) {
        var confirmPopup = $ionicPopup.confirm({
          'title': '連線異常, 是否重試？',
          'cancelText': '取消',
          'okText': '重試'
        });
        confirmPopup.then(function(res) {
          if (res) {
            fetch('reload');
          }
        });
      }
    });
  })('fetch');
})
.controller('ReportCtrl', function($scope, $ionicLoading, $ionicPopup, $state, $stateParams, News) {
  $scope.reports = [];
  $scope.id = 0;
  $scope.title = '報導';
  $scope.leftButtons = [
    {
      content: '報導',
      type: 'icon-left ion-ios7-arrow-left',
      tap: function(e) {
        $state.go('tab.news');
      }
    }
  ];
  $scope.rightButtons = [
    {
      type: 'icon-right ion-refresh',
      tap: function(e) {
        fetch('reload');
      }
    }
  ];
  
  var fetch;
  ( $scope.fetch = fetch = function (cmd) {
    var logging = $ionicLoading.show({
      'content': '連線中...'
    });
    News[cmd](function (err, data) {
      $scope.reports = data[$stateParams.id].post;
      $scope.id = $stateParams.id;
      $scope.title = data[$stateParams.id].name;
      logging.hide();
      if (err) {
        var confirmPopup = $ionicPopup.confirm({
          'title': '連線異常, 是否重試？',
          'cancelText': '取消',
          'okText': '重試'
        });
        confirmPopup.then(function(res) {
          if (res) {
            fetch('reload');
          }
        });
      }
    });
  })('fetch');
})
.controller('EventCtrl', function($scope, $ionicLoading, $ionicPopup, Event) {
  $scope.events = [];

  $scope.rightButtons = [
    {
      type: 'icon-right ion-refresh',
      tap: function(e) {
        fetch('reload');
      }
    }
  ];
  
  var fetch;
  ( $scope.fetch = fetch = function (cmd) {
    var logging = $ionicLoading.show({
      'content': '載入中...'
    });
    Event[cmd](function (err, list) {
      $scope.events = list;
      logging.hide();
      if (err) {
        var confirmPopup = $ionicPopup.confirm({
          'title': '連線異常, 是否重試？',
          'cancelText': '取消',
          'okText': '重試'
        });
        confirmPopup.then(function(res) {
          if (res) {
            fetch('reload');
          }
        });
      }
    });
  })('fetch');
})

.controller('SettingCtrl', function($scope, $ionicLoading, $ionicPopup, PushService) {
  $scope.push = {
    'live': PushService.getLive(),
    'event': PushService.getEvent(),
    'message': PushService.getMessage(),
    'reporter': PushService.getReporter()
  };
  $scope.$watch('push.live', PushService.setLive);
  $scope.$watch('push.event', PushService.setEvent);
  $scope.$watch('push.message', PushService.setMessage);
  $scope.$watch('push.reporter', PushService.setReporter);
});