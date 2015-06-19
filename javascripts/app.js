$(document).ready(function(){
  var $window = $(window);
  var $document = $(document);

  $document.on('flatdoc:ready', function(){
    $('.content ul:first').remove();
  });
});
