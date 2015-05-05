---
layout: post
title: Centos搭建git服务器
description: Centos 7做后端服务器，并在其上部署git服务器
keywords: Centos, git, git服务器
category: working
tags: [git]
---
{% include JB/setup %}

这两天都在搭建自己工作中用到的开发环境，服务器已经确定使用Centos，团队打算使用git作为版本控制工具，正好我对git还算比较熟悉，于是让我来为Centos服务器搭建git环境。

Git服务器端的部署(Centos 7.0 -64位机器一台, Centos_IP : 192.168.1.111)

####1. Git的安装####

Linux：可以在命令行输入`git`看看有没有安装，如果用Debian或Ubuntu linux，通过`sudo apt-get install git`来安装(如是老一点的Debian或Ubuntu，命令改成`sudo apt-get install git-core`)。

Windows：msysgit是Windows版的Git，从[msysgit官网](http://msysgit.github.io/){:target="_blank"}下载，然后按默认选项安装即可。

####2. 安装openssh server，本机已装，跳过####

主要是ssh的配置，ssh开启公钥认证登录，编辑 etc/ssh/sshd_config(约在47到51行)，去掉以下几行的注释:
{% highlight sh %}
RSAAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile      .ssh/authorized_keys
AuthorizedKeysCommand none
AuthorizedKeysCommandRunAs nobody
{% endhighlight %}

然后重启ssh ， `sudo service sshd restart`。

####3. 公钥和私钥配置####
上一步我们开启了ssh的公钥认证，这样我们就可以把私钥上传到服务器，这样就可以用ssh的公钥登录了。

- 生成公钥和私钥

  如果是在Linux下，直接运行`ssh-keygen -t rsa` ，会生成两个文件在~/.ssh目录下。

  如果是Windows下，可以在git bash 命令行(安装msysgit后右键可以选择)输入同上的命令，生成文件在C:\Users\username\.ssh。

- 上传公钥和私钥到git服务器

  先在git服务器创建git用户 : `sudo adduser git`，设置密码 ：`sudo passwd git`， 密码设定为"git"(也可以自行设置为其他).
  切换到用户git，`su git` 。

  将上一步生成的两个文件(文件名为"id_rsa"和"id_rsa.pub")中的"id_rsa.pub"中的内容复制到~/.ssh/authorized_keys(如没有，可以使用`touch ~/.ssh/authorized_keys`创建)文件。

- 权限设置

{% highlight sh %}
# chown -R git:git /home/git
# chmod 700 /home/git
# chmod 700 /home/git/.ssh
# chmod 644 /home/git/.ssh/authorized_keys  //公钥文件的所有权限(好像这个比较重要)
# chmod 600 /home/git/.ssh/id_rsa        //私钥文件的所有权限
{% endhighlight %}

- 登录验证

  我是把Windows下生成的公钥上传到git服务器上，所以在git bash 窗口下进行验证。
  `ssh git@192.168.1.111` (git 服务器所在的ip)，(注:如果在创建key时输入过密码，此时会要求验证密码)如果登录成功，表示验证通过。如果需要输入git用户的密码，表示验证失败。

*至此，git服务器基本上部署成功了，我们可以测试一下*

例:在git 服务器上， 在/home/git目录下`git init --bare test.git` , 这样就创建了一个空仓库；
在客户端机器上，可以使用`git clone git@192.168.1.111:test.git` 来克隆这个仓库。

如果想把git服务器上的仓库分享给其他人来协作开发，只需要把其他人的公钥保存到authorized_keys中。

很显然把所有用户的公钥都保存在authorized_keys文件中的做法并不总是合适的。特别是当协作开发的用户数量越来越多时，管理起来就十分的痛苦了。而且这种方法来说所有的用户都有完整的读写权限，这也是十分不利的。


####4. 我们可以使用Gitosis来管理 authorized_keys文件和实现简单权限管理####

- 安装 Python 的 setuptools 包，`sudo yum install python-setuptools`

- 从 Gitosis 项目主页克隆并安装：
{% highlight sh %}
$ git clone https://github.com/res0nat0r/gitosis.git
$ cd gitosis
$ sudo python setup.py install
{% endhighlight %}

- 初始化Gitosis
这个时候需要用一个公钥来初始化，我使用windows上生成的公钥，这个公钥就是生成的gitosis-admin.git的仓库的管理员：
{% highlight sh %}
[git@localhost ~]$ sudo -H -u git gitosis-init < /home/git/.ssh/authorized_keys
Initialized empty Git repository in /home/git/repositories/gitosis-admin.git/
Reinitialized existing Git repository in /home/git/repositories/gitosis-admin.git/
{% endhighlight %}

- 给仓库中的post-update增加可执行权限
`sudo chmod 755 /home/git/repositories/gitosis-admin.git/hooks/post-update`

- 差不多完成了，测试一下
 在windows机器上，在git bash窗口中, 输入`ssh git@192.168.1.111`, 出现如下的
"ERROR:gitosis.serve.main:Need SSH_ORIGINAL_COMMAND in environment. 
Connection to gitserver closed."
说明 Gitosis 认出了该用户的身份，但由于没有运行任何 Git 命令，所以它切断了连接

- 经过上一步的输出提示后，表示gitosis已经配置成功了。我们可以将gitosis-admin仓库clone到本地(`git clone git@192.168.1.111:gitosis-admin.git`)进行修改了。
 这样就可以看到gitosis-admin.git的目录的，至于目录里面有什么，或者要怎么配置gitosis-admin就可以去看[官方文档](https://github.com/res0nat0r/gitosis000){:target="_blank"}

简单的git服务器终于搭建成功了，我们才4人开发的小队伍应该是完全没有问题了。收工，该去复习下git的命令了。= =

