/**
 *
 * @param id
 * @param config
 * @returns {{start: start, resetPositionBar: resetPositionBar}}
 * @constructor
 */
HySlider = function (id, config) {
    config = config || {};
    config.width = config.width || '100%';
    config.height = config.height || '300';
    config.delay = config.delay || '2';
    config.posBar = config.posBar || id;
    var posBarContainer = $('#' + config.posBar);

    var solider = $('#' + id);

    solider.css({
        width:config.width,
        height:config.height
    });
    if(config.heightRatio) {
        config.height = solider.width() * config.heightRatio;
        solider.css({height:config.height});
    }
    // 当前宽高比
    var wh = solider.height() / solider.width();

    var wrapper = solider.children('.WRAPPER');
    var itemCount = wrapper.children('li').length;
    wrapper.css({
        width: parseInt(solider.width()) * itemCount,
        height: parseInt(config.height),
        left: 0,
        position: 'absolute'
    });

    solider.find('li').css({width:solider.width()});

    //  设置位置指示条
    var posItemTpl = "<i class='HY-SLIDER-POSITION-DOT' tag='#index#'></i>";
    var posBarTpl = "<div class='HY-SLIDER-POSITION-BAR clearfix'>#dots#</div>";
    var dots = '';
    for (var idx = 0; idx < itemCount; idx++)
        dots += posItemTpl.replace('#index#', idx);
    posBarContainer.append(posBarTpl.replace('#dots#', dots));
    if(config.posBar !== id) {
        posBarContainer.css({
            position : 'relative',
            height : posBarContainer.find('.HY-SLIDER-POSITION-BAR').height()
        })
    }

    function move(callback) {
        if (showIndex >= itemCount) showIndex = 0;
        posBarContainer.find('.HY-SLIDER-POSITION-DOT').removeClass('ACTIVED');
        posBarContainer.find('.HY-SLIDER-POSITION-BAR [tag="' + showIndex + '"]').addClass('ACTIVED');
        wrapper.animate({
            left: 0 - (parseInt(solider.width()) * showIndex)
        }, callback)
    }
    var showIndex = 0;  // 当前的index
    var timer;
    var running = false;
    function next() {
        if(!running) return;
        timer = setTimeout(function (callback) {
                showIndex++;
                move(callback);
            }, config.delay * 1000, function () {
                next();
            }
        );

    }

    function _resize(nw,nh) {
        config.width = nw;
        config.height = nh;
        solider.css({
            width:config.width,
            height:config.height
        });
        wrapper.css({
            width: parseInt(solider.width()) * itemCount,
            height:parseInt(solider.height())
        });
        solider.find('li').css({
            width:solider.width(),
            height:solider.height()
        });
        wrapper.css({left:0});
        showIndex = 0;
    }

    return {
        start: function () {
            showIndex = 0;
            running = true;
            move();
            next();
        },
        stop : function() {
            running = false;
            clearTimeout(timer);
            showIndex = 0;
        },
        resize : function(nw, nh) {
           _resize(nw,nh);
        },
        /**
         * 重置宽度
         * @param w 新宽度
         * @param keepWH 是否保持宽高比,缺省为保持
         */
        resizeWidth : function(w,keepWH) {
            if(keepWH==undefined) keepWH = true;
            solider.css({width:w});
            var nh = solider.height();
            if(keepWH==true){
                nh = solider.width() * wh;
            } else { // 重计算宽高比
                wh = solider.height() / solider.width();
            }
            _resize(w,nh);
        }
    }
};

