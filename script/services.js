angular.module('starter.services', [])

.factory('PushService', function() {
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
            alert('isDevice');
          }else{
            chrome.runtime.sendMessage({cmd: "register_token"});
          }
        }
      }, 1000);
    }
  };
})