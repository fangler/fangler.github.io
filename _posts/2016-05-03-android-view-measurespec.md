---
layout: post
title: Android View 的 MeasureSpec
description: Android View的MeasureSpec使用
keywords: Android, MeasureSpec
category: android
tags: [Android]
---

MeasureSpec是View的内部静态类，一个MeasureSpec封装了父布局传递给子布局的布局要求，每个MeasureSpec代表了一组宽度和高度的要求。
一个MeasureSpec由大小和模式组成。
它有三种模式：
UNSPECIFIED(未指定),父元素部队自元素施加任何束缚，子元素可以得到任意想要的大小；
EXACTLY(完全)，父元素决定自元素的确切大小，子元素将被限定在给定的边界里而忽略它本身大小；
AT_MOST(至多)，子元素至多达到指定大小的值。

它常用的三个函数：
1.static int getMode(int measureSpec):根据提供的测量值(格式)提取模式(上述三个模式之一)
2.static int getSize(int measureSpec):根据提供的测量值(格式)提取大小值(这个大小也就是我们通常所说的大小)
3.static int makeMeasureSpec(int size,int mode):根据提供的大小值和模式创建一个测量值(格式)

我们通常在自定义View的onMeasure方法中使用它， 在Android的View类中的getDefaultSize使用到了它
```java
    public static int getDefaultSize(int size, int measureSpec) {
        int result = size;
        int specMode = MeasureSpec.getMode(measureSpec);
        int specSize = MeasureSpec.getSize(measureSpec);

        switch (specMode) {
        case MeasureSpec.UNSPECIFIED:
            result = size;
            break;
        case MeasureSpec.AT_MOST:
        case MeasureSpec.EXACTLY:
            result = specSize;
            break;
        }
        return result;
    }
```

我们通过他的getMode和getSize分别提取他的specMode和specSize， 然后根据specMode来得到最终的size.