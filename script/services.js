angular.module('starter.services', [])

.factory('PushService', function() {
  var storage = window.localStorage;
  return {
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
    },
    setEvent: function(val){
      storage['push_event'] = (val==false) ? false : true;
    },
    setMessage: function(val){
      console.log(val);
      storage['push_message'] = (val==false) ? false : true;
    }
  };
})