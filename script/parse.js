function postParse(obj_name, obj, callback) {
  var Class = Parse.Object.extend(obj_name);
  if ( device ) {
    Parse.initialize(cfg.mobile.appId, cfg.mobile.appKey);
  }else{
    Parse.initialize(cfg.chrome.appId, cfg.chrome.appKey);
  }

  var obj = new Class();
  obj.save(obj, {
    success: function(obj) {
      callback && callback(null, obj);
    },
    error: function(obj, error) {
      callback && callback(error, obj);
    }
  });
}