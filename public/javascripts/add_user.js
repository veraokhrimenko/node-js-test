$(document).ready(function(){
  $('.add_user').on('click', function(){ 
    var element = $(this)
    $.ajax({
      type: "POST",
      url: "add_user",
      data: {id: $(this).attr('id')},
      dataType: 'json'
    })
    .done(function( msg ) {
      if(msg.message){
        element.html(msg.message)
      } else {
        element.addClass('saved').unbind('click').html('saved')
      }
    });
  });
})
