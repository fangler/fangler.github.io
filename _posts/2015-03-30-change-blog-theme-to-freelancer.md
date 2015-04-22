---
layout: post
author: fangler
title: "更换博客主题为Freelancer"
description: "更换博客主题"
category: "interest"
tags: [Freelancer]
---
{% include JB/setup %}

博客最开始使用的是jekyll-bootstrap默认的主题，今天在网上无意间看到了[startbootstrap-freelancer](http://ironsummitmedia.github.io/startbootstrap-freelancer/ "startbootstrap-freelancer"){:target="_blank"}，这个效果感觉还不错，反正是用bootstrap写的，博客是可以拿过来用的。

于是从它的官网，[在这里](http://startbootstrap.com/template-overviews/freelancer/ "freelancer"){:target="_blank"}下载代码。

以startbootstrap-freelancer为例，来为我们的博客添加主题：

1. 在_includes/themes增加一个主题的目录名，例如 *startbootstrap-freelancer-1.0.2*
2. 在_includes/themes/startbootstrap-freelancer-1.0.2目录中增加default.html, page.html, post.html,settings.yml, 可以themes目录下的其他主题复制过来，再做部分修改(见4)。settings.yml中的theme.name要修改为主题的名"startbootstrap-freelancer-1.0.2"
3. 在assets/themes目录下新增对应的主题名的目录*startbootstrap-freelancer-1.0.2*,并将上面下载的代码放在该目录，可以自己删除没有用到的。
4. 修改_includes/themes/startbootstrap-freelancer-1.0.2/default.html中对css、js文件的引用路径，使其对应到assets/themes/startbootstrap-freelancer-1.0.2目录

然后使用`rake theme:switch name="startbootstrap-freelancer-1.0.2"`切换主题
{% highlight sh %}
[fang@localhost fangler.github.com]$ rake theme:switch name="startbootstrap-freelancer-1.0.2"
Generating 'startbootstrap-freelancer-1.0.2' layout: default.html
Generating 'startbootstrap-freelancer-1.0.2' layout: page.html
Generating 'startbootstrap-freelancer-1.0.2' layout: post.html
=> Theme successfully switched!
=> Reload your web-page to check it out =)

{% endhighlight %}

**坑爹的是chrome浏览器中发现中文偶尔会出现乱码的**，我勒个去，完全不知道是什么情况。

**更坑爹是firefox浏览器中完全是正常的**， 彻底无语了，好吧，晚点看能不能解决。

换了这个主题以后，稍微有那么一点点感觉。不过觉得还是有很多想要修改的地方，没办法，没有正正经经的写过好看的页面，看来这是个长远的工作。就先这个用这个主题，等以后有需要了，再来调整。贵在折腾嘛。= =
