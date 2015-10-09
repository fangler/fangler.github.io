---
layout: post
title: Tips--给ListView等布局控件做个动画吧
description: LayoutAnimationController用于为一个layout里面的控件，或者是一个ViewGroup里面的控件设置动画效果（即整个布局）
keywords: android, LayoutAnimationController
category: android
tags: [LayoutAnimationController]
---

﻿有个需求是要给GridView做个这样的动画，GridView第一次呈现的时候，里面的每个图标(GridView的元素就是个图标加文字的组合)要有个由小变大的效果，而不是突然的出现

网上查找后，原来有个好用的东西，赶紧记录下来

**LayoutAnimationController**

1. LayoutAnimationController用于为一个layout里面的控件，或者是一个ViewGroup里面的控件设置动画效果（即整个布局）
2. 每一个控件都有相同的动画效果
3. 这些控件的动画效果在不同的时间显示出来
4. LayoutAnimationController可以在xml文件当中设置，也可以在代码中进行设置

**LayoutAnimationController的使用**
首先定义动画item_scale_in.xml
{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<scale xmlns:android="http://schemas.android.com/apk/res/android"
android:duration="2000"
android:fillAfter="true"
android:fromXScale="0.0"
android:fromYScale="0.0"
android:interpolator="@android:anim/overshoot_interpolator"
android:pivotX="50.0%"
android:pivotY="50.0%"
android:toXScale="1.0"
android:toYScale="1.0" />
{% endhighlight %}

在代码中这样引用
{% highlight java %}
/**
 * author: fangler
 * data  : 2015-05-15
 */
 Animation animation = (Animation) AnimationUtils.loadAnimation(appContext, R.anim.item_scale_in);
 LayoutAnimationController lac = new LayoutAnimationController(animation);
 lac.setOrder(LayoutAnimationController.ORDER_NORMAL); //设置动画顺序
 lac.setDelay(0.5f);//注意这个地方是以秒为单位，是浮点型数据，所以要加f
 gridview.setLayoutAnimation(lac);
{% endhighlight %}

最中的GridView的动画效果如下图所示

![图片加载中...](/images/android-tips-layoutanimationcontroller.gif)

效果感觉还是挺不错的，上面由于是试验就把duration设置成2000，实际开发的时候就不要设为这么大了，否则就太变态啦= = 
