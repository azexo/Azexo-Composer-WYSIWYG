(function($) {

    $(window).load(function() {

        $('body').append('<div class="az-tut-prevent"></div><div class="az-tut-bubble-overlay"></div><div class="az-tut-bubble" data-step="0"></div>');
        focus('body', 0);
        var BubblePosCheck;

        $(document).on('mousedown', '.az-tut-prevent .top, .az-tut-prevent .right, .az-tut-prevent .bottom, .az-tut-prevent .left', function(e) {
            $('.az-tut-bubble:not(:animated)').css({marginTop: 5});
            setTimeout(function() {
                $('.az-tut-bubble:not(:animated)').css({marginTop: 10});
                setTimeout(function() {
                    $('.az-tut-bubble:not(:animated)').css({marginTop: 5});
                    setTimeout(function() {
                        $('.az-tut-bubble:not(:animated)').css({marginTop: 0});
                    }, 20);
                }, 20);
            }, 20);
        });

        function focus(target, duration) {
            var focus_padding = 0;
            if ($('.az-tut-prevent div').length == 0)
                $('.az-tut-prevent').append('<div class="top"></div><div class="right"></div><div class="bottom"></div><div class="left"></div>');
            var top = $('.az-tut-prevent .top');
            var right = $('.az-tut-prevent .right');
            var bottom = $('.az-tut-prevent .bottom');
            var left = $('.az-tut-prevent .left');
            var target_top = $(target).offset()['top'] - focus_padding - $('body').scrollTop();
            var target_left = $(target).offset()['left'] - focus_padding;
            var target_width = $(target).outerWidth() + focus_padding * 2;
            var target_height = $(target).outerHeight() + focus_padding * 2;
            $(top).stop().animate({
                top: 0,
                left: 0,
                right: 0,
                height: target_top,
            }, duration, 'linear');
            $(right).stop().animate({
                top: target_top,
                left: target_left + target_width,
                right: 0,
                height: target_height,
            }, duration, 'linear');
            $(bottom).stop().animate({
                top: target_top + target_height,
                left: 0,
                right: 0,
                bottom: 0,
            }, duration, 'linear');
            $(left).stop().animate({
                top: target_top,
                left: 0,
                height: target_height,
                width: target_left,
            }, duration, 'linear');
        }

        function update_position(Step, init) {
            var Bubble, Offset, LeftOffset, TopOffset, ArrOffsetLeft;

            Bubble = $('.az-tut-bubble');

            Offset = $(Step.target).offset();
            LeftOffset = Offset.left + ($(Step.target).outerWidth() / 2 - Bubble.outerWidth() / 2)

            if (LeftOffset < 0) {
                ArrOffsetLeft = (Bubble.width() / 2) + LeftOffset + $(Step.target).width() / 2 + 15 + 3 + 'px';
                LeftOffset = 15;
            }

            if ((Bubble.outerWidth() + LeftOffset) > $(window).width()) {

                ArrOffsetLeft = (Bubble.outerWidth() - $(Step.target).width() / 2) - ($(window).width() - ($(Step.target).offset().left + $(Step.target).width())) + 'px';
                if (parseInt(ArrOffsetLeft) > (Bubble.outerWidth() - 20)) {
                    ArrOffsetLeft = Bubble.outerWidth() - 20 + 'px';
                }
                LeftOffset = $(window).width() - Bubble.outerWidth() - 15;

            }

            if (Step.type == 'action') {
                if (Step[ 'pos' ] == 'above')
                    TopOffset = Offset.top - Bubble.outerHeight() - 10;
                else
                    TopOffset = Offset.top + $(Step.target).outerHeight() + 10;
            } else {
                TopOffset = BubbleOverlay.height() / 2 - Bubble.outerHeight() / 2;
            }

            if ($('#wpadminbar').length) {
                TopOffset -= $('#wpadminbar').outerHeight();
            }

            if ($('.az-container.azexo-editor').length) {
                TopOffset -= parseInt($('.az-container.azexo-editor').css('margin-top'));
            }

            if (init) {
                if (Step.animation == 'fade') {
                    Bubble.stop().css({top: TopOffset + 20, left: LeftOffset}).animate({top: TopOffset, opacity: 1}, 400, function() {
                        if (Step[ 'keep_up' ] && Step['type'] == 'action')
                            tut_keep_up(Step);
                    });
                } else {
                    Bubble.stop().css({opacity: 1}).animate({top: TopOffset, left: LeftOffset}, 400, function() {
                        if (Step[ 'keep_up' ] && Step['type'] == 'action')
                            tut_keep_up(Step);
                    });
                }
            } else {
                Bubble.stop().css({top: TopOffset, left: LeftOffset});
            }

            $("head .az-tut-bubble-arr-offset").remove();
            $("head").append($('<style class="az-tut-bubble-arr-offset">.az-tut-bubble:after, .az-tut-bubble:before { left: ' + ArrOffsetLeft + ' !important; }</style>'));
        }

        function tut_keep_up(Step) {
            BubblePosCheck = setInterval(function() {
                if ($(Step.target).is(':visible')) {
                    focus(Step.target, 200);
                    event_bind(Step);
                    update_position(Step, false);
                }
            }, 200);

        }

        function event_bind(Step) {
            if ($(Step.event_el).length) {
                $(Step.event_el).off(Step.event).on(Step.event, function() {
                    $(Step.event_el).off(Step.event);
                    if (Step[ 'func_end' ] !== undefined) {
                        Step[ 'func_end'](this);
                    }
                    tut_proceed();
                });
            }
        }

        function tut_proceed() {

            var Bubble, StepID, Step, Type, Animation, Tut;

            Tut = window.azexo_tutorials[window.azexo_tutorial];
            Bubble = $('.az-tut-bubble');
            BubbleOverlay = $('.az-tut-bubble-overlay');
            StepID = Bubble.data('step');
            if (parseInt(Bubble.length) == 0 || parseInt(Tut.length) == (StepID + 0)) {
                Bubble.remove();
                BubbleOverlay.remove();
                $('.az-tut-prevent').remove();
                return;
            }

            Step = Tut[ StepID ];
            Type = Step.type;
            Animation = Step.animation;

            if (Step[ 'pos' ] !== undefined) {
            } else {
                Step[ 'pos' ] = 'above';
            }

            if (Step[ 'keep_up' ] !== undefined) {
            } else {
                Step[ 'keep_up' ] = true;
            }

            clearInterval(BubblePosCheck);
            event_bind(Step);


            var StepCheck = setInterval(function() {

                if ($(Step.target).length) {

                    clearInterval(StepCheck);

                    if ($(Step.target).css('position') == 'static') {
                        $(Step.target).css('position', 'relative');
                    }

                    if ($(Step.event_el).css('position') == 'static') {
                        $(Step.event_el).css('position', 'relative');
                    }

                    Bubble.data('step', StepID + 1)

                    if (Animation == 'fade')
                        Bubble.css({opacity: 0});

                    if ('azexo_t' in window)
                        Bubble.html(window.azexo_t(Step.label));
                    else
                        Bubble.html(Step.label);


                    if (Step[ 'func_start' ] !== undefined) {
                        Step[ 'func_start']();
                    }

                    event_bind(Step);

                    Bubble.removeClass('az-tut-bubble-type-action az-tut-bubble-type-information').addClass('az-tut-bubble-type-' + Type);
                    Bubble.removeClass('az-tut-bubble-pos-above az-tut-bubble-pos-bellow').addClass('az-tut-bubble-pos-' + Step['pos']);

                    if (Type == 'information')
                        BubbleOverlay.fadeIn(300);
                    else
                        BubbleOverlay.fadeOut(200);

                    update_position(Step, true);
                }

            }, 300);

        }

        if ('azexo_tutorial' in window && 'azexo_tutorials' in window && window.azexo_tutorial in window.azexo_tutorials) {
            tut_proceed();
        }
    });



})(jQuery);
