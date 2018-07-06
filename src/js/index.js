$(document).ready(function() {
  
  $(".dropdown-menu li a").click(function(e){
    e.preventDefault();
    console.log('fj');
    var selText = $(this).text();

    $(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
  });

  $(".dropdown-menu li a.selected").trigger("click");

});