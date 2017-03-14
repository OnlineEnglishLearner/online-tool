$( document ).ready(function(){
  $('.nav-pills>li').click(function(){
    $('.nav-pills>li').removeClass();
    $('.nav-pills>li').addClass('col-md-10 col-xs-10');
    $(this).removeClass();
    $(this).addClass('active');
  });
});
