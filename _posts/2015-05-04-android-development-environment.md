---
layout: post
title: android开发环境之选择Android Studio
description: android开发环境选择，使用Eclipse、Intelij IDEA和Android Studio 等的比较和评价
keywords: android, Eclipse, Intelij IDEA,Android Studio
category: android
tags: [android]
---
{% include JB/setup %}

记录一下现在的android开发环境：

1. 系统环境： Windows 7 旗舰版 ，8.00G 内存，128G 固态硬盘
2. IDE ：Android Studio 1.1.0
3. android模拟器[Genymotion](https://www.genymotion.com){:target="_blank"}
4. 其他工具：jdk 1.7, gradle 2.2.1(Android Studio自带)
5. 文本编辑器：notepad++ 、[Sublime Text](http://www.sublimetext.com){:target="_blank"}等

对android开发IDE的使用评价：

Eclipse：android开发时使用不到一周就放弃，老实说以前用来Python开发到是感觉还可以，但是在开发android上没有好的感觉于是放弃。

IntelliJ IDEA：android开发时使用了两年，感觉比Eclipse用着舒服。配合Genymotion模拟器，开发非常舒服方便。(期间有使用android studio(1.0版本以下)，不太文件，还是放弃)

Android Studio 1.1.0：使用有3个月左右，老实说这个东西和Intelij IDEA界面基本一致，最初用的时候除了卡还是卡，原因是Android Studio 1.1.0默认采用gradle来编译，所以在打开的时候会去拼命的下载一些库等等。*(我的感觉是gradle把Android Studio拖慢了，拖卡了)*

补充：在这里有情解决一下Android Studio首次安装运行时卡在更新处理方法？

解决：在Android Studio安装目录下的 bin 目录下，找到 idea.properties 文件，在文件最后追加disable.android.first.run=true 。再次进入就直接进去了。然后在Settings页面设置(翻墙)代理，然后把idea.properties 文件改回来，重启Android Studio下载依赖文件。

由于Android Studio使用Gradle构建，当打开其他的Gradle android项目的时候会去下载相应的依赖库，我这边下载support库相对较多，而且容易失败，所以会觉得Android Studio相当的卡。还在如果依赖库都下载完后使用还是挺方便的。

**以下内容可能引起不适**

- Android Studio 的一些不足之处：

打开项目卡、占内存确实都存在。以前用IntelliJ IDEA打开两三个项目感觉还好，没有特别卡。而现在Android Studio打开两个项目的话内存就快用完了。。

- Android Studio 的一些优点吧：

Google推荐，Gradle构建。既然是Google推荐，那就是好的。。

- 使用Android Studio的一些前提：

翻墙术：这招必须要学会了，不然很吃亏。Gradle构建的时候会根据需要下载依赖文件，所以有时候需要在Android Studio设置代理来下载。
俗话说，“不会翻墙的程序员不是好程序员。”

- 悬而未决的问题：

在Android Studio中想要添加一个依赖项目(module)，而这个module是一个Eclipse项目，在Import Module时不能识别，目前好像只能识别Gradle Module？怎么import一个Eclipse android Project呢？

**以下内容仅做广告用**

如果你使用过IntelliJ IDEA， 那么转向Android Studio 并不难；如果你没有使用过，那也可以尝试下。

如果你还在使用Eclipse，那么尝试下Android Studio 吧。

上面是打广告吗？应该不是把！

上面所有内容仅代表个人观点！

