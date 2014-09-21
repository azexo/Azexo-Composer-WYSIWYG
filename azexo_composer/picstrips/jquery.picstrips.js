/**
 * jQuery PicStrips plugin
 * http://www.moreofless.co.uk/picstrips/
 */
(function($) {
    $.fn.picstrips = function(options) {
        var settings = $.extend({
            'splits':   8,
            'hgutter':  '10px',
            'vgutter':  '60px',
            'bgcolor':  '#fff'
        }, options);
        return this.each(function() {
            var strips = this;
            function callStrips() {
                var $bars = drawPicStrips(strips, null);
				jQuery(window).on("debouncedresize", function(event) {
                    $(strips).show();
                    $bars = drawPicStrips(strips, $bars);
				});
            }
            function drawPicStrips(strips, $bars) {
                var h = $(strips).height(),
                    w = $(strips).width(),
                    hgutterWidth = parseInt(settings.hgutter, 10),
                    sw = ((w - (hgutterWidth * settings.splits)) / settings.splits), //width of a strip
                    clstyle =       'position: relative; float:left; margin-right: ' + settings.hgutter + '; background-image: url(' + strips.src + '); width: ' + sw + 'px; height: ' + h + 'px; background-size: auto ' + h + 'px; ',
                    spstyle =       'position: absolute; left: 0px; width: ' + sw + 'px; height: ' + settings.vgutter + '; background-color: ' + settings.bgcolor + '; top: ',
                    laststyle =     'position: relative; float:left; background-image: url(' + strips.src + '); width: ' + sw + 'px; height: ' + h + 'px; background-size: auto ' + h + 'px; ';
                if ($bars) {
                    $bars.remove();
                }
                var cnt = $('[id^=molbars_]').length + 1;
                $bars = $('<div id="molbars_' + cnt + '"></div>');
                $bars.insertAfter($(strips));
                var hoffs = 0;
                for (var lp = 0; lp < settings.splits; lp++) {
                    var voffs = (lp % 2 !== 0 ? '0px' : (h - parseInt(settings.vgutter, 10)) + 'px');
                    clstyle += ' background-position: -' + hoffs + 'px 100%;';
                    laststyle += ' background-position: -' + hoffs + 'px 100%;';
                    if (lp === settings.splits - 1) {
                        $('<div style="' + laststyle + '"><span style="' + spstyle + voffs + '"></span></div>').appendTo($bars);
                    } else {
                        $('<div style="' + clstyle + '"><span style="' + spstyle + voffs + '"></span></div>').appendTo($bars);
                    }
                    hoffs += sw + hgutterWidth;
                }
                $(strips).hide();
                return $bars;
            }
            if (!this.complete || this.width + this.height === 0) {
                var img = new Image();
                img.src = this.src;
                $(img).load(function() {
                    callStrips();
                });
            } else {
                callStrips();
            }
        });
    };
})(jQuery);