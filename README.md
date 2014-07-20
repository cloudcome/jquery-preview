# jquery-preview [![spm version](http://spmjs.io/badge/jquery-preview)](http://spmjs.io/package/jquery-preview)

AUTHOR WEBSITE: [http://ydr.me/](http://ydr.me/)

jquery.fn.preview 本地图片预览

**五星提示：当前脚本未作优化、未完工，请勿用在生产环境**

__IT IS [A SPM PACKAGE](http://spmjs.io/package/jquery-preview).__




#USAGE
```
var $ = require('jquery');
require('jquery-preview')($);

$('#demo').preview(settings);
```



#OPTIONS
```
$.fn.preview.defaults = {
    // 允许文件后缀
    suffix: ['png', 'jpg', 'gif'],

    // 是否允许多图，如果支持的话
    multiple: true,

    // 预览图片容器对象
    // HTML5中，不会设置图片的尺寸
    // HTML4中，会强制设置图片的尺寸，根据预览区的尺寸
    $preview: null,

    // 成功回调
    // @this: this
    // @imgs: ['imageName.png'...] 图片名称数组，可能是空数组
    onsuccess: $.noop,

    // 失败回调
    // @this: this
    // @error: [1,2...] 错误序号，从1开始
    onerror: $.noop
};
```
