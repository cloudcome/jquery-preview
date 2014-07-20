/*!
 * jquery-preview.js
 * @author  ydr.me
 * @version 1.0
 */





/**
 * API
 * 
 */



module.exports = function($){
    'use strict';

    var win = window,
        prefix = 'jquery-preview____',
        doc = win.document,
        // 支持 URL 对象
        supportURLCreate = !! win.URL && !! win.URL.createObjectURL,
        // 支持 FileReader 对象
        // supportFileReader = !! win.FileReader,
        // 支持 IE 滤镜
        hasFilter = _hasFilter(),
        defaults = {
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

    $.fn.preview = function (settings) {
        return this.each(function () {
            var $element = $(this),
                preview = $element.data(prefix),
                options = $.extend({}, defaults, settings);
            if (!preview) {
                $element.data(prefix, new Preview($element, options));
            }
        });
    };
    $.fn.preview.defaults = defaults;

    function Preview($element, options) {
        var $preview = options.$preview;
        $element.change(function () {
            var path = this.value,
                files, i = 0,
                file, $imgs = $(),
                imgName, imgs = [],
                errorIndex = [],
                src, hasProcess = 0,
                width = $preview.width(),
                height = $preview.height();

            $preview.empty();

            // html5
            if (this.files && this.files.length) {
                if (supportURLCreate) {
                    files = options.multiple ? this.files : this.files[0];
                    for (; i < files.length; i++) {
                        file = files[i];
                        if (_parseImg(options.suffix, file.name)) {
                            imgs.push(file.name);
                            src = win.URL.createObjectURL(file);
                            $imgs = $imgs.add($('<img src="' + src + '"/>'));
                        } else {
                            errorIndex.push(i + 1);
                        }
                    }
                    $preview.html($imgs);
                    options.onsuccess.call(this, imgs);
                    if (errorIndex.length) options.onerror.call(this, errorIndex);
                    hasProcess = 1;
                }
            } else if (path && (imgName = _parseImg(options.suffix, path))) {
                imgs.push(imgName);
                // ie
                if (hasFilter) {
                    this.select();
                    src = doc.selection.createRange().text;
                    doc.selection.empty();
                    try {
                        options.onsuccess.call(this, imgs);
                        $preview.css({
                            filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)',
                            width: width,
                            height: height
                        }).get(0).filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
                        hasProcess = 1;
                    } catch (e) {
                        options.onsuccess.call(this, imgs);
                        $('<img src="' + src + '"/>').css({
                            width: width,
                            height: height
                        }).appendTo($preview);
                        hasProcess = 1;
                    }
                }
            } else {
                hasProcess = 1;
                options.onsuccess.call(this, imgs);
            }
            if (!hasProcess) throw ('无法支持本地预览！');
        });
    }

    /**
     * 解析图片并返回图片名称
     * @param  {Array}  允许的图片后缀数组
     * @param  {String} 图片路径
     * @return {Array/Null}
     * @version 1.0
     * 2014年4月9日15:41:01
     */

    function _parseImg(suffix, path) {
        var reg = new RegExp('[\\\\\\/]?([^\\\\\\/]*?(?:' + ['png', 'jpg'].join('|') + '))$', 'i');
        return path.match(reg);
    }


    function _hasFilter() {
        var $div = $('<div style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=image);"></div>').appendTo('body'),
            filter = $div.css('filter');
        $div.remove();
        return /progid/.test(filter);
    }
};
