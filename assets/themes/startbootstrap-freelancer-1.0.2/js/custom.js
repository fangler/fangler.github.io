$(function(){
  /* 对categories.html目录页导航 */
  var url = window.location.href;
  if(url.indexOf('categories.html') > -1){
    $('#categories-nav a').click(function (e){
      $(this).tab('show');
    })

    /* 自动打开链接中的锚点 */
    var matches = url.match(/categories\.html(#.*)/);
    if(matches){
      $('#categories-nav a[href="' + matches[1] + '"]').tab('show');
    }else{
      $('#categories-nav a:first').tab('show');
    }
  } 
});

/* 为md文件添加target="_blank" */
function addBlankTargetForLinks () {
  $('a[href^="http"]').each(function(){
      $(this).attr('target', '_blank');
  });
}