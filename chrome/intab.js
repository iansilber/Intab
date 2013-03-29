chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == 'link') {
    IntabExt.show(request.href);
  } else if (request.method == 'selection') {
    var href = IntabExt.httpProtocol + 'www.google.com/search?q=' + encodeURIComponent(request.text);
    IntabExt.show(href);
  }
});

var IntabExt = {

  httpProtocol: location.protocol === 'https://' ? 'https://' : 'http://',

  cmd: false,
  alt: false,
  open: false,
  $container: null,
  $frame: null,
  $urlForm: null,
  $urlInput: null,
  speed: 250,
  width: 0,

  init: function() {
    $("body").append('<div class="intabExt"><a href="#close" title="Close" class="intabExt-close intabExt-control"><i class="fa-icon-remove"></i></a><br /><a href="#open_full_tab" title="Open in New Tab" class="intabExt-expand intabExt-control"><i class="fa-icon-external-link"></i></a><form class="intabExt-urlForm"><input type="text" placeholder="Enter url..." /></form><iframe sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts" width="100%" height="100%" src=""></iframe></div>');
    this.$container = $('.intabExt');
    this.$frame = $('.intabExt iframe');
    this.$urlForm = $('.intabExt-urlForm');
    this.$urlInput = $('.intabExt-urlForm input');
    this.bindEvents();
  },

  bindEvents: function() {

    $("body").on("click", "a", function(event) {
      // Exclude missing/unknown protocols such as javascript:
      if (!/^(https?|file|chrome-extension|ftps?):/i.test(this.protocol)) {
        return;
      }
      if (IntabExt.cmd && IntabExt.alt || IntabExt.open) {
        IntabExt.show(this.href);
        event.stopPropagation();
        event.preventDefault();
      }
    });

    this.$urlInput.focus(function(e) {
      setTimeout(function() {
        IntabExt.$urlInput.select();
      }, 0);
    });

    $(window).keydown(function(evt) {
      if (evt.which == 27) IntabExt.close();
      if (evt.which == 91) IntabExt.cmd = true;
      if (evt.which == 18) IntabExt.alt = true;

      if (!IntabExt.open && (IntabExt.cmd && IntabExt.alt)) {
        IntabExt.peak();
      }

      if (IntabExt.cmd && IntabExt.alt) {
        var sel = IntabExt.getSelection();
        if (sel.length > 0) {
          var href = IntabExt.httpProtocol + 'www.google.com/search?q=' + encodeURIComponent(sel);
          IntabExt.show(href);
        }
      }

    }).keyup(function(evt) {
      if (evt.which == 91) IntabExt.cmd = false;
      if (evt.which == 18) IntabExt.alt = false;

      if (!IntabExt.open && (!IntabExt.cmd || !IntabExt.alt)) {
        IntabExt.close();
      }
    });

    this.$urlForm.submit(function(e) {
      e.preventDefault();
      var href = IntabExt.$urlInput.val();
      if (href === null || href.length === 0) {
        return;
      }
      if (!href.match(/^(http|https)/)) {
        href = IntabExt.httpProtocol + href;
      }
      IntabExt.show(href);
    });

    $(document).bind('keydown', 'alt+ctrl+n', function() {
      // $('.intabExt-src').show();
    });

    IntabExt.$container.draggable({
      axis: 'x',
      iframeFix: true,
      drag: function( event, ui ) {
        
        IntabExt.width = 100 - (ui.position.left / $(window).width() *100);
        if (IntabExt.width < 98 && IntabExt.width > 1) {
          IntabExt.$container.width(IntabExt.width + '%');
        } else {
          return false;
        }
        if (IntabExt.width > 10) {
          IntabExt.open = true;
        }
      },
      
      start: function () {
        IntabExt.$container.each(function (index, element) {
          var d = $('<div class="iframeCover" style="z-index:99;position:absolute;width:100%;top:0px;left:0px;height:' + $(element).height() + 'px"></div>');
          $(element).append(d);
        });
      },

      stop: function (event, ui) {
       IntabExt.$container.css('right', '0px');
       IntabExt.$container.css('left', 'auto');
       $('.iframeCover').remove();
       if (IntabExt.width < 5) {
        IntabExt.close();
       }
      }
    });

    $(".intabExt-close").on("click", function() {
      IntabExt.close();
    });

    $(".intabExt-expand").on("click", function() {
      if (window.open($(".intabExt iframe").attr('src'))) {
        // window.open() returns null if window is blocked (popup blocker?)
        intabExt.close();
      }
    });


  },

  peak: function() {
    this.$container.animate({width: "20px"});
  },

  show: function(href) {
    this.$container.show();
    this.$frame.attr('src', href);
    if (!this.open) {
      this.$container.animate({width: '40%'}, this.speed);
    }
    this.$urlInput.val(href);
    this.open = true;
  },

  close: function() {
    this.$container.animate({width: '0px', right: '0px', left: 'auto'});
    this.$frame.attr('src', '');
    this.open = false;
    this.$urlInput.val('');
  },

  getSelection: function() {
      var text = "";
      if (window.getSelection) {
          text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
      }
      return text;
  }
};


$(function() {
  IntabExt.init();
});
