$(function(){
  var handle;
  (handle = function(){
    if ( $('#event_button_bar').length && $('.livetw_event_button').length < 1 ) {
      var event_id = /\/events\/(\w+)/i.exec($('html').html());
      var from_id = /profile_pic_header_(\w+)/i.exec($('html').html());
      event_id = event_id && event_id[1];
      from_id = from_id && from_id[1];

      var bar_style = $('#event_button_bar').attr('class');
      var button_style = $('#event_button_bar a:eq(0)').attr('class');
      var bar = $('<div class="' + bar_style + '" id="livetw_event_button_bar" />');
      var button = $('<a class="livetw_event_button ' + button_style + '" role="button" href="#"><i class="fa fa-hand-o-right fa-lg"></i><spna>通知LiveTW</span></a>');
      $('head').append('<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">');
      $('#event_button_bar').after(bar.append(button));

      chrome.runtime.sendMessage({
        cmd: "get_fbevent",
        eid: event_id
      }, function (sent) {
        if (sent) {
          $('i', button).attr('class','fa fa-flag fa-lg');
          $('spna', button).text('LiveTW抄收');
        }
      });

      button.on('click', function(){
        $('i', button).attr('class','fa fa-flag fa-lg');
        $('spna', button).text('LiveTW抄收');

        chrome.runtime.sendMessage({
          cmd: "post_fbevent",
          eid: event_id,
          from: from_id
        });
      });
    }
    setTimeout( handle, 2000);
  })();

});