var pushNotification;
var deviceRegisterToken;

document.addEventListener("deviceready", onDeviceReady, false);

function registerToken(){
  if ( !deviceRegisterToken ) {
    return;
  }

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

  postParse('mobile_token', {
    'type': device.platform.toLowerCase(),
    'uuid': device.uuid,
    'token': deviceRegisterToken,
    'channel': channel,
    'device': {
      'name': device.name,
      'version': device.version,
      'model': device.model
    }
  }, function (err, obj) {
    if (err) {
      console.log('save token error: ', error);
    }else{
      console.log('save token:', deviceRegisterToken, 'obj id:', obj.id, 'channel:', channel);
    }
  });
}

function onDeviceReady(){
  try{
    pushNotification = window.plugins.pushNotification;

    if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "Amazon" || device.platform == "amazon")
    {
        pushNotification.register(
            successHandler,
            errorHandler, {
                "senderID": cfg.mobile.androidId,
                "ecb":"onNotificationGCM"
            });
    }
    else
    {
        pushNotification.register(
            tokenHandler,
            errorHandler, {
                "badge":"true",
                "sound":"true",
                "alert":"true",
                "ecb":"onNotificationAPN"
            });
    }
    
    function successHandler (result) {
    }
    function tokenHandler (result) {
      deviceRegisterToken = result;
      registerToken();
    }
    function errorHandler (error) {
      console.log('error = ' + error);
    }
  }catch(e){
    console.log(e.message);
  }
}

// iOS
function onNotificationAPN (event) {
  if ( event.alert )
  {
    navigator.notification.alert(event.alert);
  }

  if ( event.sound )
  {
    var snd = new Media(event.sound);
    snd.play();
  }

  if ( event.badge )
  {
    pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
  }
}

// Android
function onNotificationGCM(e) {
  switch( e.event )
  {
    case 'registered':
      if ( e.regid.length > 0 )
      {
        deviceRegisterToken = e.regid;
        registerToken();
      }
    break;

    case 'message':
      alert(e.payload.title + "\n" + e.payload.message);
      if( e.payload.link ) {
        var stream = (/youtube\.com/gi.exec(e.payload.link) || /ustream\.tv/gi.exec(e.payload.link)) ? true : false ;
        if ( stream && cordova.plugins && cordova.plugins.streamPlayer ) {
          cordova.plugins.streamPlayer.play(e.payload.link);
        }else{
          window.open(e.payload.link, '_blank');
        }
      }
    break;

    case 'error':
      alert(e.msg);
    break;
  }
}