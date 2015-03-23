(function($) {
    var p = '';
    var fp = '';
    if ('azexo_prefix' in window) {
        p = window.azexo_prefix;
        fp = window.azexo_prefix.replace('-', '_');
    }
    function toAbsoluteURL(url) {
        if (url.search(/^\/\//) != -1) {
            return window.location.protocol + url
        }
        if (url.search(/:\/\//) != -1) {
            return url
        }
        if (url.search(/^\//) != -1) {
            return window.location.origin + url
        }
        var base = window.location.href.match(/(.*\/)/)[0]
        return base + url
    }
    function t(text) {
        if ('azexo_t' in window) {
            return window.azexo_t(text);
        } else {
            return text;
        }
    }
    function lang() {
        if ('azexo_lang' in window) {
            return window.azexo_lang;
        } else {
            return 'en';
        }
    }

    window.azexo_open_popup = function(url) {
        window.open(url, '', 'location,width=800,height=600,top=0');
    }
    function azexo_get_links(folder, link_types, callback) {
        $.ajax({
            type: 'POST',
            url: window.azexo_baseurl + 'ajax.php',
            data: {
                action: 'get_links',
                folder: folder,
                link_types: link_types,
            },
            dataType: "json",
            cache: false,
            context: this
        }).done(function(data) {
            callback(data);
        });
    }
    function chosen_select(options, input) {
        var single_select = '<select>';
        for (var key in options) {
            single_select = single_select + '<option value="' + key + '">"' + options[key] + '"</option>';
        }
        single_select = single_select + '</select>';
        $(input).css('display', 'none');
        var select = $(single_select).insertAfter(input);
        if ($(input).val().length) {
            $(select).append('<option value=""></option>');
            var value = $(input).val();
            if (!$(select).find('option[value="' + value + '"]').length) {
                $(select).append('<option value="' + value + '">"' + value + '"</option>');
            }
            $(select).find('option[value="' + value + '"]').attr("selected", "selected");
        } else {
            $(select).append('<option value="" selected></option>');
        }
        $(select).chosen({
            search_contains: true,
            allow_single_deselect: true,
        });
        $(select).change(function() {
            $(this).find('option:selected').each(function() {
                $(input).val($(this).val());
            });
        });
        $(select).parent().find('.chosen-container').width('100%');
        $('<div><a class="direct-input" href="#">' + t("Direct input") + '</a></div>').insertBefore(select).click(function() {
            $(input).css('display', 'block');
            $(select).parent().find('.chosen-container').remove();
            $(select).remove();
            $(this).remove();
        });
        return select;
    }
    function multiple_chosen_select(options, input, delimiter) {
        var multiple_select = '<select multiple="multiple">';
        var optgroup = '';
        for (var key in options) {
            if (key.indexOf("optgroup") >= 0) {
                if (optgroup == '') {
                    multiple_select = multiple_select + '</optgroup>';
                }
                multiple_select = multiple_select + '<optgroup label="' + options[key] + '">';
                optgroup = options[key];
                continue;
            }
            multiple_select = multiple_select + '<option value="' + key + '">"' + options[key] + '"</option>';
        }
        if (optgroup != '') {
            multiple_select = multiple_select + '</optgroup>';
        }
        multiple_select = multiple_select + '</select>';
        $(input).css('display', 'none');
        var select = $(multiple_select).insertAfter(input);
        if ($(input).val().length) {
            var values = $(input).val().split(delimiter);
            for (var i = 0; i < values.length; i++) {
                if (!$(select).find('option[value="' + values[i] + '"]').length) {
                    $(select).append('<option value="' + values[i] + '">"' + values[i] + '"</option>');
                }
                $(select).find('option[value="' + values[i] + '"]').attr("selected", "selected");
            }
        }
        $(select).chosen({
            search_contains: true,
        });
        $(select).change(function() {
            var selected = [];
            $(this).find('option:selected').each(function() {
                selected.push($(this).val());
            });
            $(input).val(selected.join(delimiter));
        });
        $(select).parent().find('.chosen-container').width('100%');
        $('<div><a class="direct-input" href="#">' + t("Direct input") + '</a></div>').insertBefore(select).click(function() {
            $(input).css('display', 'block');
            $(select).parent().find('.chosen-container').remove();
            $(select).remove();
            $(this).remove();
        });
        return select;
    }
    function link_select(input) {
        if ('links_select' in window) {
            window.links_select(input, '');
        } else {
            azexo_get_links('/', 'htm, html', function(data) {
                chosen_select(data, input);
            });
        }
    }
    function links_select(input, delimiter) {
        if ('links_select' in window) {
            window.links_select(input, delimiter);
        } else {
            azexo_get_links('/', 'htm, html', function(data) {
                multiple_chosen_select(data, input, delimiter);
            });
        }
    }
    function image_select(input) {
        images_select(input, '');
    }
    function images_select(input, delimiter) {
        if ('images_select' in window) {
            window.images_select(input, delimiter);
        } else {
            function refresh_value(preview, input) {
                var value = [];
                _.each($(preview).find('> div'), function(img) {
                    value.push(toAbsoluteURL(window.azexo_baseurl + 'filemanager' + $(img).attr('data-src').split('filemanager')[1]));
                });
                value = value.join(delimiter);
                $(input).val(value);
            }
            $(input).css('display', 'none');
            var preview = $('<div id="images-preview"></div>').insertAfter(input);
            var images = [];
            if (delimiter == '')
                images = [$(input).val()];
            else
                images = $(input).val().split(delimiter);
            for (var i = 0; i < images.length; i++) {
                if (images[i] != '') {
                    var img = render_image(images[i], 100, 100);
                    $(img).appendTo(preview).append('<div class="delete"></div>').click(function() {
                        $(this).remove();
                        refresh_value(preview, input);
                    });
                }
            }
            var filemanager_input_id = _.uniqueId();
            var filemanager_input = $('<input id="' + filemanager_input_id + '" hidden type="text" name="filemanager">').insertAfter(input);
            var popup = $('<a href="javascript:azexo_open_popup(\'' + window.azexo_baseurl + 'filemanager/filemanager/dialog.php?type=1&popup=1&field_id=' + filemanager_input_id + '\')" class="' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-picture" type="button"></a>').insertAfter(input);
            $('<div><a class="direct-input" href="#">' + t("Direct input") + '</a></div>').insertAfter(input).click(function() {
                $(input).css('display', 'block');
                $(preview).remove();
                $(filemanager_input).remove();
                $(popup).remove();
                $(this).remove();
            });
            var intervalID = setInterval(function() {
                if ($(filemanager_input).val() != '') {
                    var srcs = [];
                    _.each($(preview).find('> div'), function(img) {
                        srcs.push(toAbsoluteURL(window.azexo_baseurl + 'filemanager' + $(img).attr('data-src').split('filemanager')[1]));
                    });
                    if (_.indexOf(srcs, $(filemanager_input).val()) < 0) {
                        if (delimiter == '')
                            srcs = [];
                        srcs.push(toAbsoluteURL(window.azexo_baseurl + 'filemanager' + $(filemanager_input).val().split('filemanager')[1]));
                        var img = render_image(toAbsoluteURL(window.azexo_baseurl + 'filemanager' + $(filemanager_input).val().split('filemanager')[1]), 100, 100);
                        if (delimiter == '')
                            $(preview).empty();
                        $(img).appendTo(preview).append('<div class="delete"></div>').click(function() {
                            $(this).remove();
                            refresh_value(preview, input);
                        });
                        $(filemanager_input).val('');
                        $(input).val(srcs.join(delimiter));
                    }
                }
            }, 200);
            $(input).on("remove", function() {
                clearInterval(intervalID);
            });
            $(input).parent().find('#images-preview').sortable({
                items: '> div',
                placeholder: 'az-sortable-placeholder',
                forcePlaceholderSize: true,
                over: function(event, ui) {
                    ui.placeholder.attr('class', ui.helper.attr('class'));
                    ui.placeholder.attr('width', ui.helper.attr('width'));
                    ui.placeholder.attr('height', ui.helper.attr('height'));
                    ui.placeholder.removeClass('ui-sortable-helper');
                    ui.placeholder.addClass('az-sortable-placeholder');
                },
                update: function() {
                    refresh_value(preview, input);
                },
            });
        }
    }
    function colorpicker(input) {
        if ('wpColorPicker' in $.fn) {
            $(input).wpColorPicker();
            _.defer(function() {
                $(input).wpColorPicker({
                    change: _.throttle(function() {
                        _.defer(function() {
                            $(input).trigger('change');
                        });                                            
                    }, 1000)
                });
            });
        } else {
            window.wpColorPickerL10n = {
                "clear": t("Clear"),
                "defaultString": t("Default"),
                "pick": t("Select Color"),
                "current": t("Current Color")
            }
            azexo_add_js({
                path: 'js/iris.min.js',
                callback: function() {
                    azexo_add_js({
                        path: 'js/color-picker.min.js',
                        callback: function() {
                            azexo_add_css('css/color-picker.min.css', function() {
                                $(input).wpColorPicker();
                                _.defer(function() {
                                    $(input).wpColorPicker({
                                        change: _.throttle(function() {
                                            _.defer(function() {
                                                $(input).trigger('change');
                                            });                                            
                                        }, 1000)
                                    });
                                });
                            });
                        }
                    });
                }});
        }
    }
    function nouislider(slider, min, max, value, step, target) {
        azexo_add_css('noUiSlider/distribute/jquery.nouislider.min.css', function() {
        });
        azexo_add_js({
            path: 'noUiSlider/distribute/jquery.nouislider.all.min.js',
            callback: function() {
                $(slider).noUiSlider({
                    start: [(value == '' || isNaN(parseFloat(value)) || value == 'NaN') ? min : parseFloat(value)],
                    step: parseFloat(step),
                    range: {
                        min: [parseFloat(min)],
                        max: [parseFloat(max)]
                    },
                }).on('change', function() {
                    $(target).val($(slider).val());
                });
            }
        });
    }
    function render_image(value, width, height) {
        if ($.isNumeric(width))
            width = width + 'px';
        if ($.isNumeric(height))
            height = height + 'px';
        var img = $('<div style="background-image: url(' + encodeURI(value) + ');" data-src="' + value + '" ></div>');
        if (width.length > 0)
            $(img).css('width', width);
        if (height.length > 0)
            $(img).css('height', height);
        return img;
    }

    var icons = [];
    if ('azexo_icons' in window)
        icons = window.azexo_icons;

    var azexo_param_types = [
        {
            type: 'dropdown',
            get_value: function() {
                return $(this.dom_element).find('select[name="' + this.param_name + '"] > option:selected').val();
            },
            render: function(value) {
                var select = '<select name="' + this.param_name + '" class="' + p + 'form-control">';
                for (var name in this.value) {
                    var option = '';
                    if (name == value) {
                        option = '<option selected value="' + name + '">' + this.value[name] + '</option>';
                    } else {
                        option = '<option value="' + name + '">' + this.value[name] + '</option>';
                    }
                    select += option;
                }
                select += '/<select>';

                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div>' + select + '</div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            }
        },
        {
            type: 'checkbox',
            get_value: function() {
                var values = [];
                _.each($(this.dom_element).find('input[name="' + this.param_name + '"]:checked'), function(obj) {
                    values.push($(obj).val());
                });
                return values.join(',');
            },
            render: function(value) {
                if (value == null)
                    value = '';
                var values = value.split(',');
                var inputs = '';
                for (var name in this.value) {
                    if (_.indexOf(values, name) >= 0) {
                        inputs += '<div class="' + p + 'checkbox"><label><input name="' + this.param_name + '" type="checkbox" checked value="' + name + '">' + this.value[name] + '</label></div>';
                    } else {
                        inputs += '<div class="' + p + 'checkbox"><label><input name="' + this.param_name + '" type="checkbox" value="' + name + '">' + this.value[name] + '</label></div>';
                    }
                }
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div>' + inputs + '</div><div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            }
        },
        {
            type: 'textfield',
            get_value: function() {
                return $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
            },
            render: function(value) {
                var required = this.required ? 'required' : '';
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div><input class="' + p + 'form-control" name="' + this.param_name + '" type="text" value="' + value + '" ' + required + '></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            }
        },
        {
            type: 'textarea',
            safe: false,
            get_value: function() {
                //return $(this.dom_element).find('#' + this.id).val();
                return tinymce.get(this.id).getContent();
            },
            render: function(value) {
                this.id = _.uniqueId();
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div><textarea id="' + this.id + '" rows="10" cols="45" name="' + this.param_name + '" ">' + value + '</textarea></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
            opened: function() {
                var param = this;
                if ('azexo_tinymce' in window) {
                    window.azexo_tinymce($(this.dom_element).find('#' + param.id));
                } else {
                    function tinymce_add_editor() {
                        if (tinymce.majorVersion == 4)
                            tinymce.execCommand('mceAddEditor', false, param.id);
                        if (tinymce.majorVersion == 3)
                            tinymce.execCommand('mceAddControl', false, param.id);
                        tinymce.execCommand('mceFocus', false, param.id);
                    }
                    if ('tinymce' in window) {
                        tinymce_add_editor();
                    } else {
                        azexo_add_js({
                            path: 'tinymce/tinymce.min.js',
                            callback: function() {
                                if (_.isObject(tinymce)) {
                                    var tinymce_config = {
                                        theme: "modern",
                                        force_br_newlines: false,
                                        force_p_newlines: false,
                                        forced_root_block: '',
                                        plugins: [
                                            "advlist autolink link image lists charmap print preview hr anchor pagebreak",
                                            "searchreplace wordcount visualblocks visualchars insertdatetime media nonbreaking",
                                            "table contextmenu directionality emoticons paste textcolor responsivefilemanager"
                                        ],
                                        toolbar1: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect",
                                        toolbar2: "| responsivefilemanager | link unlink anchor | image media | forecolor backcolor  | print preview code ",
                                        image_advtab: true,
                                        external_filemanager_path: window.azexo_baseurl + "filemanager/filemanager/",
                                        filemanager_title: "Filemanager",
                                        external_plugins: {"filemanager": "plugins/responsivefilemanager/plugin.min.js"}
                                    };
                                    tinymce.init(tinymce_config);
                                    tinymce_add_editor();
                                }
                            }});
                    }
                }
            },
            closed: function() {
                if ('tinymce' in window) {
                    tinymce.execCommand('mceFocus', false, this.id);
                    if (tinymce.majorVersion == 4)
                        tinymce.execCommand('mceRemoveEditor', false, this.id);
                    if (tinymce.majorVersion == 3)
                        tinymce.execCommand('mceRemoveControl', false, this.id);
                }
            },
        },
        {
            type: 'html',
            safe: false,
            get_value: function() {
                return $(this.dom_element).find('#' + this.id).val();
            },
            opened: function() {
                var param = this;
                azexo_add_js({
                    path: 'ace/ace.js',
                    callback: function() {
                        var aceeditor = ace.edit(param.id);
                        aceeditor.setTheme("ace/theme/chrome");
                        aceeditor.getSession().setMode("ace/mode/html");
                        aceeditor.setOptions({
                            minLines: 10,
                            maxLines: 30,
                        });
                        $(param.dom_element).find('#' + param.id).val(aceeditor.getSession().getValue());
                        aceeditor.on(
                                'change', function(e) {
                                    $(param.dom_element).find('#' + param.id).val(aceeditor.getSession().getValue());
                                    aceeditor.resize();
                                }
                        );
                    }
                });
            },
            render: function(value) {
                this.id = _.uniqueId();
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div id="' + this.id + '"><textarea class="' + p + 'form-control" rows="10" cols="45" name="' + this.param_name + '" ">' + value + '</textarea></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
        },
        {
            type: 'css',
            safe: false,
            get_value: function() {
                return $(this.dom_element).find('#' + this.id).val();
            },
            opened: function() {
                var param = this;
                azexo_add_js({
                    path: 'ace/ace.js',
                    callback: function() {
                        var aceeditor = ace.edit(param.id);
                        aceeditor.setTheme("ace/theme/chrome");
                        aceeditor.getSession().setMode("ace/mode/css");
                        aceeditor.setOptions({
                            minLines: 10,
                            maxLines: 30,
                        });
                        $(param.dom_element).find('#' + param.id).val(aceeditor.getSession().getValue());
                        aceeditor.on(
                                'change', function(e) {
                                    $(param.dom_element).find('#' + param.id).val(aceeditor.getSession().getValue());
                                    aceeditor.resize();
                                }
                        );
                    }
                });
            },
            render: function(value) {
                this.id = _.uniqueId();
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div id="' + this.id + '"><textarea class="' + p + 'form-control" rows="10" cols="45" name="' + this.param_name + '" ">' + value + '</textarea></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
        },
        {
            type: 'javascript',
            safe: false,
            get_value: function() {
                return $(this.dom_element).find('#' + this.id).val();
            },
            opened: function() {
                var param = this;
                azexo_add_js({
                    path: 'ace/ace.js',
                    callback: function() {
                        var aceeditor = ace.edit(param.id);
                        aceeditor.setTheme("ace/theme/chrome");
                        aceeditor.getSession().setMode("ace/mode/javascript");
                        aceeditor.setOptions({
                            minLines: 10,
                            maxLines: 30,
                        });
                        $(param.dom_element).find('#' + param.id).val(aceeditor.getSession().getValue());
                        aceeditor.on(
                                'change', function(e) {
                                    $(param.dom_element).find('#' + param.id).val(aceeditor.getSession().getValue());
                                    aceeditor.resize();
                                }
                        );
                    }
                });
            },
            render: function(value) {
                this.id = _.uniqueId();
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div id="' + this.id + '"><textarea class="' + p + 'form-control" rows="10" cols="45" name="' + this.param_name + '" ">' + value + '</textarea></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
        },
        {
            type: 'rawtext',
            safe: false,
            get_value: function() {
                return $(this.dom_element).find('#' + this.id).val();
            },
            render: function(value) {
                this.id = _.uniqueId();
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div><textarea id="' + this.id + '" class="' + p + 'form-control" rows="10" cols="45" name="' + this.param_name + '" ">' + value + '</textarea></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
        },
        {
            type: 'colorpicker',
            get_value: function() {
                return $(this.dom_element).find('#' + this.id).val();
            },
            render: function(value) {
                this.id = _.uniqueId();
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div><input id="' + this.id + '" name="' + this.param_name + '" type="text" value="' + value + '"></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
            opened: function() {
                colorpicker('#' + this.id);
            },
        },
        {
            type: 'style',
            create: function() {
                this.important = false;
            },
            get_value: function() {
                var important_str = '';
                if (this.important) {
                    important_str = ' !important';
                }
                var style = '';
                var margin_top = $(this.dom_element).find('[name="margin_top"]').val();
                if (margin_top != '') {
                    if ($.isNumeric(margin_top))
                        margin_top = margin_top + 'px';
                    style += 'margin-top:' + margin_top + important_str + ';';
                }
                var margin_bottom = $(this.dom_element).find('[name="margin_bottom"]').val();
                if (margin_bottom != '') {
                    if ($.isNumeric(margin_bottom))
                        margin_bottom = margin_bottom + 'px';
                    style += 'margin-bottom:' + margin_bottom + important_str + ';';
                }
                var margin_left = $(this.dom_element).find('[name="margin_left"]').val();
                if (margin_left != '') {
                    if ($.isNumeric(margin_left))
                        margin_left = margin_left + 'px';
                    style += 'margin-left:' + margin_left + important_str + ';';
                }
                var margin_right = $(this.dom_element).find('[name="margin_right"]').val();
                if (margin_right != '') {
                    if ($.isNumeric(margin_right))
                        margin_right = margin_right + 'px';
                    style += 'margin-right:' + margin_right + important_str + ';';
                }


                var border_top_width = $(this.dom_element).find('[name="border_top_width"]').val();
                if (border_top_width != '') {
                    if ($.isNumeric(border_top_width))
                        border_top_width = border_top_width + 'px';
                    style += 'border-top-width:' + border_top_width + important_str + ';';
                }
                var border_bottom_width = $(this.dom_element).find('[name="border_bottom_width"]').val();
                if (border_bottom_width != '') {
                    if ($.isNumeric(border_bottom_width))
                        border_bottom_width = border_bottom_width + 'px';
                    style += 'border-bottom-width:' + border_bottom_width + important_str + ';';
                }
                var border_left_width = $(this.dom_element).find('[name="border_left_width"]').val();
                if (border_left_width != '') {
                    if ($.isNumeric(border_left_width))
                        border_left_width = border_left_width + 'px';
                    style += 'border-left-width:' + border_left_width + important_str + ';';
                }
                var border_right_width = $(this.dom_element).find('[name="border_right_width"]').val();
                if (border_right_width != '') {
                    if ($.isNumeric(border_right_width))
                        border_right_width = border_right_width + 'px';
                    style += 'border-right-width:' + border_right_width + important_str + ';';
                }


                var padding_top = $(this.dom_element).find('[name="padding_top"]').val();
                if (padding_top != '') {
                    if ($.isNumeric(padding_top))
                        padding_top = padding_top + 'px';
                    style += 'padding-top:' + padding_top + important_str + ';';
                }
                var padding_bottom = $(this.dom_element).find('[name="padding_bottom"]').val();
                if (padding_bottom != '') {
                    if ($.isNumeric(padding_bottom))
                        padding_bottom = padding_bottom + 'px';
                    style += 'padding-bottom:' + padding_bottom + important_str + ';';
                }
                var padding_left = $(this.dom_element).find('[name="padding_left"]').val();
                if (padding_left != '') {
                    if ($.isNumeric(padding_left))
                        padding_left = padding_left + 'px';
                    style += 'padding-left:' + padding_left + important_str + ';';
                }
                var padding_right = $(this.dom_element).find('[name="padding_right"]').val();
                if (padding_right != '') {
                    if ($.isNumeric(padding_right))
                        padding_right = padding_right + 'px';
                    style += 'padding-right:' + padding_right + important_str + ';';
                }

                var color = $(this.dom_element).find('#' + this.color_id).val();
                if (color != '') {
                    style += 'color:' + color + important_str + ';';
                }
                var fontsize = $(this.dom_element).find('[name="fontsize"]').val();
                if (fontsize != '') {
                    if ($.isNumeric(fontsize))
                        fontsize = Math.round(fontsize) + 'px';
                    style += 'font-size:' + fontsize + important_str + ';';
                }

                var border_color = $(this.dom_element).find('#' + this.border_color_id).val();
                if (border_color != '') {
                    style += 'border-color:' + border_color + important_str + ';';
                }
                var border_radius = $(this.dom_element).find('[name="border_radius"]').val();
                if (border_radius != '') {
                    if ($.isNumeric(border_radius))
                        border_radius = Math.round(border_radius) + '%';
                    style += 'border-radius:' + border_radius + important_str + ';';
                }
                var border_style = $(this.dom_element).find('select[name="border_style"] > option:selected').val();
                if (border_style != '') {
                    style += 'border-style:' + border_style + important_str + ';';
                }

                var bg_color = $(this.dom_element).find('#' + this.bg_color_id).val();
                if (bg_color) {
                    style += 'background-color:' + bg_color + important_str + ';';
                }
                var bg_image = $(this.dom_element).find('[name="bg_image"]').val();
                if (bg_image) {
                    style += 'background-image: url(' + encodeURI(bg_image) + ');';
                }
                var background_style = $(this.dom_element).find('select[name="background_style"] > option:selected').val();
                if (background_style.match(/repeat/)) {
                    if (background_style.match(/repeat-x/)) {
                        style += 'background-position: center bottom;';
                        style += 'background-repeat: repeat-x' + important_str + ';';
                    } else {
                        if (background_style.match(/no-repeat/)) {
                            style += 'background-position: center;';
                        } else {
                            style += 'background-position: 0 0;';
                        }
                        style += 'background-repeat: ' + background_style + important_str + ';';
                    }
                } else if (background_style.match(/cover|contain/)) {
                    style += 'background-position: center;';
                    style += 'background-repeat: no-repeat;';
                    style += 'background-size: ' + background_style + important_str + ';';
                }
                var opacity = $(this.dom_element).find('[name="opacity"]').val();
                if (opacity != '') {
                    style += 'opacity:' + opacity + important_str + ';';
                }
                return style;
            },
            render: function(value) {
                value = value.replace(/!important/g, '');
                var output = '<div class="style ' + p + 'row">';
                var match = null;
                var v = '';

                output += '<div class="layout ' + p + 'col-sm-6">';

                output += '<div class="margin"><label>' + t('Margin') + '</label>';
                match = value.match(/margin-top[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="margin_top" type="text" placeholder="-" value="' + v + '">';
                match = value.match(/margin-bottom[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="margin_bottom" type="text" placeholder="-" value="' + v + '">';
                match = value.match(/margin-left[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="margin_left" type="text" placeholder="-" value="' + v + '">';
                match = value.match(/margin-right[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="margin_right" type="text" placeholder="-" value="' + v + '">';



                output += '<div class="border"><label>' + t('Border') + '</label>';
                match = value.match(/border-top-width[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="border_top_width" type="text" placeholder="-" value="' + v + '">';
                match = value.match(/border-bottom-width[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="border_bottom_width" type="text" placeholder="-" value="' + v + '">';
                match = value.match(/border-left-width[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="border_left_width" type="text" placeholder="-" value="' + v + '">';
                match = value.match(/border-right-width[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="border_right_width" type="text" placeholder="-" value="' + v + '">';



                output += '<div class="padding"><label>' + t('Padding') + '</label>';
                match = value.match(/padding-top[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="padding_top" type="text" placeholder="-" value="' + v + '">';
                match = value.match(/padding-bottom[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="padding_bottom" type="text" placeholder="-" value="' + v + '">';
                match = value.match(/padding-left[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="padding_left" type="text" placeholder="-" value="' + v + '">';
                match = value.match(/padding-right[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="padding_right" type="text" placeholder="-" value="' + v + '">';



                output += '<div class="content">';
                output += '</div></div></div></div>';

                output += '</div>';


                output += '<div class="settings ' + p + 'col-sm-6">';


                output += '<div class="font ' + p + 'form-group"><label>' + t('Font') + '</label>';
                this.color_id = _.uniqueId();
                match = value.match(/(^| |;)color[: ]*([#\dabcdef]*) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[2];
                output += '<div><input id="' + this.color_id + '" name="color" type="text" value="' + v + '"></div>';
                match = value.match(/font-size[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="fontsize" class="' + p + 'form-control" type="text" placeholder="' + t('Font size') + '" value="' + v + '">';
                output += '<div class="fontsize-slider"></div>';

                output += '</div>';



                output += '<div class="border ' + p + 'form-group"><label>' + t('Border') + '</label>';
                this.border_color_id = _.uniqueId();
                match = value.match(/border-color[: ]*([#\dabcdef]*) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1];
                output += '<div><input id="' + this.border_color_id + '" name="border_color" type="text" value="' + v + '"></div>';
                match = value.match(/border-radius[: ]*([\-\d\.]*)(px|%|em) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1] + match[2];
                output += '<input name="border_radius" class="' + p + 'form-control" type="text" placeholder="' + t('Border radius') + '" value="' + v + '">';
                output += '<div class="radius-slider"></div>';
                match = value.match(/border-style[: ]*(\w*) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1];
                output += '<select name="border_style" class="' + p + 'form-control">';
                var border_styles = {
                    '': t("Theme defaults"),
                    'solid': t("Solid"),
                    'dotted': t("Dotted"),
                    'dashed': t("Dashed"),
                    'none': t("None"),
                    'hidden': t("Hidden"),
                    'double': t("Double"),
                    'groove': t("Groove"),
                    'ridge': t("Ridge"),
                    'inset': t("Inset"),
                    'outset': t("Outset"),
                    'initial': t("Initial"),
                    'inherit': t("Inherit"),
                };
                for (var key in border_styles) {
                    if (key == v)
                        output += '<option selected value="' + key + '">' + border_styles[key] + '</option>';
                    else
                        output += '<option value="' + key + '">' + border_styles[key] + '</option>';
                }
                output += '</select>';
                output += '</div>';

                output += '<div class="background ' + p + 'form-group"><label>' + t('Background') + '</label>';
                this.bg_color_id = _.uniqueId();
                match = value.match(/background-color[: ]*([#\dabcdef]*) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1];
                output += '<div><input id="' + this.bg_color_id + '" name="bg_color" type="text" value="' + v + '"></div>';

                this.bg_image_id = _.uniqueId();
                match = value.match(/background-image[: ]*url\(([^\)]+)\) *;/);
                if (match == null)
                    v = '';
                else
                    v = decodeURI(match[1]);
                output += '<input id="' + this.bg_image_id + '" name="bg_image" class="' + p + 'form-control" type="text" value="' + v + '">';

                match = value.match(/background-repeat[: ]*([-\w]*) *;/);
                if (match == null) {
                    v = '';
                } else {
                    if (match[1] == 'repeat') {
                        v = match[1];
                    } else {
                        if (match[1] == 'repeat-x') {
                            v = 'repeat-x';
                        } else {
                            match = value.match(/background-size[: ]*([-\w]*) *;/);
                            if (match == null) {
                                v = 'no-repeat';
                            } else {
                                v = match[1];
                            }
                        }
                    }
                }
                output += '<select name="background_style" class="' + p + 'form-control">';
                var background_styles = {
                    '': t("Theme defaults"),
                    'cover': t("Cover"),
                    'contain': t("Contain"),
                    'no-repeat': t("No Repeat"),
                    'repeat': t("Repeat"),
                    'repeat-x': t("Horizontal repeat bottom"),
                };
                for (var key in background_styles) {
                    if (key == v)
                        output += '<option selected value="' + key + '">' + background_styles[key] + '</option>';
                    else
                        output += '<option value="' + key + '">' + background_styles[key] + '</option>';
                }
                output += '</select>';

                match = value.match(/opacity[: ]*([\d\.]*) *;/);
                if (match == null)
                    v = '';
                else
                    v = match[1];
                output += '<input name="opacity" class="' + p + 'form-control" type="text" placeholder="' + t('Opacity') + '" value="' + v + '">';
                output += '<div class="opacity-slider"></div>';


                output += '</div>';

                output += '</div>';

                output += '</div>';
                this.dom_element = $(output);
            },
            opened: function() {
                image_select($(this.dom_element).find('input[name="bg_image"]'));
                colorpicker('#' + this.color_id);
                colorpicker('#' + this.border_color_id);
                colorpicker('#' + this.bg_color_id);
                nouislider($(this.dom_element).find('.opacity-slider'), 0, 1, $(this.dom_element).find('input[name="opacity"]').val(), 0.01, $(this.dom_element).find('input[name="opacity"]'));
                nouislider($(this.dom_element).find('.fontsize-slider'), 0, 100, $(this.dom_element).find('input[name="fontsize"]').val(), 1, $(this.dom_element).find('input[name="fontsize"]'));
                nouislider($(this.dom_element).find('.radius-slider'), 0, 100, $(this.dom_element).find('input[name="border_radius"]').val(), 1, $(this.dom_element).find('input[name="border_radius"]'));
            },
        },
        {
            type: 'google_font',
            hidden: !'azexo_google_fonts' in window,
            get_value: function() {
                var font = $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
                var subset = $(this.dom_element).find('input[name="' + this.param_name + '_subset"]').val();
                var variant = $(this.dom_element).find('input[name="' + this.param_name + '_variant"]').val();
                return font + '|' + subset + '|' + variant;
            },
            render: function(value) {
                var font = '';
                var subset = '';
                var variant = '';
                if (_.isString(value) && value != '' && value.split('|').length == 3) {
                    font = value.split('|')[0];
                    subset = value.split('|')[1];
                    variant = value.split('|')[2];
                }
                var font_input = '<div class="' + p + 'col-sm-4"><label>' + this.heading + '</label><input class="' + p + 'form-control" name="' + this.param_name + '" type="text" value="' + font + '"></div>';
                var subset_input = '<div class="' + p + 'col-sm-4"><label>' + t('Subset') + '</label><input class="' + p + 'form-control" name="' + this.param_name + '_subset" type="text" value="' + subset + '"></div>';
                var variant_input = '<div class="' + p + 'col-sm-4"><label>' + t('Variant') + '</label><input class="' + p + 'form-control" name="' + this.param_name + '_variant" type="text" value="' + variant + '"></div>';
                this.dom_element = $('<div class="' + p + 'form-group"><div class="' + p + 'row">' + font_input + subset_input + variant_input + '</div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
            opened: function() {
                var element = this;
                var fonts = Object.keys(window.azexo_google_fonts);
                fonts = _.object(fonts, fonts);
                var font_select = null;
                var subset_select = null;
                var variant_select = null;
                font_select = chosen_select(fonts, $(this.dom_element).find('input[name="' + this.param_name + '"]'));
                $(font_select).chosen().change(function() {
                    var f = Object.keys(window.azexo_google_fonts)[0];
                    if ($(this).val() in window.azexo_google_fonts)
                        f = window.azexo_google_fonts[$(this).val()];
                    var subsets = {};
                    for (var i = 0; i < f.subsets.length; i++) {
                        subsets[f.subsets[i].id] = f.subsets[i].name;
                    }
                    var variants = {};
                    for (var i = 0; i < f.variants.length; i++) {
                        variants[f.variants[i].id] = f.variants[i].name;
                    }

                    $(subset_select).parent().find('.direct-input').click();
                    subset_select = multiple_chosen_select(subsets, $(element.dom_element).find('input[name="' + element.param_name + '_subset"]'), ',');

                    $(variant_select).parent().find('.direct-input').click();
                    variant_select = multiple_chosen_select(variants, $(element.dom_element).find('input[name="' + element.param_name + '_variant"]'), ',');
                });
                $(font_select).chosen().trigger('change');
            },
        },
        {
            type: 'image',
            get_value: function() {
                return $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
            },
            render: function(value) {
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div><input class="' + p + 'form-control" name="' + this.param_name + '" type="text" value="' + value + '"></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
            opened: function() {
                image_select($(this.dom_element).find('input[name="' + this.param_name + '"]'));
            },
        },
        {
            type: 'images',
            get_value: function() {
                return $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
            },
            render: function(value) {
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div><input class="' + p + 'form-control" name="' + this.param_name + '" type="text" value="' + value + '"></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
            opened: function() {
                images_select($(this.dom_element).find('input[name="' + this.param_name + '"]'), ',');
            },
        },
        {
            type: 'tagged_images',
            get_value: function() {
                var value = '';
                $(this.dom_element).find('tbody tr').each(function() {
                    value += $(this).find('input.image').val() + '{' + $(this).find('input.tags').val() + '}';
                });
                return value;
            },
            render: function(value) {
                var param = this;
                function add_image(container, src, tags) {
                    var row = $('<tr><td></td><td><input class="image ' + p + 'form-control" type="text" value="' + src + '"></td><td><input class="tags ' + p + 'form-control" type="text" value="' + tags + '"></td><td class="remove"><button title="' + t("Remove") + '" type="button" class="control remove ' + p + 'btn ' + p + 'btn-danger ' + p + 'glyphicon ' + p + 'glyphicon-remove"> </button></td></tr>').appendTo(container);
                    image_select($(row).find('input.image'));
                    $(row).find('button.remove').click(function() {
                        $(row).remove();
                        return false;
                    });
                    return row;
                }
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div class="add-image ' + p + 'btn-group ' + p + 'center-block"></div><table class="' + p + 'table"><thead><tr><td></td><td>' + t('Image') + '</td><td>' + t('Tags') + '</td><td>' + t('Remove') + '</td></tr></thead><tbody class="images-group"></tbody></table><p class="' + p + 'help-block">' + this.description + '</p></div>');
                $('<button title="' + t("Add one image") + '" class="add-image ' + p + 'btn ' + p + 'btn-default">' + t("Add one image") + '</button>').appendTo($(this.dom_element).find('div.add-image')).click(function() {
                    add_image($(param.dom_element).find('tbody.images-group'), '', '');
                    $(param.dom_element).find('tbody.images-group').sortable({
                        axis: 'y',
                        items: '> tr',
                        placeholder: 'az-sortable-placeholder',
                        forcePlaceholderSize: true,
                    });
                    return false;
                });
                $('<button title="' + t("Add images") + '" class="add-images ' + p + 'btn ' + p + 'btn-default">' + t("Add images") + '</button>').appendTo($(this.dom_element).find('div.add-image')).click(function() {
                    return false;
                });
                if (value != '') {
                    var rows = value.split('}');
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i] != '') {
                            var row = rows[i].split('{');
                            add_image($(param.dom_element).find('tbody.images-group'), row[0], row[1]);
                        }
                    }
                }
            },
            opened: function() {
                $(this.dom_element).find('tbody.images-group').sortable({
                    axis: 'y',
                    items: '> tr',
                    placeholder: 'az-sortable-placeholder',
                    forcePlaceholderSize: true,
                });
            },
        },
        {
            type: 'icon',
            icons: [
                p + 'glyphicon ' + p + 'glyphicon-asterisk',
                p + 'glyphicon ' + p + 'glyphicon-plus',
                p + 'glyphicon ' + p + 'glyphicon-euro',
                p + 'glyphicon ' + p + 'glyphicon-minus',
                p + 'glyphicon ' + p + 'glyphicon-cloud',
                p + 'glyphicon ' + p + 'glyphicon-envelope',
                p + 'glyphicon ' + p + 'glyphicon-pencil',
                p + 'glyphicon ' + p + 'glyphicon-glass',
                p + 'glyphicon ' + p + 'glyphicon-music',
                p + 'glyphicon ' + p + 'glyphicon-search',
                p + 'glyphicon ' + p + 'glyphicon-heart',
                p + 'glyphicon ' + p + 'glyphicon-star',
                p + 'glyphicon ' + p + 'glyphicon-star-empty',
                p + 'glyphicon ' + p + 'glyphicon-user',
                p + 'glyphicon ' + p + 'glyphicon-film',
                p + 'glyphicon ' + p + 'glyphicon-th-large',
                p + 'glyphicon ' + p + 'glyphicon-th',
                p + 'glyphicon ' + p + 'glyphicon-th-list',
                p + 'glyphicon ' + p + 'glyphicon-ok',
                p + 'glyphicon ' + p + 'glyphicon-remove',
                p + 'glyphicon ' + p + 'glyphicon-zoom-in',
                p + 'glyphicon ' + p + 'glyphicon-zoom-out',
                p + 'glyphicon ' + p + 'glyphicon-off',
                p + 'glyphicon ' + p + 'glyphicon-signal',
                p + 'glyphicon ' + p + 'glyphicon-cog',
                p + 'glyphicon ' + p + 'glyphicon-trash',
                p + 'glyphicon ' + p + 'glyphicon-home',
                p + 'glyphicon ' + p + 'glyphicon-file',
                p + 'glyphicon ' + p + 'glyphicon-time',
                p + 'glyphicon ' + p + 'glyphicon-road',
                p + 'glyphicon ' + p + 'glyphicon-download-alt',
                p + 'glyphicon ' + p + 'glyphicon-download',
                p + 'glyphicon ' + p + 'glyphicon-upload',
                p + 'glyphicon ' + p + 'glyphicon-inbox',
                p + 'glyphicon ' + p + 'glyphicon-play-circle',
                p + 'glyphicon ' + p + 'glyphicon-repeat',
                p + 'glyphicon ' + p + 'glyphicon-refresh',
                p + 'glyphicon ' + p + 'glyphicon-list-alt',
                p + 'glyphicon ' + p + 'glyphicon-lock',
                p + 'glyphicon ' + p + 'glyphicon-flag',
                p + 'glyphicon ' + p + 'glyphicon-headphones',
                p + 'glyphicon ' + p + 'glyphicon-volume-off',
                p + 'glyphicon ' + p + 'glyphicon-volume-down',
                p + 'glyphicon ' + p + 'glyphicon-volume-up',
                p + 'glyphicon ' + p + 'glyphicon-qrcode',
                p + 'glyphicon ' + p + 'glyphicon-barcode',
                p + 'glyphicon ' + p + 'glyphicon-tag',
                p + 'glyphicon ' + p + 'glyphicon-tags',
                p + 'glyphicon ' + p + 'glyphicon-book',
                p + 'glyphicon ' + p + 'glyphicon-bookmark',
                p + 'glyphicon ' + p + 'glyphicon-print',
                p + 'glyphicon ' + p + 'glyphicon-camera',
                p + 'glyphicon ' + p + 'glyphicon-font',
                p + 'glyphicon ' + p + 'glyphicon-bold',
                p + 'glyphicon ' + p + 'glyphicon-italic',
                p + 'glyphicon ' + p + 'glyphicon-text-height',
                p + 'glyphicon ' + p + 'glyphicon-text-width',
                p + 'glyphicon ' + p + 'glyphicon-align-left',
                p + 'glyphicon ' + p + 'glyphicon-align-center',
                p + 'glyphicon ' + p + 'glyphicon-align-right',
                p + 'glyphicon ' + p + 'glyphicon-align-justify',
                p + 'glyphicon ' + p + 'glyphicon-list',
                p + 'glyphicon ' + p + 'glyphicon-indent-left',
                p + 'glyphicon ' + p + 'glyphicon-indent-right',
                p + 'glyphicon ' + p + 'glyphicon-facetime-video',
                p + 'glyphicon ' + p + 'glyphicon-picture',
                p + 'glyphicon ' + p + 'glyphicon-map-marker',
                p + 'glyphicon ' + p + 'glyphicon-adjust',
                p + 'glyphicon ' + p + 'glyphicon-tint',
                p + 'glyphicon ' + p + 'glyphicon-edit',
                p + 'glyphicon ' + p + 'glyphicon-share',
                p + 'glyphicon ' + p + 'glyphicon-check',
                p + 'glyphicon ' + p + 'glyphicon-move',
                p + 'glyphicon ' + p + 'glyphicon-step-backward',
                p + 'glyphicon ' + p + 'glyphicon-fast-backward',
                p + 'glyphicon ' + p + 'glyphicon-backward',
                p + 'glyphicon ' + p + 'glyphicon-play',
                p + 'glyphicon ' + p + 'glyphicon-pause',
                p + 'glyphicon ' + p + 'glyphicon-stop',
                p + 'glyphicon ' + p + 'glyphicon-forward',
                p + 'glyphicon ' + p + 'glyphicon-fast-forward',
                p + 'glyphicon ' + p + 'glyphicon-step-forward',
                p + 'glyphicon ' + p + 'glyphicon-eject',
                p + 'glyphicon ' + p + 'glyphicon-chevron-left',
                p + 'glyphicon ' + p + 'glyphicon-chevron-right',
                p + 'glyphicon ' + p + 'glyphicon-plus-sign',
                p + 'glyphicon ' + p + 'glyphicon-minus-sign',
                p + 'glyphicon ' + p + 'glyphicon-remove-sign',
                p + 'glyphicon ' + p + 'glyphicon-ok-sign',
                p + 'glyphicon ' + p + 'glyphicon-question-sign',
                p + 'glyphicon ' + p + 'glyphicon-info-sign',
                p + 'glyphicon ' + p + 'glyphicon-screenshot',
                p + 'glyphicon ' + p + 'glyphicon-remove-circle',
                p + 'glyphicon ' + p + 'glyphicon-ok-circle',
                p + 'glyphicon ' + p + 'glyphicon-ban-circle',
                p + 'glyphicon ' + p + 'glyphicon-arrow-left',
                p + 'glyphicon ' + p + 'glyphicon-arrow-right',
                p + 'glyphicon ' + p + 'glyphicon-arrow-up',
                p + 'glyphicon ' + p + 'glyphicon-arrow-down',
                p + 'glyphicon ' + p + 'glyphicon-share-alt',
                p + 'glyphicon ' + p + 'glyphicon-resize-full',
                p + 'glyphicon ' + p + 'glyphicon-resize-small',
                p + 'glyphicon ' + p + 'glyphicon-exclamation-sign',
                p + 'glyphicon ' + p + 'glyphicon-gift',
                p + 'glyphicon ' + p + 'glyphicon-leaf',
                p + 'glyphicon ' + p + 'glyphicon-fire',
                p + 'glyphicon ' + p + 'glyphicon-eye-open',
                p + 'glyphicon ' + p + 'glyphicon-eye-close',
                p + 'glyphicon ' + p + 'glyphicon-warning-sign',
                p + 'glyphicon ' + p + 'glyphicon-plane',
                p + 'glyphicon ' + p + 'glyphicon-calendar',
                p + 'glyphicon ' + p + 'glyphicon-random',
                p + 'glyphicon ' + p + 'glyphicon-comment',
                p + 'glyphicon ' + p + 'glyphicon-magnet',
                p + 'glyphicon ' + p + 'glyphicon-chevron-up',
                p + 'glyphicon ' + p + 'glyphicon-chevron-down',
                p + 'glyphicon ' + p + 'glyphicon-retweet',
                p + 'glyphicon ' + p + 'glyphicon-shopping-cart',
                p + 'glyphicon ' + p + 'glyphicon-folder-close',
                p + 'glyphicon ' + p + 'glyphicon-folder-open',
                p + 'glyphicon ' + p + 'glyphicon-resize-vertical',
                p + 'glyphicon ' + p + 'glyphicon-resize-horizontal',
                p + 'glyphicon ' + p + 'glyphicon-hdd',
                p + 'glyphicon ' + p + 'glyphicon-bullhorn',
                p + 'glyphicon ' + p + 'glyphicon-bell',
                p + 'glyphicon ' + p + 'glyphicon-certificate',
                p + 'glyphicon ' + p + 'glyphicon-thumbs-up',
                p + 'glyphicon ' + p + 'glyphicon-thumbs-down',
                p + 'glyphicon ' + p + 'glyphicon-hand-right',
                p + 'glyphicon ' + p + 'glyphicon-hand-left',
                p + 'glyphicon ' + p + 'glyphicon-hand-up',
                p + 'glyphicon ' + p + 'glyphicon-hand-down',
                p + 'glyphicon ' + p + 'glyphicon-circle-arrow-right',
                p + 'glyphicon ' + p + 'glyphicon-circle-arrow-left',
                p + 'glyphicon ' + p + 'glyphicon-circle-arrow-up',
                p + 'glyphicon ' + p + 'glyphicon-circle-arrow-down',
                p + 'glyphicon ' + p + 'glyphicon-globe',
                p + 'glyphicon ' + p + 'glyphicon-wrench',
                p + 'glyphicon ' + p + 'glyphicon-tasks',
                p + 'glyphicon ' + p + 'glyphicon-filter',
                p + 'glyphicon ' + p + 'glyphicon-briefcase',
                p + 'glyphicon ' + p + 'glyphicon-fullscreen',
                p + 'glyphicon ' + p + 'glyphicon-dashboard',
                p + 'glyphicon ' + p + 'glyphicon-paperclip',
                p + 'glyphicon ' + p + 'glyphicon-heart-empty',
                p + 'glyphicon ' + p + 'glyphicon-link',
                p + 'glyphicon ' + p + 'glyphicon-phone',
                p + 'glyphicon ' + p + 'glyphicon-pushpin',
                p + 'glyphicon ' + p + 'glyphicon-usd',
                p + 'glyphicon ' + p + 'glyphicon-gbp',
                p + 'glyphicon ' + p + 'glyphicon-sort',
                p + 'glyphicon ' + p + 'glyphicon-sort-by-alphabet',
                p + 'glyphicon ' + p + 'glyphicon-sort-by-alphabet-alt',
                p + 'glyphicon ' + p + 'glyphicon-sort-by-order',
                p + 'glyphicon ' + p + 'glyphicon-sort-by-order-alt',
                p + 'glyphicon ' + p + 'glyphicon-sort-by-attributes',
                p + 'glyphicon ' + p + 'glyphicon-sort-by-attributes-alt',
                p + 'glyphicon ' + p + 'glyphicon-unchecked',
                p + 'glyphicon ' + p + 'glyphicon-expand',
                p + 'glyphicon ' + p + 'glyphicon-collapse-down',
                p + 'glyphicon ' + p + 'glyphicon-collapse-up',
                p + 'glyphicon ' + p + 'glyphicon-log-in',
                p + 'glyphicon ' + p + 'glyphicon-flash',
                p + 'glyphicon ' + p + 'glyphicon-log-out',
                p + 'glyphicon ' + p + 'glyphicon-new-window',
                p + 'glyphicon ' + p + 'glyphicon-record',
                p + 'glyphicon ' + p + 'glyphicon-save',
                p + 'glyphicon ' + p + 'glyphicon-open',
                p + 'glyphicon ' + p + 'glyphicon-saved',
                p + 'glyphicon ' + p + 'glyphicon-import',
                p + 'glyphicon ' + p + 'glyphicon-export',
                p + 'glyphicon ' + p + 'glyphicon-send',
                p + 'glyphicon ' + p + 'glyphicon-floppy-disk',
                p + 'glyphicon ' + p + 'glyphicon-floppy-saved',
                p + 'glyphicon ' + p + 'glyphicon-floppy-remove',
                p + 'glyphicon ' + p + 'glyphicon-floppy-save',
                p + 'glyphicon ' + p + 'glyphicon-floppy-open',
                p + 'glyphicon ' + p + 'glyphicon-credit-card',
                p + 'glyphicon ' + p + 'glyphicon-transfer',
                p + 'glyphicon ' + p + 'glyphicon-cutlery',
                p + 'glyphicon ' + p + 'glyphicon-header',
                p + 'glyphicon ' + p + 'glyphicon-compressed',
                p + 'glyphicon ' + p + 'glyphicon-earphone',
                p + 'glyphicon ' + p + 'glyphicon-phone-alt',
                p + 'glyphicon ' + p + 'glyphicon-tower',
                p + 'glyphicon ' + p + 'glyphicon-stats',
                p + 'glyphicon ' + p + 'glyphicon-sd-video',
                p + 'glyphicon ' + p + 'glyphicon-hd-video',
                p + 'glyphicon ' + p + 'glyphicon-subtitles',
                p + 'glyphicon ' + p + 'glyphicon-sound-stereo',
                p + 'glyphicon ' + p + 'glyphicon-sound-dolby',
                p + 'glyphicon ' + p + 'glyphicon-sound-5-1',
                p + 'glyphicon ' + p + 'glyphicon-sound-6-1',
                p + 'glyphicon ' + p + 'glyphicon-sound-7-1',
                p + 'glyphicon ' + p + 'glyphicon-copyright-mark',
                p + 'glyphicon ' + p + 'glyphicon-registration-mark',
                p + 'glyphicon ' + p + 'glyphicon-cloud-download',
                p + 'glyphicon ' + p + 'glyphicon-cloud-upload',
                p + 'glyphicon ' + p + 'glyphicon-tree-conifer',
                p + 'glyphicon ' + p + 'glyphicon-tree-deciduous',
            ].concat(icons),
            get_value: function() {
                return $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
            },
            render: function(value) {
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div><input class="' + p + 'form-control" name="' + this.param_name + '" type="text" value="' + value + '"></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
            opened: function() {
                var icons = $('<div class="icons"></div>').appendTo(this.dom_element);
                for (var i = 0; i < this.icons.length; i++) {
                    $(icons).append('<span class="' + this.icons[i] + '"></span>');
                }
                var param = this;
                $(icons).selectable({
                    stop: function() {
                        var icon = '';
                        var c = $(param.dom_element).find('.ui-selected').attr('class');
                        if (c)
                            icon = c.replace('ui-selectee', '').replace('ui-selected', '');
                        $(param.dom_element).find('input[name="' + param.param_name + '"]').val($.trim(icon));
                    }
                });
                if (this.get_value() != '')
                    $(icons).find('.' + $.trim(this.get_value()).replace(/ /g, '.')).addClass("ui-selected");
            },
        },
        {
            type: 'link',
            get_value: function() {
                return $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
            },
            render: function(value) {
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div><input class="' + p + 'form-control" name="' + this.param_name + '" type="text" value="' + value + '"></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
            opened: function() {
                link_select($(this.dom_element).find('input[name="' + this.param_name + '"]'));
            },
        },
        {
            type: 'links',
            get_value: function() {
                return $(this.dom_element).find('#' + this.id).val();
            },
            render: function(value) {
                this.id = _.uniqueId();
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div><textarea id="' + this.id + '" class="' + p + 'form-control" rows="10" cols="45" name="' + this.param_name + '" ">' + value + '</textarea></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
            opened: function() {
                links_select($(this.dom_element).find('textarea[name="' + this.param_name + '"]'), "\n");
            },
        },
        {
            type: 'integer_slider',
            create: function() {
                this.min = 0;
                this.max = 100;
                this.step = 1;
            },
            get_value: function() {
                var v = $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
                return (v == '') ? NaN : parseFloat(v).toString();
            },
            render: function(value) {
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div><input class="' + p + 'form-control" name="' + this.param_name + '" type="text" value="' + value + '"></div><div class="slider"></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
            opened: function() {
                nouislider($(this.dom_element).find('.slider'), this.min, this.max, this.get_value(), this.step, $(this.dom_element).find('input[name="' + this.param_name + '"]'));
            },
        },
        {
            type: 'datetime',
            create: function() {
                this.formatDate = '';
                this.formatTime = '';
                this.timepicker = false;
                this.datepicker = false;
            },
            get_value: function() {
                return $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
            },
            render: function(value) {
                this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div><input class="' + p + 'form-control" name="' + this.param_name + '" type="text" value="' + value + '"></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
            },
            opened: function() {
                var param = this;
                azexo_add_css('datetimepicker/jquery.datetimepicker.css', function() {
                });
                azexo_add_js({
                    path: 'datetimepicker/jquery.datetimepicker.js',
                    callback: function() {
                        if (param.datepicker && param.timepicker)
                            param.format = param.formatDate + ' ' + param.formatTime;
                        if (param.datepicker && !param.timepicker)
                            param.format = param.formatDate;
                        if (!param.datepicker && param.timepicker)
                            param.format = param.formatTime;
                        $(param.dom_element).find('input[name="' + param.param_name + '"]').datetimepicker({
                            format: param.format,
                            timepicker: param.timepicker,
                            datepicker: param.datepicker,
                            inline: true,
                            lang: lang()
                        });
                    }});
            },
        },
        {
            type: 'saved_datetime',
            get_value: function() {
                return (new Date).toUTCString();
            },
        },
    ];

    if ('azexo_param_types' in window) {
        window.azexo_param_types = window.azexo_param_types.concat(azexo_param_types);
    } else {
        window.azexo_param_types = azexo_param_types;
    }

})(window.jQuery);