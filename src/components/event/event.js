/**
 * UPDATES AND DOCS AT: https://github.com/BNDong
 * https://www.cnblogs.com/bndong/
 * @author: BNDong, dbnuo@foxmail.com
 * ----------------------------------------------
 * @describe: 事件监听
 */

export default function main(_) {

    let eventFun = {
        init: () => {

            /**
             * 滚动监听
             */
            _.__event.scroll = {};
            _.__event.scroll.handle = [];
            _.__event.scroll.temScroll  = 0; // 上一次页面滚动位置
            _.__event.scroll.docScroll  = $(document).scrollTop(); // 当前滚动位置
            _.__event.scroll.homeScroll = $('#home').offset().top - 40; // 主体滚动

            // 当发生窗口滚动时，执行以下代码
            $(window).scroll(() => {
                // 更新当前滚动位置数据
                _.__event.scroll.docScroll  = $(document).scrollTop();
                // 更新主页位置数据
                _.__event.scroll.homeScroll = $('#home').offset().top - 40;
                // 执行滚动处理函数
                eventFun.handle.scroll();
                // 更新上一次滚动位置数据
                _.__event.scroll.temScroll = _.__event.scroll.docScroll;
            });

            /**
             * 窗口大小监听
             */
            _.__event.resize = {};
            _.__event.resize.handle = [];

            // 当发生窗口大小变化时，执行以下代码
            $(window).resize( () => {
                eventFun.handle.resize();
            });
        },

        handle: {
            scroll: () => {
                for (let i = 0; i < _.__event.scroll.handle.length; i++) {
                    (_.__event.scroll.handle[i])();
                }
            },
            resize: () => {
                for (let i = 0; i < _.__event.resize.handle.length; i++) {
                    (_.__event.resize.handle[i])();
                }
                // 目的就是为了保证主页内容和头部的对齐，响应式布局中头部高度变化时及时更新主页位置
                _.__tools.setDomHomePosition();
            },
        }
    };

    return eventFun;
}