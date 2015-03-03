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

        function tut_keep_up(Step) {

            BubblePosCheck = setInterval(function() {

                var Bubble, Offset, LeftOffset, TopOffset, ArrOffsetLeft, Type, Animation, BubbleHeight, Tut, TutIDVar;

                Bubble = $('.az-tut-bubble');

                if ($(Step.target).is(':visible')) {

                    focus(Step.target, 200);
                    event_bind(Step);

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


                    Bubble.stop().css({top: TopOffset, left: LeftOffset});
                    $("head").append($('<style>.az-tut-bubble:after, .az-tut-bubble:before { left: ' + ArrOffsetLeft + ' !important; }</style>'));

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

            var Bubble, StepID, Step, Offset, LeftOffset, TopOffset, ArrOffsetLeft, Type, Animation, BubbleHeight, Tut, TutIDVar;

            Tut = Tuts[window.azexo_tutorial];
            Bubble = $('.az-tut-bubble');
            BubbleOverlay = $('.az-tut-bubble-overlay');
            StepID = Bubble.data('step');
            if (parseInt(Tut.length) == (StepID + 0)) {
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

                if ($(Step.target).length
                        && $(Step.target).offset().left <= ($(window).width() - $(Step.target).outerWidth())
                        ) {

                    clearInterval(StepCheck);

                    if ($(Step.target).css('position') == 'static') {
                        $(Step.target).css('position', 'relative');
                    }

                    if ($(Step.event_el).css('position') == 'static') {
                        $(Step.event_el).css('position', 'relative');
                    }

//                    $('.az-tut-revert-zindex').each(function() {
//                        $(this).css('z-index', $(this).data('orig-zindex')).removeClass('az-tut-revert-zindex');
//                    });
//
//                    if (Step.target != 'body') {
//                        $(Step.target).data('orig-zindex', $(Step.target).css('z-index')).addClass('az-tut-revert-zindex').css({'z-index': 9999997});
//                    }
//
//                    if ($(Step.event_el).hasClass('az-tut-revert-zindex')) {
//                    } else {
//                        $(Step.event_el).data('orig-zindex', $(Step.event_el).css('z-index')).css({'z-index': 9999997}).addClass('az-tut-revert-zindex');
//                    }

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

                    Offset = $(Step.target).offset();
                    LeftOffset = Offset.left + ($(Step.target).outerWidth() / 2 - Bubble.outerWidth() / 2)

                    var ArrOffsetLeft = '50%';

                    if (LeftOffset < 0) {
                        ArrOffsetLeft = (Bubble.width() / 2) + LeftOffset + $(Step.target).width() / 2 + 15 + 3 + 'px';
                        LeftOffset = 15;
                    }

                    if ((Bubble.outerWidth() + LeftOffset) > $(window).width()) {

                        ArrOffsetLeft = (Bubble.outerWidth() - $(Step.target).width() / 2) - ($(window).width() - ($(Step.target).offset().left + $(Step.target).width())) + 'px';
                        LeftOffset = $(window).width() - Bubble.outerWidth() - 15;

                    }


                    if (Type == 'action') {
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



                    if (Animation == 'fade') {
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

                    $("head").append($('<style>.az-tut-bubble:after, .az-tut-bubble:before { left: ' + ArrOffsetLeft + ' !important; }</style>'));

                }

            }, 300);

        }

        var Tuts = [];

        Tuts['html-elements'] = [
            {
                'type': 'information',
                'label': '<span class="az-tut-bubble-title">Welcome</span>'
                        + '<div class="az-tut-bubble-content">'
                        + 'Welcome to the <strong>Azexo Composer</strong> interactive <strong>tutorial</strong>.<br>'
                        + 'In this step by step guide, we will show you some of the core functionalities.<br>'
                        + '</div>'
                        + '<a href="#" class="az-tut-proceed">Start</a>',
                'target': 'body',
                'event_el': '.az-tut-proceed',
                'event': 'click.tut',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'lets reorder menu',
                'target': 'nav > ul > li a:first-of-type',
                'event_el': 'nav > ul > li a:first-of-type',
                'event': 'mousedown.tut',
                'pos': 'bellow',
                'animation': 'fade',
                'func_start': function() {
                    $('body').on('DOMNodeInserted.tut', 'nav > ul > li .az-sortable-controls', function(e) {
                        $('nav > ul > li .az-sortable-controls').remove();
                    });
                    $('nav > ul > li a').off('click').on('click', function() {
                        return false;
                    });
                },
                'func_end': function() {
                    $('body').off('DOMNodeInserted.tut');
                }
            },
            {
                'type': 'action',
                'label': 'lets reorder menu',
                'target': 'nav > ul',
                'event_el': 'body',
                'event': 'mouseup.tut',
                'pos': 'above',
                'animation': 'slide',
                'func_end': function(node) {
                    if ($('nav > ul > li.az-sortable-placeholder').length == 0) {
                        $('.az-tut-bubble').data('step', 1);
                    }
                }
            },
            {
                'type': 'information',
                'label': '<span class="az-tut-bubble-title">lets clone menu item</span>'
                        + '<div class="az-tut-bubble-content">'
                        + '</div>'
                        + '<a href="#" class="az-tut-proceed">Continue</a>',
                'target': 'body',
                'event_el': '.az-tut-proceed',
                'event': 'click.tut',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'lets clone menu item',
                'target': 'nav > ul > li:first-of-type',
                'event_el': 'nav > ul > li:first-of-type',
                'event': 'mouseenter.tut',
                'pos': 'bellow',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'click here to clone',
                'target': 'nav > ul > li:first-of-type .az-sortable-controls .az-sortable-clone',
                'event_el': 'nav > ul > li:first-of-type .az-sortable-controls .az-sortable-clone',
                'event': 'click.tut',
                'pos': 'bellow',
                'animation': 'fade',
                'func_start': function() {
                    $('nav > ul > li:first-of-type').off('mouseenter.az-sortable');
                    $('nav > ul > li:first-of-type').off('mouseleave.az-sortable');
                }
            },
            {
                'type': 'information',
                'label': '<span class="az-tut-bubble-title">lets remove menu item</span>'
                        + '<div class="az-tut-bubble-content">'
                        + '</div>'
                        + '<a href="#" class="az-tut-proceed">Continue</a>',
                'target': 'body',
                'event_el': '.az-tut-proceed',
                'event': 'click.tut',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'lets remove menu item',
                'target': 'nav > ul > li:first-of-type',
                'event_el': 'nav > ul > li:first-of-type',
                'event': 'mouseenter.tut',
                'pos': 'bellow',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'click here to remove',
                'target': 'nav > ul > li:first-of-type .az-sortable-controls .az-sortable-remove',
                'event_el': 'nav > ul > li:first-of-type .az-sortable-controls .az-sortable-remove',
                'event': 'click.tut',
                'pos': 'bellow',
                'animation': 'fade',
                'func_start': function() {
                    $('nav > ul > li:first-of-type').off('mouseenter.az-sortable');
                    $('nav > ul > li:first-of-type').off('mouseleave.az-sortable');
                }
            },
        ];

        Tuts['html-elements-menu-item'] = [
            {
                'type': 'information',
                'label': '<span class="az-tut-bubble-title">Welcome</span>'
                        + '<div class="az-tut-bubble-content">'
                        + 'Welcome to the <strong>Azexo Composer</strong> interactive <strong>tutorial</strong>.<br>'
                        + 'In this step by step guide, we will show you some of the core functionalities.<br>'
                        + '</div>'
                        + '<a href="#" class="az-tut-proceed">Start</a>',
                'target': 'body',
                'event_el': '.az-tut-proceed',
                'event': 'click.tut',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'lets change one of menu item',
                'target': 'nav > ul',
                'event_el': 'nav > ul > li a',
                'event': 'click.tut',
                'pos': 'bellow',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'lets change text <a href="#" class="az-tut-proceed-2"><strong>click here to continue</strong></a>',
                'target': '#az-editor-modal .mce-edit-area',
                'event_el': '.az-tut-proceed-2',
                'event': 'click.tut',
                'pos': 'above',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'lets change link',
                'target': '#az-editor-modal div.chosen-container-single',
                'event_el': '#az-editor-modal div.chosen-container-single',
                'event': 'click.tut',
                'pos': 'bellow',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'select link',
                'target': '#az-editor-modal div.chosen-container-single .chosen-drop',
                'event_el': '#az-editor-modal div.chosen-container-single ul li',
                'event': 'click.tut',
                'pos': 'above',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'save changes',
                'target': '#az-editor-modal button.save',
                'event_el': '#az-editor-modal button.save',
                'event': 'click.tut',
                'pos': 'above',
                'animation': 'fade',
            },
        ];

        Tuts['html-elements-logo'] = [
            {
                'type': 'information',
                'label': '<span class="az-tut-bubble-title">Welcome</span>'
                        + '<div class="az-tut-bubble-content">'
                        + 'Welcome to the <strong>Azexo Composer</strong> interactive <strong>tutorial</strong>.<br>'
                        + 'In this step by step guide, we will show you some of the core functionalities.<br>'
                        + '</div>'
                        + '<a href="#" class="az-tut-proceed">Start</a>',
                'target': 'body',
                'event_el': '.az-tut-proceed',
                'event': 'click.tut',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'lets change this logo',
                'target': 'img[src*="logo"]',
                'event_el': 'img[src*="logo"]',
                'event': 'click.tut',
                'pos': 'bellow',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'open image library',
                'target': '#az-editor-modal button.ax-glyphicon-picture',
                'event_el': '#az-editor-modal button.ax-glyphicon-picture',
                'event': 'click.tut',
                'pos': 'bellow',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'select image from library',
                'target': '.media-modal-content ul.attachments',
                'event_el': '.media-modal-content ul.attachments li',
                'event': 'click.tut',
                'pos': 'above',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'set image',
                'target': '.media-modal-content a.media-button-insert',
                'event_el': '.media-modal-content a.media-button-insert',
                'event': 'click.tut',
                'pos': 'above',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'save changes',
                'target': '#az-editor-modal button.save',
                'event_el': '#az-editor-modal button.save',
                'event': 'click.tut',
                'pos': 'above',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'lets change link',
                'target': '#az-editor-modal div.chosen-container-single',
                'event_el': '#az-editor-modal div.chosen-container-single',
                'event': 'click.tut',
                'pos': 'bellow',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'select link',
                'target': '#az-editor-modal div.chosen-container-single .chosen-drop',
                'event_el': '#az-editor-modal div.chosen-container-single ul li',
                'event': 'click.tut',
                'pos': 'above',
                'animation': 'fade',
            },
            {
                'type': 'action',
                'label': 'save changes',
                'target': '#az-editor-modal button.save',
                'event_el': '#az-editor-modal button.save',
                'event': 'click.tut',
                'pos': 'above',
                'animation': 'fade',
            },
        ];


        Tuts['site-manage'] = [
        ];


        if ('azexo_tutorial' in window && window.azexo_tutorial in Tuts) {
            tut_proceed();
        }
    });



})(jQuery);
