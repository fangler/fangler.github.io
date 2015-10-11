---
layout: post
author: fangler
title: "使用angualarjs开发网站"
keywords: angularjs, html5
category: interest
tags: [angularjs]
---

最近一个月都是在改博客的风格，弄了很久才弄成现的这个样式，总体还是比较满意。然后是弄了一个新的图片网站，搭建在新浪SAE平台上。



还是先看看新的图片网站的效果，[在这里可以看到](http://fangler.sinaapp.com/)

主要是用到了一个开源的html5响适应模版(Lens by HTML5 UP)，在手机和平板上体验也是不错的。

模版中的图片路径固写在了index.html中，这不是我想要的效果，我希望可以把图片的一些信息写在js里面，然后用js来动态生产标签，这样可以方便的自己定义需要显示的图片。想起很久以前学习过angularjs这个google的js库有这样的功能，所以准备学习下，顺便试用下。

主要说一说其中用到的一些技术

##图片云存储--七牛云存储
由于新浪SAE的代码空间只要100M,而我的图片都是相机拍摄的，单个图片6、7M左右，显然直接放到SAE空间不够。于是把图片全传到七牛云上去了，有1G的免费空间可以用。  
而且七牛的图片API不错，用过才知道~~

##使用Angularjs自动生成标签
由于网站是用python tornado web框架部署在新浪云上，而tornado的解释器与angularjs会有冲突。  
**1. 我们先把angularjs的解释器替换掉,这里替换成"[["和"]]"**

{% highlight js %}
angular.module('fanglerApp', [], function($interpolateProvider){
    // use `[[` & `]]` for interpolate
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
})
{% endhighlight %}

这样我们就可以使用"[["和"]]"来表示angularjs语法。

**2. 使用angularjs命令**

{% highlight html %}
<article ng-repeat="picture in pictures" on-finish-render-filters>
	<a class="thumbnail" ng-href="[[picture.full]]" data-position="left center"><img ng-src="[[picture.thumbnail]]" alt="" /></a>
	<h2 ng-bind="picture.title"></h2>
	<p ng-bind="picture.body"></p>
</article>
{% endhighlight %}

上面ng-repeat命令生产标签，从pictures取数据

咋一看貌似没有什么问题，后来发现另外一个js有一段初始化语句会比angularjs执行的块，也就是说在ng-repeat还没执行完的时候，就改变了，导致h2和p标签不能显示正确的值。

**3. 监听ng-repeat执行结束**

要解决上面那个问题，我们要监听ng-repeat执行完，然后在执行其他js初始化语句。  
我们用到下面的方法：
{% highlight js %}
angular.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
{% endhighlight %}

上面重新定义了一个angular属性，在执行完后会发出一个`ngRepeatFinished`事件，我们监听这个事件：
{% highlight js %}
$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
  // 一些其他初始话脚本

});
{% endhighlight %}
我们在ng-repeat所在的标签中增加`on-finish-render-filters`这个属性就可以监听到事件了。

最后终于可以在js中配置这些数据，来让angularjs帮我自动生成。
{% highlight js %}
$scope.pictures = [
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4517.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4517.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"牛肉面", body:"面还是不错滴"},
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4521.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4521.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"崂山外", body:"这是外景"},
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4524.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4524.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"背影", body:"美女的背景~~"},
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4527.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4527.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"上山路上", body:"那边风景才是最好的"},
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4534.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4534.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"艺术", body:"书法太好了"},
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4565.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4565.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"美景", body:"天气真正好"},
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4669.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4669.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"山上的水库", body:"隐藏在山间"},
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4674.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4674.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"海边", body:"下山看海来"},
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4675.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4675.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"海", body:"好想下去游泳去~"},
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4678.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4678.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"海边", body:"海边的风景~~"},
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4681.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4681.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"出口", body:"这是出口处的标志"},
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4692.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4692.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"海边", body:"海边玩沙子"},
	  {thumbnail:'http://7xllue.com1.z0.glb.clouddn.com/IMG_4778.JPG?imageView2/0/w/360/h/225', 
	  	full:"http://7xllue.com1.z0.glb.clouddn.com/IMG_4778.JPG?imageView2/2/w/1500/h/1000", 
	  	title:"企鹅", body:"看企鹅去了~"},
	]
{% endhighlight %}

发现做网站还真的比较麻烦的，最近只是偶尔心血来潮来弄一弄，等以后有机会了在来学习慢慢折腾~~