$(function(){
  var event_id = /\/events\/(\w+)/i.exec($('html').html());
  event_id = event_id && event_id[1];

  var bar_style = $('#event_button_bar').attr('class');
  var button_style = $('#event_button_bar a:eq(0)').attr('class');
  var bar = $('<div class="' + bar_style + '" id="livetw_event_button_bar" />');
  var button = $('<a class="livetw_event_button ' + button_style + '" role="button" href="#"><i class="fa fa-hand-o-right fa-lg"></i><spna>通知LiveTW</span></a>');
  $('head').append('<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">');
  $('#event_button_bar').after(bar.append(button));
  button.on('click', function(){
    $('i', button).attr('class','fa fa-flag fa-lg');
    $('spna', button).text('LiveTW抄收');

    Parse.initialize(cfg.chrome.appId, cfg.chrome.appKey);
    var Fbevent = Parse.Object.extend("fbevent");
    var fbeventObj = new Fbevent();

    fbeventObj.save({
      event_id: event_id,
    }, {
      success: function(obj) {
        console.log('save event_id: ', event_id);
      },
      error: function(obj, error) {
        console.log('save event error: ', error);
      }
    });
  });
});