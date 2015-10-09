# fangler的博客

个人博客模板，当前完成度 80%, 访问[http://fangler.gitcafe.io/](http://fangler.gitcafe.io/)，
[gitcafe repo 地址](https://gitcafe.com/fangler/fangler)

## 本版本的一些说明
本站原始模板来至[https://github.com/P233/P233.github.io](https://github.com/P233/P233.github.io)
感谢~~

站点采用了[amazeui 妹子](http://amazeui.org/)的样式，字体，icon等。
代码高亮采用了`pygmentize`的风格。

## TODO 待完成

* 站内文章搜索功能
* Webkit 换页动画
* 改进文章筛选动画

## 使用方法

### 设置 `_config.yml`

-. `_config.yml` 除基本的站点设置外，新加入了社交链接与评论设置。将需要添加的社交帐号填入对应设置，并取消注释，会在头像下方增加一条社交帐号的链接。支持 Twitter, Weibo, Github, Codepen 以及 Dribbble。
-. `comments`目前只有`duoshuo`，鉴于国内使用多说的比较多。。 
-. `filter` 选项选择使用 `tag` 或 `category` 作为文章分类。
-. 每篇文章的头部可以添加如下的信息
    ---
    layout: post
    author: fangler
    title: 博客的诞生
    description: ubuntu下使用jekyll + bootstrap 搭建博客，搭建jekyllbootstrap主题
    keywords: jekyll, bootstrap, jekyllbootstrap
    category: interest
    tags: [搭建博客]
    show_content_nav: 'true'
    ---
`show_content_nva`会在post文章中自动生成页内导航，在右侧鼠标进入时划入。。

### 修改样式
个人定义的一些样式在`assets/css/main.css`中，一些样式和背景颜色等可以自行修改。。

### 替换图片

请不要忘记替换 `/assets/img/` 内的图片。  
`favicon.ico` 为站点的icon  
`avatar.tar` 是侧边栏头像的图片  
`qrcode.jpg` 会在提示浏览器不兼容时使用。[QR Code 生成器](https://www.unitag.io/qrcode)

如有任何问题，欢迎邮件ifangler#163.com 互相交流学习。(*请把`#`换成`@`*)

