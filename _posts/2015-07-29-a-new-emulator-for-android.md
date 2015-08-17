---
layout: post
title: 微软提供的Android模拟器
description: 微软提供的新的Android模拟器，随Visual Studio 2015发布
keywords: Android模拟器，Visual Studio 2015
category: android
tags: [Android模拟器]
---
{% include JB/setup %}

上次看到新闻说是微软发布的Visual Studio 2015是怎么怎么强大的一个开发工具，包含了很多的功能。当然Visual Studio一直很强大，作为c/c++的开发工具来说，但做android开发以来，一直都是用intelij IDEA/Android Studio等开发工具。

原来Visual Studio 2015安装时发现可以选`Microsoft Visual Studio Emulator for Android`，这是Visual Studio 2015提供的一个Android模拟器，至于为什么要提供一个Android模拟器呢？这是因为Visual Studio 2015是支持用C#来做app开发的。至于它是怎么开发app的呢，咱就不扯了。咱的重点是这个Android模拟器。

这个模拟器目前好像只能在win8及win8以后的机器上安装运行，可惜我的机器是win7安装不了。

不过今天win10发布，可以下载安装了，本人好不容易赶上第一批热潮，装上了win10，体验还是很不错的。(本文最后会附上安装win10的折腾记录)

闲话太多了，还是回到Android模拟器上来。我们可以从Visual Studio 2015官网来获取[Visual Studio Emulator for Android](https://www.visualstudio.com/explore/msft-android-emulator-vs){:target="_blank"}。

安装后我们就可以看到它的界面就像下面的样子:

![图片加载中...](/images/visual-studio-emulator-for-android.png)

它上面有两个默认已经装好的模拟器，我们可以点击右边的绿色小箭头，就可以打开这个模拟器了。

一段时间后，我们就看到了这个神奇的界面。

![图片加载中...](/images/visual-studio-emulator.png)

老实说这个模拟器还真的长得有点丑，外边框太大太占空间了，又没什么用，能不能去掉呢，右边是一排操作按钮。

不管怎么样，我们还是使用下，Android Studio 不知道有米有插件支持这个模拟器。先不管，我们来用adb连接它。

首先，查看这个模拟器的ip是多少，打开`Settings`选择`Wi-Fi`点击后会显示ip信息。

然后，我们在dos窗口输入`adb connect 192.168.0.118(模拟器的ip)`，会在Android Studio中发现连接到了这个模拟器。

这样我们就可以使用这个模拟器来调试和开发了，体验了这个模拟器发现和Genymotion有这个不相上下的速度，总体感觉还是不错的，既然win10不让我用Genymotion，那我就用这个模拟器来代替了。

*附：装win10折腾记录(29日)：*

我的电脑是win7，本来以为会想传说中收到微软的更新通知，可惜等啊等啊，也没收到通知。。

最开始按照网上的办法来：打开`window更新`，更新所有补丁。这个办法据说如果补丁都安装成功，可能会收到win10的更新通知。可惜我装了好久好久最后还是没有更新到KB3035583这个补丁，网上又没有这个补丁的下载，所以第一个办法失败。

然后是使用腾讯管家来预约升级，这货说是要等到12点以后才能下载win10，于是好不容易等到12点后，然后下载3.4G左右大小(都是分成小块的压缩包)，然后安装的时候又提示`您的电脑不支持安装win10`，安装两次都是这样，我真是**了，明明它的检测又是您的电脑支持安装win10。无奈放弃。

最后使用360卫士，这货好像也可以免费升级至win10，于是下载，校验，安装，竟然都很很顺利，完成后就会重启进入win10新的安装界面，安装大概半个小时成功的进入了win10界面。我的window信息如下：

    Windows 版本
      Windows 10 专业版
      &copy; 2015 Microsoft Corporation. All rights reserved.

总结：win7安装时win10时本机安装的软件都没有丢失，好像也不需要备份。唯一有点问题是Vmware 安装的redhat虚拟机连不上网了，折腾好久都没弄好。然后就是Visual Studio Emulator for Android使用的是Hyper-V，而Vmware会与Hyper-V冲突，所以使用Vmware时需要关闭windows功能中的Hyper-V。


