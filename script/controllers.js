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
  (fetch = function (cmd) {
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
  ( fetch = function (cmd) {
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
  ( fetch = function (cmd) {
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
  ( fetch = function (cmd) {
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
  ( fetch = function (cmd) {
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

.controller('ReporterCtrl', function($scope, $state, $ionicLoading, $ionicPopup, User) {
  var storage = window.localStorage;

  $scope.user = {
    'username': storage['usr'],
    'password': storage['pwd']
  }

  $scope.login = function(user){
    var logging = $ionicLoading.show({
      content: 'Login...',
    });
    User.login(user.username, user.password, function(status, info) {
      if ( status === true ) {
          storage['usr'] = user.username;
          storage['pwd'] = user.password;
          $state.go('tab.push');
      } else if ( status === false ) {
          $ionicPopup.alert({
            title: '登入失敗',
            content: '帳號/密碼 錯誤！',
          });
      } else {
        $ionicPopup.alert({
          title: '登入失敗',
          content: '網路連線異常！',
        });
      }
      logging.hide();
    });
  }

  User.current( function (user) {
    if ( user ) {
      $state.go('tab.push');
    } else if ( $scope.user.username && $scope.user.password ) {
      $scope.login($scope.user);
    }
  });
})

.controller('PushCtrl', function($scope, $ionicLoading, $ionicPopup, User, Push) {
  $scope.name = '公民記者';
  User.current ( function (user) {
    if ( user ) {
      $scope.name = user.get('name');
    }
  });
  $scope.push = function (message) {
    var logging = $ionicLoading.show({
      'content': '發送中'
    });
    Push.send(message, function (err) {
      if (err===true) {
        $ionicPopup.alert({
          title: '無法驗證身份'
        });
      } else if (err) {
        $ionicPopup.alert({
          title: '發送異常'
        });
      } else {
        $ionicPopup.alert({
          title: '發送成功'
        });
        $scope.$apply(function(){
          $scope.message = '';
        });
      }
      logging.hide();
    });
  }
})


.controller('SettingCtrl', function($scope) {
})

.controller('ListenCtrl', function($scope, $state, Notify) {

  $scope.push = {
    'live': Notify.getLive(),
    'event': Notify.getEvent(),
    'message': Notify.getMessage(),
    'reporter': Notify.getReporter()
  };
  $scope.$watch('push.live', Notify.setLive);
  $scope.$watch('push.event', Notify.setEvent);
  $scope.$watch('push.message', Notify.setMessage);
  $scope.$watch('push.reporter', Notify.setReporter);

  $scope.leftButtons = [
    {
      content: '設定',
      type: 'icon-left ion-ios7-arrow-left',
      tap: function(e) {
        $state.go("tab.setting");
      }
    }
  ];

  if ( typeof device !== 'undefined' ) {
    $scope.token = deviceRegisterToken;
  }else{
    chrome.pushMessaging.getChannelId(true, function(res){
      $scope.$apply(function(){
        $scope.token = res.channelId;
      });
    });
  }

})

.controller('DeveloperCtrl', function($scope, $state) {
  $scope.leftButtons = [
    {
      content: '設定',
      type: 'icon-left ion-ios7-arrow-left',
      tap: function(e) {
        $state.go("tab.setting");
      }
    }
  ];

})

.controller('NotificationCtrl', function($scope, $state) {
  $scope.leftButtons = [
    {
      content: '設定',
      type: 'icon-left ion-ios7-arrow-left',
      tap: function(e) {
        $state.go("tab.setting");
      }
    }
  ];


});