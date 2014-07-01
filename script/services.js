angular.module('starter.services', [])

.factory('Source', function ($http) {
  var storage = window.localStorage;
  var cache = JSON.parse(storage['source'] || '{"data":["https://twdata.firebaseio.com/"],"channel":["https://twdata.firebaseio.com/"],"notify":["https://twdata.firebaseio.com/"],"event":["https://twevent.firebaseio.com/"],"live":["https://twlive.firebaseio.com/"],"news":["https://twnews.firebaseio.com/"]}');
  var timestamp = storage['source_updateat'] || 0;
  return {
    get: function (name, cb) {
      if ( cache[name] ) {
        this.fetch(function(){
          var index = Math.floor(Math.random() * ( cache[name].length));
          cb(null, cache[name][index] || cache['data'][0]);
        })
      }else{
        cb(null, null);
      }
    },
    fetch: function (cb) {
      if ( timestamp + ( 48 * 60 * 60 * 1000) < new Date().getTime() ) {
        this.reload(cb);
      }else{
        cb(null, cache);
      }
    },
    reload: function (cb) {
      $http({
        'method': 'GET',
        'url': 'https://spreadsheets.google.com/feeds/list/1CsX_XR87LP8zx-wbgtg6h2hWTVx7ks673crdlnGzL_A/0/public/values?v=3.0&alt=json',
        'cache': false
      })
      .success( function (data) {
          if (typeof data === 'object') {
            var temp = {};
            data = data.feed.entry;
            for (var i = 0, len = data.length; i < len; i++) {
              if (!temp[data[i].gsx$type.$t]) {
                temp[data[i].gsx$type.$t] = [];
              }
              temp[data[i].gsx$type.$t].push(data[i].gsx$uri.$t);
            };
            cache = temp;
            storage['source'] = JSON.stringify(temp);
            storage['source_updateat'] = new Date().getTime();
          }
          cb && cb(null, cache);
      })
      .error( function (data, status) {
        cb && cb(null, cache);
      });
    }
  }
})

.factory('Live', function ($http, Source) {
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
      Source.get( 'live', function(err, url) {
        $http({
          'method': 'GET',
          'url': url + 'live.json',
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

.factory('Channel', function ($http, Source) {
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
      Source.get( 'channel', function(err, url) {
        $http({
          'method': 'GET',
          'url': url + 'channel.json',
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
      });
    },
    like: function (vuid) {

    }
  }
})

.factory('Event', function ($http, Source) {
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
      cache = {
        '精選': []
      };
      Source.get( 'event', function(err, url) {
        $http({
          'method': 'GET',
          'url': url + 'event.json',
          'cache': false
        })
        .success( function (data) {
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
          for (var i = 0, len = temp.length; i < len; i++) {
            if ( /^!/.exec(temp[i].title) ) {
              cache['精選'].push(temp[i]);
            }

            var group = /\[([^\]]+)\]/.exec(temp[i].title);
            var group = group ? group[1] : '其他';
            temp[i].title = temp[i].title.replace(/!?\[[^\]]+\]/, '');
            if ( !cache[group] ) {
              cache[group] = [];
            }
            cache[group].push(temp[i]);
          };
          cb && cb(null, cache);
        })
        .error( function (data, status) {
          cb && cb(status || true, cache);
        });
      });
    }
  }
})

.factory('News', function ($http, Source) {
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
      Source.get( 'news', function(err, url) {
        $http({
          'method': 'GET',
          'url': url + 'news.json',
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
      });
    }
  }
})

.factory('User', function () {
  return {
    login: function (username, password, cb) {
      Parse.User.logIn(username, password, {
        success: function(user) {
          console.log(user);
          cb && cb(true, user);
        },
        error: function(user, error) {
          if ( error && error.code=='101' ) {
            cb && cb(false);
          } else {
            cb && cb();
          }
        }
      });
    },
    current: function (cb) {
      cb && cb(Parse.User.current());
    },
    logout: function () {
      Parse.User.logOut();
    }
  }
})

.factory('Push', function (User) {
  return {
    send: function (req, cb) {
      User.current(function (user) {
        if (user) {
          postParse('push', {
            'type': req.type || 'reporter',
            'name': user.get('name'),
            'message': req.message,
            'link': req.link,
            'start': new Date(),
          }, function (err) {
            cb && cb(err);
          });
        }else{
          cb && cb(true);
        }
      });
    }
  }
})

.factory('Notify', function ($http, Source) {
  var storage = window.localStorage;
  var updateTimer;
  var first = true;
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
      Source.get( 'notify', function(err, url) {
        $http({
          'method': 'GET',
          'url': url + 'notify.json',
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
      });
    },
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
    getCongress: function(){
      return storage['push_congress']==="false" ? false : true;
    },
    getDirected: function(){
      return storage['push_directed']==="true" ? true : false;
    },
    setLive: function(val){
      storage['push_live'] = (val==false) ? false : true;
      this.updateToServer();
    },
    setEvent: function(val){
      storage['push_event'] = (val==false) ? false : true;
      this.updateToServer();
    },
    setMessage: function(val){
      storage['push_message'] = (val==false) ? false : true;
      this.updateToServer();
    },
    setReporter: function(val){
      storage['push_reporter'] = (val==false) ? false : true;
      this.updateToServer();
    },
    setCongress: function(val){
      storage['push_congress'] = (val==false) ? false : true;
      this.updateToServer();
    },
    setDirected: function(val){
      storage['push_directed'] = (val==true) ? true : false;
      this.updateToServer();
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
          if ( typeof cordova === "undefined" ) {
            chrome.runtime.sendMessage({cmd: "register_token"});
          }else{
            registerToken();
          }
        }
      }, 1000);
    }
  };
})