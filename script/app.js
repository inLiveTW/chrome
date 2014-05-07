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
        'live-tab': {
          templateUrl: 'template/live.html',
          controller: 'LiveCtrl'
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

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/live');

})

.filter('toDateTime', function(){
  return function(str){
    return str.replace(/\+.*/gi, '').replace(/[^0-9:-]/gi, ' ');
  };
})

.run(function($rootScope){
  $rootScope.open = function(url){
    window.open(url, '_blank');
  };
});