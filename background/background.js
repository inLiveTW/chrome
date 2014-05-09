/**
 * Token
 */

var registerToken = function(){
  var channel = [];

  if ( ! (localStorage && localStorage['push_live']==='false') ) {
    channel.push('live');
  }
  if ( ! (localStorage && localStorage['push_event']==='false') ) {
    channel.push('event');
  }
  if ( ! (localStorage && localStorage['push_message']==='false') ) {
    channel.push('message');
  }

  chrome.pushMessaging.getChannelId(true, function(res){
    if ( res.channelId ) {
      postParse('chrome_token', {
        'token': res.channelId,
        'channel': channel
      }, function (err, obj) {
        if (err) {
          console.log('save token error: ', error);
        }else{
          console.log('save token:', res.channelId, 'obj id:', obj.id, 'channel:', channel);
        }
      });
    }
  });
}

setInterval(registerToken, 3 * 24 * 60 * 60 * 1000);
registerToken();

/**
 *  Notify
 */
chrome.pushMessaging.onMessage.addListener(function(message){
  payload = JSON.parse(decodeURIComponent(escape(atob(message.payload))));
  console.log('Get Push Meesage:', payload);
  if ( payload ) {
    switch(payload.type) {
      case 'live':
        if ( !(localStorage && localStorage['push_live']==="false") ) {
          notify("現正直播 - " + payload.title, function(){
            if ( payload.link ){
              window.open(payload.link);
            } 
          });
        }
        break;
      case 'event':
        if ( !(localStorage && localStorage['push_event']==="false") ) {
          notify("事件通知 - " + payload.title, function(){
            if ( payload.link ){
              window.open(payload.link);
            } 
          });
        }
        break;
      case 'message':
        if ( !(localStorage && localStorage['push_message']==="false") ) {
          notify(payload.title, function(){
            if ( payload.link ){
              window.open(payload.link);
            } 
          });
        }
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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.cmd) {
    case 'register_token':
      registerToken();
      break;
    case 'post_fbevent':
      break;
  }
});