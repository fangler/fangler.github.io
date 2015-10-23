---
layout: post
author: fangler
title: RxJava在项目上的使用
description: 怎么在项目上使用RxJava和RxAndroid来开发应用
keywords: RxJava,RxAndroid,retrofit
category: android
tags: [RxJava ]
---

国内开始在android开发中使用RxJava的项目越来越多了，我们的项目上也用上了RxJava。那RxJava是什么呢？[官网](http://reactivex.io/intro.html)的说法是：ReactiveX是用于通过使用观察序列构成异步和基于事件的程序库。

这篇文章会根据我对RxJava的使用来理解和学习RxJava，如果任何觉得不对的地方，欢迎批评指正~~

先来统计下我们项目上正在使用的一些库：
- [leakcanary](https://github.com/square/leakcanary)    ==> 检查内存泄漏
- [butterknife](https://github.com/JakeWharton/butterknife)  ==> 视图注入框架，懒人专用~
- [dagger2](https://github.com/google/dagger) ==>依赖注入框架
- [rxandroid](https://github.com/ReactiveX/RxAndroid) ==>RxJava在android上的扩展
- [timber](https://github.com/JakeWharton/timber)==>小的Logger库
- [picasso](https://github.com/square/picasso)==>square出品的图片加载库
- [retrofit](https://github.com/square/retrofit)==>square的网络请求客户端
- [fabric](https://get.fabric.io/)==>twitter的app崩溃统计库
- [design](http://developer.android.com/intl/zh-cn/design/index.html)==>android的设计库

是不是用了好多square的库=。=，有时间的还要学习下dagger2的库，当时使用的时候出现过很多问题，后来解决了，还是感觉这个库有很多功能没有发掘~~

好了，回到主题上来。。

正好这个月不忙，所以这个月的任务是学习RxJava库，查看了很多大神写的相关博客，官网，然后是都源码，文末会列出一些好的学习这个库的网站。

这里不会再来解释RxJava是什么了，但是会列出一些RxJava能适用的场景。当然，尽量会提供代码 =。=

在Android开发中我们经常需要处理耗时的操作，比如网络请求，读写数据库，读写文件等，这个时候我们会想到用AsyncTask或者Handler+Thread的方式，但是当使用这两种方式的时候，发现代码量越来越多，尤其当需要同时/并发执行多个耗时操作时，这会让情况变得更多。更多的时候我们还要考虑如何正确的结束这些操作来避免内存泄漏。。

如果你发现你遇到上面的问题了，那你应该考虑考虑使用RxJava来处理异步请求了。

来个简单的栗子来开始使用RxJava...
{% highlight java %}
RestAdapter restAdapter = ServiceManager.getRestAdapter("http://cn.bing.com");
final ByApi byApi = restAdapter.create(ByApi.class);
byApi.getImage().subscribeOn(Schedulers.newThread())
    .observeOn(AndroidSchedulers.mainThread())
    .subscribe(new Action1<ByImage>() {
      @Override public void call(ByImage byImage) {
        String url = byImage.images.get(0).url;
        Picasso.with(MainActivity.this).load(url).into(image);
      }
    });
{% endhighlight %}
这里从·必应每日图片·取到图片的网络地址，然后用Picasso加载到相应的ImageView上。(抱歉又用上了Picasso和Retrofit=。=)

![用了都说好](http://img1.gamersky.com/image2014/03/20140321p_6/gamersky_08small_16_201432188AD7.jpg)

Retrofit支持返回一个Observable<T>，而这个正是RxJava的开始。

### Observable
RxJava的实现采用的是观察者模式，而Observable实现的就是一个被观察者，提供订阅。

#### 1. 成员
OnSubscribe 这是它的唯一个成员。 

#### 2. 构造函数
Observable类只有一个protected 的构造函数，所以我们无法直接创建它的对象，我们可以根据它的静态方法来创建。
`public final static <T> Observable<T> create(OnSubscribe<T> f) `
这应该是使用最多的，包括下面的方法，实际上还是会调用这个方法来实现
`public final static <T> Observable<T> from(Future<? extends T> future) `
将一个Future转换成Observable，调用create(OnSubscribeToObservableFuture.ToObservableFuture f)
`public final static <T> Observable<T> from(Iterable<? extends T> iterable)`
将Iterable序列转换成Observable
`public final static <T> Observable<T> from(T[] array)`
将T类型数组转成Observable
`public final static <T> Observable<T> just(final T value)`
将T类型数据转换成Observable,当然还有他的多个参数版本
`public final static Observable<Integer> range(int start, int count)`
创建一个发送(count)个Integer的Observable.

#### 3. 重要方法
从上面简单的栗子看到重要的方法有三个`subscribeOn`,`observeOn`,`subcribe`。

##### subscribeOn和observeOn
方法接收一个Schedule对象，实际上这两个方法就是用来切换subscribe(产生数据)和observeOn(观察数据)的线程。
通常我们的耗时操作是应该在单独的线程执行的，所以可以用subscribeOn(Schedulers.newThread())来将操作切换到新线程去执行，然后observeOn(AndroidSchedulers.mainThread())表示将结果发送回android的主线程。

##### subcribe
万物皆有始有终，Observable是开始，而这个就是结束。
不管是它的有参函数还是无参函数最后都用调用这个方法，经过压缩后(我去除了null判断，异常处理等)这样的
{% highlight java %}
subscribe(Subscriber<? super T> subscriber){
     subscriber.onStart();
     this.onSubscribe.call(subscriber);
     return subscriber;
}
{% endhighlight %}
`onStart`默认是空，我们可以重写它，这样可以做一些初始化操作。然后是调用了`this.onSubscribe.call(subscriber);`，这样
最后它返回了自己，这样之前的链式调用就结束了。意味着整个流程就结束了。
Subscriber实现了Subscription接口，所以我们也可以调用subscriber.unsubscribe()来手动结束整理流程。

##### lift
上面的subscribeOn和observeOn其实都用到了lift这个基础方法，观察Observable的实现可以看到它的很多方法都调用到了lift方法，所以非常有必要看看这个方法干了个嘛。
原谅我又把它的实现精简了同样去除了异常处理等其他部分，建议去看源码。
{% highlight java %}
public final <R> Observable<R> lift(final Operator<? extends R, ? super T> operator) {
     return new Observable<R>(new OnSubscribe<R>()){
     @Override
     public void call(Subscriber<? super R> o) {
          Subscriber<? super T> st = operator.call(o);
          st.onStart();
          onSubscribe.call(st);
          }
     }   
}
{% endhighlight %}
我对lift方法的理解是：它接收一个Operator(操作符)对象，而Operator是继承`Func1<Subscriber<? super R>, Subscriber<? super T>>`的接口，Func1只有一个Call方法，所以Operator会变成这样：
{% highlight java %}
public interface Operator<R, T>{
     Subscriber<? super R> call(Subscriber<? super T> t);
}
{% endhighlight %}
那么lift会返回一个新的Observable，同时Observable的成员也是new了一个新的。它的call方法：调用Operator的call方法(参数为Subscriber<? supert T>)生成Subscriber<? super R>，然后调用原始的onSubscribe的call方法(参数为Subscriber<? super R>)。这样一来就执行了一个变换，变换的主体是Operator。

再来一个栗子：我们来实现一个将输入的整数转换成字符串的操作符
{% highlight java %}
Observable.create(new Observable.OnSubscribe<Integer>() {
  @Override public void call(Subscriber<? super Integer> subscriber) {
    subscriber.onNext(1);
    subscriber.onNext(2);
    subscriber.onNext(3);
    subscriber.onCompleted();
  }
}).lift(new Observable.Operator<String, Integer>() {
  @Override public Subscriber<? super Integer> call(final Subscriber<? super String> subscriber) {
    return new Subscriber<Integer>() {
      @Override public void onStart() {
        super.onStart();
        // TODO: 2015/10/22 哈哈，这里开始我转换成String啦
        Log.d(MainActivity.class.getSimpleName(), "start lift..");
      }

      @Override public void onCompleted() {
        subscriber.onCompleted();
      }

      @Override public void onError(Throwable e) {
        subscriber.onError(e);
      }

      @Override public void onNext(Integer integer) {
        subscriber.onNext("fangler:" + integer);
      }
    };
  }
}).subscribe(new Action1<String>() {
  @Override public void call(String s) {
    Log.d(MainActivity.class.getSimpleName(), s);
  }
});
{% endhighlight %}

这时我们看到Observable类有个函数map可以实现类似的功能，而它的内容和上面的差不多。
**RxJava的建议是尽量使用已有的方法，不提倡自己实现** 

#### 其他方法
Observable类还有很多实现了其他功能的方法，基本可以满足各种需求。 
先来统计下我的项目中使用最多的方法：
+ zip : 这个是将多个Observable打包，可以提供一个Func来操作每个Observable的结果，最后返回一个新的Observable.
+ just：这个就比较简单了，上面讲过。
剩下的就是Retrofit返回的Observable。

来个zip的图片开开眼(图片来至必应，不知道链接会不会过期呢)
![图片来自必应](http://tse4.mm.bing.net/th?id=OIP.M1853118946b5772e7cdb4f4addfdf7bco0&amp;pid=15.1)
这些方法的功能在官网上或者代码中都有比较详细的说明。如果想查看更详细的图片，可以在[http://rxmarbles.com/](http://rxmarbles.com/)这个网站看到。

这里这么多才写完Observable，而后面还有其他几个类没开始...算了，重新开一篇 =。=

