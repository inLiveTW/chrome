angular.module('starter.services', [])

.factory('Live', function ($http) {
  var cache = null;
  var storage = window.localStorage;
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
          var location = JSON.parse(storage['location'] || "{}");
          var new_location = {};
          if (typeof data === 'object') {
            for (key in data) {
              if (location[data[key]['vuid']]) {
                data[key]['location'] = location[data[key]['vuid']];
                new_location[data[key]['vuid']] = location[data[key]['vuid']];
              }
              cache.push(data[key]);
            }
            storage['location'] = JSON.stringify(new_location);
          }
          cb && cb(null, cache);
      })
      .error( function (data, status) {
        cb && cb(status || true, cache);
      });
    },
    setLocation: function (vuid, location) {
      var data = JSON.parse(storage['location'] || "{}");
      if (data[vuid] != location) {
        postParse('live_location', {
          'vuid': vuid,
          'location': location
        }, function (err, obj) {
          if (err) {
            console.log('save token error: ', error);
          }else{
            console.log('save '+vuid+':', location, 'obj id:', obj.id);
          }
        });
      }
      data[vuid] = location;
      storage['location'] = JSON.stringify(data);
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
        'url': 'https://livelink.firebaseio.com/channel/.json',
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

.factory('Event', function ($http) {
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
        'url': 'https://livelink.firebaseio.com/event/.json',
        'cache': false
      })
      .success( function (data) {
        if (typeof data === 'object') {
          for (key in data) {
            data[key].sortKey = new Date(data[key].start).getTime();
            cache.push(data[key]);
          }
        }
        cache.sort(function(x,y){
          return x.sortKey > y.sortKey ? 1 : -1;
        });
        cb && cb(null, cache);
      })
      .error( function (data, status) {
        cb && cb(status || true, cache);
      });
    }
  }
})

.factory('News', function ($http) {
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
        'url': 'https://livelink.firebaseio.com/news/.json',
        'cache': false
      })
      .success( function (data) {
        if (typeof data === 'object') {
          cache = data;
        }
        cb && cb(null, cache);
      })
      .error( function (data, status) {
        cb && cb(status || true, cache);
      });
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
    getReporter: function(){
      return storage['push_reporter']==="false" ? false : true;
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
    setMessage: function(val){
      storage['push_reporter'] = (val==false) ? false : true;
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
          if ( typeof device !== 'undefined' ) {
            registerToken();
          }else{
            chrome.runtime.sendMessage({cmd: "register_token"});
          }
        }
      }, 1000);
    }
  };
})