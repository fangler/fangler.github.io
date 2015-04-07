---
layout: post
author: fangler
title: "博客的诞生"
description: "使用jekyll + bootstrap 搭建博客"
category: "Interest"
tags: [搭建博客]
---
{% include JB/setup %}

一直想用github来搭建一个博客来学习下的。正好现在在家有时间，于是来折腾下。简单的框架已经完成，后续还会继续完善。整个搭建的过程记录一下。

环境使用的是ubuntu 14.04， 使用的是[jekyllbootstrap](http://jekyllbootstrap.com/ "jekyllbootstrap"){:target="_blank"}主题。

####1. 环境准备####

**安装开发环境** ， 由于ubuntu没有安装开发环境，所以需要先安装 `sudo apt-get install build-essential` .

**安装git** ， `sudo apt-get install git` ，我安装的版本是 git version 1.9.1

**安装ruby** ，`sudo apt-get install ruby`
{% highlight sh %}
fangler@fangler-VirtualBox:~$ ruby -v
ruby 1.9.3p484 (2013-11-22 revision 43786) [x86_64-linux]
fangler@fangler-VirtualBox:~$ gem -v
1.8.23
{% endhighlight %}

**安装jekyll** ，`gem install jekyll`，安装的版本是 jekyll 0.11.2 ，如果是高版本的话命令可能后面有些地方会不一样。

####2. 搭建jekyllbootstrap主题####
**下载jekyll-bootstrap** ，`git clone https://github.com/plusjade/jekyll-bootstrap.git fangler.github.com`

下载完成后就可以看到jekyllbootstrap的效果 ，在 fangler.github.com 目录下执行`jekyll --server `(如果是jekyll高版本，命令
变成`jekyll serve`).

默认的jekyll-bootstrap使用disqus评论系统，在国内使用多说评论的还比较多，于是我也改成多说评论了。

多说评论的js如下(*需要把对应的short_name 换成你自己在多说上注册的name*):

{% highlight html %}
<!-- duoshuo comment begin -->
<script type="text/javascript">
var duoshuoQuery = {short_name:"fangler"};
	(function() {
		var ds = document.createElement('script');
		ds.type = 'text/javascript';ds.async = true;
		ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
		ds.charset = 'UTF-8';
		(document.getElementsByTagName('head')[0] 
		 || document.getElementsByTagName('body')[0]).appendChild(ds);
	})();
	</script>
<!-- duoshuo comment end -->
{% endhighlight %}

还可以使用pygments来做代码高亮，`sudo apt-get install python-pygments`.

在assets/themes/bootstrap-3/css目录下使用`pygmentize -f html -S default > pygments.css` 生成pygments.css文件， -S default 表示使用默认主题，pygmentize还有其他样式可以选择。

PS: 你可以这么查看pygments里面的样式
{% highlight python %}
>>>from pygments.styles import STYLE_MAP
>>>STYLE_MAP.keys()
{% endhighlight %}

在_includes/themes/bootstrap-3/default.html文件中加入
{% highlight html %}
<!-- Pygments styles -->
<link href="{{ ASSET_PATH }}/css/pygments.css" rel="stylesheet">
{% endhighlight %}

这样基本的blog框架已经搭好了，默认的jekyll-bootstrap也不怎么好看。后续可以自己写一些模板页面来美化 = =

####3. 遇到的问题####

* 安装开发环境出现的问题

*Q*: The headers for the current running kernel were not found. If the following
module compilation fails then this could be the reason.?

*A*: `sudo ln -s /lib/modules/3.16.0-30-generic/build/include/generated/uapi/linux/version.h /lib/modules/3.16.0-30-generic/build/include/linux/version.h`

* 页面的问题

*Q*: 访问过程是发现请求很慢，其中有请求google的jquey，这个太慢了，于是把jquery下载到本地

*A*: 修改_includes/themes/bootstrap-3/default.html中的内容
{% highlight html %}
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
改为
<script src="{{ ASSET_PATH }}/bootstrap/js/jquery-1.11.2.min.js"></script>
{% endhighlight %}
速度就快了很多。
