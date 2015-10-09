---
layout: post
title: Tips--用代码实现控件点击后的效果
description: Andorid使用代码实现控件点击后的效果,用StateListDrawable和LightingColorFilter来实现控件的点击背景效果
keywords: android, StateListDrawable,LightingColorFilter,点击效果
category: android
tags: [StateListDrawable]
---

*由于在项目中使用到，所以做个备忘来记录android开发中的tips。*

在android开发中经常要给Button等可点击的控件设置不同的状态，这样来区分控件处于点击状态还是未点击状态。一般的做法是使用selector, 如下面：

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
<item android:drawable="@drawable/ic_back_arrow_pressed" android:state_pressed="true"/>
<item android:drawable="@drawable/ic_back_arrow_normal" android:state_pressed="false"/>
<item android:drawable="@drawable/ic_back_arrow_normal" />
</selector>
{% endhighlight %}
我们将上面定义的selector传给控件的background，实际上selector是一个drawable对象，准确的来讲，上面的selector最终会被解析成StateListDrawable类对象

如果我们只是简单想要让控件被点击时颜色深一点或浅一点，这个时候并不需要再去让UI提供一张点击时的图片(特别是有时候当UI都没有的时候)，我们可以用StateListDrawable来实现点击后的效果。

代码事例如下：
{% highlight java %}
/**
 * author: fangler
 * data  : 2015-05-05
 */
 Paint paint = new Paint();
 Resources resources = context.getResources();
 paint.setColorFilter(new LightingColorFilter(Color.rgb(120, 176, 209),0));
 Bitmap bmpArrow = BitmapFactory.decodeResource(resources, R.drawable.ic_back_arrow_normal);
 Bitmap bmpArrowCopy = Bitmap.createBitmap(bmpArrow.getWidth(), bmpArrow.getHeight(), Bitmap.Config.ARGB_8888);
 Canvas canvas = new Canvas(bmpArrowCopy);
 canvas.drawBitmap(bmpArrow, 0, 0, paint);
 StateListDrawable listStates = new StateListDrawable();
 listStates.addState(new int[] {android.R.attr.state_pressed}, new BitmapDrawable(bmpArrowCopy));
 listStates.addState(new int[] { }, new BitmapDrawable(bmpArrow));
 //在此处给mButtonBack设置点击后的背景
 mButtonBack.setBackground(listState);
{% endhighlight %}

其中bmpArrow和bmpArrowCopy分别为点击前后的图片,我们用bmpArrow来创建bmpArrowCopy，通过LightingColorFilter来实现颜色变化达到不同的效果。**(LightingColorFilter中设置的Color值可以根据实际需要进行调整)**


**需要注意的是**:StateListDrawable的addState是有顺序的，范围越大，越要最后调用addState，如果上面的中addState调换位置，就没有效果的。即如果变成这样
{% highlight java %}
 ...省略一些废话

 StateListDrawable listStates = new StateListDrawable();
 listStates.addState(new int[] { }, new BitmapDrawable(bmpArrow));
 listStates.addState(new int[] {android.R.attr.state_pressed}, new BitmapDrawable(bmpArrowCopy));
 //在此处给mButtonBack设置点击后的背景
 mButtonBack.setBackground(listState);

{% endhighlight %}
就不会看到mButtonBack的点击效果了。

在很多时候UI给的背景图片没有考虑到点击后应该是不一样的，或者只是想让点击后背景图片颜色变换一下，就可以用上面的代码来实现啦= =


