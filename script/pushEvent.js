var pushNotification;
document.addEventListener("deviceready", onDeviceReady, false);

function registerToken(token){
    // {
    //     'type': device.platform.toLowerCase(),
    //     'token': token,
    //     'channel': []
    // }

}

function onDeviceReady(){
  try{
    pushNotification = window.plugins.pushNotification;

    if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "Amazon" || device.platform == "amazon")
    {
        pushNotification.register(
            successHandler,
            errorHandler, {
                "senderID":"345348025785",
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
        alert('result = ' + result);
    }

    function tokenHandler (result) {
        alert('device token = ' + result);
    }

    function errorHandler (error) {
        alert('error = ' + error);
    }
  }catch(e){
    alert(e.message);
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
            alert("regID = " + e.regid);
        }
    break;

    case 'message':
      alert(e.payload);
    break;

    case 'error':
      alert(e.msg);
    break;
  }
}