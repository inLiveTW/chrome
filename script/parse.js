function postParse(obj_name, data, callback) {
  var Class = Parse.Object.extend(obj_name);
  if ( typeof device === 'undefined' ) {
    Parse.initialize(cfg.chrome.appId, cfg.chrome.appKey);
  }else{
    Parse.initialize(cfg.mobile.appId, cfg.mobile.appKey);
  }

  var obj = new Class();
  obj.save(data, {
    success: function(obj) {
      callback && callback(null, obj);
    },
    error: function(obj, error) {
      callback && callback(error, obj);
    }
  });
}