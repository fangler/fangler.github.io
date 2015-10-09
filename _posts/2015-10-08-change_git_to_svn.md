---
layout: post
author: fangler
title: "git项目切换到svn"
keywords: git, svn
category: working
tags: [git]
---

####最近要把git项目切换到svn上去(没办法总有些领导就喜欢这种过时的技术，不愿使用新的技术...)，整理一下其中的一些坑

####本地的git项目上传到svn，需要使用到git中的svn命令(网上的说法是`git-svn`应该是旧的命令，我这边是git svn，可以见[官网](http://git-scm.com/docs/git-svn))

过程如下：

1. 在svn服务器新建了一个项目，假设为`someProc`。
注意：someProc是个空项目，即不包含`branches`,`tags`,`trunk`等目录，这不是个*标准*的svn项目
如果someProc是个标准的svn项目，会包含`branches`,`tags`,`trunk`等目录
2. 进入git项目目录内：
如果someProc是个空项目：`git svn init <svn url>/someProc`，初始化
如果someProc是个标准svn项目：`git svn init -s <svn url>/someProc`，"-s"(= "--stdlayout")表示用标准方式初始化
此时在.git/conf 会看到有类似如下的增加
`
[svn-remote "svn"]
url = <svn url>/someProc
fetch = :refs/remotes/git-svn
`
3. 获取svn 项目的更新
`git svn fetch`  会出现如下的一行 ：
r2 = 70db8c3a75f4001675dc88c01830dafe21dc69d6 (refs/remotes/git-svn)
或 r1 = 70db8c3a75f4001675dc88c01830dafe21dc69d6 (refs/remotes/origin/trunk)等
这意味着获取到svn项目的更新了，如果出现空行，表示出错了。。
4. 提交本地git项目的所有更新到svn
`git svn dcommit`
这个命令第一次的时候会报错，类似下面：
`fangler@win10 11:00 /e/ttt/someb --> git svn dcommit
Unable to determine upstream SVN information from HEAD history.
Perhaps the repository is empty. at C:\Program Files\Git\mingw64/libexec/git-core\git-svn line 866.
`

因为现在Git proj的commits不知道要放到SVN proj的哪个版本之后，即Git proj的这些提交要
放在SVN哪个版本之后（显然是放到SVN的初始提交之后，但是Git proj就是不知道，因为设计者
并不考虑把Git proj转为SVN proj的情况：）

以下是详细描述：

    This fails since the git svn command can't figure out which commits to push: there's no link

    between our original Git repository and the Subversion heads.

    To fix this, we can use a Git graft to link them. We'll tell Git the commit which created the SVN

    folder in which we want to store the project is the parent commit of the first commit in our Git

    repository.

*解决办法*

- `git show-ref remotes/git-svn` //获取svn 项目的HEAD，即上面第3步返回的 r2

- `git log --pretty=oneline v1.2 | tail -n 1` //获取git项目的第一个commit

    fangler@win10 11:01 /e/ttt/someb --> git log --pretty=oneline v1.2 | tail -n 1
    06f8be9120e826b5c4e8a5e9bef13d0b9e5851e8 first add

- `echo "06f8be9120e826b5c4e8a5e9bef13d0b9e5851e8 70db8c3a75f4001675dc88c01830dafe21dc69d6" >> .git/info/grafts` //把git 项目的从第一个开始的提交，添加到svn 项目的HEAD提交。

- `git svn dcommit` //把git项目的所有提交更新到svn项目，这时候就会看到svn正在提交了...



####本地git提交同步到svn

git的提交分3步，`git add -A` ->  `git commit -m "message to commit"` -> `git push`

我们只需要在`git commit`这一步执行完后使用`git svn dcommit`提交到svn即可将本次提交同步到svn。



参考：

http://blog.chinaunix.net/uid-11639156-id-3077471.html

http://blog.csdn.net/zhangskd/article/details/43452627
