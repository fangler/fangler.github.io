---
layout: post
author: fangler
title: Observable的执行流程
description: Observable的subscribeOn和observeOn等方法的执行流程
keywords: RxJava,RxAndroid,Observable
category: android
tags: [RxJava ]
---

前两篇文章都是在对RxJava中的几个重要的类做说明，这篇文章来个总结，并对Observable的subscribeOn和observeOn和subsribe()几个方法的流程分析一下。

为了加深理解，做了个流程图=。 =
![图片加载中](/images/rxjava_observable.png)
创建一个Observable后，我们会调用它的subscribeOn，observeOn，subscribe方法。

首先我们要清楚lift到底做了什么事情，我觉得可以总结为两点：

1. 它接收一个Operator操作符，operator有一个call方法，接收一个Subsriber<T>，返回一个新的Subscriber<R>，实现的是一个变换。 
2. 它返回一个新的Observable，这个Observable的唯一成员OnSubscribe<R>的call方法会使用原Observable的OnSubscribe调用call方法，并传入Operator返回的Subscriber作为参数。

*重点在于，lift返回的是一个新的Observable，但并没有和原来的Observable断绝关系，当他的OnSubscribe 的call方法被调用时，原Observable的OnSubscribe的call方法也会被调用，这意味着，无论我们调用用多少次lift操作，原始的Observable的OnSubscribe的call方法一定会被调用到。*

还有Observable的成员OnSubscribe的call方法，它的参数是Subscriber<T>，返回void。

接下来看看Observable的几个重要方法了。

### subscribeOn
它调用了`nest().lift(new OperatorSubscribeOn<T>(scheduler))`。
1. 首先是一个nest()转换，nest()调用just(this)，最后调用ScalarSynchronousObservable的create方法，返回了一个ScalarSynchronousObservable，这是Observable的子类。 
2. 所以，向上图描述的那样，nest调用后，之前的Observable变成了ScalarSynchronousObservable，而之前的Observable作为ScalarSynchronousObservable类的构造函数参数，ScalarSynchronousObservable的成员OnSubscribe 是重新创建的一个，它的call方法发射ScalarSynchronousObservable类传入的参数。 
3. 第3步是一个lift(OperatorSubscribeOn)变换，OperatorSubscribeOn的call方法将传入的subscriber放入到指定的线程中去执行，这样完成线程的切换。

### observableOn
它也经历了一个lift(OperatorObserveOn)操作，当observableOn的Schedule传入AndroidSchedulers .mainThread ()时，OperatorObserveOn的call方法返回一个ObserveOnSubscriber，ObserveOnSubscriber的onNext，onError，onCompleted等方法最终都会到Schedule的线程去执行。

### subscribe
这是最后的方法，它传入的参数是一个Subscriber，这个Subscriber会作为Observable的成员OnSubscribe的call方法的参数被调用。而经过上面的流程图Observable和OnSubscribe都是重新创建的，新的OnSubscribe的call方法会调用之前的OnSubscribe的call方法也会被调用，所以，所有lift操作生成的OnSubscribe的call方法都会被调用。

---------------------------------------------------------------------------------------------------------------------------------------------------------

算了，还是用代码来测试下执行流程=。=  
怎么开始呢，我发现Observable的lift，subscribe，unsafeSubscribe等方法都有使用`private static final RxJavaObservableExecutionHook hook = RxJavaPlugins.getInstance().getObservableExecutionHook() ;`这个hook的相关方法的调用。而RxJavaPlugins也有提供registerObservableExecutionHook等方法来注册hook。于是第一个想法就是重写RxJavaObservableExecutionHook来添加我们的东东。
{% highlight java %}
package com.fangler.rxdemo.hook;

import android.util.Log;

import rx.Observable;
import rx.Subscription;
import rx.plugins.RxJavaObservableExecutionHook;

/**
* Created by fangler on 2015/11/2.
*/
public class RxJavaObservableSelfHook extends RxJavaObservableExecutionHook {

  private static final String TAG = "MainActivity";

  private void log(String period) {
    Log.d(TAG, "RxJavaObservableSelfHook "+ period + ".." + Thread.currentThread().getName());
  }

  @Override public <T> Observable.OnSubscribe<T> onCreate(Observable.OnSubscribe<T> f) {
    log("onCreate");
    return super.onCreate(f);
  }

  @Override
  public <T, R> Observable.Operator<? extends R, ? super T> onLift(Observable.Operator<? extends R, ? super T> lift) {
    log("onLift");
    return super.onLift(lift);
  }

