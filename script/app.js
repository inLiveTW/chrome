// Ionic Starter App
angular.module('starter', ['ionic', 'starter.services', 'starter.controllers'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'template/tab.html'
    })
    .state('tab.channel', {
      url: '/channel',
      views: {
        'channel-tab': {
          templateUrl: 'template/channel.html',
          controller: 'ChannelCtrl'
        }
      }
    })
    .state('tab.live', {
      url: '/live',
      views: {
        'channel-tab': {
          templateUrl: 'template/live.html',
          controller: 'LiveCtrl'
        }
      }
    })
    .state('tab.news', {
      url: '/news',
      views: {
        'news-tab': {
          templateUrl: 'template/news.html',
          controller: 'NewsCtrl'
        }
      }
    })
    .state('tab.report', {
      url: '/news/:id',
      views: {
        'news-tab': {
          templateUrl: 'template/report.html',
          controller: 'ReportCtrl'
        }
      }
    })
    .state('tab.event', {
      url: '/event',
      views: {
        'event-tab': {
          templateUrl: 'template/event.html',
          controller: 'EventCtrl'
        }
      }
    })
    .state('tab.setting', {
      url: '/setting',
      views: {
        'setting-tab': {
          templateUrl: 'template/setting.html',
          controller: 'SettingCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/live');

})

.filter('toDateTime', function(){
  return function(str){
    var time = new Date(str);
    time.setHours(time.getHours()+8);
    return time.toISOString().replace('T',' ').replace(/\.\w+/,'');
  };
})

.filter('maxContent', function(){
  return function(str){
    var results = "";
    var length = 0;

    for (var n = 0; n < str.length; n++) {
        var charCode = str.charCodeAt(n);
        if (charCode < 128) {
            length += 1;
        } else if (charCode < 2048) {
            length += 2;
        } else if (charCode < 65536) {
            length += 3;
        } else if (charCode < 2097152) {
            length += 4;
        } else if (charCode < 67108864) {
            length += 5;
        } else {
            length += 6;
        }
        results += str[n];
        if (length > 180) {
          results += "...";
          break;
        }
    }

    return results;
  };
})

.filter('nl2br', function(){
  return function (str) {
    return str.replace(/\n/gi,"<br/>");
  }
})

.run(function($rootScope){
  $rootScope.open = function(url){
    window.open(url, '_blank');
  };
});