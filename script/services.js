angular.module('starter.services', [])

.factory('Live', function ($http) {
  var cache = null;
  return {
    fetch: function (cb) {
      if ( cache !== null ) {
        cb && cb(null, cache);
      }else{
        this.reload(cb);
      }
    },
    reload: function (cb) {
      cache = [];
      $http({
        'method': 'GET',
        'url': 'https://livelink.firebaseio.com/live/.json',
        'cache': false
      })
      .success( function (data) {
          if (typeof data === 'object') {
            for (key in data) {
              cache.push(data[key]);
            }
          }
          cb && cb(null, cache);
      })
      .error( function (data, status) {
        cb && cb(status || true, cache);
      });
    },
    setLocation: function (location) {

    }
  }
})

.factory('Channel', function ($http) {
  var cache = null;
  return {
    fetch: function (cb) {
      if ( cache !== null ) {
        cb && cb(null, cache);
      }else{
        this.reload(cb);
      }
    },
    reload: function (cb) {
      cache = [];
      $http({
        'method': 'GET',
        'url': 'https://g0v.github.io/liveext/channel.json',
        'cache': false
      })
      .success( function (data) {
        if (typeof data === 'object') {
          for (key in data) {
            cache.push(data[key]);
          }
        }
        cb && cb(null, cache);
      })
      .error( function (data, status) {
        cb && cb(status || true, cache);
      });
    },
    like: function (vuid) {

    }
  }
})

.factory('Event', function () {
  return {
    setLocation: function (location) {

    },
    like: function (vuid) {

    }
  }
})

.factory('PushService', function () {
  var storage = window.localStorage;
  var pushSync;
  var updateTimer;
  var first = true;
  return pushSync = {
    getLive: function(){
      return storage['push_live']==="false" ? false : true;
    },
    getEvent: function(){
      return storage['push_event']==="false" ? false : true;
    },
    getMessage: function(){
      return storage['push_message']==="false" ? false : true;
    },
    setLive: function(val){
      storage['push_live'] = (val==false) ? false : true;
      pushSync.updateToServer();
    },
    setEvent: function(val){
      storage['push_event'] = (val==false) ? false : true;
      pushSync.updateToServer();
    },
    setMessage: function(val){
      storage['push_message'] = (val==false) ? false : true;
      pushSync.updateToServer();
    },
    updateToServer: function()
    {
      if ( updateTimer ) {
        clearTimeout(updateTimer);
      }
      updateTimer = setTimeout(function(){
        updateTimer = null;
        if ( first ) {
          first = false;
        }else{
          if ( device ) {
            registerToken();
          }else{
            chrome.runtime.sendMessage({cmd: "register_token"});
          }
        }
      }, 1000);
    }
  };
})