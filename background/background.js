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
          notify("『現正直播』 - " + payload.title, payload.message, payload.link);
        }
        break;
      case 'event':
        if ( !(localStorage && localStorage['push_event']==="false") ) {
          notify("『事件通知』 - " + payload.title, payload.message, payload.link);
        }
        break;
      case 'message':
        if ( !(localStorage && localStorage['push_message']==="false") ) {
          notify("『即時訊息』 - " + payload.title, payload.message, payload.link);
        }
        break;
      case 'reporter':
        if ( !(localStorage && localStorage['push_reporter']==="false") ) {
          notify("『公民記者』 - " + payload.title, payload.message, payload.link);
        }
        break;
    }
  }
});

var notify_listener = {};

function notify(title, msg, link){
  var notification = window.webkitNotifications.createNotification(
    chrome.extension.getURL('image/icon/LiveTW128.png'),
    '' + title,
    '' + msg
  );
  notification.onclick = function(){
    if ( link ) {
      window.open(link);
    }
  };
  notification.show();
}

/**
 *
 */
// chrome.app.getDetails().version

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var storage = window.localStorage;
  switch (request.cmd) {
    case 'register_token':
      registerToken();
      break;
    case 'post_fbevent':
      var events = JSON.parse(storage['fbevent'] || "{}");
      var eid = request.eid;
      if ( eid && !events[eid] ){
        events[eid] = 1;
        storage['fbevent'] = JSON.stringify(events);
        postParse('fbevent', {
          'eid': request.eid,
          'from': request.from
        })
      }
      break;
    case 'get_fbevent':
      var events = JSON.parse(storage['fbevent'] || "{}");
      sendResponse(request.eid && events[request.eid] ? true : false);
      break;
  }
});