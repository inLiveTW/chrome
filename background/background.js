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
  if ( ! (localStorage && localStorage['push_reporter']==='false') ) {
    channel.push('reporter');
  }
  if ( ! (localStorage && localStorage['push_congress']==='false') ) {
    channel.push('congress');
  }
  if ( (localStorage && localStorage['push_directed']==='true') ) {
    channel.push('directed');
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
          notify(payload.title, payload.message, payload.link);
        }
        break;
      case 'event':
        if ( !(localStorage && localStorage['push_event']==="false") ) {
          notify(payload.title, payload.message, payload.link);
        }
        break;
      case 'message':
        if ( !(localStorage && localStorage['push_message']==="false") ) {
          notify(payload.title, payload.message, payload.link);
        }
        break;
      case 'reporter':
        if ( !(localStorage && localStorage['push_reporter']==="false") ) {
          notify(payload.title, payload.message, payload.link);
        }
        break;
      case 'push_congress':
        if ( !(localStorage && localStorage['push_congress']==="false") ) {
          notify(payload.title, payload.message, payload.link);
        }
        break;
      case 'directed':
        if ( (localStorage && localStorage['push_directed']==="true") ) {
          notify(payload.title, payload.message, payload.link);
        }
        break;
      case 'open':
        var count = parseInt(localStorage && localStorage['push_open'] || 0, 10);
        count += parseInt(payload.count, 10);
        localStorage['push_open'] = count;
        chrome.browserAction.setBadgeText({text: count > 10 ? '10+' : count + ''});
        break;
    }
  }
});

var notify_listener = {};

function notify(title, msg, link){
  if (window.Notification) {
    var notification = new window.Notification('' + title,{body:'' + msg, icon: chrome.extension.getURL('image/icon/LiveTW128.png')});
  }else{
    var notification = window.webkitNotifications.createNotification(
      chrome.extension.getURL('image/icon/LiveTW128.png'),
      '' + title,
      '' + msg
    );
  }
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