  @Override public <T> Throwable onSubscribeError(Throwable e) {
    log("onSubscribeError");
    return super.onSubscribeError(e);
  }

  @Override public <T> Subscription onSubscribeReturn(Subscription subscription) {
    log("onSubscribeReturn");
    return super.onSubscribeReturn(subscription);
  }

  @Override
  public <T> Observable.OnSubscribe<T> onSubscribeStart(Observable<? extends T> observableInstance, Observable.OnSubscribe<T> onSubscribe) {
    log("onSubscribeStart");
    return super.onSubscribeStart(observableInstance, onSubscribe);
  }
}
{% endhighlight %}

然后调用`RxJavaPlugins. getInstance().registerObservableExecutionHook( new RxJavaObservableSelfHook())`来注册。运行发现报错了“Another strategy was already registered”，看来Observable肯定已经注册了一个而且只允许注册一个。 
在看看RxJavaPlugins这个类，发现有一个reset方法可以重置所有注册的hook，不过这个函数外部无法访问，我们可以用反射来试试。
{% highlight java %}
private void hookObservable() {
  RxJavaPlugins instance = RxJavaPlugins.getInstance();
  Class clazz = instance.getClass();
  Method method = null;
  try {
    method = clazz.getDeclaredMethod("reset");
  } catch (NoSuchMethodException e) {
    e.printStackTrace();
  }
  if (method != null) {
    try {
      method.setAccessible(true);
      method.invoke(instance);
      instance.registerObservableExecutionHook(new RxJavaObservableSelfHook());
    } catch (IllegalAccessException e) {
      e.printStackTrace();
    } catch (InvocationTargetException e) {
      e.printStackTrace();
    }
  }
}
{% endhighlight %}
再次运行时正常了，这下我们可以hook的Log了。

那我们来多测试几种情况来看看执行流程=。=

#### 一次subscribeOn，一次observeOn
{% highlight java %}
Observable.create(new Observable.OnSubscribe<String>() {
  @Override public void call(Subscriber<? super String> subscriber) {
    Log.d(TAG, "Producer in " + Thread.currentThread().getName());
    subscriber.onNext("1");
    subscriber.onCompleted();
  }

}).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).subscribe(new Action1<String>() {
  @Override public void call(String s) {
    Log.d(TAG, "Consumer in " + Thread.currentThread().getName());
  }
})
{% endhighlight %}
输出的log是这样的
{% highlight java %}
11-03 10:17:32.247      664-664/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onCreate..main
11-03 10:17:32.252      664-664/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeStart..main
11-03 10:17:32.252      664-664/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onLift..main
11-03 10:17:32.257      664-664/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onLift..main
11-03 10:17:32.260      664-664/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeReturn..main
11-03 10:17:32.260      664-705/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeStart..RxCachedThreadScheduler-1
11-03 10:17:32.260      664-705/com.fangler.rxdemo D/MainActivity﹕ Producer in RxCachedThreadScheduler-1
11-03 10:17:32.261      664-705/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeReturn..RxCachedThreadScheduler-1
11-03 10:17:32.294      664-664/com.fangler.rxdemo D/MainActivity﹕ Consumer in main
{% endhighlight %}

按函数执行过程分析：在main线程调用create(hook对应onCreate)创建Observable，但是执行流程是反过来的，所以调用subscribe时才会真正执行，subscribe会依次调用hook的onSubscribeStart，onSubscribe的call方法(对应subscribeOn和onserveOn两次lift操作)，hook的onSubscribeReturn。但是subscribeOn的执行放到io线程去执行了，所以Log上有一个新的线程RxCachedThreadScheduler-1生成，而数据的生成在这个线程执行。

