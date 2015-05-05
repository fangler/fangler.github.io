---
layout: post
title: 提交Jekyll博客代码到github
description: 使用git来提交Jekyll的博客代码到github上部署博客
keywords: git, jekyll, github
category: interest
tags: [github]
---
{% include JB/setup %}

上周都是在用本地虚拟机搭建的jekyll环境来运行博客，在博客的简单框架已经完成后，想把代码提交到github上，这样的话就能使用github的博客了。

####创建gitHub代码仓库
注册github账号，注意username项：后面会用到

创建一个repository，名字为 *username*.github.io，此处*username*为注册github账号时的username

点击新建的repository，可以看到(ssh方式)有提交代码的两种方式:

>**…or create a new repository on the command line**
>
>
>echo # jekyll_demo >> README.md
>
>git init
>
>git add README.md
>
>git commit -m "first commit"
>
>git remote add origin git@github.com:fangler/fangler.github.io.git
>
>git push -u origin master
>
>**…or push an existing repository from the command line**
>
>
>git remote add origin git@github.com:fangler/fangler.github.io.git
>
>git push -u origin master

由于本地的代码还没有创建成git代码仓库，所以使用第一次方式来提交代码。

####提交本地代码到github
在本地代码目录执行`git init`。

由于不需要README.md文件，就不需要执行这一步，而是换成`git add -A`，添加所有代码。

执行`git commit -m "first commit: add all files"`，提交所有代码。

此时执行后面的两步是会出现`permission denied (publickey)`的问题，查找原因后原来是没有在github中添加SSH key。

添加SSH key的方式如下：

1. 生成SSH key，`ssh-keygen -t rsa -C "your_email@example.com"`，此时可以看到在~/.ssh/目录下生成id_rsa.pub等文件.
2. 在gitHub中点击"Settings"，选择"SSH keys"，点击"Add SSH key","Title"随便填，"Key"中填入~/.ssh/id_rsa.pub文件中的内容.
3. 测试连接是否正常，`ssh -T git@github.com`，看到"Hi fangler! You've successfully authenticated, but GitHub does not provide shell access."，表示连接成功.
具体的过程可以查看[GitHub Help](https://help.github.com/articles/generating-ssh-keys/#platform-linux Generating SSH keys)。

然后继续执行上面的两步`git remote add origin git@github.com:fangler/fangler.github.io.git`和
`git push -u origin master`提交代码到github。

如果正确，在repository的"Settings"页面"GitHub Pages"列中可以看到"Your site is published at http://fangler.github.io."，然后就可以通过[http://fangler.github.io](http://fangler.github.io)来访问gitHub博客站点了。

**可是我遇到如下的错误，特此记录一下。**

"Settings"页面显示的是"A file was included in \`_includes/themes/startbootstrap-freelancer-1.0.2/default.html\` that is a symlink or does not exist in your _includes directory"，导致博客部署怎么都不成功，可是本地jekyll环境运行确实正常的。在GitHub的[帮助页面](https://help.github.com/articles/page-build-failed-file-is-a-symlink/)没有找到相关的解决办法。根据错误信息来看应该是default.html文件中"include"其他文件是symlink或者不存在，可是我把default.html文件中的include部分全部都删掉了也不管用啊。这个文件折磨了整整半天的时间依然没有任何进展，google很久也没效。

本着不解决不舒服斯基的原则，重头到尾的一行一行的检查default.html文件，检查到某一行是发现有这样的一句`<!-- \{\% include JB/analytics \%\} -->`，最开始是酱紫的`\{\% include JB/analytics \%\}`(**注：去掉转义符查看**)，由于是自己弄的模板，觉得这个可以先不用，所以就注释起来了。难道这样注释有问题？把这句删掉后，提交代码。这个时候终于显示成功了，博客能够访问了，原来就是被这样一句小小的语法错误折磨了半天。好悲催 = =