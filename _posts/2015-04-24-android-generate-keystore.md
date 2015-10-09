---
layout: post
title: 生成keystore和apk签名
description: android生成keystore签名文件，并为apk进行签名
keywords: android,keystore,apk签名
category: android
tags: [android keystore]
---

####生成keystore####

android编译生成的apk是要签名才能发布的，也就是说签名后才能装到其他手机上。*(调试情况下是用了默认的签名所以才能在手机或模拟器上安装)*

既然要签名，就需要生成一个keystore文件，有两种方式

#####命令行方式#####

使用java中的keytool.exe工具，在java的安装目录下可以找到。*(比如：我的是 C:\Program Files\Java\jdk1.7.0_05\bin)*

使用方法比较简单：`keytool -genkey -alias fangler.keystore -keyalg RSA -validity 40000 -keystore fangler.keystore`

	C:\Users\fangler>keytool -genkey -alias fangler.keystore -keyalg RSA -validity 40000 -keystore fangler.keystore
	输入密钥库口令: fangler   
	再次输入新口令: fangler
	您的名字与姓氏是什么?
	  [Unknown]:  fangler
	您的组织单位名称是什么?
	  [Unknown]:  fangler.com
	您的组织名称是什么?
	  [Unknown]:  fangler.com
	您所在的城市或区域名称是什么?
	  [Unknown]:  SZ
	您所在的省/市/自治区名称是什么?
	  [Unknown]:  guangdong
	该单位的双字母国家/地区代码是什么?
	  [Unknown]:  CN
	CN=张峰, OU=fangler.com, O=fangler.com, L=SZ, ST=guangdong, C=CN是否正确?
	  [否]: Y

上面的内容根据需要修改..这样就话就会在"C:\Users\fangler"目录下生成 fangler.keystore文件。

#####使用IDE#####

如果是用Intellij IDEA或着Android Studio 的话，也是差不多的方法。

以Intellij IDEA 为例，点击"Build" -> "Generate Signed APK..."，就可以看到下图
![图片加载中...](/images/android_generate_keystore1.jpg)

图片中要填的东西和上图是一样的。

####apk签名####

生成keystore后就可以给编译好的apk签名了，还是喜欢用命令行的方式

需要使用到jarsigner工具，这个工具和keytool在同一个目录下，所以我们把jar的bin文件所在的目录加到系统的Path环境变量里，就可以在命令行使用了。

举个栗子：在demo.apk所在的目录下执行`jarsigner -verbose -keystore fangler.keystore -signedjar fangler_signed.apk demo.apk fangler.keystore` 
(如果签名文件有密码的话，需要输入密码)签名成功，生成的文件名为fangler_signed.apk。

也可以使用IDE来签名，也是上面图片中的，"Create new"旁边的"Choose existing"选择上面生成的keystore即可，然后就是填写keystore的密码，最后会生成签名的apk。
