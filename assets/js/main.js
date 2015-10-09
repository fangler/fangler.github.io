
/*!--------------------------------*\
   3-Ghost Theme
   @author Peiwen Lu (P233)
   https://github.com/P233/3-Ghost

   @modified by fangler 2014-09-13
\*---------------------------------*/

// Detect window size, if less than 1280px add class 'mobile' to sidebar therefore it will be auto hide when trigger the pjax request in small screen devices.
if ($(window).width() <= 1280) {
  $('#sidebar').addClass('mobile')
}

// Variables
var toc_link   = $('.toc-link'),
    sidebar    = $('#sidebar'),
    container  = $('#main_content'),
    content    = $('#pjax'),
    button     = $('#menu_fullscreen_btn');

// Tags Filter
$('#sidebar-tags').on('click', 'li', function() {
  var filter = $(this).data('filter');
  if (filter === 'all') {
    toc_link.fadeIn(300);
  } else {
    toc_link.fadeOut(10);
    $('.toc-link[data-tags~=' + filter + ']').fadeIn(300);
  }
  $(this).addClass('active').siblings().removeClass('active');
});

// If sidebar has class 'mobile', hide it after clicking.
toc_link.on('click', function() {
  $(this).addClass('active').siblings().removeClass('active');
  if (sidebar.hasClass('mobile') || !button.hasClass('fullscreen')) {
    goto_fullscreen();
  }
});

// Enable fullscreen.
$('#menu_fullscreen').on('click', function() {
  if (button.hasClass('fullscreen')) {
    goto_normal();
  } else {
    goto_fullscreen();
  }
});

// Pjax
$(document).pjax('#avatar, .toc-link', '#pjax', { fragment: '#pjax', timeout: 10000 });
$(document).on({
  'pjax:click': function() {
    content.fadeOut(200);
    $.AMUI.progress.start();
  },
  'pjax:start': function() {
  },
  'pjax:end': function() {
    $.AMUI.progress.done();
    container.scrollTop(0);
    content.fadeIn(300);

    afterPjax();
  }
});


//初始化为全屏
 if (!button.hasClass('fullscreen')) {
   button.addClass('fullscreen');
 }
 if (!sidebar.hasClass('fullscreen')) {
   sidebar.addClass('fullscreen');
 }
 if (!content.hasClass('fullscreen')) {
   content.addClass('fullscreen');
 }


// Re-run scripts for post content after pjax
function afterPjax() {
  // Open links in new tab
  $('#post-content a').attr('target','_blank');

  // Generate post TOC for h1 h2 and h3
  var toc = $('#post-content-tabs ul');
  // Empty TOC and generate an entry for h1
  toc.empty().append('<li class="post-content-tab-h1"><a href="#post-title">' + $('#post-title').text() + '</a></li>');

  // Generate entries for h2 and h3
    $('#post-content').children('h2, h3').each(function () {
      // Generate random ID for each heading
      $(this).attr('id', function () {
        var ID = "",
            alphabet = "abcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 5; i++) {
          ID += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        return ID;
      });

      if ($(this).prop("tagName") == 'H2') {
        toc.append('<li class="post-content-tab-h2"><a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a></li>');
      } else {
        toc.append('<li class="post-content-tab-h3"><a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a></li>');
      }
    });

    // Smooth scrolling
    $('.post-content-tab-h1, .post-content-tab-h2 .post-content-tab-h3').on('click', function () {
      var target = $(this.hash);
      container.animate({scrollTop: target.offset().top + container.scrollTop() - 70}, 500, function () {
        target.addClass('flash').delay(700).queue(function () {
          $(this).removeClass('flash').dequeue();
        });
      });
    });

  pjax_loadDuodsuo();
  goto_fullscreen();

}afterPjax();

function goto_fullscreen(){
  sidebar.addClass('fullscreen');
  button.addClass('fullscreen');
  content.delay(100).queue(function(){
    $(this).addClass('fullscreen').dequeue();
  });
  //小屏时不进行显示右侧章节列表
  if($(window).width() > 500){
    $("#post-content-tabs").removeClass("trigger_unhover");
    $("#post-content-tabs").addClass("trigger_hover")
  }
}

function goto_normal(){
  sidebar.removeClass('fullscreen');
  button.removeClass('fullscreen');
  content.delay(100).queue(function(){
    $(this).removeClass('fullscreen').dequeue();
  });
  $("#post-content-tabs").removeClass("trigger_hover");
  $("#post-content-tabs").addClass("trigger_unhover")
}


/**
 * pjax后需要回调函数.加载多说
 */
function pjax_loadDuodsuo(){
  var dus=$(".ds-thread");
  if($(dus).length==1){
    var el = document.createElement('div');
    el.setAttribute('data-thread-key',$(dus).attr("data-thread-key"));//必选参数
    el.setAttribute('data-url',$(dus).attr("data-url"));
    try {
      DUOSHUO.EmbedThread(el);
    } catch (e) {
    }
    $(dus).html(el);
  }
}