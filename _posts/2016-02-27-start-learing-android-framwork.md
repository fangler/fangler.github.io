---
layout: post
title: 学习Android framwork 开发
description: Android framwork层开发
keywords: Android, framwork
category: android
tags: [framwork]
---

有段时间没写点啥了，最近这两个月变化还是挺大的，值得记录一下。

2016年开始了新的工作，现在开始了做framwork的开发。（1月中旬跳槽的，2天内入职，感觉很刺激）

由于之前完全没接触过framwork的开发，之前在面试的时候被问到framwork的东西的时候也是答不出来，在新的工作中算是从零开始。在加上没有完全在ubuntu下工作过的经历，虽然对Linux命令还比较熟悉，也比较喜欢Linux，这样的环境还是需要一段时间来适应。

现在的开发方式和AOSP的开发方式一致，需要使用repo + git + gerrit。

- repo : 这是google基于python在git上封装的一个小工具，用来管理多个git代码仓库
- git : 强大的代码管理工具
- gerrit : 这是基于网页的代码review工具。

所以现在的开发方式是：使用repo下载代码，git来编辑提交，gerrit来做代码审核，审核通过后再提交到代码服务器。
而提交的commit message必须严格按照公司的提交格式。

有点悲伤的是Ubuntu上工具还是没有Window下多，之前很多在Window下使用熟练的工具没法用，现在也没有能发挥工作机的全部性能。

还好Android Studio 和Atom(github推出的文本编辑器)等工具是跨平台的，所以在Ubuntu下都能使用。  
使用下面的方法来将AOSP工程生成Android Studio的项目，这样又可以用它来开发Android了。

{% highlight sh %}
$ source build/envsetup.sh
$ lunch aosp_x86-eng #(or pick your favorite lunch target)    
$ make
$ mmm development/tools/idegen/
$ ./development/tools/idegen/idegen.sh
{% endhighlight %}

这样会在AOSP目录生成Android.ipr的文件，用Android Studio打开它，然后等它indexing...，整个indexing过程可能需要超过30分钟，然后就发现整个AOSP工程导入进来了。

现在还是在不停的学习和融入公司的工作流程等，虽然离开了安卓应用开发进入一个陌生的领域，开始慢慢熟悉framwork开发后，还是有很多东西可以学习的。

最近半年打算专注在framwork开发上，可能写博客的机会不多，有些需要记录下来的笔记会优先写在evernote上，等有机会再慢慢搬到博客上来。=。=
