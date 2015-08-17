---
layout: post
title: 提交代码到git服务器
description: 使用git命令提交本地代码到git服务器上
keywords: git, git服务器
category: working
tags: [git]
---
{% include JB/setup %}

git服务器部署好了后，我们就可以创建远程仓库了。其他人便可以从远程仓库中拉取或推送数据了，来协作开发项目，分享各自的工作进展。

远程仓库创建(在服务器上先创建好对应项目的空仓库，eg:`git init --bare fangler_src.git`)好后，我们需要将本地代码提交到git服务器，有两种情况：

假设我们的代码目录为fangler_src，所有的代码都在这个目录下。

**1. 代码还没有创建成仓库**

这种情况下，需要先创建成仓库。下图将呈现具体步骤

![图片加载中...](/images/commit_to_git_server1.png)

创建完成后，我们使用`git remote -v`查看远程仓库， 可以看到输出为空，表示没有关联任何远程仓库。

使用`git remote add origin git@192.168.0.200:fangler_src.git`来关联到git服务器对应的仓库，再次查看远程仓库，发现origin已和远程仓库fangler_src.git关联上。

![图片加载中...](/images/commit_to_git_server2.png)

最后我们将代码push到远程，`git push origin master`，成功。

*(当然还有一种简单的方法，我们直接将远程仓库clone过来，然后把代码复制到clone生成的目录，然后就是使用git命令来提交到远程了。)*

**2. 代码已经是git仓库，而且有远程仓库**

如果是这种情况，发现我们执行"git remote add origin "的时候出现错误"fatal：remote origin already exists." ，这是因为origin 已经关联到其他远程仓库了。我们就不能继续使用origin了，需要换个名字，`git remote add origin2 git@192.168.0.200:fangler_src.git`。

![图片加载中...](/images/commit_to_git_server3.png)

这样的话，我们就会使用origin2(也可以自己换成其他的)来提交代码，`git push origin2 master`，成功。

**还有一些其他的命令可能用的到**

- 如果想修改远程仓库的本地名称，可以使用`git remote rename`，比如想把上面的origin2换成develop，可以这样做：
```c
$git remote rename origin2 develop
$git remote
develop
origin
```

- 如果上面origin对应的远程仓库不可用(ip地址修改了情况)，我们可能想要移除对应的远程仓库，可以使用`git remote rm`命令。
{% highlight sh %}
$ git remote rm paul
$ git remote
origin
{% endhighlight%}

