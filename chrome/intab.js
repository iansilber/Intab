var IntabExt = {

  cmd: false,
  alt: false,
  open: false,
  $container: null,
  $frame: null,

  init: function() {
    $("body").append('<div class="intabExt"><a href="#close" class="intabExt-close intabExt-control"><i class="fa-icon-remove"></i></a><br /><a href="#open_full_tab" class="intabExt-expand intabExt-control"><i class="fa-icon-external-link"></i></a><iframe width="100%" height="100%" src=""></iframe></div>');
    this.$container = $('.intabExt');
    this.$frame = $('.intabExt iframe');
    this.bindEvents();
  },

  bindEvents: function() {

    $("body").on("click", "a", function(event) {
      var href = $(this).attr('href');
      if (href.indexOf("http://")==0 && href.indexOf("https://")==0) {
        return;
      }
      if (IntabExt.cmd && IntabExt.alt || IntabExt.open) {
        IntabExt.show(href);
        event.stopPropagation();
        return false;
      }
    });

    $(window).keydown(function(evt) {
      if (evt.which == 27) IntabExt.close();
      if (evt.which == 91) IntabExt.cmd = true;
      if (evt.which == 18) IntabExt.alt = true;

      if (!IntabExt.open && (IntabExt.cmd && IntabExt.alt)) {
        IntabExt.peak();
      }
    }).keyup(function(evt) {
      if (evt.which == 91) IntabExt.cmd = false;
      if (evt.which == 18) IntabExt.alt = false;

      if (!IntabExt.open && (!IntabExt.cmd || !IntabExt.alt)) {
        IntabExt.close();
      }
    });

    $(document).bind('keydown', 'alt+ctrl+n', function() {
      var href = prompt('Enter a URL:');
      if (href === null || href.length == 0) {
        return;
      }
      if (!href.match(/^http|https/)) {
        href = 'http://' + href;
      }
      IntabExt.show(href);
    });

    IntabExt.$container.draggable({
      axis: 'x',
      iframeFix: true,
      drag: function( event, ui ) {
        
        var width = 100 - (ui.position.left / $(window).width() *100);
        if (width < 98 && width > 1) {
          IntabExt.$container.width(width + '%');
        } else {
          return false;
        }
      },
      
      start: function () {
          IntabExt.$container.each(function (index, element) {
          var d = $('<div class="iframeCover" style="z-index:99;position:absolute;width:100%;top:0px;left:0px;height:' + $(element).height() + 'px"></div>');
          $(element).append(d);});
      },

      stop: function (event, ui) {
       IntabExt.$container.css('right', '0px');
       IntabExt.$container.css('left', 'auto');
       $('.iframeCover').remove();
      }
    });

    $(".intabExt-close").on("click", function() {
      IntabExt.close();
    });

    $(".intabExt-expand").on("click", function() {
      window.open($(".intabExt iframe").attr('src'));
      intabExt.close();
    })


  },

  peak: function() {
    this.$container.animate({width: "20px"});
  },

  show: function(href) {
    this.$container.show();
    this.$frame.attr('src', href);
    if (!this.open) {
      this.$container.animate({width: '40%'});
    }
    this.open = true;
  },

  close: function() {
    this.$container.animate({width: '0px', right: '0px', left: 'auto'});
    this.$frame.attr('src', '');
    this.open = false;
  }
}


$(function() {IntabExt.init()});