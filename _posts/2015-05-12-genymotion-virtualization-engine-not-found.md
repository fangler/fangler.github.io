---
layout: post
title: genymotion "Virtualization engine not found" 错误的解决办法
description: 打开Genymotion的时候出现了这个错误 "Virtualization engine not found, Plugin loading aborted." 
keywords: Virtualization engine not found, Genymotion
category: working
tags: [Genymotion]
---
{% include JB/setup %}

今天在打开Genymotion的时候出现了这个错误 "Virtualization engine not found, Plugin loading aborted." ，太奇怪了，上周还好好的，难道是系统配置改变了？

看到这个错误，第一感觉是VirtualBox 出错了，因为Genymotion的运行是依赖于VirtualBox的，于是果断重新安装VirtualBox，可是错误还在，依然打不开。。

分析：Genymotion 和VirtualBox 都是按照默认的安装方式，也是安装到默认位置，没理由找不到啊？ 到底是什么鬼？

打开VirtualBox ，出错了，"创建COM对象失败.应用程序中断." 、"E_NOINTERFACE (0x80004002)" 等错误。原来这是高版本的VirtualBox有些bug，对win7的兼容性不好。

于是在VirtualBox的属性中选择"以兼容模式运行这个程序"，选的是"Windows Server 2008 (Service Pack 1)"

![图片加载中](/images/genymotion-Virtualization-engine-not-found.png)

再次打开VirtualBox成功。心想这下Genymotion应该正常了吧。

打开Genymotion，还是出现上面的错误。。这到底是什么鬼？

难道Genymotion也是需要以兼容性运行？于是同样在Genymotion的属性中选择"以兼容模式运行这个程序"，和VirtualBox选择的一样。再次打开终于成功了。

感觉这个方法不是很靠谱，不知道有没有更好的办法？？



