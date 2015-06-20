$(document).ready(function() {
  var $window = $(window);
  var $document = $(document);

  $document.on('flatdoc:ready', function() {
    $('.content ul:first').remove();
    $window.scrollTop(0);
  });

  (function($) {
    var $window = $(window);
    var $document = $(document);

     $document.on('flatdoc:ready', function() {
       $('.menu a').anchorjump();
       $.anchorjump($(location).attr('hash'))
     });

    $(function() {
      var $sidebar = $('.menubar');
      var elTop;

      $window
        .on('resize.sidestick', function() {
          $sidebar.removeClass('fixed');
          elTop = $sidebar.offset().top;
          $window.trigger('scroll.sidestick');
        })
        .on('scroll.sidestick', function() {
          var scrollY = $window.scrollTop();
          $sidebar.toggleClass('fixed', (scrollY >= elTop));
        })
        .trigger('resize.sidestick');
    });
  })(jQuery);
});

// Makes anchor jumps happen with smooth scrolling.
//
//    $("#menu a").anchorjump();
//    $("#menu a").anchorjump({ offset: -30 });
//
//    // Via delegate:
//    $("#menu").anchorjump({ for: 'a', offset: -30 });
//
// You may specify a parent. This makes it scroll down to the parent.
// Great for tabbed views.
//
//     $('#menu a').anchorjump({ parent: '.anchor' });
//
// You can jump to a given area.
//
//     $.anchorjump('#bank-deposit', options);
(function($) {
  var defaults = {
    'speed': 1000,
    'offset': 0,
    'for': null,
    'parent': null
  };

  $.fn.anchorjump = function(options) {
    options = $.extend({}, defaults, options);

    if (options['for']) {
      this.on('click', options['for'], onClick);
    } else {
      this.on('click', onClick);
    }

    function onClick(e) {
      var $a = $(e.target).closest('a');
      if (e.ctrlKey || e.metaKey || e.altKey || $a.attr('target')) return;

      e.preventDefault();
      var href = $a.attr('href');

      $.anchorjump(href, options);
    }
  };

  var current_active = null;

  // Jump to a given area.
  $.anchorjump = function(href, options) {
    options = $.extend({}, defaults, options);

    var top = 0;

    if (href != '#') {
      var $area = $(href);
      // Find the parent
      if (options.parent) {
        var $parent = $area.closest(options.parent);
        if ($parent.length) { $area = $parent; }
      }
      if (!$area.length) { return; }

      // Determine the pixel offset; use the default if not available
      var offset =
        $area.attr('data-anchor-offset') ?
        parseInt($area.attr('data-anchor-offset'), 10) :
        options.offset;

      top = Math.max(0, $area.offset().top + offset);
    }

    $('html, body').animate({ scrollTop: top }, options.speed);
    $('body').trigger('anchor', href);

    // Update active anchor
    $(current_active).removeClass('active');
    current_active = "[href=" + href + "]";
    $(current_active).addClass('active')

    // Add the location hash via pushState.
    if (window.history.pushState) {
      window.history.pushState({ href: href }, "", href);
    }
  };
})(jQuery);
