---
layout: post
title: 在VMware上安装Centos
description: VMware虚拟机安装Centos Everything版本，并安装VMware tools
keywords: VMware,Centos Everything,VMware tools
category: working
tags: [Centos]
---
{% include JB/setup %}

最近在虚拟机上安装Centos作为开发环境，期间出现了一些问题，于是整理成一篇文章记录下来。

**环境：**

  CentOS-7-x86_64-Everything-1503-01  --> 在[官网](http://www.centos.org/download/){:target="_blank"}选择 "Everything ISO" 安装的。

  VMware-workstation-full-10          --> 来源神秘，在网上胡乱搜索找到的，内含VMware 10 和 注册机。
  
注：也可以用[VirtualBox](https://www.virtualbox.org/){:target="_blank"}来代替VMware，不过我比较喜欢VMware的vmtools安装成功后的"进入Unity模式"，感觉碉堡了。

使用VMware安装CentOS的具体过程就不说了(不懂的话，网上也可以查到)，假设安装成功，现在我们进入系统，发现没有安装GUI界面。

**安装GUI界面(X Window System)使用下面两条命令：**

`yum groupinstall "X Window System"` & `yum groupinstall GNOME Desktop Environment`

安装完成后，输入`startx` 即可进入X Window。

这个时候我们可以在VMware的"虚拟机(M)"选项中选择"安装VMware Tools(T)..." ，然后就可以在Centos虚拟机桌面上看到"VMware tools'目录，打开它里面会有"VMware Tools - xxxx.tar.gz"这个压缩包。我们将压缩包拷贝到用户主目录下去安装。

1. 解压 ： `tar -zxvf VMware Tools - xxxx.tar.gz` ，会出现一个"vmware-tools-distrib"目录，里面会有"vmware-install.pl"文件。
2. 安装 ：`./vmware-install.pl` 

**在安装过程中出现了些问题：**

- Q：/usr/bin/perl: bad interpreter: No such file or directory。
- A：这是因为 perl 环境没有安装，使用`yum groupinstall "Perl Support"`
- Q：What is the location of the "ifconfig" program on your machine? The answer " " is invalid.
- A：没有安装网络组件，使用`yum install net-tools`
- Q：Searching for GCC... The path " " is not valid path to the gcc binary
- A： 没有安装开发环境，使用 yum groupinstall "Development Tools"
- Q：Searching for a valid kernel header path... The path " " is not a valid path
- A： 开始以为是kernel header 没有，使用`yum install kernel-headers`提示已安装，使用`yum -y upgrade kernel kernel-devel`，然后reboot，重新安装VMware Tools，终于成功。

其实之所以安装VMware Tools过程中出现这么多组件没有安装，是因为在安装Centos系统时默认选择了"最小安装"的方式，这种方式安装的东西比较少，如果我们选择其他的方式来安装Centos的话，就不用这么麻烦了。