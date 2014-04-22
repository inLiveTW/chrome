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
          templateUrl: 'template/channel.html'
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

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/live');

});