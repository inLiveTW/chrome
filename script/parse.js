Parse.initialize(cfg.mobile.appId, cfg.mobile.appKey);

function postParse(obj_name, data, callback) {
  var Class = Parse.Object.extend(obj_name);
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