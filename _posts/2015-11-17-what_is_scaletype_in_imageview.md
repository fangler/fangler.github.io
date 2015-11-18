---
layout: post
title: ImageView的ScaleType详解
description: ImageView的Scaletype决定了图片在View上显示时的样子，如进行何种比例的缩放，及显示图片的整体还是部分
keywords: ImageView, Scaletype
category: android
tags: [ImageView]
---

    一直对ImageView的ScaleType的几个选项有点陌生，网上的资料也没能让我清楚的知道在什么场景应该选择ScaleType的哪个选项，于是自己用例子来实验了一把。

开始之前：下面会有图来说明这几个选项的区别，每张图片会比较默认的ScaleType和相应的ScaleType选项。其中图片的黑色框框是ImageView的显示边界。

#### FIT_CENTER
将图片按比例扩大/缩放到ImageView的宽高，居中显示。
我的理解：将图片按比例缩放(扩大)直到图片的宽或高与ImageView的宽高相等，然后居中显示。
*这是ImageView的默认处理方式*

#### FIT_XY
不按比例缩放图片，目标是把图片塞满整个View。
我的理解：将图片缩放/扩大直到与ImageView的宽高相等，由于没有按比例缩放，所以会存在宽或高出现拉伸至相同高度。

有图有真相：
![图片加载中...](/images/imageview_fit_xy.png)

#### FIT_START
FIT_START, FIT_END在图片缩放效果上与FIT_CENTER一样，只是显示的位置不同。

#### FIT_END
同上。

我的理解：上面两个属性与FIT_CENTER的缩放方式是一样的，只是最后显示的位置不一样，FIT_CENTER是居中显示，FIT_START是显示在START的位置，FIT_END是显示在END的位置。
关于START和END的位置：
1. 如果图片缩放到与ImageView等宽，那么START在顶部，END在底部。
2. 如果图片缩放到与ImageView等高，那么START在左边，END在右边。

图片如下：
*FIT_START效果*
![图片加载中...](/images/imageview_fit_start.png)
*FIT_END效果*
![图片加载中...](/images/imageview_fit_end.png)

#### CENTER
按图片的原来size居中显示，当图片宽/高超过ImageView的宽/高，则截取图片的居中部分显示。
我的理解：这个是不会改变图片大小的，将图片显示在ImageView中，如果图片宽高超过ImageView的宽高，则将超出的部分裁切到显示。如果图片未超过ImageView大小，则显示原图。

效果如下：
*图片较小的情况*
![图片加载中...](/images/imageview_center_1.png)
*图片超过ImageView大小的情况*
![图片加载中...](/images/imageview_center_2.png)

#### CENTER_CROP
按比例扩大图片的size居中显示，使得图片宽/高等于或大于ImageView的宽/高
我的理解：这个会按比例拉伸图片直到图片的宽高都大于或等于ImageView的宽高，多余的部分被裁切掉。

效果如下：
![图片加载中...](/images/imageview_center_crop.png)

#### CENTER_INSIDE
将图片的内容完整居中显示，通过按比例缩小或原来的size使得图片宽/高等于或小于ImageView的宽/高
我的理解：这个和CENTER_CROP的处理方式类似，只是它会按比例拉伸图片直到图片的宽高都小于或等于ImageView的宽高。
需要注意的是：如果图片的宽高都小于ImageView的宽高时，显示的是原图。

效果如下：
*图片超过ImageView大小的情况*
![图片加载中...](/images/imageview_center_inside_1.png)
*图片较小的情况*
![图片加载中...](/images/imageview_center_inside_2.png)

这下就清楚多了~~

最后附上源码地址：[https://github.com/fangler/AndroidDemos/tree/master/ImageScaleDemo](https://github.com/fangler/AndroidDemos/tree/master/ImageScaleDemo)


