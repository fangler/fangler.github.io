---
layout: post
title: 在digitalocean上购买vps搭建SS服务
description: digitalocean上购买vps,搭建一个ShadowSocks服务
keywords: digitalocean, ShadowSocks
category: interest
tags: [android]
---

#### 前言
今天忽然发现所有的免费vpn都不能用了，连了好久都连不上，瞬间工作的激情都没了。于是一怒之下准备去买国外的服务器搭个ss。  
第一个选择是去[Linode](https://www.linode.com/),口碑好机房挺多的。可惜注册以后发现我最多只能用信用卡支付，可惜至今都没钱办信用卡。考虑了好久只能放弃。  
第二个选择是[digitalocean](https://www.digitalocean.com/),这个口碑不好，据说会无缘无故的封号，我注册的时候都在求神拜佛的别封我号啊。还好这个可以用[paypal](https://www.paypal.com)付款，而paypal可以绑定银联卡，普通的银联卡也可以。  
于是注册了paypal的账号，然后用我一个多年未用的工行卡支付了10$，digitalocean付款成功后貌似需要一个认证啥的，然后你的账户总共会有20$,购买5$每月的可以使用4个月。还好没有出现什么很大的问题~~

服务器到手后，会发送root的密码到邮箱。可以用ssh登陆到Centos7(我选的os是Centos7)，然后开始了装环境之旅~~

#### 基础环境准备
1. python pip 工具
wget https://raw.github.com/pypa/pip/master/contrib/get-pip.py
python get-pip.py

2. mysql ， centos7下msyql似乎换成mariadb，我这边安装mysql后一直无法启动服务，一直报错`loaded not-found (reason no such file or directory) `，换成mariadb后就正常了。

    yum install mariadb mariadb-server
    systemctl start mariadb.service
    systemctl enable mariadb.service
    /usr/bin/mysql_secure_installation

3. python shadowsocks模块 : `pip instal shadowsocks`  

4. python的cymysql模块 : `pip install cymysql`

5. shadowsocks封装的一个python版本，支持多用户管理和流量统计，原作者的版本被封杀了，这个版本还能存在也是奇迹，被我找到也更是奇迹啊。  
 [Github地址](https://github.com/mengskysama/shadowsocks/tree/manyuser)，存起来以后也应该会有用。

6. 环境准备后以后，可以开始部署我们的shadoGwsocks server环境了。

#### SS服务部署
1. 下载代码：
`git clone -b manyuser https://github.com/mengskysama/shadowsocks.git`
2. 创建数据库database，确保mysql服务已启动。mardiadb环境配置成功后可以设置mysql的密码。
   `mysql -u root -p` -> `create database shadowsocks;` ->`use shadowsocks`
3. 导入表，clone上面的代码后，我们进入`cd shadowsocks/shadowsocks/`可以看到一个shadowsocks.sql的文件，在mysql中使用`source shadowsocks.sql`导入该表。
4. 开启服务`python server.py`
如果看到db start server at port [50000] pass [0000000]
start server at 50000
那么恭喜，你成功了。

*若不幸看到“ImportError: No module named M2Crypto.EVP”，没关系，这是缺少一个python库。`yum install m2crypto`后再次开启服务搞定。*


然后配置客户端的shadowsocks环境，默认的port是50000，password是0000000，我们可以通过修改shadowsocks中的user表来修改port和password。
命令类似如下：
`update table user set port=999 where id=7`  
`update table user set passwd=123456 where id =7`等。

完成后终于可以用ShadowSocks client来连接了~~
