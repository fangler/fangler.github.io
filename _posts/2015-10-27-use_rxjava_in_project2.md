---
layout: post
author: fangler
title: RxJava在项目上的使用2
description: 怎么在项目上使用RxJava和RxAndroid来开发应用
keywords: RxJava,RxAndroid,retrofit
category: android
tags: [RxJava ]
---

这个月主要是学习并理解RxJava，到现在已经完成的7788了，收获很多~~

上一篇讲了辣么多却只讲了一个类Observable，这次争取把其他的都讲完。

### Observer
我们看到Observable的subscribe函数是一个Observer类，如下面: 
`public final Subscription subscribe(final Observer<? super T> observer)`

插一下文档对Observer类的描述（翻译成中文=。=）： 
”当一个Observer调用Observable的subscribe方法时，Observable将会调用Observer的onNext方法来发送数据，一个正确实现的Observable会调用Observer的onCompleted或onError方法最多一次。“ 
再看看Observer类，它是一个接口，定义了onCompleted，onNext，onError三个方法。 
我们看到了subscribe还有接收其他几个参数的方法，比如
{% highlight java %}
public final Subscription subscribe()
public final Subscription subscribe(final Action1<? super T> onNext)
public final Subscription subscribe(final Action1<? super T> onNext, final Action1<Throwable> onError)
public final Subscription subscribe(final Action1<? super T> onNext, final Action1<Throwable> onError, final Action0 onComplete)
public final Subscription subscribe(Subscriber<? super T> subscriber)
private static <T> Subscription subscribe(Subscriber<? super T> subscriber, Observable<T> observable)
{% endhighlight %}
我们查看每个方法的实现，发现它们都会调用`public final Subscription subscribe(Subscriber<? super T> subscriber) `这个方法，比如
{% highlight java %}
public final Subscription subscribe(final Observer<? super T> observer) {
    if (observer instanceof Subscriber) {
        return subscribe((Subscriber<? super T>)observer);
    }
    return subscribe(new Subscriber<T>() {

        @Override
        public void onCompleted() {
            observer.onCompleted();
        }

        @Override
        public void onError(Throwable e) {
            observer.onError(e);
        }

        @Override
        public void onNext(T t) {
            observer.onNext(t);
        }

    });
}
{% endhighlight %}
先判断observer是否是Subscriber，如果是就将subscribe的参数由observer转换为Subscriber，否则参数是新创建的Sunscriber。

subscribe方法的最后还是调用了私有静态方法`private static <T> Subscription subscribe(Subscriber<? super T> subscriber, Observable<T> observable) `。

### Subscriber
上面说到了Observable的subscribe的参数最终都会由Observer转换成Subscriber，来看看Subscriber类 
`public abstract class Subscriber<T> implements Observer<T>, Subscription` 
Subscriber类实现了Observer和Subscription两个接口，所以Subscriber类可以当作Observer类来使用，至于SubScription类下面再讲。 
这个类的描述（同样翻译成中文）：
”当一个Subscriber 调用Observable的subscribe方法时，Observable将会调用Subscriber 的onNext方法来发送数据，一个正确实现的Observable会调用Subscriber 的onCompleted或onError方法最多一次。 “
尼玛这完全和Observer类描述一样啊，那当然了，因为这两个类本来就是实现相同的功能啊=。=  
不过我总觉得不应该这个翻译，应该翻译成：
”当Observable的subscribe方法被调用时，Observable将会调用Subscriber 的onNext方法来发送数据，一个正确实现的Observable会调用Subscriber 的onCompleted或onError方法最多一次。 “  
因为subscribe的方法并不是静态方法，其他人并不能调用它，而且我们使用时subscribe方法都是由Observable调用的=。=

**基本上我们都不会直接使用Observer类，而是使用Subscriber类来代替。**
SubScriber类的使用场景就多了，比如  
`public interface OnSubscribe<T> extends Action1<Subscriber<? super T>>`  
`public interface Operator<R, T> extends Func1<Subscriber<? super R>, Subscriber<? super T>>`
这个接口都间接的和Subscriber发生着关系~~  
最重要的是subscribe方法，它的实现，我们看到如果没有发生异常就是返回了参数Subscriber。

### Subscription
Subscriber类实现了另一个接口就是Subscription，它定义了两个方法unsubscribe和isUnsubscribed。
它的更多实现在rx.subscriptions这个包里面可以看到，比如常见的CompositeSubscription类等。

它的使用场景主要是调用unsubscribe来取消事件的订阅。Observable的subscribe方法返回的就是一个Subscription。  
然后可以在Activity的onPause事件中调用unsubscribe 取消所有事件来避免内存泄漏。

### Producer
这个接口是支持“backpressure”来使用的，一般在Sunscriber的子类中使用的比较多。  
"backpressure"是为了避免这种情况： Fast producer slow consumer，即数据生产的太快而消费的太慢导致的不平衡。  
我们一般很少会自己来使用它。

### Notification
这个类在Observable的几个比较少的方法中有使用，它可以携带数据，所以在有些场合使用比较方便，同样我们使用的情况比较少。

### 其他
rx.subjects包中还有一个类Subject也是比较神奇的类。同样我们使用的情况也比较少。等以后用到了拿例子来说明下。


附（学习RxJava的一些参考网站）：
[官网http://reactivex.io/](http://reactivex.io/)  
[http://rxmarbles.com/生动的图像](http://rxmarbles.com/)  
[http://www.introtorx.com/](http://www.introtorx.com/)  
[http://rxwiki.wikidot.com/](http://rxwiki.wikidot.com/)  
[ReactiveX文档中文翻译](https://www.gitbook.com/book/mcxiaoke/rxdocs/details)

