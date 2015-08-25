---
layout: post
title: git Tips:一些有用的git命令
description: 一些有用的git命令
keywords: git, git cherry-pick, git stash
category: working
tags: [git]
---
{% include JB/setup %}

###原来还有这么好用的git命令

很多新手在学习git的时候找不到好的资源，这里分享一些我收藏的资源 ==  

1. [Git Community Book 中文版](http://gitbook.liuhui998.com/index.html)  
2. [猴子都能懂得GIT入门](http://backlogtool.com/git-guide/cn/)  
感谢无私的奉献者们~~



下面记录的一些命令是本人使用过程中一些使用比较少，但用处多多的命令~~  
####先预习下git中 ^ 和 ~ 的区别  
[这里](http://stackoverflow.com/questions/2221658/whats-the-difference-between-head-and-head-in-git)讲的再详细不过了,如果你觉得还不错，那[这个](http://mux.alimama.com/posts/799)肯定能满足你强大的好奇心。

####git cherry-pick <commitID>  
这个git命令可以将你某个分支的提交记录放到当前分支上来。

>举个栗子：在master提交了一个分支，提交完后才想起来这个提交应该要放到develop分支上来的。这时候就可以用cherry-pick命令了。我们记住在master上提交的commit记录值，然后checkout到develop分支，运行git cherry-pick [commit记录的值]，你会发现你的提交从master上转移过来了。

####git reset --hard HEAD~  
这个将最近的一次提交重置，即删除了最近一次提交。后面的`HEAD~`可以为`HEAD~2`/`HEAD~3`等，分别为最近的两次/三次提交。  
**务必要确定这些文件是不需要了的**

####git stash/stash pop/stash list  
`git stash`可以将你未commit的变化暂存起来。  
`git stash pop`是将最后一次暂存的记录取出来。  
`git stash list`是查看所有暂存记录

####git commit --amend  
这个命令可以对最后一次提交的log进行修改，这次不小心写错提交日志的时候就很有用了。

未完，待续...
