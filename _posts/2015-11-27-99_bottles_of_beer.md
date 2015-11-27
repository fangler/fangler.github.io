---
layout: post
title: 99 bottles of beer
description: 99 bottles of beer 是首歌，网上有个用各种语言的小程序生成这首歌的歌词的小项目。
keywords: Kotlin, java
category: interest
tags: [Kotlin]
---

**在学习Kotlin语言的时候无意间看到了这个项目[99 bottles of beer](http://99-bottles-of-beer.net/)。挺有意思的一个小项目，用各种编程语言来实现生成99 bottles of beer这首歌的歌词。**

在项目网站上已经有1500多种编程语言的实现了，你可以进去评分，或者提交自己的新语言的实现。

为此还特意去听了一下这首歌，哎呀，很欢快的一首歌，完全没听懂歌词=。=

正好在再学Kotlin语言，所以想到用它来实现一下。

下面是Kotlin的实现
{% highlight java %}
/**
 +  kotlin of 99 bottles of beer by fangler
  + @return
 */
fun main(args: Array<String>) {
  for(index in 99 downTo 1){
    if(index == 1){
      println("""1 bottle of beer on the wall, 1 bottle of beer.
Take one down and pass it around, no more bottles of beer on the wall.""")
      println()
      println("""No more bottles of beer on the wall, no more bottles of beer.
Go to the store and buy some more, 99 bottles of beer on the wall.""")
    }else{
      val indexBellow = index - 1;
      println("""$index bottles of beer on the wall, $index bottles of beer.
Take one down and pass it around, $indexBellow bottles of beer on the wall.""")
      println()
    }
  }
}
{% endhighlight %}

代码可以在[http://try.kotlinlang.org/](http://try.kotlinlang.org/)上运行查看效果。

顺便用了其他熟悉的语言实现了=。=

java版
{% highlight java %}
import java.io.*;
import java.lang.String;
/**
* java of 99 bottles of beer by fangler
*/
class test  
{
  public static void main (String[] args) throws java.lang.Exception
  {
    
    for (int i=99;i>0 ;--i ){
        if(i == 1){
           System.out.println("1 bottle of beer on the wall, 1 bottle of beer.\nTake one down and pass it around, no more bottles of beer on the wall.\n");
           System.out.println("No more bottles of beer on the wall, no more bottles of beer.\nGo to the store and buy some more, 99 bottles of beer on the wall.");
        }else{
           System.out.println(String.format("%d bottles of beer on the wall, %d bottles of beer.\nTake one down and pass it around, %d bottles of beer on the wall.\n", i, i, i-1));
        }
    } 
  }
}
{% endhighlight %}

使用[java在线编辑](http://www.mcqyy.com/RunCode/java/)完成。

C++版
{% highlight c++ %}
#include<iostream>

static inline void CC(int i) {
  std::cout<<i<<" bottles of beer on the wall, "<<i<<" bottles of beer."<<std::endl;
  std::cout<<"Take one down and pass it arround, "<<i-1<<" bottles of beer on the wall"<<std::endl;
  std::cout<<std::endl;
}

static inline void LL(){ 
  std::cout<<"1 bottle of beer on the wall, 1 bottle of beer.\n"
    <<"Take one down and pass it around, no more bottles of beer on the wall."<<std::endl;
  std::cout<<"\nNo more bottles of beer on the wall, no more bottles of beer.\n"
    <<"Go to the store and buy some more, 99 bottles of beer on the wall."<<std::endl;
}

int main(){
  for(int index = 99; index > 0; --index){
    if(index == 1){
      LL(); 
    }else{
      CC(index);
    }
  }
}
{% endhighlight %}

使用Vim/g++编译运行。

python版
{% highlight python%}
#-*- coding=utf-8 -*-

#!/usr/bin/python

#*****************************************
#* 99-bottles-of-beer python
#* see http://99-bottles-of-beer.net/ for detail.
#* 2015-11-27 @fangler
#*****************************************

def out(i):
    print("""{0} bottles of beer on the wall, {1} bottles of beer.
Take one down and pass it around, {2} bottles of beer on the wall.\n""".format(i, i, i-1))

def start(i):
  if i==1 :
    print """1 bottle of beer on the wall, 1 bottle of beer.
Take one down and pass it around, no more bottles of beer on the wall.

No more bottles of beer on the wall, no more bottles of beer. 
Go to the store and buy some more, 99 bottles of beer on the wall."""
  else :
    out(i)
    start(i-1)

if __name__ == "__main__":
    start(99)
{% endhighlight %}

还是挺有意思的，其他语言等以后学习了再补充=。=

