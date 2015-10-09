---
layout: post
title: 使用fiddler调试http请求
description: 在android开发中，经常要与服务端打交道，有些时候我们不知道服务器的接口是不是有问题，这个时候我们很希望有一个能截获所有http请求的方法，就像chrome浏览器中F12能看到所有请求的信息，fiddler这个强大的工具就出现了。
keywords: fiddler, http
category: android
tags: [git]
---

###Fiddler调试http的利器

在android开发中，经常要与服务端打交道，有些时候我们不知道服务器的接口是不是有问题，这个时候我们很希望有一个能截获所有http请求的方法，就像chrome浏览器中F12能看到所有请求的信息，fiddler这个强大的工具就出现了。



[Fiddler](http://www.telerik.com/fiddler){:target="_blank"} : The free web debugging proxy for any browser, system or platform。

官网的这张图片已经说明的非常清楚了

![图片加载中...](http://d585tldpucybw.cloudfront.net/sfimages/default-source/productsimages/fiddler/productbanners/telerik_fiddler_headbanner3fa997dbaae845b3b13e6885a6f1d2a7.jpg?sfvrsn=4)

解释下就是：fiddler可以跟踪http请求的request和response，即所有的http request 和response都会经过fiddler。

这表示fiddler可以对http的request和response做任何操作，例如：修改request的参数/Header等，修改response返回值，返回结果等...

要使用fiddler来调试http请求很简单，只需要设置好代理即可。

####使用Fiddler来调试android手机中的http请求 
要调试手机中的http请求，需要[打开fiddler的远程调试](http://blog.csdn.net/ifangler/article/details/44102139)

设置完后一定要记得**重启一下fiddler**,**重启一下fiddler**,**重启一下fiddler**（重要的事情说3遍）

如果上面的步骤都没问题，这个时候我们就可以在fiddler的界面中看到所有经过手机上的http请求了。(*如果还没有http请求，看看`File -> Capture Traffic` 有没有选上*)

####修改http请求的Headers
上次在使用新浪云的时候访问某些图片的时候出现了`403 Forbidden`, 但是用浏览器直接访问是正常的，猜想肯定是网站做了限制，于是用fiddler来调试。

![图片加载中...](/images/fiddler-action-filter.png)

可以看到我们在`Filters`的`Request Headers`部分修改了了`refer`的值为www.baidu.com，然后点击右上角的按钮`Actions` -> `Run filtersets now`，再次访问时图片能正常访问了，我们成功的修改了请求头的refer的值。

####修改http请求的response 
在开发中需要测试多种数据，但有时候后端不一定会合作，更多的时候他们才不会给什么测试数据，但是业务复杂时，制造测试数据又变得麻烦。很显然现在的情况就是这样，不过还好，有了fiddler我们就可以很方便的制造测试数据了。

这其实是用到了上图中的`AutoResponder` 的功能，我们可以对某个或者某类url执行autoresponses,如下图
![图片加载中...](/images/fiddler-action-autoresponse.png)

我们还可以在弹出的选项中选择`Find a file ...`， 然后选择一个文件来作为response，这样就可以把自己想要的结果写在这个文件里，成功的修改了response.

当然fiddler的功能远远没有这么简单，还可以自动在request和response断点等等。
下面说明一下fiddler的一些其他的选项功能

####Fiddler的Inspectors这个用来查看http请求的request和response信息，可以用多种格式来查看

####Fiddler的Composer这个可以用来模拟http请求，当然我是用chrome浏览器的一个叫`Anvanced Rest Client`插件在调试，会更方便一下。

还有一些其他更多的功能正在学习中。