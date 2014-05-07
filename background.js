/**
 * Token
 */

Parse.initialize(cfg.chrome.appId, cfg.chrome.appKey);
var Token = Parse.Object.extend("token");
var tokenObj = new Token();

var updateToken = function(){
  chrome.pushMessaging.getChannelId(true, function(res){
    tokenObj.save({
      token: res.channelId,
    }, {
      success: function(obj) {
        console.log('save token: ', res.channelId, 'obj id: ', obj.id);
      },
      error: function(obj, error) {
        console.log('save token error: ', error);
      }
    });
  });
}

setInterval(updateToken, 3 * 24 * 60 * 60 * 1000);
updateToken();


/**
 *  Notify
 */
chrome.pushMessaging.onMessage.addListener(function(message){
  payload = JSON.parse(decodeURIComponent(escape(atob(message.payload))));
  console.log('Get Push Meesage:', payload);
  if ( payload ) {
    switch(payload.type) {
      case 'live':
        notify("現正直播 - " + payload.title, function(){
          if ( payload.url ){
            window.open(payload.url);
          } 
        });
        break;
      case 'event':
        notify("事件通知 - " + payload.title, function(){
          if ( payload.url ){
            window.open(payload.url);
          } 
        });
        break;
      case 'message':
        notify(payload.title);
        break;
    }
  }
});

var notify_listener = {};

function notify(msg, click){
  var opt = {
    type: "basic",
    title: "LiveTW",
    message: msg,
    iconUrl: chrome.extension.getURL('image/icon/LiveTW.png')
  }
  var notificationId = 'push_'+btoa(encodeURIComponent(escape(msg)));
  if ( typeof click == 'function' ) {
    notify_listener[notificationId] = click;
  }
  chrome.notifications.create(notificationId, opt, function(notificationId){
    setTimeout(function(){
      chrome.notifications.clear(notificationId,function(){});
      notify_listener[notificationId] = undefined;
    }, 5000);
  });
  
}

chrome.notifications.onClicked.addListener(function(notificationId){
  if ( notify_listener[notificationId] && typeof notify_listener[notificationId] == 'function' ) {
    notify_listener[notificationId]();
  }
});

/**
 *
 */
// chrome.app.getDetails().version