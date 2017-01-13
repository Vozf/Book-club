$(function(){
  $("i").on('click',function(){
      function reload(){
        location.reload(true);
      }
      var obj=$(this);
      var titl={
          title:obj.attr("id")
      };
      console.log("check")
      if(obj.hasClass("init"))
        $.post("/",titl,reload);
      else if(obj.hasClass("selfDec"))
        $.ajax({url: '/',type: 'DELETE',data: titl,success:reload});
      else if(obj.hasClass("acc"))
       $.post('/api/trade',titl,reload);
      else if(obj.hasClass("dec"))
      $.ajax({url: '/api/trade',type: 'DELETE',data: titl,success:reload});
    return false;
  })
})
$(function(){
  $("i").on('click',function(){
    
    return false;
  })
  $("#inbut").on('click',function(){
    $("#outli").css("display","none");
     $("#inli").css("display","block");
    return false;
  })
    $("#outbut").on('click',function(){
      $("#inli").css("display","none"); 
    $("#outli").css("display","block");
     
    return false;
  })
})