#### 两次subscribeOn，一次observeOn
{% highlight java %}
Observable.create(new Observable.OnSubscribe<String>() {
  @Override public void call(Subscriber<? super String> subscriber) {
    Log.d(TAG, "Producer in " + Thread.currentThread().getName());
    subscriber.onNext("1");
    subscriber.onCompleted();
  }

}).subscribeOn(Schedulers.io()).subscribeOn(Schedulers. newThread())
.observeOn(AndroidSchedulers.mainThread()).subscribe(new Action1<String>() {
  @Override public void call(String s) {
    Log.d(TAG, "Consumer in " + Thread.currentThread().getName());
  }
})
{% endhighlight %}
输出Log如下
{% highlight java %}
11-03 10:32:03.827    6079-6079/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onCreate..main
11-03 10:32:03.832    6079-6079/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeStart..main
11-03 10:32:03.832    6079-6079/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onLift..main
11-03 10:32:03.837    6079-6079/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onLift..main
11-03 10:32:03.837    6079-6079/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeReturn..main
11-03 10:32:03.838    6079-6095/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeStart..RxNewThreadScheduler-1
11-03 10:32:03.838    6079-6095/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onLift..RxNewThreadScheduler-1
11-03 10:32:03.841    6079-6095/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeReturn..RxNewThreadScheduler-1
11-03 10:32:03.842    6079-6097/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeStart..RxCachedThreadScheduler-1
11-03 10:32:03.842    6079-6097/com.fangler.rxdemo D/MainActivity﹕ Producer in RxCachedThreadScheduler-1
11-03 10:32:03.842    6079-6097/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeReturn..RxCachedThreadScheduler-1
11-03 10:32:03.851    6079-6079/com.fangler.rxdemo D/MainActivity﹕ Consumer in main
{% endhighlight %}
由于调用了两次suscribeOn且Schedule不同，所以执行流程上多了一个线程。最后生成数据是在里create方法最近的subscribeOn方法对应的Schedule上执行。

#### 两次subscribeOn，两次observeOn
{% highlight java %}
private Subscription subscribeTwice() {
  return Observable.create(new Observable.OnSubscribe<String>() {
    @Override public void call(Subscriber<? super String> subscriber) {
      Log.d(TAG, "Producer in " + Thread.currentThread().getName());
      subscriber.onNext("1");
      subscriber.onCompleted();
    }

  }).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).subscribeOn(Schedulers.newThread())
      .observeOn(Schedulers.newThread()).subscribe(action1);
}
{% endhighlight %}
先看看对应的Log..
{% highlight java %}
11-03 10:38:05.085    8248-8248/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onCreate..main
11-03 10:38:05.090    8248-8248/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeStart..main
11-03 10:38:05.090    8248-8248/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onLift..main
11-03 10:38:05.096    8248-8248/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onLift..main
11-03 10:38:05.097    8248-8248/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeReturn..main
11-03 10:38:05.097    8248-8268/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeStart..RxNewThreadScheduler-2
11-03 10:38:05.098    8248-8268/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onLift..RxNewThreadScheduler-2
11-03 10:38:05.099    8248-8268/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onLift..RxNewThreadScheduler-2
11-03 10:38:05.102    8248-8268/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeReturn..RxNewThreadScheduler-2
11-03 10:38:05.102    8248-8270/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeStart..RxCachedThreadScheduler-1
11-03 10:38:05.102    8248-8270/com.fangler.rxdemo D/MainActivity﹕ Producer in RxCachedThreadScheduler-1
11-03 10:38:05.102    8248-8270/com.fangler.rxdemo D/MainActivity﹕ RxJavaObservableSelfHook onSubscribeReturn..RxCachedThreadScheduler-1
11-03 10:38:05.112    8248-8267/com.fangler.rxdemo D/MainActivity﹕ Consumer in RxNewThreadScheduler-1
{% endhighlight %}
这次subscribeOn和observeOn分别嵌套的调用了两次，反过来看看执行顺序，最后的observeOn传入一个newThread的Schedule，所以最后数据的消费在线程RxCachedThreadScheduler-1中执行，倒数第二的subscribeOn传入的是一个newThread的Schedule，所以生成RxNewThreadScheduler-2线程，它会导致它之前的动作都切换到这个线程来执行，所以我们看到两次onlift都在这个线程执行。在往前的observeOn传入AndroidSchedulers.mainThread()的Schedule，发现它似乎没被用到。最前面的subscribeOn出传入的是io的schedule，同前面一样，最后生成数据是在里create方法最近的subscribeOn方法对应的Schedule上执行。

经过上面的测试我们得出的结论是：
**subscribeOn（schedule），会导致它之前的操作会在shedule对应的线程去执行，而数据的生产只会在离create方法最近的对应的线程执行，数据的消费在离subscribe最近的线程执行。**

或者这样

**数据的生成在里数据创建最近的地方执行，而数据的消费在离数据的订阅最近的地方执行。中间所有的线程只是执行数据变换的地方。**

当然了我们一般也不会用那么多次subscribeOn和observeOn来这么任性的切换线程执行，所以上面的例子只是来加深对这样执行流程和线程切换的理解~~

最后附上测试代码地址：[https://github.com/fangler/RxJavaDemo](https://github.com/fangler/RxJavaDemo)

