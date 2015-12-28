---
layout: post
title: EditText输入类型为密码时显示/隐藏密码内容
description: android的登录页面的用户名和密码输入框中会有选项 显示密码，当点击时显示或隐藏密码输入框中的内容
keywords: EditText
category: android
tags: [android]
---


![图片飞走了](/images/edittext_show_password.gif)    
​ 
    常见的android的登录页面的用户名和密码输入框中会有选项 “显示密码”，
当点击时显示或隐藏 密码输入框中的内容，这个功能如何实现呢。
有下面的两种方式可以实现：

#### 1. 使用HideReturnsTransformationMethod 和  PasswordTransformationMethod
{% highlight java %}
((CheckBox) findViewById(R.id.check)).setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        if(isChecked){
            editText.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
        }else {
            editText.setTransformationMethod(PasswordTransformationMethod.getInstance());
        }
    }
});
{% endhighlight %}

   注：其中 R.id.check 是 “显示密码” 的Checkbox , editText 是密码输入框 EditText。

#### 2.使用InputType.TYPE_TEXT_VARITION_VISIBLE_PASSWORD 和InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_VARIATION_PASSWORD

{% highlight java %}
((CheckBox) findViewById(R.id.check2)).setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
   @Override
   public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
       if(isChecked){
           editText.setInputType(InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
       }else {
           editText.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
       }
   }
});
{% endhighlight %}
注： 描述 同 1。
