---
layout: post
title: 学习JetBrains的Kotlin语言
description: Kotlin 是一个基于 JVM 的新的编程语言，由 JetBrains开发。也有人把Kotlin当作是Android世界的Swift。
keywords: Kotlin, JetBrains
category: android
tags: [Kotlin]
---

    Kotlin 是一个基于 JVM 的新的编程语言，由 JetBrains 开发。JetBrains的IDE，用过的应该都会说好吧。也有人把Kotlin当作是Android世界的Swift，反正是各种各种厉害啦。本着对新技术的崇高热情，我也在闲暇的时候学习了一下Kotlin语言，故此记录一下。

Kotlin 的一些变化

先说重大变化：比如超级父类不在是Object了，而是Any。

### Basics

变量定义：
1. 定义只读变量
`val a: Int = 1` 
`val b = 1`  //自动推导为Int类型  
`val c: Int`  //初始化变量，初始化的时候需要指定类型
`a += 1`   // Error: Val cannot be reassigned
2. 定义可变变量
`var x = 5` //自动推导为Int类型
`x += 1` //success

函数定义：
`fun double(x: Int): Int {}`
函数定义使用fun关键字了，返回值用 ：Int来表示。

字符串模板：
字符串可以包含模板语法，也就是说代码可以被计算然后将结果拼接成字符串。模板表达式使用美元符号($)加变量来表示。
`val i = 10`  
`val s = "i = $i"` // s最终计算成 'i = 10'
*如果想正确显示美元符号，需要这样做：` val price = "${'$'}9.99"`*

***

**经过测试，有下面几种情况：**
`val price = "$9.99"`  // 如果$后面连接的是数字，则会正确输出$9.99
`val price = "$i9.99"` // Error:Unresolved reference: i9 , 如果$后面连接的是变量，则会变成模板语法
`val price = "${'$'}i9.99"` // 输出 $i9.99

***

### Packages
Package在Kotlin中也有了相应的变化，再也不用需要类名与文件名保持一致了=。=  
源文件开始有一个package声明 （这一点保持java原样）
{% highlight java %} 
package foo.bar
funbaz(){}
classGoo{}

// ...
{% endhighlight %}
现在源文件中的所有内容，包括函数和类都属于声明的package，如果没有声明package，那全属于"default" package，这一点到类似于c++的namespace。

与java不同，Kotlin去掉了"import static"语法，其实我觉得去掉也好，"import static"用起来很晕 =。=

### Control Flow
流程语句新增了when表达式来替换switch/case语法，不过更加智能。
{% highlight java %} 
when (x) {
  in 1..10->print("x is in the range")
  !in10..20->print("x is outside the range")
  else->print("none of the above")
}
{% endhighlight %} 
需要说明的是，这个没有了fall through的危险，如果任何一个分支满足，最后的else会执行。

换个思路来讲，when表达式也可以替换if/else if/else的结构，而且显得更整洁。

其他流程变化都还比较小，可以在[http://kotlinlang.org/docs/reference/control-flow.html](http://kotlinlang.org/docs/reference/control-flow.html)查看更多。

提个问题：for表达式是不是有点借鉴了python的语法？=。=

### Returns and Jumps
变化的地方：所有的表达式在Kotlin都可以打一个标签(label)，使用@符号加标签名，如@abc，@Fuck等。 
这应该要实现c/c++中的go关键字用法，来实现任意跳转。
{% highlight java %} 
fuck@ for (i in 1..100) {
    for (j in 1..100) {
      if (i == 12 && j == 12){
        print("loop out")
        break@fuck
      }else{
        print("[$i..$j]")
      }
    }
  }
{% endhighlight %} 
上面的栗子可以看到，使用lable标签可以直接跳出双重for循环。

*经过测试：lable标签名可以是已存在的函数名/变量名，但是不能是"main"。*

### Classes and Inheritance
其实变化还是蛮多的，要讲完实在太不容易，而且我也没有消化完。  
地址在[http://kotlinlang.org/docs/reference/classes.html](http://kotlinlang.org/docs/reference/classes.html)

#### 其他特性
**Null Satety**  
我们可以在变量中添加？来避免java中随处可见的NullPointException。
{% highlight java %} 
var b: String? = "abc"
b = null // ok
{% endhighlight %} 

**SmartCasts**  
在很多场景下，我们不需要显示的转换，因为Kotlin会偷偷为我们进行安全转换
{% highlight java %} 
fun demo(x:Any){
  if(x is String){
  }
}
{% endhighlight %} 

**Delegated Properties**  
这是个比较大的特性。我们一次实现这种方式，以后每次都不需要再次计算。
实现的方式有几种：
+ lazy properties: the value gets computed only upon first access，第一次访问时计算。
+ observable properties: listeners get notified about changes to this property, 有更改后进行通知
+ storing properties in a map, not in separate field each. 使用map来存储

测试例子如下：
{% highlight java %} 
/**
* Created by fangler on 2015/11/26.
*/
   
import kotlin.properties.Delegates
import kotlin.reflect.KProperty

val lazyValue: String by lazy {
  println("computed!")
  "Hello"
}

class Delegate {
  operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
    return "$thisRef, thank you for delegating '${property.name}' to me!"
  }

  operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
    println("$value has been assigned to '${property.name} in $thisRef.'")
  }
}

class Example {
  var p: String by Delegate()
}

class User {
  var name: String by Delegates.observable("<no name>") {
      prop, old, new ->
      println("$old -> $new")
  }
}

fun main(args: Array<String>) {
  val emp = Example();
  println(emp.p)
  emp.p = "fangler";
  println(emp.p)
  val user = User()
  println(user)
  user.name = "first"
  user.name = "second"
  println(user)

  println(lazyValue)
  println(lazyValue)
   
}
{% endhighlight %} 
输出：
{% highlight java %} 
Example@4de67cdb, thank you for delegating 'p' to me!
fangler has been assigned to 'p in Example@4de67cdb.'
Example@4de67cdb, thank you for delegating 'p' to me!
User@6078b973
-> first
first -> second
User@6078b973
computed!
Hello
Hello
{% endhighlight %} 

还有其他的特性待慢慢学习消化了=。=

