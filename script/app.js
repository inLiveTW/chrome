// Ionic Starter App

angular.module('starter', ['ionic', 'starter.services', 'starter.controllers'])


.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('channel', {
      url: '/channel',
      templateUrl: 'template/channel.html',
      controller: 'ChannelCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/channel');

});