---
layout: post
title: ADB命令集锦
description: ADB命令
keywords: Android ADB
category: android
tags: [Android]
---

-> adb 查看手机分辨率
  
      adb shell dumpsys window | grep "ShownFrame" | head -n 1  

-> 打开所要查看的包名
  
     adb shell dumpsys activity top | head -n 10  

-> 查看当前栈顶Activity
  
     adb shell dumpsys activity | grep mFocusedActivity  

-> adb shell package相关
  
     adb shell pm list packages：列出所有的包名  
     
     adb shell dumpsys package：列出所有的安装应用的信息  
     
     adb shell dumpsys package com.android.XXX：查看某个包的具体信息  
     
     
-> adb shell activity相关
  
     adb shell am start -n 包名/包名＋类名（-n 类名,-a action,-d date,-m MIME-TYPE,-c category,-e 扩展数据,等）。