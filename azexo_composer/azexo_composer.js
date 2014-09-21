(function($, azexo_frontend, p, fp, azexo_js_waiting_callbacks, azexo_loaded_js, azexo_elements, scroll_magic, azexo_containers, azexo_containers_loaded) {
    window.azexo_backend = true;
    var args = arguments.callee.toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, '')
            .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
            .split(/,/);
    var jquery_name = args[0];
    var azexo_frontend_name = args[1];
    var p_name = args[2];
    var fp_name = args[3];
    var azexo_js_waiting_callbacks_name = args[4];
    var azexo_loaded_js_name = args[5];
    var azexo_elements_name = args[6];
    var scroll_magic_name = args[7];
    var azexo_containers_name = args[8];
    var azexo_containers_loaded_name = args[9];
    // ------------------INTERFACE------------------------------------
    if ('azexo_prefix' in window) {
        p = window.azexo_prefix;
        fp = window.azexo_prefix.replace('-', '_');
    }
    function title(text) {
        if ('azexo_title' in window && (text in window.azexo_title)) {
            return window.azexo_title[text];
        } else {
            return t(text);
        }
    }
    window.azexo_title = {
        'Drag and drop': t('Drag and drop element.'),
        'Add': t('Add new element into current element area.'),
        'Edit': t('Open settings form to change element properties, set CSS styles and add CSS classes.'),
        'Paste': t('Paste elements into current element area from clipboard copied into it before.'),
        'Copy': t('Copy element or contained elements to clipboard.'),
        'Clone': t('Clone current element.'),
        'Remove': t('Delete current element'),
        'Save as template': t('Save element or contained elements as template to template library.'),
        'Save container': t('Save to server all elements which placed in current container element.'),
    };
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
    function azexo_login(callback) {
        if ('azexo_editor' in window) {
            callback(window.azexo_editor);
            return;
        }
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_login',
                        url: window.location.href,
                        password: getCookie('azexo_password'),
                    },
                    dataType: "json",
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            } else {
                $.ajax({
                    type: 'POST',
                    url: window.azexo_baseurl + 'ajax.php',
                    data: {
                        action: 'login',
                        password: getCookie('azexo_password'),
                    },
                    dataType: "json",
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            }
        } else {
            callback(false);
        }
    }
    // -- containers ---
    function azexo_get_container_types(callback) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_get_container_types',
                    url: window.location.href,
                },
                dataType: "json",
                cache: false,
                context: this
            }).done(function(data) {
                callback(data);
            });
        } else {
            $.ajax({
                type: 'POST',
                url: window.azexo_baseurl + 'ajax.php',
                data: {
                    action: 'get_container_types',
                },
                dataType: "json",
                cache: false,
                context: this
            }).done(function(data) {
                callback(data);
            });
        }
    }
    function azexo_get_container_names(container_type, callback) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_get_container_names',
                    container_type: container_type,
                    url: window.location.href,
                },
                dataType: "json",
                cache: false,
                context: this
            }).done(function(data) {
                callback(data);
            });
        } else {
            $.ajax({
                type: 'POST',
                url: window.azexo_baseurl + 'ajax.php',
                data: {
                    action: 'get_container_names',
                    container_type: container_type,
                },
                dataType: "json",
                cache: false,
                context: this
            }).done(function(data) {
                callback(data);
            });
        }
    }
    function azexo_save_container(type, name, shortcode) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_save_container',
                    type: type,
                    name: name,
                    shortcode: shortcode,
                },
                dataType: "json",
                cache: false,
                context: this
            }).done(function(data) {
                if (data) {
                    //success
                }
            });
        } else {
            $.ajax({
                type: 'POST',
                url: window.azexo_baseurl + 'ajax.php',
                data: {
                    action: 'container_save',
                    type: type,
                    name: name,
                    shortcode: shortcode,
                },
                dataType: "json",
                cache: false,
                context: this
            }).done(function(data) {
                if (data) {
                    //success
                }
            });
        }
    }
    function azexo_load_container(type, name, callback) {
        if (azexo_containers_loaded.hasOwnProperty(type + '/' + name)) {
            callback(azexo_containers_loaded[type + '/' + name]);
            return;
        }
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_load_container',
                        type: type,
                        name: name,
                    },
                    cache: !window.azexo_editor,
                }).done(function(data) {
                    azexo_containers_loaded[type + '/' + name] = data;
                    callback(data);
                }).fail(function() {
                    callback('');
                });
            } else {
                type = (type === '') ? 'default' : type;
                var url = window.azexo_baseurl + '../azexo_containers/' + type + '/' + name;
                $.ajax({
                    url: url,
                    cache: !window.azexo_editor,
                }).done(function(data) {
                    azexo_containers_loaded[type + '/' + name] = data;
                    callback(data);
                }).fail(function() {
                    callback('');
                });
            }
        } else {
            type = (type === '') ? 'default' : type;
            azexo_add_js({
                path: '../azexo_containers/' + type + '/' + name + '.js',
                callback: function() {
                    var data = window['azexo_container_' + type + '_' + name];
                    callback(decodeURIComponent(atob(data)));
                }
            });
        }
    }
    // -- cms elements ---
    function azexo_get_cms_element_names(callback) {
        if ('azexo_cms_element_names' in window) {
            callback(window.azexo_cms_element_names);
            return;
        }
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_get_cms_element_names',
                        url: window.location.href,
                    },
                    dataType: "json",
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                }).fail(function() {
                    callback(false);
                });
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    }
    function azexo_load_cms_element(name, settings, container, callback) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_load_cms_element',
                    name: name,
                    settings: settings,
                    container: container,
                },
                cache: !window.azexo_editor,
            }).done(function(data) {
                callback(data);
            });
        }
    }
    function azexo_get_cms_element_settings(name, callback) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_get_cms_element_settings',
                    name: name,
                    url: window.location.href,
                },
                cache: !window.azexo_editor,
            }).done(function(data) {
                callback(data);
            });
        }
    }
    // -- template-elements ---
    function azexo_get_elements(callback) {
        if ('azexo_template_elements' in window) {
            for (var name in window.azexo_template_elements) {
                window.azexo_template_elements[name] = decodeURIComponent(atob(window.azexo_template_elements[name]));
            }
            callback(window.azexo_template_elements);
            return;
        }
        if (window.azexo_online) {
            $.ajax({
                type: 'POST',
                url: window.azexo_baseurl + 'ajax.php',
                data: {
                    action: 'get_elements',
                },
                dataType: "json",
                cache: !window.azexo_editor,
                context: this
            }).done(function(data) {
                callback(data);
            });
        } else {
            azexo_add_js({
                path: '../azexo_elements/elements.js',
                callback: function() {
                    for (var name in azexo_template_elements) {
                        azexo_template_elements[name] = decodeURIComponent(atob(azexo_template_elements[name]));
                    }
                    callback(azexo_template_elements);
                }
            });
        }
    }
    // -- templates ---
    function azexo_get_templates(callback) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_get_templates',
                    url: window.location.href,
                },
                dataType: "json",
                cache: false,
                context: this
            }).done(function(data) {
                callback(data);
            });
        } else {
            $.ajax({
                type: 'POST',
                url: window.azexo_baseurl + 'ajax.php',
                data: {
                    action: 'get_templates',
                },
                dataType: "json",
                cache: false,
                context: this
            }).done(function(data) {
                callback(data);
            });
        }
    }
    function azexo_load_template(name, callback) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_load_template',
                    url: window.location.href,
                    name: name,
                },
                cache: false,
            }).done(function(data) {
                callback(data);
            }).fail(function() {
                callback('');
            });
        } else {
            var url = window.azexo_baseurl + '../azexo_templates/' + name;
            $.ajax({
                url: url,
                cache: false,
            }).done(function(data) {
                callback(data);
            }).fail(function() {
                callback('');
            });
        }
    }
    function azexo_save_template(name, template) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_save_template',
                    url: window.location.href,
                    name: name,
                    template: template,
                },
                cache: false,
                context: this
            }).done(function(data) {
            });
        } else {
            $.ajax({
                type: 'POST',
                url: window.azexo_baseurl + 'ajax.php',
                data: {
                    action: 'save_template',
                    name: name,
                    template: template,
                },
                cache: false,
                context: this
            }).done(function(data) {
            });
        }
    }
    function azexo_delete_template(name) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_delete_template',
                    url: window.location.href,
                    name: name,
                },
                cache: false,
                context: this
            }).done(function(data) {
            });
        } else {
            $.ajax({
                type: 'POST',
                url: window.azexo_baseurl + 'ajax.php',
                data: {
                    action: 'delete_template',
                    name: name,
                },
                cache: false,
                context: this
            }).done(function(data) {
            });
        }
    }
    // -- form ---
    function azexo_get_recaptcha_publickey(callback) {
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_get_recaptcha_publickey',
                    },
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            } else {
                $.ajax({
                    type: 'POST',
                    url: window.azexo_baseurl + 'ajax.php',
                    data: {
                        action: 'get_recaptcha_publickey',
                    },
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            }

        } else {
            callback('');
        }
    }
    function azexo_submit_form(container_type, container_name, name, values, callback) {
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_submit_form',
                        container_type: container_type,
                        container_name: container_name,
                        name: name,
                        values: values,
                    },
                    dataType: "json",
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            } else {
                $.ajax({
                    type: 'POST',
                    url: window.azexo_baseurl + 'ajax.php',
                    data: {
                        action: 'submit_form',
                        name: name,
                        values: values,
                    },
                    dataType: "json",
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            }
        } else {
            callback('');
        }
    }
    function azexo_load_submissions(container_type, container_name, name, callback) {
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_load_submissions',
                        container_type: container_type,
                        container_name: container_name,
                        name: name,
                    },
                    dataType: "json",
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            } else {
                $.ajax({
                    type: 'POST',
                    url: window.azexo_baseurl + 'ajax.php',
                    data: {
                        action: 'load_submissions',
                        name: name,
                    },
                    dataType: "json",
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            }
        } else {
            callback('');
        }
    }
    function azexo_save_submissions(name, submissions, callback) {
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_save_submissions',
                        submissions: submissions,
                    },
                    dataType: "json",
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            } else {
                $.ajax({
                    type: 'POST',
                    url: window.azexo_baseurl + 'ajax.php',
                    data: {
                        action: 'save_submissions',
                        name: name,
                        submissions: submissions,
                    },
                    dataType: "json",
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            }
        } else {
            callback('');
        }
    }
    // -- settings form ---
    function azexo_get_settings_form(callback) {
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_get_settings_form',
                        url: window.location.href,
                    },
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            } else {
                $.ajax({
                    type: 'POST',
                    url: window.azexo_baseurl + 'ajax.php',
                    data: {
                        action: 'get_settings_form',
                    },
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            }
        } else {
            callback('');
        }
    }
    function azexo_submit_settings_form(values, callback) {
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_submit_settings_form',
                        url: window.location.href,
                        values: values,
                    },
                    dataType: "json",
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            } else {
                $.ajax({
                    type: 'POST',
                    url: window.azexo_baseurl + 'ajax.php',
                    data: {
                        action: 'submit_settings_form',
                        values: values,
                    },
                    dataType: "json",
                    cache: false,
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            }
        } else {
            callback('');
        }
    }
    // ------------------HELPERS------------------------------------
    function extend(Child, Parent) {
        var F = function() {
        };
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.baseclass = Parent;
    }
    function mixin(dst, src) {
        var tobj = {};
        for (var x in src) {
            if ((typeof tobj[x] == "undefined") || (tobj[x] != src[x])) {
                dst[x] = src[x];
            }
        }
        if (document.all && !document.isOpera) {
            var p = src.toString;
            if (typeof p == "function" && p != dst.toString && p != tobj.toString &&
                    p != "\nfunction toString() {\n    [native code]\n}\n") {
                dst.toString = src.toString;
            }
        }
        return dst;
    }
    var azexo = {};
    azexo.shortcode = {
        next: function(tag, text, index) {
            var re = azexo.shortcode.regexp(tag),
                    match, result;

            re.lastIndex = index || 0;
            match = re.exec(text);

            if (!match) {
                return;
            }
            if ('[' === match[1] && ']' === match[7]) {
                return azexo.shortcode.next(tag, text, re.lastIndex);
            }

            result = {
                index: match.index,
                content: match[0],
                shortcode: azexo.shortcode.fromMatch(match)
            };
            if (match[1]) {
                result.match = result.match.slice(1);
                result.index++;
            }
            if (match[7]) {
                result.match = result.match.slice(0, -1);
            }

            return result;
        },
        replace: function(tag, text, callback) {
            return text.replace(azexo.shortcode.regexp(tag), function(match, left, tag, attrs, slash, content, closing, right) {
                if (left === '[' && right === ']') {
                    return match;
                }
                var result = callback(azexo.shortcode.fromMatch(arguments));
                return result ? left + result + right : match;
            });
        },
        string: function(options) {
            return new azexo.shortcode(options).string();
        },
        regexp: _.memoize(function(tag) {
            return new RegExp('\\[(\\[?)(' + tag + ')(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)', 'g');
        }),
        attrs: _.memoize(function(text) {
            var named = {},
                    numeric = [],
                    pattern, match;
            pattern = /(\w+)\s*=\s*"([^"]*)"(?:\s|$)|(\w+)\s*=\s*\'([^\']*)\'(?:\s|$)|(\w+)\s*=\s*([^\s\'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|(\S+)(?:\s|$)/g;
            text = text.replace(/[\u00a0\u200b]/g, ' ');
            while ((match = pattern.exec(text))) {
                if (match[1]) {
                    named[ match[1].toLowerCase() ] = match[2];
                } else if (match[3]) {
                    named[ match[3].toLowerCase() ] = match[4];
                } else if (match[5]) {
                    named[ match[5].toLowerCase() ] = match[6];
                } else if (match[7]) {
                    numeric.push(match[7]);
                } else if (match[8]) {
                    numeric.push(match[8]);
                }
            }

            return {
                named: named,
                numeric: numeric
            };
        }),
        fromMatch: function(match) {
            var type;

            if (match[4]) {
                type = 'self-closing';
            } else if (match[6]) {
                type = 'closed';
            } else {
                type = 'single';
            }

            return new azexo.shortcode({
                tag: match[2],
                attrs: match[3],
                type: type,
                content: match[5]
            });
        }
    };
    azexo.shortcode = _.extend(function(options) {
        _.extend(this, _.pick(options || {}, 'tag', 'attrs', 'type', 'content'));

        var attrs = this.attrs;
        this.attrs = {
            named: {},
            numeric: []
        };

        if (!attrs) {
            return;
        }
        if (_.isString(attrs)) {
            this.attrs = azexo.shortcode.attrs(attrs);
        } else if (_.isEqual(_.keys(attrs), ['named', 'numeric'])) {
            this.attrs = attrs;
        } else {
            _.each(options.attrs, function(value, key) {
                this.set(key, value);
            }, this);
        }
    }, azexo.shortcode);
    _.extend(azexo.shortcode.prototype, {
        get: function(attr) {
            return this.attrs[ _.isNumber(attr) ? 'numeric' : 'named' ][ attr ];
        },
        set: function(attr, value) {
            this.attrs[ _.isNumber(attr) ? 'numeric' : 'named' ][ attr ] = value;
            return this;
        },
        string: function() {
            var text = '[' + this.tag;

            _.each(this.attrs.numeric, function(value) {
                if (/\s/.test(value)) {
                    text += ' "' + value + '"';
                } else {
                    text += ' ' + value;
                }
            });

            _.each(this.attrs.named, function(value, name) {
                text += ' ' + name + '="' + value + '"';
            });
            if ('single' === this.type) {
                return text + ']';
            } else if ('self-closing' === this.type) {
                return text + ' /]';
            }
            text += ']';

            if (this.content) {
                text += this.content;
            }
            return text + '[/' + this.tag + ']';
        }
    });
    azexo.html = _.extend(azexo.html || {}, {
        attrs: function(content) {
            var result, attrs;
            if ('/' === content[ content.length - 1 ]) {
                content = content.slice(0, -1);
            }

            result = azexo.shortcode.attrs(content);
            attrs = result.named;

            _.each(result.numeric, function(key) {
                if (/\s/.test(key)) {
                    return;
                }

                attrs[ key ] = '';
            });

            return attrs;
        },
        string: function(options) {
            var text = '<' + options.tag,
                    content = options.content || '';

            _.each(options.attrs, function(value, attr) {
                text += ' ' + attr;
                if ('' === value) {
                    return;
                }
                if (_.isBoolean(value)) {
                    value = value ? 'true' : 'false';
                }

                text += '="' + value + '"';
            });
            if (options.single) {
                return text + ' />';
            }
            text += '>';
            text += _.isObject(content) ? azexo.html.string(content) : content;

            return text + '</' + options.tag + '>';
        }
    });
    function substr_replace(str, replace, start, length) {
        if (start < 0) { // start position in str
            start = start + str.length;
        }
        length = length !== undefined ? length : str.length;
        if (length < 0) {
            length = length + str.length - start;
        }

        return str.slice(0, start) + replace.substr(0, length) + replace.slice(length) + str.slice(start + length);
    }
    function width2span(width, device) {
        var prefix = p + 'col-' + device + '-',
                numbers = width ? width.split('/') : [1, 1],
                range = _.range(1, 13),
                num = !_.isUndefined(numbers[0]) && _.indexOf(range, parseInt(numbers[0], 10)) >= 0 ? parseInt(numbers[0], 10) : false,
                dev = !_.isUndefined(numbers[1]) && _.indexOf(range, parseInt(numbers[1], 10)) >= 0 ? parseInt(numbers[1], 10) : false;
        if (num !== false && dev !== false) {
            return prefix + (12 * num / dev);
        }
        return prefix + '12';
    }
    function span2width(span, device) {
        if (span == p + "col-" + device + "-12")
            return '1/1';
        else if (span == p + "col-" + device + "-11")
            return '11/12';
        else if (span == p + "col-" + device + "-10") //three-fourth
            return '5/6';
        else if (span == p + "col-" + device + "-9") //three-fourth
            return '3/4';
        else if (span == p + "col-" + device + "-8") //two-third
            return '2/3';
        else if (span == p + "col-" + device + "-7")
            return '7/12';
        else if (span == p + "col-" + device + "-6") //one-half
            return '1/2';
        else if (span == p + "col-" + device + "-5") //one-half
            return '5/12';
        else if (span == p + "col-" + device + "-4") // one-third
            return '1/3';
        else if (span == p + "col-" + device + "-3") // one-fourth
            return '1/4';
        else if (span == p + "col-" + device + "-2") // one-fourth
            return '1/6';
        else if (span == p + "col-" + device + "-1")
            return '1/12';
        return false;
    }
    var azexo_regexp_split = _.memoize(function(tags) {
        return new RegExp('(\\[(\\[?)[' + tags + ']+' +
                '(?![\\w-])' +
                '[^\\]\\/]*' +
                '[\\/' +
                '(?!\\])' +
                '[^\\]\\/]*' +
                ']?' +
                '(?:' +
                '\\/]' +
                '\\]|\\]' +
                '(?:' +
                '[^\\[]*' +
                '(?:\\[' +
                '(?!\\/' + tags + '\\])[^\\[]*' +
                ')*' +
                '' +
                '\\[\\/' + tags + '\\]' +
                ')?' +
                ')' +
                '\\]?)', 'g');
    });
    var azexo_regexp = _.memoize(function(tags) {
        return new RegExp('\\[(\\[?)(' + tags + ')(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)');
    });
    function escapeParam(value) {
        return value.replace(/"/g, '``');
    }
    function unescapeParam(value) {
        if (_.isString(value))
            return value.replace(/(\`{2})/g, '"');
        else
            return value;
    }
    function rawurldecode(str) {

        return decodeURIComponent((str + '')
                .replace(/%(?![\da-f]{2})/gi, function() {
                    // PHP tolerates poorly formed escape sequences
                    return '%25';
                }));
    }
    function rawurlencode(str) {

        str = (str + '')
                .toString();

        // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
        // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
        return encodeURIComponent(str)
                .replace(/!/g, '%21')
                .replace(/'/g, '%27')
                .replace(/\(/g, '%28')
                .
                replace(/\)/g, '%29')
                .replace(/\*/g, '%2A');
    }
    function setCookie(c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = encodeURIComponent(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }
    function getCookie(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return decodeURIComponent(y);
            }
        }
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
    function youtube_parser(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[7].length == 11) {
            return match[7];
        } else {
            return false;
        }
    }
    function vimeo_parser(url) {
        var m = url.match(/^.+vimeo.com\/(.*\/)?([^#\?]*)/);
        return m ? m[2] || m[1] : false;
    }
    function nouislider(slider, min, max, value, step, target) {
        azexo_add_css('nouislider/jquery.nouislider.css', function() {
        });
        azexo_add_js({
            path: 'nouislider/jquery.nouislider.min.js',
            callback: function() {
                $(slider).noUiSlider({
                    range: {
                        min: parseFloat(min),
                        max: parseFloat(max)
                    },
                    start: (value == '') ? NaN : parseFloat(value),
                    handles: 1,
                    step: parseFloat(step),
                    behaviour: "extend-tap",
                    serialization: {
                        lower: [$.Link({
                                target: target
                            })],
                    },
                    slide: function() {
                    },
                    set: function() {
                    }
                }).change(function() {
                });
            }
        });
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
    function get_select(options, name, value) {
        var select = '<select name="' + name + '" class="' + p + 'form-control">';
        select += '<option value="">' + t("Please select") + '</option>';
        for (var key in options) {
            if (key == value)
                select += '<option value="' + key + '" selected>' + options[key] + '</option>';
            else
                select += '<option value="' + key + '">' + options[key] + '</option>';
        }
        select += '/<select>';
        return select;
    }
    function get_alert(message) {
        return '<div class="' + p + 'alert ' + p + 'alert-warning ' + p + 'fade ' + p + 'in" role="alert"><button type="button" class="' + p + 'close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="' + p + 'sr-only">' + t('Close') + '</span></button>' + message + '</div>';
    }
    $.fn.closest_descendents = function(filter) {
        var $found = $(),
                $currentSet = this; // Current place
        while ($currentSet.length) {
            $found = $.merge($found, $currentSet.filter(filter));
            $currentSet = $currentSet.not(filter);
            $currentSet = $currentSet.children();
        }
        return $found; // Return first match of the collection
    }
    // ------------------PARAMS------------------------------------
    function BaseParamType() {
        this.dom_element = null;
        this.heading = '';
        this.description = '';
        this.param_name = '';
        this.required = false;
        this.admin_label = '';
        this.holder = '';
        this.wrapper_class = '';
        this.value = null;
        this.can_be_empty = false;
        this.hidden = false;
        this.tab = '';
        this.dependency = {};
        if ('create' in this) {
            this.create();
        }
    }
    BaseParamType.prototype = {
        safe: true,
        param_types: {},
        show_editor: function(params, element, callback) {
            $('#az-editor-modal').remove();
            var header = '<div class="' + p + 'modal-header"><button type="button" class="' + p + 'close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="' + p + 'modal-title">' + element.name + ' ' + t("settings") + '</h4></div>';
            var footer = '<div class="' + p + 'modal-footer"><button type="button" class="' + p + 'btn ' + p + 'btn-default" data-dismiss="modal">' + t("Close") + '</button><button type="button" class="save ' + p + 'btn ' + p + 'btn-primary">' + t("Save changes") + '</button></div>';
            var modal = $('<div id="az-editor-modal" class="' + p + 'modal azexo"><div class="' + p + 'modal-dialog ' + p + 'modal-lg"><div class="' + p + 'modal-content">' + header + '<div class="' + p + 'modal-body"></div>' + footer + '</div></div></div>').prependTo('body');
            var tabs = {};
            for (var i = 0; i < params.length; i++) {
                if (params[i].hidden)
                    continue;
                if (params[i].tab in tabs) {
                    tabs[params[i].tab].push(params[i]);
                } else {
                    tabs[params[i].tab] = [params[i]];
                }
            }
            var tabs_form = $('<div id="az-editor-tabs"></div>');
            var i = 0;
            var menu = '<ul class="' + p + 'nav ' + p + 'nav-tabs">';
            for (var title in tabs) {
                i++;
                if (title === '')
                    title = t('General');
                menu += '<li><a href="#az-editor-tab-' + i + '" data-toggle="tab">' + title + '</a></li>';
            }
            menu += '</ul>';
            $(tabs_form).append(menu);
            i = 0;
            var tabs_content = $('<form role="form" class="' + p + 'tab-content"></form>');
            for (var title in tabs) {
                i++;
                var tab = $('<div id="az-editor-tab-' + i + '" class="' + p + 'tab-pane"></div>');
                for (var j = 0; j < tabs[title].length; j++) {
                    tabs[title][j].render(element.attrs[tabs[title][j].param_name]);
                    $(tab).append(tabs[title][j].dom_element);
                    //$(tab).append('<hr>');
                }
                $(tabs_content).append(tab);
            }
            $(tabs_form).append(tabs_content);
            $(modal).find('.' + p + 'modal-body').append(tabs_form);
            $('#az-editor-tabs a[href="#az-editor-tab-1"]')[fp + 'tab']('show');
            $('#az-editor-modal input[name="el_class"]').each(function() {
                multiple_chosen_select(BaseElement.prototype.el_classes, this, ' ');
            });
            for (var i = 0; i < params.length; i++) {
                if ('element' in params[i].dependency) {
                    var param = null;
                    for (var j = 0; j < params.length; j++) {
                        if (params[j].param_name === params[i].dependency.element) {
                            param = params[j];
                            break;
                        }
                    }
                    if ('is_empty' in params[i].dependency) {
                        (function(i, param) {
                            $(param.dom_element).find('[name="' + param.param_name + '"]').on('keyup change', function() {
                                if (param.get_value() === '') {
                                    params[i].display_none = false;
                                    $(params[i].dom_element).css('display', 'block');
                                    if ('callback' in params[i].dependency) {
                                        params[i].dependency.callback.call(params[i], param);
                                    }
                                } else {
                                    params[i].display_none = true;
                                    $(params[i].dom_element).css('display', 'none');
                                }
                            }).trigger('change');
                        })(i, param);
                    }
                    if ('not_empty' in params[i].dependency) {
                        (function(i, param) {
                            $(param.dom_element).find('[name="' + param.param_name + '"]').on('keyup change', function() {
                                if (param.get_value() !== '') {
                                    params[i].display_none = false;
                                    $(params[i].dom_element).css('display', 'block');
                                    if ('callback' in params[i].dependency) {
                                        params[i].dependency.callback.call(params[i], param);
                                    }
                                } else {
                                    params[i].display_none = true;
                                    $(params[i].dom_element).css('display', 'none');
                                }
                            }).trigger('change');
                        })(i, param);
                    }
                    if ('value' in params[i].dependency) {
                        (function(i, param) {
                            $(param.dom_element).find('[name="' + param.param_name + '"]').on('keyup change', function() {
                                if (_.indexOf(params[i].dependency.value, param.get_value()) >= 0) {
                                    params[i].display_none = false;
                                    $(params[i].dom_element).css('display', 'block');
                                    if ('callback' in params[i].dependency) {
                                        params[i].dependency.callback.call(params[i], param);
                                    }
                                } else {
                                    params[i].display_none = true;
                                    $(params[i].dom_element).css('display', 'none');
                                }
                            }).trigger('change');
                        })(i, param);
                    }
                }
            }
            $('#az-editor-modal').one('shown.' + fp + 'bs.modal', function(e) {
                for (var i = 0; i < params.length; i++) {
                    if (!params[i].hidden)
                        params[i].opened();
                }
            });
            $('#az-editor-modal').one('hidden.' + fp + 'bs.modal', function(e) {
                for (var i = 0; i < params.length; i++) {
                    params[i].closed();
                }
            });
            $('#az-editor-modal').find('.save').click(function() {
                var values = {};
                for (var i = 0; i < params.length; i++) {
                    if (params[i].hidden)
                        continue;
                    if (!('display_none' in params[i]) || ('display_none' in params[i] && !params[i].display_none))
                        values[params[i].param_name] = params[i].get_value();
                    if (params[i].required && values[params[i].param_name] == '') {
                        $(params[i].dom_element).addClass('has-error');
                        return false;
                    }
                }
                callback.call(element, values);
                $('#az-editor-modal')[fp + 'modal']("hide");
                return false;
            });
            $('#az-editor-modal')[fp + 'modal']('show');
        },
        opened: function() {
        },
        closed: function() {
        },
        render: function(value) {

        }
    };
    function register_param_type(type, ParamType) {
        extend(ParamType, BaseParamType);
        ParamType.prototype.type = type;
        BaseParamType.prototype.param_types[type] = ParamType;
    }
    function make_param_type(settings) {
        if (settings.type in BaseParamType.prototype.param_types) {
            var new_param = new BaseParamType.prototype.param_types[settings.type];
            mixin(new_param, settings);
            return new_param;
        } else {
            var new_param = new BaseParamType();
            mixin(new_param, settings);
            return new_param;
        }
    }
//
//
//
    function ContainerParamType() {
        ContainerParamType.baseclass.apply(this, arguments);
    }
    register_param_type('container', ContainerParamType);
    mixin(ContainerParamType.prototype, {
        get_value: function() {
            return $(this.dom_element).find('input[name="' + this.param_name + '_type"]').val() + '/' + $(this.dom_element).find('input[name="' + this.param_name + '_name"]').val();
        },
        render: function(value) {
            var type = value.split('/')[0];
            var name = value.split('/')[1];
            this.dom_element = $('<div class="' + p + 'form-group"><label>' + this.heading + '</label><div><label>' + t("Type") + '</label><input class="' + p + 'form-control" name="' + this.param_name + '_type" type="text" value="' + type + '"></div><div><label>' + t("Name") + '</label><input class="' + p + 'form-control" name="' + this.param_name + '_name" type="text" value="' + name + '"></div><p class="' + p + 'help-block">' + this.description + '</p></div>');
        },
        opened: function() {
            var value = this.get_value();
            var type_select = null;
            var name_select = null;
            var element = this;
            azexo_get_container_types(function(data) {
                type_select = chosen_select(data, $(element.dom_element).find('input[name="' + element.param_name + '_type"]'));
                $(type_select).chosen().change(function() {
                    azexo_get_container_names($(this).val(), function(data) {
                        $(name_select).parent().find('.direct-input').click();
                        $(element.dom_element).find('input[name="' + element.param_name + '_name"]').val('');
                        name_select = chosen_select(data, $(element.dom_element).find('input[name="' + element.param_name + '_name"]'));
//                        $(name_select).empty();
//                        for (var key in data) {
//                            $(name_select).append('<option value="' + key + '">"' + data[key] + '"</option>');
//                        }
//                        $(name_select).trigger("chosen:updated");
                    });
                });
            });
            azexo_get_container_names(value.split('/')[0], function(data) {
                name_select = chosen_select(data, $(element.dom_element).find('input[name="' + element.param_name + '_name"]'));
            });
        },
    });
//
//
//
    function htmlDecode(input) {
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }
    $.fn.deserialize = function(data) {
        var f = $(this), map = {};
        //Get map of values
        $.each(data.split("&"), function() {
            var nv = this.split("="),
                    n = rawurldecode(nv[0]),
                    v = nv.length > 1 ? rawurldecode(nv[1]) : null;
            if (!(n in map)) {
                map[n] = [];
            }
            map[n].push(v);
        })
        //Set values for all form elements in the data
        $.each(map, function(n, v) {
            f.find("[name='" + n + "']").val(v[0].replace(/\+/g, " "));
            if (v[0].replace(/\+/g, " ") == 'on') {
                f.find("[type='checkbox'][name='" + n + "']").attr('checked', 'checked');
            }
            f.find("select[name='" + n + "'] > option").removeAttr('selected');
            f.find("select[name='" + n + "'] > option[value='" + v + "']").prop('selected', 'selected');
        })
        //Uncheck checkboxes and radio buttons not in the form data
        $("input:checkbox:checked,input:radio:checked").each(function() {
            if (!($(this).attr("name") in map)) {
                this.checked = false;
            }
        })

        return this;
    };
    function CMSSettingsParamType() {
        CMSSettingsParamType.baseclass.apply(this, arguments);
    }
    register_param_type('cms_settings', CMSSettingsParamType);
    mixin(CMSSettingsParamType.prototype, {
        get_value: function() {
            return $(this.dom_element).find('form').serialize();
        },
        render_form: function(instance) {
            var param = this;
            azexo_get_cms_element_settings(instance, function(data) {
                $(param.dom_element).empty();
                $(data).appendTo(param.dom_element);
                if (param.form_value.length > 0) {
                    $(param.dom_element).deserialize(htmlDecode(param.form_value));
                }
            });
        },
        get_form: function(name_param) {
            var form_value = name_param.get_value();
            if (form_value.length > 0) {
                this.render_form(form_value);
            }
        },
        render: function(value) {
            this.form_value = value;
            this.dom_element = $('<div class="' + p + 'form-group"></div>');
        },
        opened: function() {
            if ('instance' in this) {
                this.render_form(this.instance);
            }
        },
    });
//
//
//
    if ('azexo_param_types' in window) {
        for (var i = 0; i < window.azexo_param_types.length; i++) {
            var param_type = window.azexo_param_types[i];
            var ExternalParamType = function() {
                ExternalParamType.baseclass.apply(this, arguments);
            }
            register_param_type(param_type.type, ExternalParamType);
            param_type.baseclass = ExternalParamType.baseclass;
            mixin(ExternalParamType.prototype, param_type);
        }
    }
    // ------------------CORE------------------------------------
    window.azexo_add_css = function(path, callback) {
        var url = window.azexo_baseurl + path;
        if ($('link[href*="' + url + '"]').length) {
            callback();
            return;
        }
        var head = document.getElementsByTagName('head')[0];
        var stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.type = 'text/css';
        stylesheet.href = url;
        stylesheet.onload = callback;
        head.appendChild(stylesheet);
    }
    window.azexo_add_js_list = function(options) {
        if ('loaded' in options && options.loaded) {
            options.callback();
        } else {
            var counter = 0;
            for (var i = 0; i < options.paths.length; i++) {
                azexo_add_js({
                    path: options.paths[i],
                    callback: function() {
                        counter++;
                        if (counter == options.paths.length) {
                            options.callback();
                        }
                    }});
            }
        }
    }
    window.azexo_add_js = function(options) {
        if ('loaded' in options && options.loaded) {
            options.callback();
        } else {
            azexo_add_external_js(window.azexo_baseurl + options.path, 'callback' in options ? options.callback : function() {
            });
        }
    }
    window.azexo_add_external_js = function(url, callback) {
        if (url in azexo_js_waiting_callbacks) {
            azexo_js_waiting_callbacks[url].push(callback);
            return;
        } else {
            if (url in azexo_loaded_js) {
                callback();
                return;
            }
        }
        azexo_js_waiting_callbacks[url] = [callback];
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = function() {
            azexo_loaded_js[url] = true;
            while (url in azexo_js_waiting_callbacks) {
                var callbacks = azexo_js_waiting_callbacks[url];
                azexo_js_waiting_callbacks[url] = undefined;
                delete azexo_js_waiting_callbacks[url];
                for (var i = 0; i < callbacks.length; i++) {
                    callbacks[i]();
                }
            }
        };
        head.appendChild(script);
    }
    EventObject = function() {
    };
    EventObject.prototype = {
        _eventList: {},
        _getEvent: function(eventName, create) {
            if (!this._eventList[eventName]) {
                if (!create) {
                    return null;
                }
                this._eventList[eventName] = [];
            }
            return this._eventList[eventName];
        },
        attachEvent: function(eventName, handler) {
            var evt = this._getEvent(eventName, true);
            evt.push(handler);
        },
        detachEvent: function(eventName, handler) {
            var evt = this._getEvent(eventName);
            if (!evt) {
                return;
            }
            var getArrayIndex = function(array, item) {
                for (var i = array.length; i < array.length; i++) {
                    if (array[i] && array[i] === item) {
                        return i;
                    }
                }
                return -1;
            };
            var index = getArrayIndex(evt, handler);
            if (index > -1) {
                evt.splice(index, 1);
            }
        },
        raiseEvent: function(eventName, eventArgs) {
            var handler = this._getEventHandler(eventName);
            if (handler) {
                handler(this, eventArgs);
            }
        },
        _getEventHandler: function(eventName) {
            var evt = this._getEvent(eventName, false);
            if (!evt || evt.length === 0) {
                return null;
            }
            var h = function(sender, args) {
                for (var i = 0; i < evt.length; i++) {
                    evt[i](sender, args);
                }
            };
            return h;
        }
    };
//
//
//
    function AZEXOElements() {
    }
    AZEXOElements.prototype = new EventObject;
    mixin(AZEXOElements.prototype, {
        elements_instances: {},
        elements_instances_by_an_name: {},
        template_elements_loaded: false,
        cms_elements_loaded: false,
        try_render_unknown_elements: function() {
            if (this.template_elements_loaded && this.cms_elements_loaded) {
                for (var id in azexo_elements.elements_instances) {
                    var el = azexo_elements.elements_instances[id];
                    if (el instanceof UnknownElement) {
                        var shortcode = el.attrs['content'];
                        var match = /^\s*\<[\s\S]*\>\s*$/.exec(shortcode);
                        if (match)
                            BaseElement.prototype.parse_html.call(el, shortcode);
                        else
                            BaseElement.prototype.parse_shortcode.call(el, shortcode);
                        for (var i = 0; i < el.children.length; i++) {
                            el.children[i].recursive_render();
                        }
                        $(el.dom_element).empty();
                        for (var i = 0; i < el.children.length; i++) {
                            $(el.dom_element).append(el.children[i].dom_element);
                        }
                        if (window.azexo_editor)
                            el.update_sortable();
                        el.recursive_showed();
                    }
                }
            }
        },
        create_template_elements: function(elements) {
            for (var name in elements) {
                var template = elements[name];

                var TemplateElement = function(parent, parse) {
                    TemplateElement.baseclass.apply(this, arguments);
                }
                register_animated_element(name, false, TemplateElement);
                mixin(TemplateElement.prototype, {
                    name: name,
                    icon: 'fa fa-cube',
                    description: t(''),
                    template: template,
                    params: [
                    ].concat(TemplateElement.prototype.params),
                    show_settings_on_create: true,
                    has_content: true,
                    category: 'Template-elements',
                    render: function($, p, fp) {
                        var template = this.template;
                        for (var i = 0; i < this.params.length; i++) {
                            var value = this.attrs[this.params[i].param_name];
                            //
                            if (this.params[i].type == 'textfield') {
                                template = template.replace('[[' + this.params[i].param_name + ']]', value);
                            }
                            //
                            if (this.params[i].type == 'textarea') {
                                template = template.replace('{{' + this.params[i].param_name + '}}', value);
                            }
                            //
                            if (this.params[i].type == 'image') {
                                template = template.replace('((' + this.params[i].param_name + '))', value);
                            }
                            //
                            if (this.params[i].type == 'link') {
                                template = template.replace('<<' + this.params[i].param_name + '>>', value);
                            }
                        }
                        this.dom_element = $('<div class="az-element az-template ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '">' + template + '</div>');
                        this.dom_content_element = this.dom_element;
                        TemplateElement.baseclass.prototype.render.apply(this, arguments);
                    },
                });
                //
                var pattern = /\[\[([^\]]*)\]\]/g;
                var i = 0;
                var match = {};
                while ((match = pattern.exec(template)) != null) {
                    var param = make_param_type({
                        type: 'textfield',
                        param_name: 'param' + i,
                        value: match[1]
                    });
                    TemplateElement.prototype.params.unshift(param);
                    template = substr_replace(template, '[[param' + i + ']]', match.index, match[0].length);
                    i++;
                }
                TemplateElement.prototype.template = template;
                //
                var pattern = /\{\{([^\}]*)\}\}/g;
                while ((match = pattern.exec(template)) != null) {
                    var param = make_param_type({
                        type: 'textarea',
                        param_name: 'param' + i,
                        value: match[1]
                    });
                    TemplateElement.prototype.params.unshift(param);
                    template = substr_replace(template, '{{param' + i + '}}', match.index, match[0].length);
                    i++;
                }
                TemplateElement.prototype.template = template;
                //
                var pattern = /\(\(([^\)]*)\)\)/g;
                while ((match = pattern.exec(template)) != null) {
                    var param = make_param_type({
                        type: 'image',
                        param_name: 'param' + i,
                        value: match[1]
                    });
                    TemplateElement.prototype.params.unshift(param);
                    template = substr_replace(template, '((param' + i + '))', match.index, match[0].length);
                    i++;
                }
                TemplateElement.prototype.template = template;
                //
                var pattern = /\<\<([^\>]*)\>\>/g;
                while ((match = pattern.exec(template)) != null) {
                    var param = make_param_type({
                        type: 'link',
                        param_name: 'param' + i,
                        value: match[1]
                    });
                    TemplateElement.prototype.params.unshift(param);
                    template = substr_replace(template, '<<param' + i + '>>', match.index, match[0].length);
                    i++;
                }
                TemplateElement.prototype.template = template;
            }
            this.template_elements_loaded = true;
            this.try_render_unknown_elements();
        },
        create_cms_elements: function(elements) {
            for (var key in elements) {
                var base = 'az_' + key;
                var CMSElement = function(parent, parse) {
                    CMSElement.baseclass.apply(this, arguments);
                }
                register_animated_element(base, false, CMSElement);
                mixin(CMSElement.prototype, {
                    name: elements[key],
                    icon: 'fa fa-cube',
                    description: t(''),
                    category: 'CMS',
                    instance: key,
                    params: [
                        make_param_type({
                            type: 'cms_settings',
                            heading: t('Settings'),
                            param_name: 'settings',
                            instance: key,
                        }),
                    ].concat(CMSElement.prototype.params),
                    show_settings_on_create: true,
                    is_container: true,
                    has_content: true,
                    is_cms_element: true,
                    get_button: function() {
                        return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'pull-left ' + p + 'text-overflow" data-az-element="' + this.base + '"><i class="' + p + 'text-primary ' + this.icon + '"></i><div class="' + p + 'small">' + this.name + '</div></div>';
                    },
                    get_content: function() {
                        return '';
                    },
                    showed: function($, p, fp) {
                        CMSElement.baseclass.prototype.showed.apply(this, arguments);
                        if ('content' in this.attrs && this.attrs['content'] != '') {
                            $(this.dom_content_element).append(this.attrs['content']);
                            this.attrs['content'] = '';
                        } else {
                            var element = this;
                            azexo_add_js({
                                path: 'jquery-waypoints/waypoints.min.js',
                                loaded: 'waypoint' in $.fn,
                                callback: function() {
                                    $(element.dom_element).waypoint(function(direction) {
                                        var container = element.parent.get_my_container();
                                        azexo_load_cms_element(element.instance, element.attrs['settings'], container.attrs['container'], function(data) {
                                            $(element.dom_content_element).empty();
                                            $(element.dom_content_element).append(data);
                                        });
                                    }, {offset: '100%', triggerOnce: true});
                                    $(document).trigger('scroll');
                                }});
                        }
                    },
                    render: function($, p, fp) {
                        this.dom_element = $('<div class="az-element az-cms-element ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
                        this.dom_content_element = $('<div></div>').appendTo(this.dom_element);
                        CMSElement.baseclass.prototype.render.apply(this, arguments);
                    },
                });
            }
            this.cms_elements_loaded = true;
            this.try_render_unknown_elements();
        },
        make_elements_modal: function(container, pre_render_callback) {
            var disallowed_elements = container.get_all_disallowed_elements();
            var tabs = {};
            for (var id in BaseElement.prototype.elements) {
                if (BaseElement.prototype.elements[id].prototype.hidden)
                    continue;
                if (disallowed_elements.indexOf(BaseElement.prototype.elements[id].prototype.base) >= 0)
                    continue;
                if (BaseElement.prototype.elements[id].prototype.category in tabs) {
                    tabs[BaseElement.prototype.elements[id].prototype.category].push(BaseElement.prototype.elements[id]);
                } else {
                    tabs[BaseElement.prototype.elements[id].prototype.category] = [BaseElement.prototype.elements[id]];
                }
            }
            var elements_tabs = $('<div id="az-elements-tabs"></div>');
            var i = 0;
            var menu = '<ul class="' + p + 'nav ' + p + 'nav-tabs">';
            for (var title in tabs) {
                i++;
                if (title === '')
                    title = t('Content');
                menu += '<li><a href="#az-elements-tab-' + i + '" data-toggle="tab">' + title + '</a></li>';
            }
            if(window.azexo_online)
                menu += '<li><a href="#az-elements-tab-templates" data-toggle="tab">' + t("Saved templates") + '</a></li>';
            menu += '</ul>';
            $(elements_tabs).append(menu);
            i = 0;
            var tabs_content = $('<div class="' + p + 'tab-content"></div>');
            for (var title in tabs) {
                i++;
                var tab = $('<div id="az-elements-tab-' + i + '" class="' + p + 'tab-pane ' + p + 'clearfix"></div>');
                for (var j = 0; j < tabs[title].length; j++) {
                    $(tab).append(tabs[title][j].prototype.get_button());
                }
                $(tabs_content).append(tab);
            }
            if(window.azexo_online)
                tab = $('<div id="az-elements-tab-templates" class="' + p + 'tab-pane ' + p + 'clearfix"></div>');
            $(tabs_content).append(tab);
            $(elements_tabs).append(tabs_content);

            $('#az-elements-modal').remove();
            var header = '<div class="' + p + 'modal-header"><button type="button" class="' + p + 'close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="' + p + 'modal-title">' + t("Elements list") + '</h4></div>';
            var elements_modal = $('<div id="az-elements-modal" class="' + p + 'modal azexo" style="display:none"><div class="' + p + 'modal-dialog ' + p + 'modal-lg"><div class="' + p + 'modal-content">' + header + '<div class="' + p + 'modal-body"></div></div></div></div>');
            $('body').prepend(elements_modal);
            $(elements_modal).find('.' + p + 'modal-body').append(elements_tabs);
            $(elements_tabs).find('> ul a:first')[fp + 'tab']('show');
            $(elements_modal).find('[data-az-element]').click(function() {
                var key = $(this).attr('data-az-element');

                var depth = container.get_nested_depth(key);
                if (depth < BaseElement.prototype.max_nested_depth) {

                    if (container instanceof ContainerElement && container.parent == null && key != 'az_row') {
                        var row = new RowElement(container, false);
                        row.update_dom();

                        var constructor = BaseElement.prototype.elements[key];
                        var child = new constructor(row.children[0], false);
                        pre_render_callback(child);
                        child.update_dom();
                        container.update_empty();
                        row.children[0].update_empty();
                        row.update_empty();
                    } else {
                        var constructor = BaseElement.prototype.elements[key];
                        var child = new constructor(container, false);
                        pre_render_callback(child);
                        child.update_dom();
                        container.update_empty();
                    }
                    $('#az-elements-modal')[fp + 'modal']("hide");
                    if (child.show_settings_on_create) {
                        child.edit();
                    }
                } else {
                    alert(t('Element can not be added. Max nested depth reached.'));
                }
            });
            if(window.azexo_online)
                $(elements_tabs).find('a[href="#az-elements-tab-templates"]').on('shown.' + fp + 'bs.tab', function(e) {
                //e.target
                azexo_get_templates(function(templates) {
                    var tab_templates = $(elements_tabs).find('#az-elements-tab-templates');
                    $(tab_templates).empty();
                    for (var i = 0; i < templates.length; i++) {
                        var name = templates[i];
                        var button = '<div class="' + p + 'well ' + p + 'text-center ' + p + 'pull-left ' + p + 'text-overflow" data-az-template="' + name + '"><i class="' + p + 'text-primary fa fa-cubes"></i><h4>' + name + '</h4></div>';
                        button = $(button).appendTo(tab_templates).click(function() {
                            var key = $(this).attr('data-az-template');
                            azexo_load_template(key, function(shortcode) {
                                var length = container.children.length;
                                BaseElement.prototype.parse_shortcode.call(container, shortcode);
                                for (var i = length; i < container.children.length; i++) {
                                    container.children[i].recursive_render();
                                }
                                for (var i = length; i < container.children.length; i++) {
                                    $(container.dom_content_element).append(container.children[i].dom_element);
                                }
                                if (window.azexo_editor) {
                                    container.update_empty();
                                    container.update_sortable();
                                }
                                container.recursive_showed();
                                $('#az-elements-modal')[fp + 'modal']("hide");
                            });
                        });
                        $('<span class="fa fa-trash-o" data-az-template="' + name + '"></span>').appendTo(button).click(function() {
                            var name = $(this).attr('data-az-template');
                            azexo_delete_template(name);
                            $(tab_templates).find('[data-az-template="' + name + '"]').remove();
                        });
                    }
                });
            });
        },
        show: function(container, pre_render_callback) {
            $('#az-elements-modal').remove();
            this.make_elements_modal(container, pre_render_callback);
            $('#az-elements-modal')[fp + 'modal']('show');
            $('#az-elements-modal #az-elements-tabs').find('> ul a:first')[fp + 'tab']('show');
        },
        get_element: function(id) {
            return this.elements_instances[id];
        },
        delete_element: function(id) {
            this.raiseEvent("delete_element", id);
            delete this.elements_instances[id];
        },
        add_element: function(id, element, parse) {
            this.elements_instances[id] = element;
            this.raiseEvent("add_element", {id: id, parse: parse});
        },
    });
//
//
//
    function BaseElement(parent, parse) {
        if (azexo_frontend)
            this.id = _.uniqueId('f');
        else
            this.id = _.uniqueId();
        if (parent != null) {
            this.parent = parent;
            if (parse)
                parent.children.push(this);
            else
                parent.children.unshift(this);
        }
        //
        this.children = [];
        this.dom_element = null;
        this.dom_content_element = null;
        this.attrs = {};
        for (var i = 0; i < this.params.length; i++) {
            if (_.isString(this.params[i].value))
                this.attrs[this.params[i].param_name] = this.params[i].value;
            else {
                if (!this.params[i].hidden)
                    this.attrs[this.params[i].param_name] = '';
//            if (_.isArray(this.params[i].value)) {
//                this.attrs[this.params[i].param_name] = this.params[i].value[0];
//            } else {
//                if (_.isObject(this.params[i].value)) {
//                    var keys = _.keys(this.params[i].value);
//                    this.attrs[this.params[i].param_name] = keys[0];
//                } else {
//                    this.attrs[this.params[i].param_name] = null;
//                }
//            }
            }
        }
        this.controls = null;
        azexo_elements.add_element(this.id, this, parse);
    }
    BaseElement.prototype = {
        el_classes: _.object([p + 'optgroup-bootstrap', p + 'bg-primary', p + 'text-primary', p + 'bg-default', p + 'text-default', p + 'text-muted', p + 'small', p + 'text-left', p + 'text-right', p + 'text-center', p + 'text-justify', p + 'pull-left', p + 'pull-right', p + 'center-block', p + 'well', p + 'visible-xs-block', p + 'visible-sm-block', p + 'visible-md-block', p + 'visible-lg-block', p + 'hidden-xs', p + 'hidden-sm', p + 'hidden-md', p + 'hidden-lg'], [t("Bootstrap classes"), t("Background primary style"), t("Text primary style"), t("Background default style"), t("Text default style"), t("Text muted style"), t("Text small style"), t("Text align left"), t("Text align right"), t("Text align center"), t("Text align justify"), t("Pull left"), t("Pull right"), t("Block align center"), t("Well"), t("Visible on extra small devices, phones (<768px)"), t("Visible on small devices, tablets (≥768px)"), t("Visible on medium devices, desktops (≥992px)"), t("Visible onn large devices, desktops (≥1200px)"), t("Hidden on extra small devices, phones (<768px)"), t("Hidden on small devices, tablets (≥768px)"), t("Hidden on medium devices, desktops (≥992px)"), t("Hidden on large devices, desktops (≥1200px)")]),
        elements: {},
        tags: {},
        max_nested_depth: 3,
        name: '',
        category: '',
        description: '',
        params: [
            make_param_type({
                type: 'textfield',
                heading: t('Element classes'),
                param_name: 'el_class',
                description: t('If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.')
            }),
            make_param_type({
                type: 'style',
                heading: t('Style'),
                param_name: 'style',
                description: t('Style options.'),
                tab: t('Style')
            }),
            make_param_type({
                type: 'style',
                heading: t('Hover style'),
                param_name: 'hover_style',
                important: true,
                description: t('Hover style options.'),
                tab: t('Hover style')
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Left'),
                param_name: 'pos_left',
                tab: t('Placement'),
                max: '1',
                step: '0.01',
                hidden: true,
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Right'),
                param_name: 'pos_right',
                tab: t('Placement'),
                max: '1',
                step: '0.01',
                hidden: true,
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Top'),
                param_name: 'pos_top',
                tab: t('Placement'),
                max: '1',
                step: '0.01',
                hidden: true,
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Bottom'),
                param_name: 'pos_bottom',
                tab: t('Placement'),
                max: '1',
                step: '0.01',
                hidden: true,
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Width'),
                param_name: 'pos_width',
                tab: t('Placement'),
                max: '1',
                step: '0.01',
                hidden: true,
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Height'),
                param_name: 'pos_height',
                tab: t('Placement'),
                max: '1',
                step: '0.01',
                hidden: true,
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Z-index'),
                param_name: 'pos_zindex',
                tab: t('Placement'),
                hidden: true,
            }),
        ],
        icon: '',
        is_container: false,
        has_content: false,
        frontend_render: false,
        show_settings_on_create: false,
        wrapper_class: '',
        weight: 0,
        hidden: false,
        disallowed_elements: [],
        controls_position: function() {
            if (!this.is_container || this.has_content) {
                var element_height = $(this.dom_element).height();
                var frame_height = $(window).height();
                if (element_height > frame_height) {
                    var window_top = $(window).scrollTop();
                    var control_top = $(this.controls).offset().top;
                    var element_position_top = $(this.dom_element).offset().top;

                    var new_position = (window_top - element_position_top) + frame_height / 2;
                    if (new_position > 40 && new_position < element_height) {
                        $(this.controls).css('top', new_position);
                    } else if (new_position > element_height) {
                        $(this.controls).css('top', element_height - 40);

                    } else {
                        $(this.controls).css('top', 40);
                    }
                }
            }
        },
        show_controls: function() {
            if (window.azexo_editor) {
                this.controls = $('<div class="controls ' + p + 'btn-group ' + p + 'btn-group-xs"></div>').prependTo(this.dom_element);
                $('<span title="' + title("Drag and drop") + '" class="control drag-and-drop ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon ' + p + 'glyphicon-move">' + this.name + '</span>').appendTo(this.controls);

                if (this.is_container && !this.has_content) {
                    $('<button title="' + title("Add") + '" type="button" class="control add ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-plus"> </button>').appendTo(this.controls).click({object: this}, this.click_add);
                    $('<button title="' + title("Paste") + '" type="button" class="control paste ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-hand-down"> </button>').appendTo(this.controls).click({object: this}, this.click_paste);
                }

                $('<button title="' + title("Edit") + '" type="button" class="control edit ' + p + 'btn ' + p + 'btn-warning ' + p + 'glyphicon ' + p + 'glyphicon-pencil"> </button>').appendTo(this.controls).click({object: this}, this.click_edit);
                $('<button title="' + title("Copy") + '" type="button" class="control copy ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-briefcase"> </button>').appendTo(this.controls).click({object: this}, this.click_copy);
                $('<button title="' + title("Clone") + '" type="button" class="control clone ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-repeat"> </button>').appendTo(this.controls).click({object: this}, this.click_clone);
                $('<button title="' + title("Remove") + '" type="button" class="control remove ' + p + 'btn ' + p + 'btn-danger ' + p + 'glyphicon ' + p + 'glyphicon-remove"> </button>').appendTo(this.controls).click({object: this}, this.click_remove);
                $('<button title="' + title('Save as template') + '" type="button" class="control save-template ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-floppy-save"> </button>').appendTo(this.controls).click({object: this}, this.click_save_template);
                this.update_empty();

                var element = this;
                setTimeout(function() {
                    element.controls_position();
                }, 1000);
                $(window).scroll(function() {
                    element.controls_position();
                });

                var element = this;
                element.right_click_number = 0;
                $(this.dom_element).mousedown(function(e) {
                    if (e.which == 2) {
                        element.right_click_number++;
                        var i = 1;
                        var parent = element;
                        var last = false;
                        while (i < element.right_click_number) {
                            if ($(parent.dom_element).parent().closest('[data-az-id]').length > 0) {
                                var id = $(parent.dom_element).parent().closest('[data-az-id]').attr('data-az-id');
                                parent = azexo_elements.get_element(id);
                                i++;
                            } else {
                                last = true;
                                break;
                            }
                        }
                        $('.controls').css('visibility', 'hidden').css('opacity', '0');
                        $('.control').css('opacity', '0');
                        $('.az-element').removeClass('highlight');
                        if (!last) {
                            if (parent instanceof LayersElement) {
                                if (parent.layer_number < parent.children.length) {
                                    var layer = parent.children[parent.layer_number];
                                    $(layer.dom_element).find(' > .controls').css('visibility', 'visible').css('opacity', '1').find(' > .control').css('opacity', '1');
                                    $(layer.dom_element).addClass('highlight');
                                    element.right_click_number--;
                                    parent.layer_number++;
                                } else {
                                    $(parent.dom_element).find(' > .controls').css('visibility', 'visible').css('opacity', '1').find(' > .control').css('opacity', '1');
                                    $(parent.dom_element).addClass('highlight');
                                    parent.layer_number = 0;
                                }
                            } else {
                                $(parent.dom_element).find(' > .controls').css('visibility', 'visible').css('opacity', '1').find(' > .control').css('opacity', '1');
                                $(parent.dom_element).addClass('highlight');
                            }
                        } else {
                            element.right_click_number = 0;
                        }
                        return false;
                    }
                });
                $(this.dom_element).mouseenter(function(e) {
                    element.right_click_number = 0;
                    if (element instanceof LayersElement)
                        element.layer_number = 0;
                });
                $(this.dom_element).mouseleave(function(e) {
                    if ($(element.dom_element).hasClass('highlight')) {
                        $('.controls').css('visibility', '').css('opacity', '');
                        $('.control').css('opacity', '')
                        $('.az-element').removeClass('highlight');
                    }
                });
            }
        },
        get_empty: function() {
            //→←↑↓↖↗↘↙
            return '<div class="az-empty"><div class="top ' + p + 'well"><strong>' + t('Click to put an element here.') + '</strong></div></div>';
        },
        update_empty: function() {
            if (window.azexo_editor) {
                if ((this.children.length == 0 && this.is_container && !this.has_content) || (this.has_content && this.attrs['content'] == '')) {
                    $(this.dom_content_element).find('> .az-empty').remove();
                    var empty = $(this.get_empty()).appendTo(this.dom_content_element);
                    var pos = '';
                    if ($(empty).find('.bottom').length == 0)
                        pos = 'bottom';
                    if ($(empty).find('.top').length == 0)
                        pos = 'top';
                    if (pos != '')
                        $(empty).append('<div class="' + pos + ' ' + p + 'well">' + t('Mouse over highlights the boundaries of the elements and its controls.') + '</div>');
                    $(empty).click(function(e) {
                        if (e.which == 1) {
                            var id = $(this).closest('[data-az-id]').attr('data-az-id');
                            azexo_elements.show(azexo_elements.get_element(id), function(element) {
                            });
                        }
                    });
                } else {
                    $(this.dom_content_element).find('> .az-empty').remove();
                }
            }
        },
        get_button: function() {
            return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'pull-left ' + p + 'text-overflow" data-az-element="' + this.base + '"><i class="' + p + 'text-primary ' + this.icon + '"></i><div>' + this.name + '</div><div class="' + p + 'text-muted ' + p + 'small">' + this.description + '</div></div>';
        },
        click_add: function(e) {
            e.data.object.add();
            return false;
        },
        add: function() {
            azexo_elements.show(this, function(element) {
            });
        },
        update_sortable: function() {
            if (window.azexo_editor) {
                if (this.is_container && !this.has_content || (this instanceof UnknownElement)) {
                    $(this.dom_content_element).sortable({
                        items: '> .az-element',
                        connectWith: '.az-ctnr',
                        handle: '> .controls > .drag-and-drop',
                        update: this.update_sorting,
                        placeholder: 'az-sortable-placeholder',
                        forcePlaceholderSize: true,
                        over: function(event, ui) {
                            ui.placeholder.attr('class', ui.helper.attr('class'));
                            ui.placeholder.removeClass('ui-sortable-helper');
                            ui.placeholder.addClass('az-sortable-placeholder');
                            //$(this).closest('[data-az-id]')
                        }
                    });
                }
            }
        },
        replace_render: function() {
            var dom_element = this.dom_element;
            var dom_content_element = this.dom_content_element;
            if (dom_element != null) {
                this.render($, p, fp);
                $(dom_element).replaceWith(this.dom_element);
                if (dom_content_element != null) {
                    $(this.dom_content_element).replaceWith(dom_content_element);
                }
            }
            if (window.azexo_editor)
                this.show_controls();
        },
        update_dom: function() {
            this.detach_children();
            $(this.dom_element).remove();
            this.parent.detach_children();
            this.render($, p, fp);
            this.attach_children();
            if (window.azexo_editor)
                this.show_controls();
            this.parent.attach_children();
            if (window.azexo_editor) {
                this.update_sortable();
                this.update_empty();
            }
            this.showed($, p, fp);
        },
        showed: function($, p, fp) {
            if ('pos_left' in this.attrs)
                $(this.dom_element).css("left", this.attrs['pos_left']);
            if ('pos_right' in this.attrs)
                $(this.dom_element).css("right", this.attrs['pos_right']);
            if ('pos_top' in this.attrs)
                $(this.dom_element).css("top", this.attrs['pos_top']);
            if ('pos_bottom' in this.attrs)
                $(this.dom_element).css("bottom", this.attrs['pos_bottom']);
            if ('pos_width' in this.attrs)
                $(this.dom_element).css("width", this.attrs['pos_width']);
            if ('pos_height' in this.attrs)
                $(this.dom_element).css("height", this.attrs['pos_height']);
            if ('pos_zindex' in this.attrs)
                $(this.dom_element).css("z-index", this.attrs['pos_zindex']);
            if ('hover_style' in this.attrs && this.attrs['hover_style'] != '') {
                $('head').append("<style>.hover-style-" + this.id + ":hover { " + this.attrs['hover_style'] + " } </style>");
                $(this.dom_element).addClass('hover-style-' + this.id);
            }
        },
        render: function($, p, fp) {
            $(this.dom_element).attr('data-az-id', this.id);
        },
        update_data: function() {
            $(this.dom_element).attr('data-azb', this.base);
            for (var i = 0; i < this.params.length; i++) {
                var param = this.params[i];
                if (param.param_name in this.attrs) {
                    var value = this.attrs[param.param_name];
                    if ((value == '' && param.can_be_empty || value != '') && (param.param_name !== 'content') && (value !== param.value)) {
                        //if (param.param_name !== 'content') {
                        if (!param.safe) {
                            value = btoa(encodeURIComponent(value));
                        }
                        $(this.dom_element).attr('data-azat-' + param.param_name, value);
                    }
                }
            }

            if (this.dom_content_element != null) {
                $(this.dom_content_element).attr('data-azcnt', 'true');
            }
        },
        recursive_update_data: function() {
            this.update_data();
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].recursive_update_data();
            }
        },
        recursive_clear_animation: function() {
            if ('clear_animation' in this)
                this.clear_animation();
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].recursive_clear_animation();
            }
        },
        recursive_showed: function() {
            this.showed($, p, fp);
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].recursive_showed();
            }
        },
        update_sorting_children: function() {
            var options = $(this.dom_content_element).sortable('option');
            var children = [];
            $(this.dom_content_element).find(options.items).each(function() {
                children.push(azexo_elements.get_element($(this).attr('data-az-id')));
            });
            this.children = children;
            for (var i = 0; i < this.children.length; i++)
                this.children[i].parent = this;
            this.update_empty();
        },
        update_sorting: function(event, ui) {
            var element = azexo_elements.get_element($(ui.item).closest('[data-az-id]').attr('data-az-id'));
            ui.source = azexo_elements.get_element($(this).closest('[data-az-id]').attr('data-az-id'));
            ui.from_pos = element.get_child_position();
            ui.source.update_sorting_children();
//            var options = $(this).sortable('option');
//            var children = [];
//            $(this).find(options.items).each(function() {
//                children.push(azexo_elements.get_element($(this).attr('data-az-id')));
//            });
//            source.children = children;
//            for (var i = 0; i < source.children.length; i++)
//                source.children[i].parent = source;
//            source.update_empty();            
            ui.target = azexo_elements.get_element($(ui.item).parent().closest('[data-az-id]').attr('data-az-id'));
            if (ui.source.id != ui.target.id)
                ui.target.update_sorting_children();
            ui.to_pos = element.get_child_position();


//            if (!_.isNull(ui.sender)) {
//                var sender_options = $(ui.sender).sortable('option');
//                var sender = azexo_elements.get_element($(ui.sender).closest('[data-az-id]').attr('data-az-id'));
//                var children = [];
//                $(ui.sender).find(sender_options.items).each(function() {
//                    children.push(azexo_elements.get_element($(this).attr('data-az-id')));
//                });
//                sender.children = children;
//                for (var i = 0; i < sender.children.length; i++)
//                    sender.children[i].parent = sender;
//                sender.update_empty();
//            }
            azexo_elements.raiseEvent("update_sorting", ui);
        },
        click_edit: function(e) {
            e.data.object.edit();
            return false;
        },
        edit: function() {
            BaseParamType.prototype.show_editor(this.params, this, this.edited);
        },
        edited: function(attrs) {
            //this.attrs = attrs;
            for (var name in attrs) {
                this.attrs[name] = unescapeParam(attrs[name]);
            }
            this.update_dom();
            azexo_elements.raiseEvent("edited_element", this.id);
        },
        attrs2string: function() {
            var attrs = '';
            for (var i = 0; i < this.params.length; i++) {
                var param = this.params[i];
                if (param.param_name in this.attrs) {
                    var value = this.attrs[param.param_name];
                    if ((value == '' && param.can_be_empty || value != '') && (param.param_name !== 'content') && (value !== param.value)) {
                        //if (param.param_name !== 'content') {
                        if (!param.safe) {
                            value = btoa(encodeURIComponent(value));
                        }
                        attrs += param.param_name + '="' + value + '" ';
                    }
                }
            }
            return attrs;
        },
        get_content: function() {
            for (var i = 0; i < this.params.length; i++) {
                var param = this.params[i];
                if (param.param_name === 'content') {
                    if (param.type == "html") {
                        return btoa(encodeURIComponent(this.attrs['content']));
                    }
                }
            }
            return this.attrs['content'];
        },
        set_content: function(content) {
            var value = unescapeParam(content);
            for (var i = 0; i < this.params.length; i++) {
                var param = this.params[i];
                if (param.param_name === 'content') {
                    if (param.type == "html") {
                        value = decodeURIComponent(atob(value.replace(/^#E\-8_/, '')));
                        this.attrs['content'] = value;
                        return;
                    }
                }
            }
            this.attrs['content'] = value;
        },
        parse_attrs: function(attrs) {
            for (var i = 0; i < this.params.length; i++) {
                var param = this.params[i];
                if (param.param_name in attrs) {
                    if (!param.safe) {
                        var value = unescapeParam(attrs[param.param_name]);
                        this.attrs[param.param_name] = decodeURIComponent(atob(value.replace(/^#E\-8_/, '')));
                    } else {
                        this.attrs[param.param_name] = unescapeParam(attrs[param.param_name]);
                    }
                } else {
                    if ('value' in param && _.isString(param.value)) {
                        this.attrs[param.param_name] = param.value;
                    }
                }
            }
            for (var name in attrs) {
                if (!(name in this.attrs)) {
                    this.attrs[name] = attrs[name];
                }
            }
            azexo_elements.raiseEvent("edited_element", this.id);
        },
        get_nested_depth: function(base) {
            var depth = 0;
            if (this.parent != null) {
                depth += this.parent.get_nested_depth(base);
            }
            if (this.base == base) {
                depth++;
            }
            return depth;
        },
        get_my_shortcode: function() {
            var tags = _.keys(BaseElement.prototype.elements);
            var nested_counter = _.object(tags, Array.apply(null, new Array(tags.length)).map(Number.prototype.valueOf, 0));
            var shortcode = this.get_shortcode(nested_counter);
            return shortcode;
        },
        get_children_shortcode: function() {
            var tags = _.keys(BaseElement.prototype.elements);
            var nested_counter = _.object(tags, Array.apply(null, new Array(tags.length)).map(Number.prototype.valueOf, 0));
            var shortcode = '';
            for (var i = 0; i < this.children.length; i++) {
                shortcode += this.children[i].get_shortcode(nested_counter);
            }
            return shortcode;
        },
        get_shortcode: function(nested_counter) {
            nested_counter[this.base]++;
            var contain_shortcode = '';
            for (var i = 0; i < this.children.length; i++) {
                contain_shortcode += this.children[i].get_shortcode(nested_counter);
            }
            if (this.base == 'az_unknown') {
                shortcode = contain_shortcode;
            } else {
                var base = '';
                if (nested_counter[this.base] == 1) {
                    base = this.base;
                } else {
                    var c = nested_counter[this.base] - 1;
                    base = this.base + '_' + c;
                }

                var attrs = this.attrs2string();
                var shortcode = '[' + base + ' ' + attrs + ']';
                if (this.is_container) {
                    if (this.has_content) {
                        shortcode += this.get_content() + '[/' + base + ']';
                    } else {
                        shortcode += contain_shortcode + '[/' + base + ']';
                    }
                }
            }
            nested_counter[this.base]--;
            return shortcode;
        },
        parse_shortcode: function(content) {
            var tags = _.keys(BaseElement.prototype.tags).join('|'),
                    reg = azexo.shortcode.regexp(tags),
                    matches = $.trim(content).match(reg);
            if (_.isNull(matches)) {
                if (content.length == 0) {
                    return;
                } else {
                    this.parse_shortcode('[az_row][az_column width="1/1"][az_text]' + content + '[/az_text][/az_column][/az_row]');
                }
            }
            _.each(matches, function(raw) {
                var sub_matches = raw.match(azexo_regexp(tags));
                var sub_content = sub_matches[5];
                var sub_regexp = new RegExp('^[\\s]*\\[\\[?(' + _.keys(BaseElement.prototype.tags).join('|') + ')(?![\\w-])');
                var atts_raw = azexo.shortcode.attrs(sub_matches[3]);
                var shortcode = sub_matches[2];

                if (this.get_nested_depth(shortcode) > BaseElement.prototype.max_nested_depth)
                    return;
                if (this instanceof ContainerElement && this.parent == null && shortcode != 'az_row') {
                    this.parse_shortcode('[az_row][az_column width="1/1"]' + content + '[/az_column][/az_row]');
                    return;
                }
                var constructor = UnknownElement;
                if (shortcode in BaseElement.prototype.tags) {
                    constructor = BaseElement.prototype.tags[shortcode];
                }
                var element = new constructor(this, true);
                element.parse_attrs(atts_raw.named);

                var settings = BaseElement.prototype.tags[shortcode].prototype;

                if (_.isString(sub_content) && sub_content.match(sub_regexp) && (settings.is_container === true)) {
                    element.parse_shortcode(sub_content);
                } else if (_.isString(sub_content) && sub_content.length && shortcode === 'az_row') {
                    element.parse_shortcode('[az_column width="1/1"][az_text]' + sub_content + '[/az_text][/az_column]');
                } else if (_.isString(sub_content) && sub_content.length && shortcode === 'az_column' && !(sub_content.substring(0, 1) == '[' && sub_content.slice(-1) == ']')) {
                    element.parse_shortcode('[az_text]' + sub_content + '[/az_text]');
                } else if (_.isString(sub_content)) {
                    if (settings.has_content === true) {
                        element.set_content(sub_content);
                    } else {
                        if (sub_content != '')
                            element.parse_shortcode('[az_unknown]' + sub_content + '[/az_unknown]');
                    }
                }
            }, this);
        },
        parse_html: function(dom_element) {
            var element = this;
            if (($(dom_element).children().closest_descendents('[data-azb]').length == 0) && ($.trim($(dom_element).html()).length > 0)) {
                var row = new RowElement(element, false);
                row.children = [];
                var column = new ColumnElement(row, false);
                var constructor = BaseElement.prototype.elements['az_text'];
                var child = new constructor(column, false);
                child.attrs['content'] = $(dom_element).html();
                child.update_dom();
                if('update_empty' in element)
                    element.update_empty();
                if('update_empty' in column)
                    column.update_empty();
                if('update_empty' in row)
                    row.update_empty();
            } else {
                $(dom_element).children().closest_descendents('[data-azb]').each(function() {
                    var tag = $(this).attr('data-azb');
                    var constructor = UnknownElement;
                    if (tag in BaseElement.prototype.tags) {
                        constructor = BaseElement.prototype.tags[tag];
                    }
                    var child = new constructor(element, true);

                    if (azexo_frontend) {
                        azexo_elements.elements_instances[child.id] = null;
                        delete azexo_elements.elements_instances[child.id];
                        child.id = $(this).attr('data-az-id');
                        azexo_elements.elements_instances[child.id] = child;
                    }

                    child.dom_element = $(this);
                    var attrs = {};
                    $($(this)[0].attributes).each(function() {
                        if (this.nodeName.indexOf('data-azat') >= 0) {
                            attrs[this.nodeName.replace('data-azat-', '')] = this.value;
                        }
                    });
                    child.parse_attrs(attrs);
                    if (child.is_container) {
                        var cnt = $(this).closest_descendents('[data-azcnt]');
                        if (cnt.length > 0) {
                            child.dom_content_element = $(cnt);
                            if (child.has_content) {
                                if (child instanceof UnknownElement) {
                                    child.attrs['content'] = $(cnt).wrap('<div></div>').parent().html();
                                    $(cnt).unwrap();
                                } else {
                                    child.attrs['content'] = $(cnt).html();
                                }
                            } else {
                                child.parse_html(cnt);
                            }
                        }
                    }
                });
            }
        },
        recursive_render: function() {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].recursive_render();
            }
            if (azexo_frontend) {
                if (this.frontend_render) {
                    this.detach_children();
                    this.parent.detach_children();
                    this.render($, p, fp);
                    this.attach_children();
                    this.parent.attach_children();
                }
            } else {
                this.render($, p, fp);
                this.attach_children();
            }
            if (window.azexo_editor) {
                this.show_controls();
                this.update_sortable();
            }
        },
        detach_children: function() {
            for (var i = 0; i < this.children.length; i++) {
                $(this.children[i].dom_element).detach();
            }
        },
        attach_children: function() {
            for (var i = 0; i < this.children.length; i++) {
                $(this.dom_content_element).append(this.children[i].dom_element);
            }
        },
        click_copy: function(e) {
            e.data.object.copy();
            return false;
        },
        copy: function() {
            var shortcode = this.get_my_shortcode();
            $('#azexo-clipboard').html(btoa(encodeURIComponent(shortcode)));
        },
        click_paste: function(e) {
            e.data.object.paste(0);
            return false;
        },
        paste: function(start) {
            var shortcode = decodeURIComponent(atob($('#azexo-clipboard').html()));
            if (shortcode != '') {
                var length = this.children.length;
                BaseElement.prototype.parse_shortcode.call(this, shortcode);

                var new_children = [];
                for (var i = length; i < this.children.length; i++) {
                    this.children[i].recursive_render();
                    new_children.push(this.children[i]);
                }
                this.children = this.children.slice(0, length);

                this.children.splice.apply(this.children, [start, 0].concat(new_children));

                this.detach_children();
                this.attach_children();

//            for (var i = length; i < this.children.length; i++) {
//                this.children[i].recursive_render();
//            }
//            for (var i = length; i < this.children.length; i++) {
//                $(this.dom_content_element).append(this.children[i].dom_element);
//            }
                this.update_empty();
                this.update_sortable();
                this.recursive_showed();
            }
        },
        click_save_template: function(e) {
            e.data.object.save_template();
            return false;
        },
        save_template: function() {
            var shortcode = this.get_my_shortcode();
            var name = window.prompt(t('Please enter template name'), '');
            if (name != '' && name != null)
                azexo_save_template(name, shortcode);
        },
        click_clone: function(e) {
            e.data.object.clone();
            return false;
        },
        clone: function() {
            this.copy();
            for (var i = 0; i < this.parent.children.length; i++) {
                if (this.parent.children[i].id == this.id) {
                    this.parent.paste(i);
                    break;
                }
            }
        },
        click_remove: function(e) {
            e.data.object.remove();
            return false;
        },
        remove: function() {
            azexo_elements.delete_element(this.id);
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].remove();
            }
            $(this.dom_element).remove();
            for (var i = 0; i < this.parent.children.length; i++) {
                if (this.parent.children[i].id == this.id) {
                    this.parent.children.splice(i, 1);
                    break;
                }
            }
            this.parent.update_empty();
        },
        get_child_position: function() {
            for (var i = 0; i < this.parent.children.length; i++) {
                if (this.parent.children[i].id == this.id) {
                    return i;
                    break;
                }
            }
            return -1;
        },
        add_css: function(path, loaded, callback) {
            var container = this.get_my_container();
            container.css[window.azexo_baseurl + path] = true;
            if (!loaded) {
                window.azexo_add_css(path, callback);
            }
        },
        add_js_list: function(options) {
            var container = this.get_my_container();
            for (var i = 0; i < options.paths.length; i++) {
                container.js[window.azexo_baseurl + options.paths[i]] = true;
            }
            window.azexo_add_js_list(options);
        },
        add_js: function(options) {
            var container = this.get_my_container();
            container.js[window.azexo_baseurl + options.path] = true;
            window.azexo_add_js(options);
        },
        add_external_js: function(url, callback) {
            var container = this.get_my_container();
            container.js[url] = true;
            window.azexo_add_external_js(url, callback);
        },
        get_my_container: function() {
            if (this instanceof ContainerElement) {
                return this;
            } else {
                return this.parent.get_my_container();
            }
        },
        get_all_disallowed_elements: function() {
            if ('parent' in this) {
                var disallowed_elements = _.uniq(this.parent.get_all_disallowed_elements().concat(this.disallowed_elements));
                return disallowed_elements;
            } else {
                return this.disallowed_elements;
            }
        }
    };
    function register_element(base, is_container, Element) {
        extend(Element, BaseElement);
        Element.prototype.base = base;
        Element.prototype.is_container = is_container;
        BaseElement.prototype.elements[base] = Element;
        BaseElement.prototype.tags[base] = Element;
        if (is_container) {
            for (var i = 1; i < BaseElement.prototype.max_nested_depth; i++) {
                BaseElement.prototype.tags[base + '_' + i] = Element;
            }
        }
    }
//
//
//
    function UnknownElement(parent, parse) {
        UnknownElement.baseclass.apply(this, arguments);
    }
    register_element('az_unknown', true, UnknownElement);
    mixin(UnknownElement.prototype, {
        has_content: true,
        hidden: true,
        show_controls: function() {
        },
        update_empty: function() {
        },
        render: function($, p, fp) {
            this.dom_element = $('<div class = "az-element"></div>');
            this.dom_content_element = this.dom_element;
            if ('content' in this.attrs) {
                var match = /\[[^\]]*\]([^\[]*)\[\/[^\]]*\]/.exec(this.attrs['content']);
                if (match) {
                    $(this.dom_element).append(match[1]);
                }
            }
            UnknownElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    if (!('azexo_baseurl' in window)) {
        if ($('script[src*="azexo_composer.js"]').length > 0) {
            var azexo_composer_src = $('script[src*="azexo_composer.js"]').attr('src');
            window.azexo_baseurl = azexo_composer_src.slice(0, azexo_composer_src.indexOf('azexo_composer.js'));
        } else {
            if ($('script[src*="azexo_composer.min.js"]').length > 0) {
                var azexo_composer_src = $('script[src*="azexo_composer.min.js"]').attr('src');
                window.azexo_baseurl = azexo_composer_src.slice(0, azexo_composer_src.indexOf('azexo_composer.min.js'));
            }            
        }
    }
    if(!('azexo_online' in window))
        window.azexo_online = (window.location.protocol == 'http:' || window.location.protocol == 'https:');
    azexo_elements = new AZEXOElements();
    if (!('azexo_editor' in window))
        window.azexo_editor = false;

    function toggle_editor_controls() {
        if (window.azexo_editor) {
            azexo_add_css('css/font-awesome.css', function() {
            });
            if ($('#azexo-clipboard').length == 0) {
                $('body').prepend('<div id="azexo-clipboard" style="display:none"></div>');
            }
            azexo_add_js({path: 'chosen/chosen.jquery.min.js'});
            azexo_add_css('chosen/chosen.min.css', function() {
            });
            for (var id in azexo_elements.elements_instances) {
                var el = azexo_elements.elements_instances[id];
                if (el instanceof ContainerElement) {
                    $(el.dom_element).addClass('azexo-editor');
                }
                if (el.controls == null) {
                    el.show_controls();
                }
                el.update_sortable();
            }
        } else {
            for (var id in azexo_elements.elements_instances) {
                var el = azexo_elements.elements_instances[id];
                if (el instanceof ContainerElement) {
                    $(el.dom_element).removeClass('azexo-editor');
                }
                if (el.controls != null) {
                    $(el.controls).remove();
                }
                el.update_empty();
            }
        }
    }
    function try_login() {
        if (!('ajaxurl' in window))
            if(!window.azexo_editor || window.azexo_online)
                delete window.azexo_editor;
        azexo_login(function(data) {
            window.azexo_editor = data;
            toggle_editor_controls();
        });
    }
    try_login();
    function onReadyFirst(completed) {
        $.holdReady(true);
        if (document.readyState === "complete") {
            setTimeout(completed);
        } else if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", completed, false);
            window.addEventListener("load", completed, false);
        } else {
            document.attachEvent("onreadystatechange", completed);
            window.attachEvent("onload", completed);
        }
    }
    onReadyFirst(function() {
        azexo_load();
        $.holdReady(false);
    });
    function connect_container(dom_element) {
        var html = $(dom_element).html();
        var match = /^\s*\<[\s\S]*\>\s*$/.exec(html);
        if (match || html == '') {
            $(dom_element).find('> script').detach().appendTo('head');
            $(dom_element).find('> link[href]').detach().appendTo('head');
            //$(dom_element).find('> script').remove();
            //$(dom_element).find('> link[href]').remove();
            var container = new ContainerElement(null, false);
            container.attrs['container'] = $(dom_element).attr('data-az-type') + '/' + $(dom_element).attr('data-az-name');
            container.dom_element = $(dom_element);
            $(container.dom_element).attr('data-az-id', container.id);
            //container.dom_content_element = $(dom_element).closest_descendents('[data-azcnt]');
            container.dom_content_element = $(dom_element);
            $(container.dom_element).css('display', '');
            $(container.dom_element).addClass('azexo');
            container.parse_html(container.dom_content_element);
            container.html_content = true;
            container.loaded_container = container.attrs['container'];

            for (var i = 0; i < container.children.length; i++) {
                container.children[i].recursive_render();
            }
            if (!azexo_frontend) {
                container.dom_content_element.empty();
                if (window.azexo_editor) {
                    container.show_controls();
                    container.update_sortable();
                }
                container.attach_children();
            }
            container.rendered = true;
            for (var i = 0; i < container.children.length; i++) {
                container.children[i].recursive_showed();
            }
        } else {
            if (html.replace(/^\s+|\s+$/g, '') != '')
                azexo_containers_loaded[$(dom_element).attr('data-az-type') + '/' + $(dom_element).attr('data-az-name')] = html.replace(/^\s+|\s+$/g, '');
            var container = new ContainerElement(null, false);
            container.attrs['container'] = $(dom_element).attr('data-az-type') + '/' + $(dom_element).attr('data-az-name');
            container.render($, p, fp);
            var classes = $(container.dom_element).attr('class') + ' ' + $(dom_element).attr('class');
            classes = $.unique(classes.split(' ')).join(' ');
            $(container.dom_element).attr('class', classes);
            $(container.dom_element).attr('style', $(dom_element).attr('style'));
            $(container.dom_element).css('display', '');
            $(container.dom_element).addClass('azexo');
            $(dom_element).replaceWith(container.dom_element);
            container.showed($, p, fp);
            if (window.azexo_editor)
                container.show_controls();
        }
        if (window.azexo_editor) {
            $(container.dom_element).addClass('azexo-editor');
        }
        return container;
    }
    var azexo_loaded = false;
    function azexo_load() {
        if (azexo_loaded)
            return;
        azexo_loaded = true;
        $('.az-container').each(function() {
            var container = connect_container(this);
            azexo_containers.push(container);
        });
        if (window.azexo_editor) {
            if ($('#azexo-clipboard').length == 0) {
                $('body').prepend('<div id="azexo-clipboard" style="display:none"></div>');
            }
        }
        $('body').keydown(function(event) {
            if (event.ctrlKey && event.altKey) {
                $('#az-admin-modal').remove();
                var header = '<div class="' + p + 'modal-header"><button type="button" class="' + p + 'close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="' + p + 'modal-title">' + t("Admin area") + '</h4></div>';
                var footer = '<div class="' + p + 'modal-footer"><button type="button" class="' + p + 'btn ' + p + 'btn-default" data-dismiss="modal">' + t("Close") + '</button><button type="button" class="save ' + p + 'btn ' + p + 'btn-primary">' + t("Save changes") + '</button></div>';
                var modal = $('<div id="az-admin-modal" class="' + p + 'modal azexo"><div class="' + p + 'modal-dialog ' + p + 'modal-lg"><div class="' + p + 'modal-content">' + header + '<div class="' + p + 'modal-body"></div>' + footer + '</div></div></div>').prependTo('body');
                var form = null;
                if (window.azexo_editor) {
                    azexo_get_settings_form(function(data) {
                        if (data.length > 0 && data != '0' && data != 'false') {
                            form = $(data);
                            $(modal).find('.' + p + 'modal-body').append(form);
                            $('<button type="button" class="' + p + 'btn ' + p + 'btn-default" data-dismiss="modal">' + t("Logout") + '</button>').appendTo('#az-admin-modal .modal-footer').click(function() {
                                setCookie('azexo_password', '', null);
                                window.azexo_editor = false;
                                toggle_editor_controls();
                            });
                            $('#az-admin-modal').find('.save').click(function() {
                                azexo_submit_settings_form(form.serialize(), function(data) {
                                    $('#az-admin-modal')[fp + 'modal']("hide");
                                });
                                return false;
                            });
                            $('#az-admin-modal')[fp + 'modal']('show');
                        }
                    });
                } else {
                    form = $('<form></form>').append('<div class="' + p + 'form-group"><label>' + t('Login') + '</label><div><input class="' + p + 'form-control" name="password" type="password" placeholder="' + t('Please enter password here') + '" ></div><p class="' + p + 'help-block">' + t('') + '</p></div>');
                    $(modal).find('.' + p + 'modal-body').append(form);
                    $('#az-admin-modal').find('.save').click(function() {
                        setCookie('azexo_password', $('#az-admin-modal').find('[name="password"]').val(), null);
                        try_login();
                        $('#az-admin-modal')[fp + 'modal']("hide");
                        return false;
                    });
                    $('#az-admin-modal')[fp + 'modal']('show');
                }
            }
        });
    }
    $.fn.azexo_composer = function(method) {
        var methods = {
            init: function(options) {
                var settings = $.extend({
                    'test': 'test',
                }, options);
                return this.each(function() {
                    var textarea = this;
                    var container = $(this).data('azexo_composer');
                    if (!container) {
                        var dom = $('<div>' + $(textarea).val() + '</div>')[0];
                        $(dom).find('> script').remove();
                        $(dom).find('> link[href]').remove();
                        $(dom).find('> .az-container > script').remove();
                        $(dom).find('> .az-container > link[href]').remove();
                        $(textarea).css('display', 'none');
                        var container_dom = null;
                        if ($(dom).find('> .az-container[data-az-type][data-az-name]').length > 0) {
                            container_dom = $(dom).children().insertAfter(textarea);
                        } else {
                            container_dom = $('<div class="az-element az-container" data-az-type="textarea" data-az-name="' + Math.random().toString(36).substr(2) + '"></div>').insertAfter(textarea);
                            container_dom.append($(dom).html());
                        }
                        
                        window.azexo_title['Save container'] = t('Generate HTML and JS for all elements which placed in current container element.');
                        var container = connect_container(container_dom);

                        $(textarea).data('azexo_composer', container);
                        
                        container.save_container = function() {
                            azexo_add_js({
                                path: 'js/json2.min.js',
                                loaded: 'JSON' in window,
                                callback: function() {
                                    _.defer(function() {
                                        if (container.id in azexo_elements.elements_instances) {
                                            var name = container.attrs['container'].split('/')[1];
                                            var html = container.get_container_html();
                                            $(textarea).val('<div class="az-element az-container" data-az-type="textarea" data-az-name="' + name + '">' + html + '</div>');
                                        }
                                    });
                                }
                            });
                        };
                        azexo_elements.attachEvent("add_element", container.save_container);
                        azexo_elements.attachEvent("edited_element", container.save_container);
                        azexo_elements.attachEvent("update_element", container.save_container);
                        azexo_elements.attachEvent("delete_element", container.save_container);
                        azexo_elements.attachEvent("update_sorting", container.save_container);
                    }
                });
            },
            show: function( ) {
                this.each(function() {
                });
            },
            hide: function( ) {
                this.each(function() {
                    var container = $(this).data('azexo_composer');
                    if (container) {
                        azexo_elements.delete_element(container.id);
                        for (var i = 0; i < container.children.length; i++) {
                            container.children[i].remove();
                        }
                        $(container.dom_element).remove();
                        $(this).removeData('azexo_composer');

                        $(this).css('display', '');
                    }
                });
            },
        };
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error(method);
        }
    };
    // ------------------ELEMENTS------------------------------------
//
//
//
    var azexo_animations = {
        "bounce": t('bounce'),
        "flash": t('flash'),
        "pulse": t('pulse'),
        "rubberBand": t('rubberBand'),
        "shake": t('shake'),
        "swing": t('swing'),
        "tada": t('tada'),
        "wobble": t('wobble'),
        "bounceIn": t('bounceIn'),
        "bounceInDown": t('bounceInDown'),
        "bounceInLeft": t('bounceInLeft'),
        "bounceInRight": t('bounceInRight'),
        "bounceInUp": t('bounceInUp'),
        "bounceOut": t('bounceOut'),
        "bounceOutDown": t('bounceOutDown'),
        "bounceOutLeft": t('bounceOutLeft'),
        "bounceOutRight": t('bounceOutRight'),
        "bounceOutUp": t('bounceOutUp'),
        "fadeIn": t('fadeIn'),
        "fadeInDown": t('fadeInDown'),
        "fadeInDownBig": t('fadeInDownBig'),
        "fadeInLeft": t('fadeInLeft'),
        "fadeInLeftBig": t('fadeInLeftBig'),
        "fadeInRight": t('fadeInRight'),
        "fadeInRightBig": t('fadeInRightBig'),
        "fadeInUp": t('fadeInUp'),
        "fadeInUpBig": t('fadeInUpBig'),
        "fadeOut": t('fadeOut'),
        "fadeOutDown": t('fadeOutDown'),
        "fadeOutDownBig": t('fadeOutDownBig'),
        "fadeOutLeft": t('fadeOutLeft'),
        "fadeOutLeftBig": t('fadeOutLeftBig'),
        "fadeOutRight": t('fadeOutRight'),
        "fadeOutRightBig": t('fadeOutRightBig'),
        "fadeOutUp": t('fadeOutUp'),
        "fadeOutUpBig": t('fadeOutUpBig'),
        "flip": t('flip'),
        "flipInX": t('flipInX'),
        "flipInY": t('flipInY'),
        "flipOutX": t('flipOutX'),
        "flipOutY": t('flipOutY'),
        "lightSpeedIn": t('lightSpeedIn'),
        "lightSpeedOut": t('lightSpeedOut'),
        "rotateIn": t('rotateIn'),
        "rotateInDownLeft": t('rotateInDownLeft'),
        "rotateInDownRight": t('rotateInDownRight'),
        "rotateInUpLeft": t('rotateInUpLeft'),
        "rotateInUpRight": t('rotateInUpRight'),
        "rotateOut": t('rotateOut'),
        "rotateOutDownLeft": t('rotateOutDownLeft'),
        "rotateOutDownRight": t('rotateOutDownRight'),
        "rotateOutUpLeft": t('rotateOutUpLeft'),
        "rotateOutUpRight": t('rotateOutUpRight'),
        "slideInDown": t('slideInDown'),
        "slideInLeft": t('slideInLeft'),
        "slideInRight": t('slideInRight'),
        "slideOutLeft": t('slideOutLeft'),
        "slideOutRight": t('slideOutRight'),
        "slideOutUp": t('slideOutUp'),
        "slideInUp": t('slideInUp'),
        "slideOutDown": t('slideOutDown'),
        "hinge": t('hinge'),
        "rollIn": t('rollIn'),
        "rollOut": t('rollOut'),
        "zoomIn": t('zoomIn'),
        "zoomInDown": t('zoomInDown'),
        "zoomInLeft": t('zoomInLeft'),
        "zoomInRight": t('zoomInRight'),
        "zoomInUp": t('zoomInUp'),
        "zoomOut": t('zoomOut'),
        "zoomOutDown": t('zoomOutDown'),
        "zoomOutLeft": t('zoomOutLeft'),
        "zoomOutRight": t('zoomOutRight'),
        "zoomOutUp": t('zoomOutUp'),
//        "move-right-in": t('move-right-in'),
//        "move-right-out": t('move-right-out'),
    };
    function AnimatedElement(parent, parse) {
        AnimatedElement.baseclass.apply(this, arguments);
    }
    extend(AnimatedElement, BaseElement);
    mixin(AnimatedElement.prototype, {
        params: [
            make_param_type({
                type: 'dropdown',
                heading: t('Animation start'),
                param_name: 'an_start',
                tab: t('Animation'),
                value: {
                    '': t('No animation'),
                    'appear': t('On appear'),
                    'hover': t('On hover'),
                    'click': t('On click'),
                    'trigger': t('On trigger'),
                },
            }),
            make_param_type({
                type: 'dropdown',
                heading: t('Animation in'),
                param_name: 'an_in',
                tab: t('Animation'),
                value: azexo_animations,
                dependency: {'element': 'an_start', 'value': ['appear', 'hover', 'click', 'trigger']},
            }),
            make_param_type({
                type: 'dropdown',
                heading: t('Animation out'),
                param_name: 'an_out',
                tab: t('Animation'),
                value: azexo_animations,
                dependency: {'element': 'an_start', 'value': ['hover', 'trigger']},
            }),
            make_param_type({
                type: 'checkbox',
                heading: t('Hidden'),
                param_name: 'an_hidden',
                tab: t('Animation'),
                value: {
                    'before_in': t("Before in-animation"),
                    'after_in': t("After in-animation"),
                },
                dependency: {'element': 'an_start', 'value': ['appear', 'hover', 'click', 'trigger']},
            }),
            make_param_type({
                type: 'checkbox',
                heading: t('Infinite?'),
                param_name: 'an_infinite',
                tab: t('Animation'),
                value: {
                    'yes': t("Yes, please"),
                },
                dependency: {'element': 'an_start', 'value': ['appear', 'hover', 'click', 'trigger']},
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Duration'),
                param_name: 'an_duration',
                tab: t('Animation'),
                max: '3000',
                description: t('In milliseconds.'),
                value: '1000',
                dependency: {'element': 'an_start', 'value': ['appear', 'hover', 'click', 'trigger']},
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('In-delay'),
                param_name: 'an_in_delay',
                tab: t('Animation'),
                max: '10000',
                description: t('In milliseconds.'),
                value: '0',
                dependency: {'element': 'an_start', 'value': ['appear', 'hover', 'click', 'trigger']},
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Out-delay'),
                param_name: 'an_out_delay',
                tab: t('Animation'),
                max: '10000',
                description: t('In milliseconds.'),
                value: '0',
                dependency: {'element': 'an_start', 'value': ['hover', 'trigger']},
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Parent number'),
                param_name: 'an_parent',
                tab: t('Animation'),
                max: '10',
                min: '0',
                description: t('Define the number of Parent Containers the animation should attempt to break away from.'),
                value: '1',
                dependency: {'element': 'an_start', 'value': ['hover', 'click']},
            }),
            make_param_type({
                type: 'dropdown',
                heading: t('Animation fill mode'),
                param_name: 'an_fill_mode',
                tab: t('Animation'),
                value: {
                    '': t('Default'),
                    forwards: t('Forwards'),
                    backwards: t('Backwards'),
                    both: t('Both'),
                    none: t('None'),
                },
                description: t('"FORWARDS" - after the animation ends (determined by animation-iteration-count), the animation will apply the property values for the time the animation ended; "BACKWARDS" - The animation will apply the property values defined in the keyframe that will start the first iteration of the animation, during the period defined by animation-delay. These are either the values of the from keyframe (when animation-direction is "normal" or "alternate") or those of the to keyframe (when animation-direction is "reverse" or "alternate-reverse"); "BOTH" - the animation will follow the rules for both forwards and backwards. That is, it will extend the animation properties in both directions; "NONE" - The animation will not apply any styles to the target before or after it is executing.'),
                dependency: {'element': 'an_start', 'value': ['appear', 'hover', 'click', 'trigger']},
            }),
            make_param_type({
                type: 'textfield',
                heading: t('Name for animations'),
                param_name: 'an_name',
                hidden: true,
            }),
            make_param_type({
                type: 'textfield',
                heading: t('Animation scenes'),
                param_name: 'an_scenes',
                hidden: true,
            }),
        ].concat(AnimatedElement.prototype.params),
        set_in_timeout: function() {
            var element = this;
            element.in_timeout = setTimeout(function() {
                $(element.dom_element).css('opacity', '');
                $(element.dom_element).removeClass('animated');
                $(element.dom_element).removeClass(element.attrs['an_in']);
                $(element.dom_element).removeClass(element.attrs['an_out']);
                $(element.dom_element).css('animation-duration', element.attrs['an_duration'] + 'ms');
                $(element.dom_element).css('-webkit-animation-duration', element.attrs['an_duration'] + 'ms');
                $(element.dom_element).css('animation-fill-mode', element.attrs['an_fill_mode']);
                $(element.dom_element).css('-webkit-animation-fill-mode', element.attrs['an_fill_mode']);
                $(element.dom_element).addClass('animated');
                if (element.attrs['an_infinite'] == 'yes') {
                    $(element.dom_element).addClass('infinite');
                }
                $(element.dom_element).addClass(element.attrs['an_in']);
            }, Math.round(element.attrs['an_in_delay']));
        },
        start_in_animation: function() {
            var element = this;
            if ($(element.dom_element).parents('.azexo-animations-disabled').length == 0) {

                if (element.out_timeout > 0) {
                    if ($(element.dom_element).hasClass('animated')) {
                        //still in-animate
                        element.clear_animation();
                        element.set_in_timeout();
                    } else {
                        //plan to in-animate
                        clearTimeout(element.out_timeout);
                        if (!element.hidden_after_in) {
                            element.set_in_timeout();
                        }
                    }
                } else {
                    //no in-animate, no plan
                    element.set_in_timeout();
                }
            }
        },
        set_out_timeout: function() {
            var element = this;
            element.out_timeout = setTimeout(function() {
                $(element.dom_element).css('opacity', '');
                $(element.dom_element).removeClass('animated');
                $(element.dom_element).removeClass(element.attrs['an_in']);
                $(element.dom_element).removeClass(element.attrs['an_out']);
                $(element.dom_element).css('animation-duration', element.attrs['an_duration'] + 'ms');
                $(element.dom_element).css('-webkit-animation-duration', element.attrs['an_duration'] + 'ms');
                $(element.dom_element).css('animation-fill-mode', element.attrs['an_fill_mode']);
                $(element.dom_element).css('-webkit-animation-fill-mode', element.attrs['an_fill_mode']);
                $(element.dom_element).addClass('animated');
                if (element.attrs['an_infinite'] == 'yes') {
                    $(element.dom_element).addClass('infinite');
                }
                $(element.dom_element).addClass(element.attrs['an_out']);
            }, Math.round(element.attrs['an_out_delay']));
        },
        start_out_animation: function() {
            var element = this;
            if ($(element.dom_element).parents('.azexo-animations-disabled').length == 0) {

                if (element.in_timeout > 0) {
                    if ($(element.dom_element).hasClass('animated')) {
                        //still in-animate
                        element.clear_animation();
                        element.set_out_timeout();
                    } else {
                        //plan to in-animate
                        clearTimeout(element.in_timeout);
                        if (!element.hidden_before_in) {
                            element.set_out_timeout();
                        }
                    }
                } else {
                    //no in-animate, no plan
                    element.set_out_timeout();
                }
            }
        },
        clear_animation: function() {
            if ($(this.dom_element).hasClass(this.attrs['an_in'])) {
                this.inned = true;
                if (this.hidden_before_in) {
                    $(this.dom_element).css('opacity', '1');
                }
                if (this.hidden_after_in) {
                    $(this.dom_element).css('opacity', '0');
                }
            }
            if ($(this.dom_element).hasClass(this.attrs['an_out'])) {
                this.inned = false;
                if (this.hidden_before_in) {
                    $(this.dom_element).css('opacity', '0');
                }
                if (this.hidden_after_in) {
                    $(this.dom_element).css('opacity', '1');
                }
            }
            $(this.dom_element).css('animation-duration', '');
            $(this.dom_element).css('-webkit-animation-duration', '');
            $(this.dom_element).css('animation-fill-mode', '');
            $(this.dom_element).css('-webkit-animation-fill-mode', '');
            $(this.dom_element).removeClass('animated');
            $(this.dom_element).removeClass('infinite');
            if (this.attrs['an_fill_mode'] == '') {
                $(this.dom_element).removeClass(this.attrs['an_in']);
                $(this.dom_element).removeClass(this.attrs['an_out']);
            }
        },
        end_animation: function() {
            this.in_timeout = 0;
            this.out_timeout = 0;
            if ($(this.dom_element).hasClass(this.attrs['an_in'])) {
                if (this.attrs['an_start'] == 'hover' && !this.hover) {
                    this.start_out_animation();
                }
            }
            if ($(this.dom_element).hasClass(this.attrs['an_out'])) {
                if (this.attrs['an_start'] == 'hover' && this.hover) {
                    this.start_in_animation();
                }
                this.clear_animation();
            }
        },
        trigger_start_in_animation: function() {
            if (this.attrs['an_start'] == 'trigger') {
                this.start_in_animation();
            } else {
                for (var i = 0; i < this.children.length; i++) {
                    if ('trigger_start_in_animation' in this.children[i]) {
                        this.children[i].trigger_start_in_animation();
                    }
                }
            }
        },
        trigger_start_out_animation: function() {
            if (this.attrs['an_start'] == 'trigger') {
                this.start_out_animation();
            } else {
                for (var i = 0; i < this.children.length; i++) {
                    if ('trigger_start_out_animation' in this.children[i]) {
                        this.children[i].trigger_start_out_animation();
                    }
                }
            }
        },
        css_animation: function() {
            var element = this;
            $(element.dom_element).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                element.end_animation();
            });
            element.hidden_before_in = _.indexOf(element.attrs['an_hidden'].split(','), 'before_in') >= 0;
            element.hidden_after_in = _.indexOf(element.attrs['an_hidden'].split(','), 'after_in') >= 0;

            if (element.hidden_before_in) {
                $(element.dom_element).css('opacity', '0');
            }
            if (element.hidden_after_in) {
                $(element.dom_element).css('opacity', '1');
            }
            var parent_number = element.attrs['an_parent'];
            if (parent_number == '') {
                parent_number = 1;
            }
            parent_number = Math.round(parent_number);
            var i = 0;
            var parent = $(element.dom_element);
            while (i < parent_number) {
                parent = $(parent).parent().closest('[data-az-id]');
                i++;
            }

            this.add_css('animate.css/animate.min.css', false, function() {
                switch (element.attrs['an_start']) {
                    case 'click':
                        $(parent).click(function() {
                            if (!$(element.dom_element).hasClass('animated')) {
                                element.start_in_animation();
                            }
                        });
                        break;
                    case 'appear':
                        element.add_js({
                            path: 'jquery-waypoints/waypoints.min.js',
                            loaded: 'waypoint' in $.fn,
                            callback: function() {
                                $(element.dom_element).waypoint(function(direction) {
                                    if (!$(element.dom_element).hasClass('animated')) {
                                        element.start_in_animation();
                                    }
                                }, {offset: '100%', triggerOnce: true});
                                $(document).trigger('scroll');
                            }});
                        break;
                    case 'hover':
                        element.inned = false;
                        $(parent).on('mouseenter', function() {
                            element.hover = true;
//                                if (!$(element.dom_element).hasClass('animated'))
//                                    if (!element.inned)
                            element.start_in_animation();
                        });
                        $(parent).on('mouseleave', function() {
                            element.hover = false;
//                                if (!$(element.dom_element).hasClass('animated'))
//                                    if (element.inned)
                            element.start_out_animation();
                        });
                        break;
                    case 'trigger':
                        break;
                    default:
                        break;
                }
            });
        },
        show_controls: function() {
            var element = this;
            if (window.azexo_editor) {
                AnimatedElement.baseclass.prototype.show_controls.apply(this, arguments);
                $('<button title="' + title("Scroll animation") + '" class="control scroll-animation ' + p + 'btn ' + p + 'btn-warning ' + p + 'glyphicon ' + p + 'glyphicon-sort"> </button>').appendTo(this.controls).click(function() {
                    $('#az-scroll-animation-modal').remove();
                    var header = '<div class="' + p + 'modal-header"><button type="button" class="' + p + 'close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="' + p + 'modal-title">' + t("Scroll animation settings") + '</h4></div>';
                    var footer = '<div class="' + p + 'modal-footer"><button type="button" class="' + p + 'btn ' + p + 'btn-default" data-dismiss="modal">' + t("Close") + '</button><button type="button" class="save ' + p + 'btn ' + p + 'btn-primary">' + t("Save changes") + '</button></div>';
                    var modal = $('<div id="az-scroll-animation-modal" class="' + p + 'modal azexo"><div class="' + p + 'modal-dialog ' + p + 'modal-lg"><div class="' + p + 'modal-content">' + header + '<div class="' + p + 'modal-body"></div>' + footer + '</div></div></div>').prependTo('body');
                    var tabs = $('<div id="az-scroll-animation-tabs"><ul class="' + p + 'nav ' + p + 'nav-tabs"><li><a href="#script" data-toggle="tab">' + t("Script") + '</a></li><li><a href="#wizards" data-toggle="tab">' + t("Wizards") + '</a></li></ul><div class="' + p + 'tab-content"><div id="script" class="' + p + 'tab-pane"></div><div id="wizards" class="' + p + 'tab-pane"></div></div></div>');
                    $(modal).find('.' + p + 'modal-body').append(tabs);
                    var form = $('<div id="az-scroll-animation-form" class="' + p + 'clearfix"><div class="tree ' + p + 'col-sm-5"></div><div class="options ' + p + 'col-sm-7"></div></div>');
                    $(tabs).find('#script').append(form);
                    $('#az-scroll-animation-tabs a[href="#script"]')[fp + 'tab']('show');

                    azexo_add_css('jstree/dist/themes/default/style.min.css', function() {
                    });
                    $(form).find('.tree').append('<div class="' + p + 'form-group an-name"><label>' + t("Name") + '</label><div><input class="' + p + 'form-control" name="an_name" type="text" value="' + element.an_name + '" required ></div><p class="' + p + 'help-block">' + t("Name to identify this element in scroll animations") + '</p></div>');
                    azexo_add_js({
                        path: 'jstree/dist/jstree.min.js',
                        loaded: 'jstree' in $.fn,
                        callback: function() {
                            var index = {};
                            var index_type = {};
                            var index_parents = {};
                            function get_scene(id) {
                                $(form).find('.options').empty();

                                $(form).find('.options').append('<div class="' + p + 'form-group"><label>' + t("Time line") + '</label><div class="' + p + 'radio"><label><input type="radio" name="time" value="scroll">' + t("Scroll position") + '</label></div><div class="' + p + 'radio"><label><input type="radio" name="time" value="real">' + t("Real time") + '</label></div></div>');
                                $(form).find('.options [name="time"]').on('change', function() {
                                    if ($(this).val() == 'scroll') {
                                        $(form).find('.options .' + p + 'form-group.duration').css('display', 'block');
                                        $(form).find('.options .' + p + 'form-group.repeat, .options .' + p + 'form-group.repeatdelay').css('display', 'none');

                                        index[id].duration = $(form).find('.options [name="duration"]').val();
                                        tree.jstree('edit', id, t("Scene") + ':' + index[id].duration + '|' + index[id].offset + '|' + index[id].triggerHook);
                                    } else {
                                        $(form).find('.options .' + p + 'form-group.duration').css('display', 'none');
                                        $(form).find('.options .' + p + 'form-group.repeat, .options .' + p + 'form-group.repeatdelay').css('display', 'block');
                                        index[id].duration = '0';
                                        tree.jstree('edit', id, t("Scene") + ':' + index[id].duration + '|' + index[id].offset + '|' + index[id].triggerHook);
                                    }
                                });
                                if (index[id].duration == '0') {
                                    $(form).find('.options [name="time"][value="real"]').attr('checked', 'checked');
                                } else {
                                    $(form).find('.options [name="time"][value="scroll"]').attr('checked', 'checked');
                                }

                                $(form).find('.options').append('<div class="' + p + 'form-group duration"><label>' + t("Duration") + '</label><div><input class="' + p + 'form-control" name="duration" type="text" value="' + index[id].duration + '"></div><p class="' + p + 'help-block">' + t("The duration of the scene in pixels") + '</p></div>');
                                $(form).find('.options [name="duration"]').on('change', function() {
                                    index[id].duration = $(this).val();
                                    tree.jstree('edit', id, t("Scene") + ':' + index[id].duration + '|' + index[id].offset + '|' + index[id].triggerHook);
                                });

                                $(form).find('.options').append('<div class="' + p + 'form-group offset"><label>' + t("Offset") + '</label><div><input class="' + p + 'form-control" name="offset" type="text" value="' + index[id].offset + '"></div><p class="' + p + 'help-block">' + t("Offset Value (in pixels) for the Trigger Position.") + '</p></div>');
                                $(form).find('.options [name="offset"]').on('change', function() {
                                    index[id].offset = $(this).val();
                                    tree.jstree('edit', id, t("Scene") + ':' + index[id].duration + '|' + index[id].offset + '|' + index[id].triggerHook);
                                });
                                if (index[id].duration == '0') {
                                    $(form).find('.options .' + p + 'form-group.duration').css('display', 'none');
                                }

                                $(form).find('.options').append('<div class="' + p + 'form-group repeat"><label>' + t("Repeat") + '</label><div class="' + p + 'checkbox"><label><input type="checkbox" name="indefinite"> ' + t("repeat indefinitely") + '</label></div><div><input class="' + p + 'form-control" name="repeat" type="text" value="' + index[id].repeat + '"></div><p class="' + p + 'help-block">' + t("Number of times that the timeline should repeat after its first iteration") + '</p></div>');
                                $(form).find('.options [name="repeat"]').on('change', function() {
                                    index[id].repeat = $(this).val();
                                });
                                $(form).find('.options [name="indefinite"]').on('change', function() {
                                    if ($(this).prop('checked')) {
                                        index[id].repeat = '-1';
                                        $(form).find('.options .' + p + 'form-group.repeat .' + p + 'form-control').css('display', 'none');
                                    } else {
                                        index[id].repeat = $(form).find('.options [name="repeat"]').val();
                                        if (index[id].repeat < 0) {
                                            $(form).find('.options [name="repeat"]').val('0')
                                            index[id].repeat = 0;
                                        }
                                        $(form).find('.options .' + p + 'form-group.repeat .' + p + 'form-control').css('display', 'block');
                                    }
                                });
                                if (index[id].repeat == '-1') {
                                    $(form).find('.options [name="indefinite"]').attr('checked', 'checked');
                                    $(form).find('.options .' + p + 'form-group.repeat .' + p + 'form-control').css('display', 'none');
                                } else {
                                    $(form).find('.options .' + p + 'form-group.repeat .' + p + 'form-control').css('display', 'block');
                                }
                                $(form).find('.options').append('<div class="' + p + 'form-group repeatdelay"><label>' + t("Repeat delay") + '</label><div><input class="' + p + 'form-control" name="repeatDelay" type="text" value="' + index[id].repeatDelay + '"></div><p class="' + p + 'help-block">' + t("Amount of time in seconds between repeats.") + '</p></div>');
                                $(form).find('.options [name="repeatDelay"]').on('change', function() {
                                    index[id].repeatDelay = $(this).val();
                                });
                                if (index[id].duration != '0') {
                                    $(form).find('.options .' + p + 'form-group.repeat').css('display', 'none');
                                    $(form).find('.options .' + p + 'form-group.repeatdelay').css('display', 'none');
                                }

                                var hook = ["onEnter", "onCenter", "onLeave"];
                                hook = _.object(hook, hook);
                                $(form).find('.options').append('<div class="' + p + 'form-group"><label>' + t("Trigger hook") + '</label><div>' + get_select(hook, 'trigger-hook', index[id].triggerHook) + '</div><p class="' + p + 'help-block">' + t("Trigger hook") + '</p></div>');
                                $(form).find('.options [name="trigger-hook"]').on('change', function() {
                                    index[id].triggerHook = $(this).val();
                                    tree.jstree('edit', id, t("Scene") + ':' + index[id].duration + '|' + index[id].offset + '|' + index[id].triggerHook);
                                });
                                $(form).find('.options').append('<div class="' + p + 'form-group"><label>' + t("Pin") + '</label><div>' + get_select(_.object(_.keys(azexo_elements.elements_instances_by_an_name), _.keys(azexo_elements.elements_instances_by_an_name)), 'pin', index[id].pin) + '</div><p class="' + p + 'help-block">' + t("Pin element") + '</p></div>');
                                $(form).find('.options [name="pin"]').on('change', function() {
                                    index[id].pin = $(this).val();
                                });
                            }
                            function add_scene(duration) {
                                var id = tree.jstree('create_node', '#', {type: 'scene', text: t("Scene") + ':' + duration + '|0|0.5', state: {opened: true}}, 'last');
                                element.an_scenes.push({duration: duration, offset: 0, triggerHook: 'onCenter', timeline: [], repeat: '0', repeatDelay: '0'});
                                index[id] = element.an_scenes[element.an_scenes.length - 1];
                                index_type[id] = 'scene';
                                add_step(id);
                            }
                            function get_step(id) {
                                $(form).find('.options').empty();
                            }
                            function add_step(scene) {
                                var n = tree.jstree('get_children_dom', scene).length;
                                var id = tree.jstree('create_node', scene, {type: 'step', text: t("Step") + ':' + n.toString(), state: {opened: true}}, 'last');
                                index[scene].timeline.push({tweens: []});
                                index[id] = index[scene].timeline[index[scene].timeline.length - 1];
                                index_type[id] = 'step';
                                index_parents[id] = scene;
                                add_tween(id);
                            }
                            function get_tween(id) {
                                var scene = index_parents[index_parents[id]];
                                $(form).find('.options').empty();
                                $(form).find('.options').append('<div class="' + p + 'form-group"><label>' + t("Target") + '</label><div>' + get_select(_.object(_.keys(azexo_elements.elements_instances_by_an_name), _.keys(azexo_elements.elements_instances_by_an_name)), 'target', index[id].target) + '</div><p class="' + p + 'help-block">' + t("Target element") + '</p></div>');
                                $(form).find('.options [name="target"]').on('change', function() {
                                    index[id].target = $(this).val();
                                    tree.jstree('edit', id, t("Tween") + ':' + index[id].target + '|' + index[id].duration);
                                });
                                $(form).find('.options').append('<div class="' + p + 'form-group duration"><label>' + t("Duration") + '</label><div><input class="' + p + 'form-control" name="duration" type="text" value="' + index[id].duration + '"></div><p class="' + p + 'help-block">' + t("Duration of the tween in seconds.") + '</p></div>');
                                $(form).find('.options [name="duration"]').on('change', function() {
                                    index[id].duration = $(this).val();
                                    tree.jstree('edit', id, t("Tween") + ':' + index[id].target + '|' + index[id].duration);
                                });
                                function css_plugin_settings(container, obj, name) {
                                    var n = 0;
                                    var css_properties = _.keys(document.body.style);
                                    css_properties = _.object(css_properties, css_properties);
                                    function add_property(container, current_property, current_value) {
                                        var property_name = 'property' + n.toString();
                                        var value_name = 'property' + n.toString() + 'value';
                                        var row = $('<div class="row"><div class="select ' + p + 'col-xs-5">' + get_select(css_properties, property_name, current_property) + '</div><div class="value ' + p + 'col-xs-5"><input class="' + p + 'form-control" name="' + value_name + '" type="text" value="' + current_value + '"></div><div class="remove ' + p + 'col-xs-2"><button title="' + title("Remove") + '" type="button" class="control remove ' + p + 'btn ' + p + 'btn-danger ' + p + 'glyphicon ' + p + 'glyphicon-remove"> </button></div></div>').appendTo(container);
                                        $(row).find('[name="' + property_name + '"]').chosen({
                                            search_contains: true,
                                        });
                                        function update() {
                                            var pr = $(row).find('[name="' + property_name + '"]').val();
                                            if (current_property != '' && current_property != pr) {
                                                delete obj[name][current_property];
                                            }
                                            var v = $(row).find('[name="' + value_name + '"]').val();
                                            if (pr != '') {
                                                current_property = pr;
                                                if (!_.isObject(obj[name]))
                                                    obj[name] = {};
                                                obj[name][pr] = v;
                                            }
                                        }
                                        $(row).find('[name="' + property_name + '"]').change(function() {
                                            update();
                                        });
                                        $(row).find('[name="' + value_name + '"]').change(function() {
                                            update();
                                        });
                                        $(row).find('button.remove').click(function() {
                                            var pr = $(row).find('[name="' + property_name + '"]').val();
                                            if (pr != '') {
                                                if (_.isObject(obj[name]))
                                                    delete obj[name][pr];
                                            }
                                            $(row).remove();
                                        });
                                        n++;
                                        return row;
                                    }
                                    function delete_property(dom_element) {

                                    }
                                    var group = $('<div><div class="' + p + 'form-group properties"></div><div class="add-property"></div></div>').appendTo(container);
                                    for (var pr in obj[name]) {
                                        var row = add_property($(group).find('.properties'), pr, obj[name][pr]);
                                    }
                                    $('<button title="' + title("Add property") + '" class="add-property ' + p + 'btn ' + p + 'btn-default">' + t("Add property") + '</button>').appendTo($(group).find('.add-property')).click(function() {
                                        add_property($(group).find('.properties'), '', '');
                                    });
                                }
                                $(form).find('.options').append('<div class="' + p + 'form-group"><label>' + t("From") + '</label><div class="from"></div><p class="' + p + 'help-block">' + t("From") + '</p></div>');
                                css_plugin_settings($(form).find('.options .from'), index[id].from, 'css');
                                $(form).find('.options').append('<div class="' + p + 'form-group"><label>' + t("To") + '</label><div class="to"></div><p class="' + p + 'help-block">' + t("To") + '</p></div>');
                                css_plugin_settings($(form).find('.options .to'), index[id].to, 'css');
                                var ease_types = ["Linear", "Power0", "Power1", "Power2", "Power3", "Power4", "Quad", "Cubic", "Quart", "Quint", "Strong", "Elastic", "Back", "Bounce", "SlowMo", "SteppedEase", "Circ", "Expo", "Sine"];
                                var eases = [];
                                for (var i = 0; i < ease_types.length; i++) {
                                    eases.push(ease_types[i] + ".easeNone");
                                    eases.push(ease_types[i] + ".easeIn");
                                    eases.push(ease_types[i] + ".easeOut");
                                    eases.push(ease_types[i] + ".easeInOut");
                                }
                                eases = _.object(eases, eases);
                                $(form).find('.options').append('<div class="' + p + 'form-group"><label>' + t("Ease") + '</label><div>' + get_select(eases, 'ease', index[id].ease) + '</div><p class="' + p + 'help-block">' + t("Ease") + '</p></div>');
                                $(form).find('.options [name="ease"]').on('change', function() {
                                    index[id].ease = $(this).val();
                                });
                                $(form).find('.options [name="ease"]').chosen({
                                    search_contains: true,
                                });
                                $(form).find('.options').append('<div class="' + p + 'form-group delay"><label>' + t("Delay") + '</label><div><input class="' + p + 'form-control" name="delay" type="text" value="' + index[id].delay + '"></div><p class="' + p + 'help-block">' + t("Amount of delay in seconds before the tween should begin.") + '</p></div>');
                                $(form).find('.options [name="delay"]').on('change', function() {
                                    index[id].delay = $(this).val();
                                });
                                if (index[scene].duration != '0') {
                                    $(form).find('.options .' + p + 'form-group.duration').css('display', 'none');
                                    $(form).find('.options .' + p + 'form-group.delay').css('display', 'none');
                                }
                            }
                            function add_tween(step) {
                                var id = tree.jstree('create_node', step, {type: 'tween', text: t("Tween") + ':' + '|1', state: {opened: true}}, 'last');
                                index[step].tweens.push({target: '', duration: 1, from: {}, to: {}, ease: 'Linear.easeNone', delay: '0'});
                                index[id] = index[step].tweens[index[step].tweens.length - 1];
                                index_type[id] = 'tween';
                                index_parents[id] = step;
                            }
                            function get_path(id) {
                                switch (index_type[id]) {
                                    case 'scene':
                                        var i = element.an_scenes.indexOf(index[id]);
                                        if (i > -1) {
                                            return [i];
                                        }
                                        break;
                                    case 'step':
                                        var i = element.an_scenes.indexOf(index[index_parents[id]]);
                                        if (i > -1) {
                                            var j = element.an_scenes[i].timeline.indexOf(index[id]);
                                            if (j > -1) {
                                                return [i, j];
                                            }
                                        }
                                        break;
                                    case 'tween':
                                        var i = element.an_scenes.indexOf(index[index_parents[index_parents[id]]]);
                                        if (i > -1) {
                                            var j = element.an_scenes[i].timeline.indexOf(index[index_parents[id]]);
                                            if (j > -1) {
                                                var k = element.an_scenes[i].timeline[j].tweens.indexOf(index[id]);
                                                if (k > -1) {
                                                    return [i, j, k];
                                                }
                                            }
                                        }
                                        break;
                                    default:
                                        break;
                                }
                                return false;
                            }
                            function fill_tree() {
                                for (var i = 0; i < element.an_scenes.length; i++) {
                                    var scene = tree.jstree('create_node', '#', {type: 'scene', text: t("Scene") + ':' + element.an_scenes[i].duration + '|' + element.an_scenes[i].offset + '|' + element.an_scenes[i].triggerHook, state: {opened: true}}, 'last');
                                    index[scene] = element.an_scenes[i];
                                    index_type[scene] = 'scene';
                                    for (var j = 0; j < element.an_scenes[i].timeline.length; j++) {
                                        var step = tree.jstree('create_node', scene, {type: 'step', text: t("Step") + ':' + j.toString(), state: {opened: true}}, 'last');
                                        index[step] = element.an_scenes[i].timeline[j];
                                        index_type[step] = 'step';
                                        index_parents[step] = scene;
                                        for (var k = 0; k < element.an_scenes[i].timeline[j].tweens.length; k++) {
                                            var tween = tree.jstree('create_node', step, {type: 'tween', text: t("Tween") + ':' + element.an_scenes[i].timeline[j].tweens[k].target + '|' + element.an_scenes[i].timeline[j].tweens[k].duration, state: {opened: true}}, 'last');
                                            index[tween] = element.an_scenes[i].timeline[j].tweens[k];
                                            index_type[tween] = 'tween';
                                            index_parents[tween] = step;
                                        }
                                    }
                                }
                            }
                            var buttons = $('<div class="' + p + 'btn-group ' + p + 'btn-group-xs"></div>').appendTo($(form).find('.tree'));
                            $('<button title="' + title("Add scene") + '" class="add-scene ' + p + 'btn ' + p + 'btn-default">' + t("Add scene") + '</button>').appendTo(buttons).click(function() {
                                var duration = window.prompt(t('Enter duration of new scene:'), 100);
                                if (duration != '' && duration != null)
                                    add_scene(duration)
                            });
                            $('<button title="' + title("Add timeline step") + '" class="add-step ' + p + 'btn ' + p + 'btn-default" disabled>' + t("Add step") + '</button>').appendTo(buttons).click(function() {
                                var ids = tree.jstree('get_selected');
                                add_step(ids[0]);
                            });
                            $('<button title="' + title("Add tween") + '" class="add-tween ' + p + 'btn ' + p + 'btn-default" disabled>' + t("Add tween") + '</button>').appendTo(buttons).click(function() {
                                var ids = tree.jstree('get_selected');
                                add_tween(ids[0]);
                            });
                            $('<button title="' + title("Delete") + '" class="delete ' + p + 'btn ' + p + 'btn-default">' + t("Delete") + '</button>').appendTo(buttons).click(function() {
                                var ids = tree.jstree('get_selected');
                                if (ids.length > 0) {
                                    tree.jstree('delete_node', ids[0]);
                                }
                            });
                            var tree = $('<div id="jstree"></div>').appendTo($(form).find('.tree')).jstree({
                                "core": {
                                    'check_callback': function(operation, node, node_parent, node_position, more) {
                                        return true;
                                    },
                                    "multiple": false,
                                    "animation": 0
                                },
//                                "dnd": {
//                                    "is_draggable": function(nodes) {
//                                        var draggable = true;
//                                        for (var i = 0; i < nodes.length; i++) {
//                                            if (index_type[nodes[i].id] == 'step') {
//                                                draggable = false;
//                                                break;
//                                            }
//                                        }
//                                        return draggable;
//                                    }
//                                },
                                "types": {
                                    "#": {
                                        "valid_children": ["scene"]
                                    },
                                    "scene": {
                                        "icon": p + 'glyphicon ' + p + 'glyphicon-play',
                                        "valid_children": ["step"]
                                    },
                                    "step": {
                                        "icon": p + 'glyphicon ' + p + 'glyphicon-step-forward',
                                        "valid_children": ["tween"]
                                    },
                                    "tween": {
                                        "icon": p + 'glyphicon ' + p + 'glyphicon-leaf',
                                        "valid_children": []
                                    }
                                },
                                "plugins": ["dnd", "types"]
                            }).on('changed.jstree', function(e, data) {
                                for (var i = 0; i < data.selected.length; i++) {
                                    var id = data.instance.get_node(data.selected[i]).id;
                                    switch (index_type[id]) {
                                        case 'scene':
                                            $(buttons).find('.add-step').removeAttr('disabled');
                                            $(buttons).find('.add-tween').attr('disabled', 'disabled');
                                            get_scene(id);
                                            break;
                                        case 'step':
                                            $(buttons).find('.add-step').attr('disabled', 'disabled')
                                            $(buttons).find('.add-tween').removeAttr('disabled');
                                            get_step(id);
                                            break;
                                        case 'tween':
                                            $(buttons).find('.add-step').attr('disabled', 'disabled');
                                            $(buttons).find('.add-tween').attr('disabled', 'disabled');
                                            get_tween(id);
                                            break;
                                        default:
                                            $(buttons).find('.add-step').attr('disabled', 'disabled');
                                            $(buttons).find('.add-tween').attr('disabled', 'disabled');
                                            break;
                                    }
                                }
                            }).on('delete_node.jstree', function(e, data) {
                                var id = data.node.id;
                                var path = get_path(data.node.id);
                                switch (path.length) {
                                    case 1:
                                        element.an_scenes.splice(path[0], 1);
                                        break;
                                    case 2:
                                        element.an_scenes[path[0]].timeline.splice(path[1], 1);
                                        break;
                                    case 3:
                                        element.an_scenes[path[0]].timeline[path[1]].tweens.splice(path[2], 1);
                                        break;
                                    default:
                                        break;
                                }
                            }).on('move_node.jstree', function(e, data) {
                                var path = get_path(data.node.id);
                                if (data.parent == data.old_parent) {
                                    switch (path.length) {
                                        case 1:
                                            element.an_scenes.splice(data.position, 0, element.an_scenes.splice(data.old_position, 1)[0]);
                                            break;
                                        case 2:
                                            element.an_scenes[path[0]].timeline.splice(data.position, 0, element.an_scenes[path[0]].timeline.splice(data.old_position, 1)[0]);
                                            break;
                                        case 3:
                                            element.an_scenes[path[0]].timeline[path[1]].tweens.splice(data.position, 0, element.an_scenes[path[0]].timeline[path[1]].tweens.splice(data.old_position, 1)[0]);
                                            break;
                                        default:
                                            break;
                                    }
                                } else {
                                    var parent_path = get_path(data.parent);
                                    var obj = null;
                                    switch (path.length) {
                                        case 1:
                                            obj = element.an_scenes.splice(path[0], 1)[0];
                                            break;
                                        case 2:
                                            obj = element.an_scenes[path[0]].timeline.splice(path[1], 1)[0];
                                            break;
                                        case 3:
                                            obj = element.an_scenes[path[0]].timeline[path[1]].tweens.splice(path[2], 1)[0];
                                            break;
                                        default:
                                            break;
                                    }
                                    switch (parent_path.length) {
                                        case 0:
                                            element.an_scenes.splice(data.position, 0, obj);
                                            break;
                                        case 1:
                                            element.an_scenes[parent_path[0]].timeline.splice(data.position, 0, obj);
                                            break;
                                        case 2:
                                            element.an_scenes[parent_path[0]].timeline[parent_path[1]].tweens.splice(data.position, 0, obj);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            });

                            element.an_name = '';
                            if ('an_name' in element.attrs) {
                                element.an_name = element.attrs['an_name'];
                                azexo_elements.elements_instances_by_an_name[element.an_name] = element;
                            }
                            element.an_scenes = [];
                            if ('an_scenes' in element.attrs) {
                                element.an_scenes = $.parseJSON(decodeURIComponent(atob(element.attrs['an_scenes'])));
                            }
                            fill_tree();

                            $('<div class="' + p + 'form-group"><label>' + t("Choose a wizard") + '</label>' + get_select({'vparalax': 'Vertical paralax for child element'}, 'wizard', '') + '</div><div id="wizard-form"></div>').appendTo($(tabs).find('#wizards'));
                            $(tabs).find('#wizards [name="wizard"]').change(function() {
                                $(tabs).find('#wizard-form').empty();
                                switch ($(this).val()) {
                                    case 'vparalax':
                                        $(tabs).find('#wizard-form').append('<div class="' + p + 'form-group"><label>' + t("Target") + '</label><div>' + get_select(_.object(_.keys(azexo_elements.elements_instances_by_an_name), _.keys(azexo_elements.elements_instances_by_an_name)), 'target', '') + '</div><p class="' + p + 'help-block">' + t("Target element") + '</p></div>');
                                        $(tabs).find('#wizard-form').append('<div class="' + p + 'form-group"><label>' + t("Shift") + '</label><div><input class="' + p + 'form-control" name="shift" type="text" value="1000"></div><p class="' + p + 'help-block">' + t("Number of pixels before/after original position when animation start/stop.") + '</p></div>');
                                        $(tabs).find('#wizard-form').append('<div class="' + p + 'form-group"><label>' + t("Speed") + '</label><div><input class="' + p + 'form-control" name="speed" type="text" value="1"></div><p class="' + p + 'help-block">' + t("Speed ratio. Where 1 mean speed which is equal to viewport speed.") + '</p></div>');
                                        $('<button title="' + title("Create script") + '" class="create-script ' + p + 'btn ' + p + 'btn-default">' + t("Create script") + '</button>').appendTo($(tabs).find('#wizard-form')).click(function() {
                                            var shift = parseInt($(tabs).find('#wizard-form [name="shift"]').val());
                                            var speed = parseFloat($(tabs).find('#wizard-form [name="speed"]').val());

                                            var target = $(tabs).find('#wizard-form [name="target"]').val();
                                            var target_element = azexo_elements.elements_instances_by_an_name[target];
                                            if ($(element.dom_element).find(target_element.dom_element).length > 0) {
                                                var tween = {target: target, duration: 1, from: {css: {transform: 'translateY(' + (shift * speed).toString() + 'px)'}}, to: {css: {transform: 'translateY(' + (-shift * speed).toString() + 'px)'}}, ease: 'Linear.easeNone', delay: '0'};
                                                var step = {tweens: [tween]};
                                                var top = $(target_element.dom_element).offset().top - $(element.dom_element).offset().top;
                                                var scene = {duration: 2 * shift, offset: top - shift, triggerHook: 'onCenter', timeline: [step], repeat: '0', repeatDelay: '0'};

                                                element.an_scenes.push(scene);
                                                var an_scenes = _.clone(element.an_scenes);
                                                $('#jstree .jstree-node').each(function() {
                                                    tree.jstree('delete_node', $(this).attr('id'));
                                                });
                                                element.an_scenes = an_scenes;
                                                fill_tree();
                                                $('#az-scroll-animation-tabs a[href="#script"]')[fp + 'tab']('show');
                                            } else {
                                                $(tabs).find('#wizard-form').prepend(get_alert(t('Animated target element must be child of the current element.')));
                                            }
                                        });
                                        break;
                                    default:
                                        break;
                                }
                            });
                        }
                    });
                    $('#az-scroll-animation-modal').find('.save').click(function() {
                        $(form).find('.tree [name="an_name"]')
                        if ($(form).find('.tree [name="an_name"]').val() == '') {
                            $(form).find('.tree .an-name').addClass('has-error');
                            return false;
                        }
                        azexo_add_js({
                            path: 'js/json2.min.js',
                            loaded: 'JSON' in window,
                            callback: function() {
                                element.an_name = $(form).find('.tree [name="an_name"]').val();
                                if (element.an_name != '') {
                                    element.attrs['an_name'] = element.an_name;
                                    azexo_elements.elements_instances_by_an_name[element.an_name] = element;
                                    $(element.dom_element).attr('data-an-name', element.an_name);
                                }
                                element.attrs['an_scenes'] = btoa(encodeURIComponent(JSON.stringify(element.an_scenes)));
                                element.update_scroll_animation();
                            }
                        });
                        $('#az-scroll-animation-modal')[fp + 'modal']('hide');
                        azexo_elements.raiseEvent("edited_element", element.id);
                        return false;
                    });
                    $('#az-scroll-animation-modal')[fp + 'modal']('show');
                    return false;
                });
            }
        },
        update_scroll_animation: function() {
            var element = this;
            this.add_js_list({
                paths: ['ScrollMagic/js/_dependent/greensock/TweenMax.min.js', 'ScrollMagic/js/_dependent/greensock/TimelineMax.min.js', 'ScrollMagic/js/jquery.scrollmagic.min.js'],
                loaded: 'ScrollMagic' in window,
                callback: function() {
                    if (scroll_magic == null) {
                        var options = {};
                        if (window.azexo_editor) {
                            //options = {loglevel: 3};
                        }
                        scroll_magic = new ScrollMagic(options);
                    }

                    if ($.isArray(element.scroll_magic_scenes)) {
                        for (var i = 0; i < element.scroll_magic_scenes.length; i++) {
                            if ('indicators' in element.scroll_magic_scenes[i] && 'remove' in element.scroll_magic_scenes[i].indicators)
                                element.scroll_magic_scenes[i].indicators.remove();
                            scroll_magic.removeScene(element.scroll_magic_scenes[i]);
                        }
                    }
                    element.scroll_magic_scenes = [];
                    if ($(element.dom_element).parents('.azexo-animations-disabled').length == 0) {
                        for (var i = 0; i < element.an_scenes.length; i++) {
                            var options = {
                                triggerElement: '[data-az-id="' + element.id + '"]',
                                duration: element.an_scenes[i].duration,
                                offset: element.an_scenes[i].offset,
                                triggerHook: element.an_scenes[i].triggerHook,
                            };
                            var scene = new ScrollScene(options).addTo(scroll_magic);
                            element.scroll_magic_scenes.push(scene);

                            if (window.azexo_editor) {
                                (function(scene) {
                                    element.add_js({
                                        path: 'ScrollMagic/js/jquery.scrollmagic.debug.js',
                                        callback: function() {
                                            scene.addIndicators({
                                                suffix: element.an_name,
                                            });
                                        },
                                    });
                                })(scene);
                            }

                            if ('pin' in element.an_scenes[i] && element.an_scenes[i].pin != '') {
                                scene.setPin('[data-an-name="' + element.an_scenes[i].pin + '"]');
                            }
                            var options = {};
                            if (element.an_scenes[i].duration == '0') {
                                options = {repeat: parseInt(element.an_scenes[i].repeat), repeatDelay: parseFloat(element.an_scenes[i].repeatDelay)};
                            }
                            var timeline = new TimelineMax(options);
                            for (var j = 0; j < element.an_scenes[i].timeline.length; j++) {
                                var step = [];
                                for (var k = 0; k < element.an_scenes[i].timeline[j].tweens.length; k++) {
                                    var target = '[data-an-name="' + element.an_scenes[i].timeline[j].tweens[k].target + '"]';
                                    var f = _.keys(element.an_scenes[i].timeline[j].tweens[k].from);
                                    var t = _.keys(element.an_scenes[i].timeline[j].tweens[k].to);
                                    if (f.length == 0 && t.length > 0) {
                                        var to = element.an_scenes[i].timeline[j].tweens[k].to;
                                        to.ease = element.an_scenes[i].timeline[j].tweens[k].ease;
                                        to.delay = parseFloat(element.an_scenes[i].timeline[j].tweens[k].delay);
                                        step.push(TweenMax.to(target, element.an_scenes[i].timeline[j].tweens[k].duration, to));
                                    }
                                    if (f.length > 0 && t.length == 0) {
                                        var from = element.an_scenes[i].timeline[j].tweens[k].from;
                                        from.ease = element.an_scenes[i].timeline[j].tweens[k].ease;
                                        from.delay = parseFloat(element.an_scenes[i].timeline[j].tweens[k].delay);
                                        step.push(TweenMax.from(target, element.an_scenes[i].timeline[j].tweens[k].duration, from));
                                    }
                                    if (f.length > 0 && t.length > 0) {
                                        var from = element.an_scenes[i].timeline[j].tweens[k].from;
                                        from.ease = element.an_scenes[i].timeline[j].tweens[k].ease;
                                        from.delay = element.an_scenes[i].timeline[j].tweens[k].delay;
                                        var to = element.an_scenes[i].timeline[j].tweens[k].to;
                                        to.ease = element.an_scenes[i].timeline[j].tweens[k].ease;
                                        to.delay = parseFloat(element.an_scenes[i].timeline[j].tweens[k].delay);
                                        step.push(TweenMax.fromTo(target, element.an_scenes[i].timeline[j].tweens[k].duration, from, to));
                                    }
                                }
                                timeline.add(step);
                            }
                            scene.setTween(timeline);
                        }
                    }
                }
            });
        },
        showed: function($, p, fp) {
            AnimatedElement.baseclass.prototype.showed.apply(this, arguments);
            this.an_scenes = [];
            if ('an_scenes' in this.attrs && this.attrs['an_scenes'] != '') {
                this.an_scenes = $.parseJSON(decodeURIComponent(atob(this.attrs['an_scenes'])));
                this.update_scroll_animation();
            }
            if ('an_start' in this.attrs && this.attrs['an_start'] != '' && this.attrs['an_start'] != 'no') {
                this.css_animation();
            }
        },
        render: function($, p, fp) {
            this.an_name = '';
            if ('an_name' in this.attrs && this.attrs['an_name'] != '') {
                this.an_name = this.attrs['an_name'];
                azexo_elements.elements_instances_by_an_name[this.an_name] = this;
                $(this.dom_element).attr('data-an-name', this.an_name);
            }
            AnimatedElement.baseclass.prototype.render.apply(this, arguments);
        }
    });
    function register_animated_element(base, is_container, Element) {
        extend(Element, AnimatedElement);
        Element.prototype.base = base;
        Element.prototype.is_container = is_container;
        AnimatedElement.prototype.elements[base] = Element;
        AnimatedElement.prototype.tags[base] = Element;
        if (is_container) {
            for (var i = 1; i < AnimatedElement.prototype.max_nested_depth; i++) {
                AnimatedElement.prototype.tags[base + '_' + i] = Element;
            }
        }
    }
//
//
//
    function RowElement(parent, parse) {
        RowElement.baseclass.apply(this, arguments);
        this.columns = '';
        if (!parse) {
            this.set_columns('1/1');
        }
        this.attrs['device'] = 'sm';
    }
    register_animated_element('az_row', true, RowElement);
    mixin(RowElement.prototype, {
        name: t('Row'),
        icon: 'fa fa-table',
        description: t('One row to implement a table layout with responsive ability. You can choose number of columns and thier widths. Used by default.'),
        category: t('Layout'),
        params: [
            make_param_type({
                type: 'dropdown',
                heading: t('Device'),
                param_name: 'device',
                value: {
                    xs: t('Extra small devices Phones (<768px)'),
                    sm: t('Small devices Tablets (≥768px)'),
                    md: t('Medium devices Desktops (≥992px)'),
                    lg: t('Large devices Desktops (≥1200px)')
                },
                description: t('Bootstrap responsive grid system')
            }),
            make_param_type({
                type: 'dropdown',
                heading: t('Background Effect'),
                param_name: 'effect',
                tab: t('Background Effects'),
                value: {
                    '': t('Simple Image'),
                    'fixed': t('Fixed Image'),
                    'parallax': t('Parallax Image'),
                    'youtube': t('YouTube Video'),
//                    'gradient': t('Gradient Color'),
                },
                description: t('Select the effect you want to apply to the row background.')
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Parallax speed'),
                param_name: 'parallax_speed',
                tab: t('Background Effects'),
                value: 20,
                dependency: {'element': 'effect', 'value': ['parallax']},
            }),
            make_param_type({
                type: 'checkbox',
                heading: t('Video Play Options'),
                param_name: 'video_options',
                tab: t('Background Effects'),
                description: t('Select options for the video.'),
                value: {
                    'loop': t("Loop"),
                    'mute': t("Muted"),
                },
                dependency: {'element': 'effect', 'value': ['youtube']},
            }),
            make_param_type({
                type: 'textfield',
                heading: t('YouTube Video URL'),
                param_name: 'video_youtube',
                tab: t('Background Effects'),
                description: t('Enter the YouTube video URL.'),
                dependency: {'element': 'effect', 'value': ['youtube']},
            }),
            make_param_type({
                type: 'textfield',
                heading: t('Start Time in seconds'),
                param_name: 'video_start',
                tab: t('Background Effects'),
                description: t('Enter time in seconds from where video start to play.'),
                value: '0',
                dependency: {'element': 'effect', 'value': ['youtube']},
            }),
            make_param_type({
                type: 'textfield',
                heading: t('Stop Time in seconds'),
                param_name: 'video_stop',
                tab: t('Background Effects'),
                description: t('Enter time in seconds where video ends.'),
                value: '0',
                dependency: {'element': 'effect', 'value': ['youtube']},
            }),
        ].concat(RowElement.prototype.params),
        is_container: true,
        get_button: function() {
            return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'text-overflow" data-az-element="' + this.base + '" style="width:100%;"><i class="' + p + 'text-primary ' + this.icon + '"></i><div>' + this.name + '</div><div class="' + p + 'text-muted ' + p + 'small">' + this.description + '</div></div>';
        },
        show_controls: function() {
            if (window.azexo_editor) {
                RowElement.baseclass.prototype.show_controls.apply(this, arguments);
                $(this.controls).find('.add').remove();
                $(this.controls).find('.paste').remove();
                var element = this;
                var controls = this.controls;
                var buttons = '<div class="row-layouts ' + p + 'clearfix">';
                var layouts = [
                    '1/1',
                    '1/2 + 1/2',
                    '2/3 + 1/3',
                    '1/3 + 1/3 + 1/3',
                    '1/4 + 1/4 + 1/4 + 1/4',
                    '1/4 + 3/4',
                    '1/4 + 1/2 + 1/4',
                    '5/6 + 1/6',
                    '1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6',
                    '1/6 + 4/6 + 1/6',
                    '1/6 + 1/6 + 1/6 + 1/2',
                ];
                for (var i = 0; i < layouts.length; i++) {
                    buttons += '<div title="' + title('Set ' + layouts[i] + ' colums') + '" class="control set-columns-layout l_' + layouts[i].replace(/ \+ /g, '_').replace(/\//g, '') + '" data-az-columns="' + layouts[i] + '"></div>';
                }
                buttons += '</div>';

                var columns = $('<button title="' + title("Set layout") + '" class="control set-columns ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon ' + p + 'glyphicon-th"> </button>').appendTo(this.controls).click({object: this}, this.click_set_columns)[fp + 'popover']({
                    animation: false,
                    placement: p + 'right',
                    html: 'true',
                    trigger: 'manual',
                    //container: 'body',
                    content: buttons,
                }).hover(function() {
                    $(this)[fp + 'popover']('show');
                    $(controls).find('.' + p + 'popover .set-columns-layout').each(function() {
                        $(this).click({object: element}, element.click_set_columns);
                    });
                    $(element.dom_element).mouseleave(function() {
                        $(columns)[fp + 'popover']('hide');
                        $(columns).css('display', '');
                    });
                });
            }
        },
        update_sortable: function() {
            if (window.azexo_editor) {
                $(this.dom_element).sortable({
                    axis: 'x',
                    items: '> .az-column',
                    handle: '> .controls > .drag-and-drop',
                    update: this.update_sorting,
                    placeholder: 'az-sortable-placeholder',
                    forcePlaceholderSize: true,
                    over: function(event, ui) {
                        ui.placeholder.attr('class', ui.helper.attr('class'));
                        ui.placeholder.removeClass('ui-sortable-helper');
                        ui.placeholder.addClass('az-sortable-placeholder');
                    },
                });
            }
        },
        update_sorting: function(event, ui) {
            RowElement.baseclass.prototype.update_sorting.apply(this, arguments);
            var element = azexo_elements.get_element($(this).closest('[data-az-id]').attr('data-az-id'));
            for (var i = 0; i < element.children.length; i++) {
                element.children[i].update_empty();
            }
        },
        update_dom: function() {
            RowElement.baseclass.prototype.update_dom.apply(this, arguments);
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].update_dom();
            }
        },
        click_set_columns: function(e) {
            var columns = $(this).attr('data-az-columns');
            if (columns == '' || columns == undefined) {
                if (e.data.object.columns == '') {
                    columns = [];
                    for (var i = 0; i < e.data.object.children.length; i++) {
                        columns.push(e.data.object.children[i].attrs['width']);
                    }
                    e.data.object.columns = columns.join(' + ');
                }
                columns = window.prompt(t('Enter custom layout for your row:'), e.data.object.columns);
            }
            if (columns != '' && columns != null)
                e.data.object.set_columns(columns);
            return false;
        },
        set_columns: function(columns) {
            this.columns = columns;
            var widths = columns.replace(' ', '').split('+');
            if (this.children.length == 0) {
                for (var i = 0; i < widths.length; i++) {
                    var child = new ColumnElement(this, true);
                    child.update_dom();
                    child.update_width(widths[i]);
                }
            } else {
                if (this.children.length == widths.length) {
                    for (var i = 0; i < widths.length; i++) {
                        this.children[i].update_width(widths[i]);
                    }
                } else {
                    if (this.children.length > widths.length) {
                        var last_column = this.children[widths.length - 1];
                        for (var i = 0; i < this.children.length; i++) {
                            if (i < widths.length) {
                                this.children[i].update_width(widths[i]);
                            } else {
                                var column = this.children[i];
                                for (var j = 0; j < column.children.length; j++) {
                                    column.children[j].parent = last_column;
                                    last_column.children.push(column.children[j]);
                                }
                                column.children = [];
                            }
                        }
                        last_column.update_dom();
                        var removing_columns = this.children.slice(widths.length, this.children.length);
                        for (var i = 0; i < removing_columns.length; i++) {
                            removing_columns[i].remove();
                        }
                    } else {
                        for (var i = 0; i < widths.length; i++) {
                            if (i < this.children.length) {
                                this.children[i].update_width(widths[i]);
                            } else {
                                var child = new ColumnElement(this, true);
                                child.update_dom();
                                child.update_width(widths[i]);
                            }
                        }
                    }
                }
            }
            this.update_sortable();
        },
        showed: function($, p, fp) {
            RowElement.baseclass.prototype.showed.apply(this, arguments);
            var element = this;
            switch (this.attrs['effect']) {
                case 'parallax':
                    this.add_js_list({
                        paths: ['jquery.parallax/jquery.parallax.js', 'jquery-waypoints/waypoints.min.js'],
                        loaded: 'waypoint' in $.fn && 'parallax' in $.fn,
                        callback: function() {
                            $(element.dom_element).waypoint(function(direction) {
                                $(element.dom_element).css('background-attachment', 'fixed');
                                $(element.dom_element).css('background-position', '50% 0');
                                $(element.dom_element).parallax("50%", element.attrs['parallax_speed'] / 100);
                            }, {offset: '100%', triggerOnce: true});
                            $(document).trigger('scroll');
                        }});
                    break;
                case 'fixed':
                    $(element.dom_element).css('background-attachment', 'fixed');
                    break;
                case 'youtube':
                    var loop = _.indexOf(element.attrs['video_options'].split(','), 'loop') >= 0;
                    var mute = _.indexOf(element.attrs['video_options'].split(','), 'mute') >= 0;
                    this.add_css('jquery.mb.YTPlayer/css/YTPlayer.css', 'mb_YTPlayer' in $.fn, function() {
                    });
                    this.add_js_list({
                        paths: ['jquery.mb.YTPlayer/inc/jquery.mb.YTPlayer.js', 'jquery-waypoints/waypoints.min.js'],
                        loaded: 'waypoint' in $.fn && 'mb_YTPlayer' in $.fn,
                        callback: function() {
                            $(element.dom_element).waypoint(function(direction) {
                                $(element.dom_element).attr('data-property', "{videoURL:'" + youtube_parser(element.attrs['video_youtube']) + "',containment:'#" + element.id + "', showControls:false, autoPlay:true, loop:" + loop.toString() + ", mute:" + mute.toString() + ", startAt:" + element.attrs['video_start'] + ", stopAt:" + element.attrs['video_stop'] + ", opacity:1, addRaster:false, quality:'default'}");
                                $(element.dom_element).mb_YTPlayer();
                                $(element.dom_element).playYTP();
                            }, {offset: '100%', triggerOnce: true});
                            $(document).trigger('scroll');
                        }});
                    break;
                default:
                    break;
            }
        },
        render: function($, p, fp) {
            this.dom_element = $('<div id="' + this.id + '" class="az-element az-row ' + p + 'row ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
            this.dom_content_element = this.dom_element;
            RowElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function ColumnElement(parent, parse) {
        ColumnElement.baseclass.call(this, parent, parse);
    }
    register_element('az_column', true, ColumnElement);
    mixin(ColumnElement.prototype, {
        name: t('Column'),
        params: [
            make_param_type({
                type: 'textfield',
                heading: t('Column with'),
                param_name: 'width',
                hidden: true,
            }),
        ].concat(ColumnElement.prototype.params),
        hidden: true,
        is_container: true,
        get_empty: function() {
            if (this.id == this.parent.children[0].id)
                return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for this row and current column. You can choose columns layout by mouse over (or click) this button: ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-th"></span></div></div>';
            else
                return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for current column of this row. You can reorder columns by drag and drop.') + '</div></div>';
        },
        show_controls: function() {
            if (window.azexo_editor) {
                ColumnElement.baseclass.prototype.show_controls.apply(this, arguments);
                $(this.controls).find('.clone').remove();
                $(this.controls).find('.copy').remove();
                $(this.controls).find('.remove').remove();
            }
        },
        get_my_shortcode: function() {
            return this.get_children_shortcode();
        },
        update_width: function(width) {
            $(this.dom_element).removeClass(width2span(this.attrs['width'], this.parent.attrs['device']));
            this.attrs['width'] = width;
            $(this.dom_element).addClass(width2span(this.attrs['width'], this.parent.attrs['device']));
            azexo_elements.raiseEvent("update_element", this.id);
        },
        render: function($, p, fp) {
            this.dom_element = $('<div class="az-element az-ctnr az-column ' + this.attrs['el_class'] + ' ' + width2span(this.attrs['width'], this.parent.attrs['device']) + '" style="' + this.attrs['style'] + '"></div>');
            this.dom_content_element = this.dom_element;
            ColumnElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function GridElement(parent, parse) {
        GridElement.baseclass.apply(this, arguments);
        this.linked_elements_index = {};
        if (!parse) {
            this.add_item();
        }
        this.attach_events();
    }
    register_animated_element('az_grid', true, GridElement);
    mixin(GridElement.prototype, {
        name: t('Grid'),
        icon: 'fa fa-th-large',
        description: t('Grid with filter by tags. Every item of grid can contain any number of any types of elements.'),
        category: t('Layout'),
        params: [
            make_param_type({
                type: 'integer_slider',
                heading: t('Columns number'),
                param_name: 'columns_number',
                min: '1',
                max: '20',
                value: '3',
            }),
            make_param_type({
                type: 'checkbox',
                heading: t('Masonry grid?'),
                param_name: 'masonry',
                value: {
                    'yes': t("Yes, please"),
                },
            }),
        ].concat(GridElement.prototype.params),
        is_container: true,
        get_button: function() {
            return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'text-overflow" data-az-element="' + this.base + '" style="width:100%;"><i class="' + p + 'text-primary ' + this.icon + '"></i><div>' + this.name + '</div><div class="' + p + 'text-muted ' + p + 'small">' + this.description + '</div></div>';
        },
        update_sortable: function() {
            if (window.azexo_editor) {
                var element = this;
                function over(event, ui) {
                    ui.placeholder.attr('class', ui.helper.attr('class'));
                    ui.placeholder.css('width', ui.helper.css('width'));
                    ui.placeholder.css('height', ui.helper.css('height'));
                    ui.placeholder.removeClass('ui-sortable-helper');
                    ui.placeholder.addClass('az-sortable-placeholder');
                }
                $(this.dom_element).find('> ul').sortable({
                    items: '> .az-item',
                    connectWith: '.az-grid > ul',
                    handle: '> .controls > .drag-and-drop',
                    update: element.update_sorting,
                    placeholder: 'az-sortable-placeholder',
                    forcePlaceholderSize: true,
                    start: over,
                    over: over,
                });
            }
        },
        update_sorting: function(event, ui) {
            GridElement.baseclass.prototype.update_sorting.apply(this, arguments);
            var element = azexo_elements.get_element($(this).closest('[data-az-id]').attr('data-az-id'));
            for (var i = 0; i < element.children.length; i++) {
                element.children[i].update_empty();
            }
        },
        show_controls: function() {
            if (window.azexo_editor) {
                GridElement.baseclass.prototype.show_controls.apply(this, arguments);
                $(this.controls).find('.add').remove();
                $(this.controls).find('.paste').remove();
                $(this.controls).find('.clone').remove();
//                $('<button title="' + title("Add item") + '" class="control add-item ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon ' + p + 'glyphicon-plus-sign" > </button>').appendTo(this.controls).click({object: this}, this.click_add_item);
                azexo_add_js({
                    path: 'js/json2.min.js',
                    loaded: 'JSON' in window,
                    callback: function() {
                    },
                });
            }
        },
        click_add_item: function(e) {
            e.data.object.add_item();
            return false;
        },
        add_item: function() {
            var child = new ItemElement(this, true);
            child.update_dom();
            this.update_dom();
        },
        attach_events: function() {
            if (window.azexo_editor) {
                var grid_element = this;

                azexo_elements.attachEvent("add_element",
                        function(sender, data) {
                            var el = azexo_elements.get_element(data.id);
                            var item = grid_element.get_item(el);
                            if (item != null) {
                                item.parent.linked_elements_index[el.id] = el;
                            }
                            if (el.parent.id in grid_element.linked_elements_index || el.base == 'az_item') {
                                if (!('element_adding' in grid_element)) {
                                    grid_element.element_adding = true;
                                    grid_element.add_control(el);
                                    if (!data.parse || el.base == 'az_column')
                                        el.synchronize();
                                    if ($(el.parent.dom_content_element).hasClass('ui-sortable') && el.id != item.id)
                                        $(el.parent.dom_content_element).sortable("option", "containment", item.dom_content_element);
                                    delete grid_element.element_adding;
                                }
                            }
                        }
                );
                function update_element(edited, id) {
                    var el = azexo_elements.get_element(id);
                    if (id in grid_element.linked_elements_index || el.parent.id in grid_element.linked_elements_index) {
                        if (!('element_updating' in grid_element)) {
                            grid_element.element_updating = true;
                            var el = azexo_elements.get_element(id);
                            var item = grid_element.get_item(el);
                            grid_element.add_control(el);
                            if (!edited)
                                el.synchronize();
                            if ($(el.parent.dom_content_element).hasClass('ui-sortable') && el.id != item.id)
                                $(el.parent.dom_content_element).sortable("option", "containment", item.dom_content_element);
                            delete grid_element.element_updating;
                        }
                    }
                }
                azexo_elements.attachEvent("edited_element",
                        function(sender, id) {
                            update_element(true, id);
                        }
                );
                azexo_elements.attachEvent("update_element",
                        function(sender, id) {
                            update_element(false, id);
                        }
                );
                azexo_elements.attachEvent("delete_element",
                        function(sender, id) {
                            var el = azexo_elements.get_element(id);
                            var item = grid_element.get_item(el);
                            if (item != null && el.id in item.parent.linked_elements_index && el.base != 'az_item') {
                                if (!('element_deleting' in grid_element)) {
                                    grid_element.element_deleting = true;
                                    if (!('item_removing' in grid_element)) {
                                        var linked_elements = grid_element.get_linked_elements(el, true);
                                        for (var i = 0; i < linked_elements.length; i++) {
                                            if (el.id != linked_elements[i].id) {
                                                linked_elements[i].remove();
                                            }
                                        }
                                    }
                                    delete item.parent.linked_elements_index[el.id];
                                    delete grid_element.element_deleting;
                                }
                            }
                        }
                );
                azexo_elements.attachEvent("update_sorting",
                        function(sender, ui) {
                            var id = $(ui.item).closest('[data-az-id]').attr('data-az-id');
                            if (id in grid_element.linked_elements_index) {
                                var element = azexo_elements.get_element(id);
                                var item = grid_element.get_item(element);
                                if (item == null) {
                                    delete grid_element.linked_elements_index[id];
                                } else {
                                    if (element.id != item.id) {
                                        if (ui.source.id == ui.target.id) {
                                            var linked_elements = grid_element.get_linked_elements(element.parent, false);
                                            var path = grid_element.get_path(element.parent);
                                            for (var i = 0; i < linked_elements.length; i++) {
                                                var parent = linked_elements[i];
                                                if (parent.id != element.parent.id) {
                                                    parent.children.splice(ui.to_pos, 0, parent.children.splice(ui.from_pos, 1)[0]);
                                                    parent.update_dom();
                                                }
                                            }
                                        } else {
                                            var source_path = grid_element.get_path(ui.source);
                                            var source_linked_elements = grid_element.get_linked_elements(ui.source, false);
                                            var target_path = grid_element.get_path(ui.target);
                                            var target_linked_elements = grid_element.get_linked_elements(ui.target, false);
                                            for (var i = 0; i < source_linked_elements.length; i++) {
                                                var source_parent = source_linked_elements[i];
                                                var target_parent = target_linked_elements[i];
                                                if (source_parent.id != ui.source.id && target_parent.id != ui.target.id) {
                                                    var el = source_parent.children.splice(ui.from_pos, 1)[0];
                                                    source_parent.update_dom();
                                                    target_parent.children.splice(ui.to_pos, 0, el);
                                                    target_parent.update_dom();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                );
            }
        },
        get_path: function(element) {
            if (element.base == 'az_item') {
                return [];
            }
            if ('parent' in element) {
                var path = this.get_path(element.parent);
                if (path != null)
                    return this.get_path(element.parent).concat([element.get_child_position()]);
                else
                    return null;
            } else {
                return null;
            }
        },
        get_item: function(element) {
            if (element.base == 'az_item')
                return element;
            if ('parent' in element)
                return this.get_item(element.parent);
            else
                return null;
        },
        get_linked_elements: function(element, check_children) {
            var linked_elements = [];
            var path = this.get_path(element);
            for (var i = 0; i < this.children.length; i++) {
                var el = this.children[i];
                for (var j = 0; j < path.length; j++) {
                    if (path[j] < el.children.length)
                        el = el.children[path[j]];
                    else
                        return [];
                }
                if (element.base == el.base) {
                    if (check_children)
                        for (var j = 0; j < linked_elements.length; j++) {
                            if (linked_elements[j].parent.children.length != el.parent.children.length)
                                return [];
                        }
                    linked_elements.push(el);
                }
            }
            return linked_elements;
        },
        add_control: function(element) {
            var grid_element = this;

            element.synchronize = function() {
                var linked_elements = grid_element.get_linked_elements(this, true);
                if (linked_elements.length == grid_element.children.length) {
                    for (var i = 0; i < linked_elements.length; i++) {
                        linked_elements[i].edited(this.attrs);
                    }
                } else {
                    var linked_elements = grid_element.get_linked_elements(this.parent, true);
                    if (linked_elements.length == grid_element.children.length) {
                        var constructor = BaseElement.prototype.tags[this.base];
                        var pos = this.get_child_position();
                        for (var i = 0; i < linked_elements.length; i++) {
                            if (linked_elements[i].id != this.parent.id) {
                                var parent = linked_elements[i];

                                var new_element = new constructor(parent, true);
                                parent.children.splice(pos, 0, parent.children.splice(parent.children.length - 1, 1)[0]);
                                //new_element.edited(this.attrs);
                                new_element.update_dom();
                                parent.update_dom();

                                grid_element.linked_elements_index[new_element.id] = new_element;
                                grid_element.add_control(new_element);
                            }
                        }
                    }
                }
            };
            _.defer(function() {
                var item = grid_element.get_item(element);
                if (item != null) {
                    if (element.parent.dom_content_element != null && element.id != item.id)
                        if ($(element.parent.dom_content_element).hasClass('ui-sortable'))
                            $(element.parent.dom_content_element).sortable("option", "containment", item.dom_content_element);
                }

                if (element.controls != null) {
                    $(element.controls).find('.copy').remove();
                    $(element.controls).find('.paste').remove();
                    $(element.controls).find('.save-template').remove();
                    if (element.base != 'az_item') {
                        $(element.controls).find('.clone').remove();
                    }
                    if (element.controls.find('.synchronize').length == 0) {
                        $('<button title="' + title("Synchronize this element settings through all grid items") + '" class="control synchronize ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-pushpin" > </button>').appendTo(element.controls).click({object: element}, function(e) {
                            e.data.object.synchronize();
                            return false;
                        });
                    }
                }
            });
            for (var i = 0; i < element.children.length; i++) {
                grid_element.add_control(element.children[i]);
            }
        },
        showed: function($, p, fp) {
            GridElement.baseclass.prototype.showed.apply(this, arguments);
            var element = this;
            this.add_js({
                path: 'js/masonry.min.js',
                loaded: 'masonry' in $.fn,
                callback: function() {
                    var width = Math.floor($(element.dom_element).parent().width() / parseInt(element.attrs['columns_number']));
                    var tags = [];
                    for (var i = 0; i < element.children.length; i++) {
                        $(element.children[i].dom_element).css('width', width);
                        if (element.children[i].attrs['tags'] != '') {
                            var tg = element.children[i].attrs['tags'].split(',');
                            for (var j = 0; j < tg.length; j++)
                                tg[j] = tg[j].replace(/ /g, '');
                            tags = tags.concat(tg);
                        }
                    }
                    tags = $.unique(tags);
                    $(element.dom_element).find('.az-tags').remove();
                    if (tags.length > 0) {
                        var tags_element = $('<div class="az-tags ' + p + 'btn-group"></div>').prependTo(element.dom_element);
                        $('<a class="az-tag ' + p + 'btn ' + p + 'btn-default">' + t('All') + '</a>').appendTo(tags_element).click(function() {
                            $(element.dom_content_element).find('> .az-item').css('display', 'block');
                            if (element.attrs['masonry'] == 'yes')
                                $(element.dom_element).find('ul').masonry('layout');
                        });
                        for (var i = 0; i < tags.length; i++) {
                            (function(i) {
                                $('<a class="az-tag ' + p + 'btn ' + p + 'btn-default">' + tags[i] + '</a>').appendTo(tags_element).click(function() {
                                    $(element.dom_content_element).find('> .az-item[data-az-tags*="' + tags[i] + '"]').css('display', 'block');
                                    $(element.dom_content_element).find('> .az-item:not([data-az-tags*="' + tags[i] + '"])').css('display', 'none');
                                    if (element.attrs['masonry'] == 'yes')
                                        $(element.dom_element).find('ul').masonry('layout');
                                });
                            })(i);
                        }
                    }
                    if (element.attrs['masonry'] == 'yes') {
                        $(element.dom_element).find('ul').masonry({
                            itemSelector: 'li',
                            columnWidth: width,
//                            gutter: 10,
                        });
                    } else {
//                        $(element.dom_element).find('ul').masonry({
//                            itemSelector: 'li',
//                        });
                    }
                }});
        },
        render: function($, p, fp) {
            var element = this;
            this.dom_element = $('<div class="az-element az-grid ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
            this.dom_content_element = $('<ul></ul>').appendTo(this.dom_element);
            GridElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function ItemElement(parent, parse) {
        ItemElement.baseclass.apply(this, arguments);
    }
    register_element('az_item', true, ItemElement);
    mixin(ItemElement.prototype, {
        name: t('Item'),
        params: [
            make_param_type({
                type: 'textfield',
                heading: t('Item tags'),
                param_name: 'tags',
                descritption: t('Separated by comma.'),
            }),
            make_param_type({
                type: 'textfield',
                heading: t('Item height'),
                param_name: 'height',
                description: t('You can use px, em, %, etc. or enter just number and it will use pixels.'),
            }),
        ].concat(ItemElement.prototype.params),
        hidden: true,
        is_container: true,
        disallowed_elements: ['az_grid', 'az_tabs', 'az_accordion', 'az_carousel', 'az_form'],
        get_empty: function() {
            return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for this grid element and for current item element. You can add new item via clone current item by click on this button:') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-repeat"></span></div><div class="bottom ' + p + 'well"><strong>' + t('1) Create one item as template. 2) Clone it as much as you want. 3) Customize every item.') + '</strong></div></div>';
//            if (this.id == this.parent.children[0].id)
//                return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for this grid element and for current item element. ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-plus-sign"></span>' + t(' - add a new item.') + '</div></div>';
//            else
//                return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for current item element of this grid. ') + '</div></div>';
        },
        get_my_shortcode: function() {
            return this.get_children_shortcode();
        },
        remove: function() {
            this.parent.item_removing = true;
            ItemElement.baseclass.prototype.remove.apply(this, arguments);
            delete this.parent.item_removing;
            this.parent.showed($, p, fp);
        },
        clone: function() {
            var shortcode = ItemElement.baseclass.prototype.get_my_shortcode.apply(this, arguments);
            $('#azexo-clipboard').html(btoa(encodeURIComponent(shortcode)));
            for (var i = 0; i < this.parent.children.length; i++) {
                if (this.parent.children[i].id == this.id) {
                    this.parent.paste(i);
                    break;
                }
            }
            this.parent.update_dom();
        },
        show_controls: function() {
            if (window.azexo_editor) {
                ItemElement.baseclass.prototype.show_controls.apply(this, arguments);
                this.parent.add_control(this);
            }
        },
        edited: function() {
            ItemElement.baseclass.prototype.edited.apply(this, arguments);
            this.parent.showed($, p, fp);
        },
        showed: function($, p, fp) {
            ItemElement.baseclass.prototype.showed.apply(this, arguments);
            var width = Math.floor($(this.parent.parent.dom_content_element).width() / parseInt(this.parent.attrs['columns_number']));
            $(this.dom_element).css('width', width);
        },
        render: function($, p, fp) {
            this.dom_element = $('<li class="az-element az-ctnr az-item ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '" data-az-tags="' + this.attrs['tags'] + '"></li>');
            this.dom_content_element = this.dom_element;
            if ('height' in  this.attrs)
                $(this.dom_element).css('height', this.attrs['height']);
            ItemElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function LayersElement(parent, parse) {
        LayersElement.baseclass.apply(this, arguments);
    }
    register_animated_element('az_layers', true, LayersElement);
    mixin(LayersElement.prototype, {
        name: t('Layers'),
        icon: 'fa fa-archive',
        description: t('Box with fixed size. Every contained element have free position and free size in proportion with this element.'),
        category: t('Layout'),
        params: [
            make_param_type({
                type: 'textfield',
                heading: t('Width'),
                param_name: 'width',
                description: t('You can use px, em, %, etc. or enter just number and it will use pixels.'),
                value: '100%',
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Height'),
                param_name: 'height',
                max: '10000',
                value: '500',
            }),
        ].concat(LayersElement.prototype.params),
        show_settings_on_create: true,
        is_container: true,
        disallowed_elements: ['az_layers'],
        get_button: function() {
            return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'text-overflow" data-az-element="' + this.base + '" style="width:100%;"><i class="' + p + 'text-primary ' + this.icon + '"></i><div>' + this.name + '</div><div class="' + p + 'text-muted ' + p + 'small">' + this.description + '</div></div>';
        },
        get_empty: function() {
            return '<div class="az-empty"><div class="top ' + p + 'well">' + t('Double click will add a new element. All elements are draggable and resizable. Middle mouse click will iterate via all elements placed in this container - it can help when elements overlapped.') + '</div><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for this layers element.') + '</div></div>';
        },
        zindex_normalize: function() {
            var zindexes = [];
            for (var i = 0; i < this.children.length; i++) {
                if (isNaN(parseInt(this.children[i].attrs['pos_zindex']))) {
                    this.children[i].attrs['pos_zindex'] = 0;
                }
                zindexes.push(parseInt(this.children[i].attrs['pos_zindex']));
            }
            zindexes = _.sortBy(zindexes, function(num) {
                return num;
            });
            zindexes = _.uniq(zindexes);
            for (var i = 0; i < this.children.length; i++) {
                var ind = _.sortedIndex(zindexes, parseInt(this.children[i].attrs['pos_zindex']));
                $(this.children[i].dom_element).css("z-index", ind);
                this.children[i].attrs['pos_zindex'] = ind;
            }
        },
        update_sortable: function() {
            if (window.azexo_editor) {
                var element = this;
                element.zindex_normalize();
                function store_position(dom_element) {
                    var id = $(dom_element).closest('[data-az-id]').attr('data-az-id');
                    var el = azexo_elements.get_element(id);
                    el.attrs['pos_left'] = parseInt($(dom_element).css("left")) / ($(element.dom_element).width() / 100) + "%";
                    el.attrs['pos_top'] = parseInt($(dom_element).css("top")) / ($(element.dom_element).height() / 100) + "%";
                    el.attrs['pos_width'] = parseInt($(dom_element).css("width")) / ($(element.dom_element).width() / 100) + "%";
                    el.attrs['pos_height'] = parseInt($(dom_element).css("height")) / ($(element.dom_element).height() / 100) + "%";
                    azexo_elements.raiseEvent("update_element", id);
                }
                $(this.dom_content_element).resizable({
//                    containment: "parent",
                    start: function(event, ui) {
                        for (var i = 0; i < element.children.length; i++) {
                            var dom_element = element.children[i].dom_element;
                            $(dom_element).css("left", parseInt($(dom_element).css("left")) / ($(element.dom_element).width() / 100) + "%");
                            $(dom_element).css("top", parseInt($(dom_element).css("top")) / ($(element.dom_element).height() / 100) + "%");
                            $(dom_element).css("width", parseInt($(dom_element).css("width")) / ($(element.dom_element).width() / 100) + "%");
                            $(dom_element).css("height", parseInt($(dom_element).css("height")) / ($(element.dom_element).height() / 100) + "%");
                        }
                    },
                    stop: function(event, ui) {
                        element.attrs['width'] = parseInt($(element.dom_content_element).css("width")) / ($(element.dom_element).width() / 100) + "%";
                        element.attrs['height'] = $(element.dom_content_element).height();
                    }
                });
                for (var i = 0; i < this.children.length; i++) {
                    if (!$.isNumeric($(this.children[i].dom_element).css("z-index"))) {
                        $(this.children[i].dom_element).css("z-index", 0);
                    }
                    if (this.children[i].controls == null) {
                        this.children[i].show_controls();
                    }
                    if (this.children[i].attrs['pos_top'] == null) {
                        this.children[i].attrs['pos_top'] = '50%';
                    }
                    if (this.children[i].attrs['pos_left'] == null) {
                        this.children[i].attrs['pos_left'] = '50%';
                    }
                    if (this.children[i].attrs['pos_width'] == null) {
                        this.children[i].attrs['pos_width'] = '50%';
                    }
                    if (this.children[i].attrs['pos_height'] == null) {
                        this.children[i].attrs['pos_height'] = '50%';
                    }
                    if (this.children[i].controls.find('.width100').length == 0)
                        $('<button title="' + title("100% width") + '" class="control width100 ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-resize-horizontal" > </button>').appendTo(this.children[i].controls).click({object: this.children[i]}, function(e) {
                            e.data.object.attrs['pos_left'] = '0%';
                            $(e.data.object.dom_element).css("left", '0%');
                            e.data.object.attrs['pos_width'] = '100%';
                            $(e.data.object.dom_element).css("width", '100%');
                        });
                    if (this.children[i].controls.find('.heigth100').length == 0)
                        $('<button title="' + title("100% heigth") + '" class="control heigth100 ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-resize-vertical" > </button>').appendTo(this.children[i].controls).click({object: this.children[i]}, function(e) {
                            e.data.object.attrs['pos_top'] = '0%';
                            $(e.data.object.dom_element).css("top", '0%');
                            e.data.object.attrs['pos_height'] = '100%';
                            $(e.data.object.dom_element).css("height", '100%');
                        });
                    if (this.children[i].controls.find('.forward').length == 0)
                        $('<button title="' + title("Bring forward") + '" class="control forward ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-arrow-up" > </button>').appendTo(this.children[i].controls).click({object: this.children[i]}, function(e) {
                            if ($.isNumeric($(e.data.object.dom_element).css("z-index"))) {
                                $(e.data.object.dom_element).css("z-index", Math.round($(e.data.object.dom_element).css("z-index")) + 1);
                                e.data.object.attrs['pos_zindex'] = $(e.data.object.dom_element).css("z-index");
                            } else {
                                $(e.data.object.dom_element).css("z-index", 0);
                                e.data.object.attrs['pos_zindex'] = 0;
                            }
                            element.zindex_normalize();
                        });
                    if (this.children[i].controls.find('.backward').length == 0)
                        $('<button title="' + title("Send backward") + '" class="control backward ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-arrow-down" > </button>').appendTo(this.children[i].controls).click({object: this.children[i]}, function(e) {
                            if ($.isNumeric($(e.data.object.dom_element).css("z-index"))) {
                                if (Math.round($(e.data.object.dom_element).css("z-index")) > 0) {
                                    $(e.data.object.dom_element).css("z-index", Math.round($(e.data.object.dom_element).css("z-index")) - 1);
                                    e.data.object.attrs['pos_zindex'] = $(e.data.object.dom_element).css("z-index");
                                }
                            } else {
                                $(e.data.object.dom_element).css("z-index", 0);
                                e.data.object.attrs['pos_zindex'] = 0;
                            }
                            element.zindex_normalize();
                        });

                    $(this.children[i].dom_element).draggable({
                        handle: "> .controls > .drag-and-drop",
                        containment: "#" + this.id,
                        scroll: false,
                        snap: "#" + this.id + ", .az-element",
                        //connectToSortable: '.az-ctnr',
                        stop: function(event, ui) {
                            store_position(this);
                        }
                    });
                    $(this.children[i].dom_element).resizable({
                        containment: "#" + this.id,
                        stop: function(event, ui) {
                            store_position(this);
                        }
                    });
                }
            }
        },
        show_controls: function() {
            if (window.azexo_editor) {
                LayersElement.baseclass.prototype.show_controls.apply(this, arguments);
                this.update_sortable();
                var element = this;
                $(this.dom_content_element).dblclick(function(e) {
                    if (e.which == 1) {
                        azexo_elements.show(element, function(new_element) {
                            new_element.attrs['pos_top'] = e.offsetY.toString() + 'px';
                            new_element.attrs['pos_left'] = e.offsetX.toString() + 'px';
                        });
                    }
                });
            }
        },
        attach_children: function() {
            LayersElement.baseclass.prototype.attach_children.apply(this, arguments);
            if (window.azexo_editor)
                this.update_sortable();
        },
        render: function($, p, fp) {
            this.dom_element = $('<div class="az-element az-layers ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"><div id="' + this.id + '" class="az-ctnr"></div></div>');
            this.dom_content_element = $(this.dom_element).find('.az-ctnr');
            $(this.dom_content_element).css('width', this.attrs['width']);
            $(this.dom_content_element).css('height', this.attrs['height']);
            LayersElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function TabsElement(parent, parse) {
        TabsElement.baseclass.apply(this, arguments);
        if (!parse) {
            this.add_tab();
        }
    }
    register_animated_element('az_tabs', true, TabsElement);
    mixin(TabsElement.prototype, {
        name: t('Tabs'),
        icon: 'fa fa-folder-o',
        description: t('Bootstrap content tabs. Every tab can contain any number of any types of elements.'),
        category: t('Layout'),
        params: [
        ].concat(TabsElement.prototype.params),
        is_container: true,
        get_button: function() {
            return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'text-overflow" data-az-element="' + this.base + '" style="width:100%;"><i class="' + p + 'text-primary ' + this.icon + '"></i><div>' + this.name + '</div><div class="' + p + 'text-muted ' + p + 'small">' + this.description + '</div></div>';
        },
        show_controls: function() {
            if (window.azexo_editor) {
                TabsElement.baseclass.prototype.show_controls.apply(this, arguments);
                $(this.controls).find('.add').remove();
                $(this.controls).find('.paste').remove();
                $('<button title="' + title("Add tab") + '" class="control add-tab ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon ' + p + 'glyphicon-plus-sign" > </button>').appendTo(this.controls).click({object: this}, this.click_add_tab);
            }
        },
        update_sortable: function() {
            if (window.azexo_editor) {
                $(this.dom_element).sortable({
                    axis: 'x',
                    items: '> ul > li',
                    update: this.update_sorting,
                    placeholder: 'az-sortable-placeholder',
                    forcePlaceholderSize: true,
                    over: function(event, ui) {
                        ui.placeholder.attr('class', ui.helper.attr('class'));
                        ui.placeholder.removeClass('ui-sortable-helper');
                        ui.placeholder.addClass('az-sortable-placeholder');
                    }
                });
            }
        },
        update_sorting: function(event, ui) {
            var options = $(this).sortable('option');
            var element = azexo_elements.get_element($(this).attr('data-az-id'));
            var children = [];
            $(this).find(options.items).each(function() {
                var id = $(this).find('a[data-toggle="tab"]').attr('href').replace('#', '');
                children.push(azexo_elements.get_element(id));
            });
            element.children = children;
            for (var i = 0; i < element.children.length; i++)
                element.children[i].parent = element;
            element.update_dom();
            azexo_elements.raiseEvent("update_sorting", ui);
        },
        click_add_tab: function(e) {
            e.data.object.add_tab();
            return false;
        },
        add_tab: function() {
            var child = new TabElement(this, false);
            child.update_dom();
            this.update_dom();
            $(this.dom_element).find('a[href="#' + child.id + '"]')[fp + 'tab']('show');
        },
        showed: function($, p, fp) {
            TabsElement.baseclass.prototype.showed.apply(this, arguments);
            $(this.dom_element).find('ul.' + p + 'nav-tabs li:first a')[fp + 'tab']('show');
        },
        render: function($, p, fp) {
            this.dom_element = $('<div class="az-element az-tabs ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
            var menu = '<ul class="' + p + 'nav ' + p + 'nav-tabs" role="tablist">';
            for (var i = 0; i < this.children.length; i++) {
                menu += '<li><a href="#' + this.children[i].id + '" role="tab" data-toggle="tab">' + this.children[i].attrs['title'] + '</a></li>';
            }
            menu += '</ul>';
            $(this.dom_element).append(menu);
            var content = '<div id="' + this.id + '" class="' + p + 'tab-content"></div>';
            this.dom_content_element = $(content).appendTo(this.dom_element);
            TabsElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function TabElement(parent, parse) {
        TabElement.baseclass.apply(this, arguments);
    }
    register_element('az_tab', true, TabElement);
    mixin(TabElement.prototype, {
        name: t('Tab'),
        params: [
            make_param_type({
                type: 'textfield',
                heading: t('Tab title'),
                param_name: 'title',
                value: t('Title')
            }),
        ].concat(TabElement.prototype.params),
        hidden: true,
        is_container: true,
        get_empty: function() {
            return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for this tabs element and for current tab element. ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-plus-sign"></span>' + t(' - add a new tab.') + ' ' + t('Tabs headers are draggable. You can enter tab title by click on this button: ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-pencil"></span></div></div>';
        },
        show_controls: function() {
            if (window.azexo_editor) {
                TabElement.baseclass.prototype.show_controls.apply(this, arguments);
                $(this.controls).find('.drag-and-drop').remove();
                $('<span class="control ' + p + 'btn ' + p + 'btn-primary">' + this.name + '</span>').prependTo(this.controls);
            }
        },
        get_my_shortcode: function() {
            return this.get_children_shortcode();
        },
        edited: function(attrs) {
            TabElement.baseclass.prototype.edited.apply(this, arguments);
            this.parent.update_dom();
            $('a[href="#' + this.id + '"]')[fp + 'tab']('show');
        },
        clone: function() {
            //TabElement.baseclass.prototype.clone.apply(this, arguments);
            var shortcode = TabElement.baseclass.prototype.get_my_shortcode.apply(this, arguments);
            $('#azexo-clipboard').html(btoa(encodeURIComponent(shortcode)));
            this.parent.paste(this.parent.children.length);
            this.parent.update_dom();
        },
        remove: function() {
            TabElement.baseclass.prototype.remove.apply(this, arguments);
            this.parent.update_dom();
        },
        render: function($, p, fp) {
            this.dom_element = $('<div id="' + this.id + '" class="az-element az-ctnr az-tab ' + p + 'tab-pane ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
            this.dom_content_element = this.dom_element;
            TabElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function AccordionElement(parent, parse) {
        AccordionElement.baseclass.apply(this, arguments);
        if (!parse) {
            this.add_toggle();
        }
    }
    register_animated_element('az_accordion', true, AccordionElement);
    mixin(AccordionElement.prototype, {
        name: t('Accordion'),
        icon: 'fa fa-bars',
        description: t('Bootstrap content accordion. Every toggle of this element can contain any number of any types of elements.'),
        category: t('Layout'),
        params: [
            make_param_type({
                type: 'dropdown',
                heading: t('Type'),
                param_name: 'type',
                value: {
                    'panel-default': t('Default'),
                    'panel-primary': t('Primary'),
                    'panel-success': t('Success'),
                    'panel-info': t('Info'),
                    'panel-warning': t('Warning'),
                    'panel-danger': t('Danger'),
                },
            }),
            make_param_type({
                type: 'checkbox',
                heading: t("Collapsed?"),
                param_name: 'collapsed',
                value: {
                    'yes': t("Yes, please"),
                },
            }),
        ].concat(AccordionElement.prototype.params),
        is_container: true,
        get_button: function() {
            return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'text-overflow" data-az-element="' + this.base + '" style="width:100%;"><i class="' + p + 'text-primary ' + this.icon + '"></i><div>' + this.name + '</div><div class="' + p + 'text-muted ' + p + 'small">' + this.description + '</div></div>';
        },
        show_controls: function() {
            if (window.azexo_editor) {
                AccordionElement.baseclass.prototype.show_controls.apply(this, arguments);
                $(this.controls).find('.add').remove();
                $(this.controls).find('.paste').remove();
                $('<button title="' + title("Add toggle") + '" class="control add-toggle ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon ' + p + 'glyphicon-plus-sign" > </button>').appendTo(this.controls).click({object: this}, this.click_add_toggle);
            }
        },
        update_sortable: function() {
            if (window.azexo_editor) {
                $(this.dom_element).sortable({
                    axis: 'y',
                    items: '> .az-toggle',
                    handle: '> .controls > .drag-and-drop',
                    update: this.update_sorting,
                    placeholder: 'az-sortable-placeholder',
                    forcePlaceholderSize: true,
                    over: function(event, ui) {
                        ui.placeholder.attr('class', ui.helper.attr('class'));
                        ui.placeholder.removeClass('ui-sortable-helper');
                        ui.placeholder.addClass('az-sortable-placeholder');
                    }
                });
            }
        },
        click_add_toggle: function(e) {
            e.data.object.add_toggle();
            return false;
        },
        add_toggle: function() {
            var child = new ToggleElement(this, false);
            child.update_dom();
            this.update_dom();
        },
        update_dom: function() {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].update_dom();
            }
            AccordionElement.baseclass.prototype.update_dom.apply(this, arguments);
        },
        showed: function($, p, fp) {
            AccordionElement.baseclass.prototype.showed.apply(this, arguments);
            $(this.dom_element).find('> .az-toggle > .' + p + 'in').removeClass(p + 'in');
            $(this.dom_element).find('> .az-toggle > .' + p + 'collapse:not(:first)')[fp + 'collapse']({
                'toggle': false,
                'parent': '#' + this.id
            });
            $(this.dom_element).find('> .az-toggle > .' + p + 'collapse:first')[fp + 'collapse']({
                'toggle': this.attrs['collapsed'] != 'yes',
                'parent': '#' + this.id
            });
        },
        render: function($, p, fp) {
            this.dom_element = $('<div id="' + this.id + '" class="az-element az-accordion ' + p + 'panel-group ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
            this.dom_content_element = this.dom_element;
            AccordionElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function ToggleElement(parent, parse) {
        ToggleElement.baseclass.apply(this, arguments);
    }
    register_element('az_toggle', true, ToggleElement);
    mixin(ToggleElement.prototype, {
        name: t('Toggle'),
        params: [
            make_param_type({
                type: 'textfield',
                heading: t('Toggle title'),
                param_name: 'title',
                value: t('Title')
            }),
        ].concat(ToggleElement.prototype.params),
        hidden: true,
        is_container: true,
        get_empty: function() {
            return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for this accordion element and for current toggle. ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-plus-sign"></span>' + t(' - add a new toggle. You can enter toggle title by click on this button: ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-pencil"></span></div></div>';
        },
        get_my_shortcode: function() {
            return this.get_children_shortcode();
        },
        clone: function() {
            //ToggleElement.baseclass.prototype.clone.apply(this, arguments);
            var shortcode = ToggleElement.baseclass.prototype.get_my_shortcode.apply(this, arguments);
            $('#azexo-clipboard').html(btoa(encodeURIComponent(shortcode)));
            this.parent.paste(this.parent.children.length);
        },
        render: function($, p, fp) {
            var type = p + 'panel-default';
            if (this.parent.attrs['type'] != '')
                type = this.parent.attrs['type'];
            this.dom_element = $('<div class="az-element az-toggle ' + p + 'panel ' + type + ' ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"><div class="' + p + 'panel-heading"><h4 class="' + p + 'panel-title"><a data-toggle="collapse" data-parent="#' + this.parent.id + '" href="#' + this.id + '">' + this.attrs['title'] + '</a></h4></div><div id="' + this.id + '" class="' + p + 'panel-collapse ' + p + 'collapse"><div class="' + p + 'panel-body az-ctnr"></div></div></div>');
            this.dom_content_element = $(this.dom_element).find('.' + p + 'panel-body');
            ToggleElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function CarouselElement(parent, parse) {
        CarouselElement.baseclass.apply(this, arguments);
        if (!parse) {
            this.add_slide();
        }
    }
    register_animated_element('az_carousel', true, CarouselElement);
    mixin(CarouselElement.prototype, {
        name: t('Carousel'),
        icon: 'fa fa-ellipsis-h',
        description: t('Content carousel. Every slide of this element can contain any number of any types of elements. It can be used for create classic content slider.'),
        category: t('Layout'),
        params: [
            make_param_type({
                type: 'integer_slider',
                heading: t('Number items'),
                param_name: 'items',
                min: '1',
                max: '10',
                value: '1',
            }),
            make_param_type({
                type: 'checkbox',
                heading: t('Options'),
                param_name: 'options',
                value: {
                    'navigation': t("Navigation"),
                    'auto_play': t("Auto play"),
                    'mouse': t("Mouse drag"),
                    'touch': t("Touch drag"),
                },
            }),
            make_param_type({
                type: 'dropdown',
                heading: t('Transition style'),
                param_name: 'transition',
                value: {
                    '': t('Default'),
                    'fade': t('fade'),
                    'backSlide': t('backSlide'),
                    'goDown': t('goDown'),
                    'fadeUp': t('fadeUp'),
                },
            }),
        ].concat(CarouselElement.prototype.params),
        is_container: true,
        show_settings_on_create: true,
        frontend_render: true,
        get_button: function() {
            return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'text-overflow" data-az-element="' + this.base + '" style="width:100%;"><i class="' + p + 'text-primary ' + this.icon + '"></i><div>' + this.name + '</div><div class="' + p + 'text-muted ' + p + 'small">' + this.description + '</div></div>';
        },
        show_controls: function() {
            if (window.azexo_editor) {
                CarouselElement.baseclass.prototype.show_controls.apply(this, arguments);
                $(this.controls).find('.add').remove();
                $(this.controls).find('.paste').remove();
                var element = this;
                $('<button title="' + title("Add slide") + '" class="control add-toggle ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon ' + p + 'glyphicon-plus-sign" > </button>').appendTo(this.controls).click({object: this}, this.click_add_slide);
            }
        },
        update_sortable: function() {
        },
        click_add_slide: function(e) {
            e.data.object.add_slide();
            return false;
        },
        add_slide: function() {
            var child = new SlideElement(this, true);
            child.update_dom();
            this.update_dom();
        },
        showed: function($, p, fp) {
            CarouselElement.baseclass.prototype.showed.apply(this, arguments);
            this.add_css('owl.carousel/owl-carousel/owl.carousel.css', 'owlCarousel' in $.fn, function() {
            });
            this.add_css('owl.carousel/owl-carousel/owl.theme.css', 'owlCarousel' in $.fn, function() {
            });
            this.add_css('owl.carousel/owl-carousel/owl.transitions.css', 'owlCarousel' in $.fn, function() {
            });
            var element = this;
            this.add_js({
                path: 'owl.carousel/owl-carousel/owl.carousel.js',
                loaded: 'owlCarousel' in $.fn,
                callback: function() {
                    //$(element.controls).detach();
                    var owl_carousel_refresh = function(owl) {
                        var userItems = null;
                        if ('userItems' in owl)
                            userItems = owl.userItems;
                        else
                            userItems = owl.$userItems;
                        var visibleItems = null;
                        if ('visibleItems' in owl)
                            visibleItems = owl.visibleItems;
                        else
                            visibleItems = owl.$visibleItems;
                        for (var i = 0; i < userItems.length; i++) {
                            if (_.indexOf(visibleItems, i) < 0) {
                                var item = userItems[i];
                                var id = $(item).attr('data-az-id');
                                var el = azexo_elements.get_element(id);
                                for (var j = 0; j < el.children.length; j++) {
                                    if ('trigger_start_out_animation' in el.children[j]) {
                                        el.children[j].trigger_start_out_animation();
                                    }
                                }
                            }
                        }
                        for (var i = 0; i < visibleItems.length; i++) {
                            if (visibleItems[i] < userItems.length) {
                                var item = userItems[visibleItems[i]];
                                var id = $(item).attr('data-az-id');
                                var el = azexo_elements.get_element(id);
                                for (var j = 0; j < el.children.length; j++) {
                                    if ('trigger_start_in_animation' in el.children[j]) {
                                        el.children[j].trigger_start_in_animation();
                                    }
                                }
                            }
                        }
                    }
                    $(element.dom_content_element).owlCarousel({
                        singleItem: (element.attrs['items'] == '1'),
                        items: element.attrs['items'],
                        navigation: _.indexOf(element.attrs['options'].split(','), 'navigation') >= 0,
                        autoPlay: _.indexOf(element.attrs['options'].split(','), 'auto_play') >= 0,
                        mouseDrag: _.indexOf(element.attrs['options'].split(','), 'mouse') >= 0,
                        touchDrag: _.indexOf(element.attrs['options'].split(','), 'touch') >= 0,
                        transitionStyle: element.attrs['transition'] == '' ? false : element.attrs['transition'],
                        stopOnHover: true,
                        afterAction: function() {
                            owl_carousel_refresh(this.owl);
                        },
                        beforeMove: function() {
                        },
                        afterMove: function() {
                        },
                        startDragging: function() {
                        },
                    });
                    owl_carousel_refresh(element.dom_content_element.data('owlCarousel'));
                    //$(element.dom_element).prepend(element.controls);
                }});
        },
        render: function($, p, fp) {
            this.dom_element = $('<div id="' + this.id + '" class="az-element az-carousel ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
            this.dom_content_element = $('<div></div>').appendTo(this.dom_element);
            CarouselElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function SlideElement(parent, parse) {
        SlideElement.baseclass.apply(this, arguments);
    }
    register_element('az_slide', true, SlideElement);
    mixin(SlideElement.prototype, {
        name: t('Slide'),
        params: [
        ].concat(SlideElement.prototype.params),
        hidden: true,
        frontend_render: true,
        is_container: true,
        get_empty: function() {
            if (this.id == this.parent.children[0].id)
                return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for this carousel element and for current slide. ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-plus-sign"></span>' + t(' - add a new slide.') + '</div></div>';
            else
                return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for current slide of this carousel element.') + '</div></div>';
        },
        show_controls: function() {
            if (window.azexo_editor) {
                SlideElement.baseclass.prototype.show_controls.apply(this, arguments);
                $(this.controls).find('.clone').remove();
                $(this.controls).find('.drag-and-drop').remove();
                $('<span class="control ' + p + 'btn ' + p + 'btn-primary">' + this.name + '</span>').prependTo(this.controls);
            }
        },
        get_my_shortcode: function() {
            return this.get_children_shortcode();
        },
        edited: function() {
            SlideElement.baseclass.prototype.edited.apply(this, arguments);
            this.parent.update_dom();
        },
        render: function($, p, fp) {
            var type = 'panel-default';
            if (this.parent.attrs['type'] != '')
                type = this.parent.attrs['type'];
            this.dom_element = $('<div class="az-element az-slide ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
            this.dom_content_element = this.dom_element;
            SlideElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function ContainerElement(parent, parse) {
        ContainerElement.baseclass.apply(this, arguments);
        this.rendered = false;
        this.loaded_container = null;
        this.js = {};
        this.css = {};
    }
    register_animated_element('az_container', true, ContainerElement);
    mixin(ContainerElement.prototype, {
        name: t('Container'),
        icon: 'fa fa-archive',
        description: t('AJAX loaded content from server. Content can be edited and saved to server.'),
        category: t('Layout'),
        params: [
            make_param_type({
                type: 'container',
                heading: t('Container'),
                param_name: 'container',
                description: t('Type and name used as identificator to save container on server.'),
                value: '/',
            }),
        ].concat(ContainerElement.prototype.params),
        show_settings_on_create: true,
        is_container: true,
        hidden: ! window.azexo_online,
        get_button: function() {
            return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'text-overflow" data-az-element="' + this.base + '" style="width:100%;"><i class="' + p + 'text-primary ' + this.icon + '"></i><div>' + this.name + '</div><div class="' + p + 'text-muted ' + p + 'small">' + this.description + '</div></div>';
        },
        get_empty: function() {
            return '<div class="az-empty"><div class="top ' + p + 'well"><strong>' + t('Click to put an element here.') + '</strong></div><div class="top-right ' + p + 'well"><h1>↗</h1><span class="' + p + 'glyphicon ' + p + 'glyphicon-eye-open"></span>' + t(' - toggle editor helpers.') + ' <span class="' + p + 'glyphicon ' + p + 'glyphicon-play-circle"></span>' + t(' - toggle animation engine to not hinder editing.') + ' <span class="' + p + 'glyphicon ' + p + 'glyphicon-save"></span>' + t(' - save results of editing on server.') + '</div></div>';
        },
        show_controls: function() {
            if (window.azexo_editor) {
                var element = this;
                ContainerElement.baseclass.prototype.show_controls.apply(this, arguments);
                if (this.parent == null) {
                    $('<button title="' + title("Toggle editor") + '" class="control toggle-editor ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-eye-open" > </button>').appendTo(this.controls).click(function() {
                        $(element.dom_element).toggleClass('azexo-editor');
                        return false;
                    });
                    $('<button title="' + title("Toggle animations") + '" class="control toggle-animations ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-play-circle" > </button>').appendTo(this.controls).click(function() {
                        $(element.dom_element).toggleClass('azexo-animations-disabled');
                        return false;
                    });
                    $(this.controls).removeClass(p + 'btn-group-xs');
                    $(this.controls).find('.edit').remove();
                    $(this.controls).find('.copy').remove();
                    $(this.controls).find('.clone').remove();
                    $(this.controls).find('.remove').remove();
                    $(this.controls).find('.scroll-animation').remove();
                    $(this.controls).find('.drag-and-drop').attr('title', '');
                    $(this.controls).find('.drag-and-drop').removeClass(p + 'glyphicon');
                    $(this.controls).find('.drag-and-drop').removeClass(p + 'glyphicon-move');
                    $(this.controls).find('.drag-and-drop').removeClass('drag-and-drop');
                }
                $('<button title="' + title("Save container") + '" class="control save-container ' + p + 'btn ' + p + 'btn-success ' + p + 'glyphicon ' + p + 'glyphicon-save" > </button>').appendTo(this.controls).click({object: this}, this.click_save_container);
            }
        },
        get_my_shortcode: function() {
            return this.get_children_shortcode();
        },
        get_container_html: function() {
            function get_object_method_js(object, method, own) {
                if (own) {
                    if (!object.hasOwnProperty(method))
                        return '';
                }
                return method + ': ' + object[method].toString() + ",\n";
            }
            function get_object_property_js(object, property, own) {
                if (own) {
                    if (!object.hasOwnProperty(property))
                        return '';
                }
                return property + ': ' + JSON.stringify(object[property]) + ",\n";
            }
            function get_object_js(object, own) {
                var js = '{';
                for (var key in object) {
                    if (own) {
                        if (!object.hasOwnProperty(key))
                            continue;
                    }
                    if ($.isFunction(object[key])) {
                        js += get_object_method_js(object, key, own);
                    } else {
                        js += get_object_property_js(object, key, own);
                    }
                }
                js += '}';
                return js;
            }
            function get_class_method_js(class_function, method, own) {
                if (own) {
                    if (!class_function.prototype.hasOwnProperty(method))
                        return '';
                }
                return class_function.name + '.prototype.' + method + '=' + class_function.prototype[method].toString() + "\n";
            }
            function get_class_property_js(class_function, property, own) {
                if (own) {
                    if (!class_function.prototype.hasOwnProperty(property))
                        return '';
                }
                return class_function.name + '.prototype.' + property + '=' + JSON.stringify(class_function.prototype[property]) + ";\n";
            }
            function get_class_js(class_function, own) {
                var js = '';
                js += class_function.toString() + "\n";
                if ('baseclass' in class_function) {
                    js += extend.name + "(" + class_function.name + ", " + class_function.baseclass.name + ");\n";
                }
                for (var key in class_function.prototype) {
                    if (own) {
                        if (!class_function.prototype.hasOwnProperty(key))
                            continue;
                    }
                    if ($.isFunction(class_function.prototype[key])) {
                        js += get_class_method_js(class_function, key, own);
                    } else {
                        js += get_class_property_js(class_function, key, own);
                    }
                }
                return js;
            }
            function get_element_params_js(class_function) {
                var params = [];
                for (var i = 0; i < class_function.prototype.params.length; i++) {
                    var param = {};
                    param.param_name = class_function.prototype.params[i].param_name;
                    param.value = '';
                    if ('value' in class_function.prototype.params[i] && _.isString(class_function.prototype.params[i].value))
                        param.value = class_function.prototype.params[i].value;
                    param.safe = class_function.prototype.params[i].safe;
                    params.push(param);
                }
                return class_function.name + '.prototype.params=' + JSON.stringify(params) + ";\n";
            }
            function get_element_object_js(object, own) {
                var element = {};
                element.base = object.base;
                if ('showed' in object)
                    element.showed = object.showed;
                element.params = [];
                for (var i = 0; i < object.params.length; i++) {
                    if ('value' in object.params[i] && _.isString(object.params[i].value)) {
                        var param = {};
                        param.param_name = object.params[i].param_name;
                        param.value = object.params[i].value;
                        element.params.push(param);
                    } else {
                        var param = {};
                        param.param_name = object.params[i].param_name;
                        param.value = '';
                        element.params.push(param);
                    }
                }
                if (object.hasOwnProperty('is_container'))
                    element.is_container = object.is_container;
                if (object.hasOwnProperty('has_content'))
                    element.has_content = object.has_content;
                if (object.hasOwnProperty('frontend_render')) {
                    element.frontend_render = object.frontend_render;
                    if (element.frontend_render) {
                        element.render = object.render;
                        if (object.hasOwnProperty('recursive_render'))
                            element.recursive_render = object.recursive_render;
                    }
                }
                return get_object_js(element, own);
            }
            function get_contained_elements(element) {
                var bases = {};
                bases[element.base] = true;
                for (var i = 0; i < element.children.length; i++) {
                    var b = get_contained_elements(element.children[i]);
                    $.extend(bases, b);
                }
                return bases;
            }
            function check_attributes(element) {
                var attributes = {};
                if ('an_scenes' in element.attrs && element.attrs['an_scenes'] != '') {
                    attributes['an_scenes'] = true;
                }
                if ('an_start' in element.attrs && element.attrs['an_start'] != '' && element.attrs['an_start'] != 'no') {
                    attributes['an_start'] = true;
                }
                for (var i = 0; i < element.children.length; i++) {
                    $.extend(attributes, check_attributes(element.children[i]));
                }
                return attributes;
            }
            function check_dinamic(element) {
                if (element.constructor.prototype.hasOwnProperty('showed')) {
                    var exception = false;
                    if('is_cms_element' in element)
                        exception = true;
                    switch (element.base) {                        
                        case 'az_container':
                            if(element.parent == null)
                                exception = true;
                            break;
                        case 'az_image':
                            if (element.attrs['img_link_large'] != 'yes' 
                                && element.attrs['adipoli_start'] == 'none'
                                && element.attrs['adipoli_hover'] == 'none'
                                && element.attrs['splits'] != 'yes')
                                exception = true;
                            break;
                        case 'az_row':
                            if (element.attrs['effect'] == '')
                                exception = true;
                            break;
                        default:
                            break;
                    }
                    if(!exception)
                        return true;
                }
                for (var i = 0; i < element.children.length; i++) {
                    if (check_dinamic(element.children[i])) {
                        return true;
                    }
                }
                return false;
            }
            function get_hover_styles(element) {
                var hover_styles = '';
                if(element.attrs['hover_style'] != '')
                    hover_styles = "<style>.hover-style-" + element.id + ":hover { " + element.attrs['hover_style'] + " } </style>";
                for (var i = 0; i < element.children.length; i++) {
                    hover_styles = hover_styles + get_hover_styles(element.children[i]);
                }
                return hover_styles;
            }
            var element = this;
            var bases = get_contained_elements(element);
            var attributes = check_attributes(element);
            function get_javascript() {
                var javascript = "(function(" + jquery_name + ") {\n";
                javascript += "if('azexo_backend' in window) return;\n";
                javascript += "var " + azexo_frontend_name + " = true;\n";
                javascript += "var " + p_name + " = '" + p + "';var " + fp_name + " = '" + fp + "';\n";
                javascript += t.toString() + "\n";
                javascript += lang.toString() + "\n";
                javascript += azexo_load_container.toString() + "\n";

                javascript += extend.toString() + "\n";
                javascript += mixin.toString() + "\n";
                javascript += substr_replace.toString() + "\n";
                javascript += unescapeParam.toString() + "\n";
                javascript += jquery_name + ".fn.closest_descendents = " + $.fn.closest_descendents.toString() + " \n";


                javascript += BaseParamType.toString() + "\n";
                javascript += BaseParamType.name + ".prototype.safe = true;\n";
                javascript += BaseParamType.name + ".prototype.param_types = {};\n";

                javascript += make_param_type.toString() + "\n";

                javascript += 'window.azexo_add_css=' + window.azexo_add_css.toString() + "\n";
                javascript += 'window.azexo_add_js=' + window.azexo_add_js.toString() + "\n";
                javascript += 'window.azexo_add_js_list=' + window.azexo_add_js_list.toString() + "\n";
                javascript += "var " + azexo_js_waiting_callbacks_name + " = {};\n";
                javascript += "var " + azexo_loaded_js_name + " = {};\n";
                javascript += 'window.azexo_add_external_js=' + window.azexo_add_external_js.toString() + "\n";

                javascript += AZEXOElements.toString() + "\n";
                javascript += AZEXOElements.name + ".prototype.elements_instances = {};\n";
                javascript += AZEXOElements.name + ".prototype.elements_instances_by_an_name = {};\n";
                javascript += get_class_method_js(AZEXOElements, 'get_element', true);
                javascript += get_class_method_js(AZEXOElements, 'delete_element', true);
                javascript += get_class_method_js(AZEXOElements, 'add_element', true);
                javascript += AZEXOElements.name + ".prototype._eventList = {};\n";
                javascript += get_class_method_js(AZEXOElements, '_getEvent', false);
                javascript += get_class_method_js(AZEXOElements, 'attachEvent', false);
                javascript += get_class_method_js(AZEXOElements, 'detachEvent', false);
                javascript += get_class_method_js(AZEXOElements, 'raiseEvent', false);
                javascript += get_class_method_js(AZEXOElements, '_getEventHandler', false);

                javascript += BaseElement.toString() + "\n";
                javascript += BaseElement.name + ".prototype.p = '" + p + "';\n";
                javascript += BaseElement.name + ".prototype.fp = '" + fp + "';\n";
                javascript += BaseElement.name + ".prototype.elements = {};\n";
                javascript += BaseElement.name + ".prototype.tags = {};\n";
                javascript += get_element_params_js(BaseElement);
                javascript += get_class_method_js(BaseElement, 'showed', true);
                javascript += get_class_method_js(BaseElement, 'render', true);
                javascript += get_class_method_js(BaseElement, 'recursive_render', true);
                javascript += get_class_method_js(BaseElement, 'replace_render', true);                
                javascript += get_class_method_js(BaseElement, 'update_dom', true);
                javascript += get_class_method_js(BaseElement, 'attach_children', true);
                javascript += get_class_method_js(BaseElement, 'detach_children', true);
                javascript += get_class_method_js(BaseElement, 'recursive_showed', true);
                javascript += get_class_method_js(BaseElement, 'parse_attrs', true);
                javascript += get_class_method_js(BaseElement, 'parse_html', true);
                javascript += get_class_method_js(BaseElement, 'add_css', true);
                javascript += get_class_method_js(BaseElement, 'add_js_list', true);
                javascript += get_class_method_js(BaseElement, 'add_js', true);
                javascript += get_class_method_js(BaseElement, 'add_external_js', true);
                javascript += get_class_method_js(BaseElement, 'get_my_container', true);
                javascript += register_element.toString() + "\n";
                javascript += UnknownElement.toString() + "\n";
                javascript += register_element.name + "('az_unknown', true, " + UnknownElement.name + ");\n";

                javascript += "window.azexo_baseurl = '" + window.azexo_baseurl + "';\n";
                if ('ajaxurl' in window)
                    javascript += "window.ajaxurl = '" + window.ajaxurl + "';\n";
                if ('azexo_lang' in window)
                    javascript += "window.azexo_lang = '" + window.azexo_lang + "';\n";
                if ('recaptcha_publickey' in window)
                    javascript += "window.recaptcha_publickey = '" + window.recaptcha_publickey + "';\n";
                javascript += "var window.azexo_online = (window.location.protocol == 'http:' || window.location.protocol == 'https:');\n";
                javascript += "var " + azexo_elements_name + " = new " + AZEXOElements.name + "();\n";
                javascript += "var " + scroll_magic_name + " = null;\n";
                javascript += "window.azexo_editor = false;\n";
                javascript += "var " + azexo_containers_name + " = [];\n";
                javascript += "var " + azexo_containers_loaded_name + " = {};\n";
                javascript += connect_container.toString() + "\n";
                var type = element.attrs['container'].split('/')[0];
                var name = element.attrs['container'].split('/')[1];
                javascript += jquery_name + "(document).ready(function(){" + connect_container.name + "(" + jquery_name + "('[data-az-type=\"" + type + "\"][data-az-name=\"" + name + "\"]'));});\n";

                javascript += AnimatedElement.toString() + "\n";
                javascript += extend.name + "(" + AnimatedElement.name + ", " + BaseElement.name + ");\n";
                javascript += get_element_params_js(AnimatedElement);
                if ('an_start' in attributes) {
                    javascript += get_class_method_js(AnimatedElement, 'set_in_timeout', true);
                    javascript += get_class_method_js(AnimatedElement, 'start_in_animation', true);
                    javascript += get_class_method_js(AnimatedElement, 'set_out_timeout', true);
                    javascript += get_class_method_js(AnimatedElement, 'start_out_animation', true);
                    javascript += get_class_method_js(AnimatedElement, 'clear_animation', true);
                    javascript += get_class_method_js(AnimatedElement, 'end_animation', true);
                    javascript += get_class_method_js(AnimatedElement, 'trigger_start_in_animation', true);
                    javascript += get_class_method_js(AnimatedElement, 'trigger_start_out_animation', true);
                    javascript += get_class_method_js(AnimatedElement, 'css_animation', true);
                }
                if ('an_scenes' in attributes)
                    javascript += get_class_method_js(AnimatedElement, 'update_scroll_animation', true);
                if ('an_start' in attributes || 'an_scenes' in attributes)
                    javascript += get_class_method_js(AnimatedElement, 'showed', true);
                javascript += register_animated_element.toString() + "\n";

                javascript += FormDataElement.toString() + "\n";
                javascript += extend.name + "(" + FormDataElement.name + ", " + AnimatedElement.name + ");\n";
                javascript += FormDataElement.name + ".prototype.form_elements = {};\n";
                javascript += register_form_data_element.toString() + "\n";


                if (RowElement.prototype.base in bases) {
                    javascript += RowElement.toString() + "\n";
                    javascript += register_animated_element.name + "('" + RowElement.prototype.base + "', true, " + RowElement.name + ");\n";
                    javascript += get_class_method_js(RowElement, 'showed', true);
                    javascript += RowElement.name + ".prototype.set_columns = function(columns){};\n";
                    javascript += ColumnElement.toString() + "\n";
                    javascript += register_element.name + "('" + ColumnElement.prototype.base + "', true, " + ColumnElement.name + ");\n";
                    javascript += get_class_method_js(ColumnElement, 'showed', true);
                }

                if (GridElement.prototype.base in bases) {
                    javascript += GridElement.toString() + "\n";
                    javascript += register_animated_element.name + "('" + GridElement.prototype.base + "', true, " + GridElement.name + ");\n";
                    javascript += get_element_params_js(GridElement);
                    javascript += GridElement.name + ".prototype.attach_events = function(){};\n";
                    javascript += get_class_method_js(GridElement, 'showed', true);
                    javascript += get_class_method_js(GridElement, 'render', true);
                    javascript += ItemElement.toString() + "\n";
                    javascript += register_element.name + "('" + ItemElement.prototype.base + "', true, " + ItemElement.name + ");\n";
                    javascript += get_element_params_js(ItemElement);
                    javascript += get_class_method_js(ItemElement, 'showed', true);
                    javascript += get_class_method_js(ItemElement, 'render', true);
                }

                if (LayersElement.prototype.base in bases) {
                    javascript += LayersElement.toString() + "\n";
                    javascript += register_animated_element.name + "('" + LayersElement.prototype.base + "', true, " + LayersElement.name + ");\n";
                }

                if (TabsElement.prototype.base in bases) {
                    javascript += TabsElement.toString() + "\n";
                    javascript += register_animated_element.name + "('" + TabsElement.prototype.base + "', true, " + TabsElement.name + ");\n";
                    javascript += get_element_params_js(TabsElement);
                    javascript += get_class_method_js(TabsElement, 'showed', true);
                    javascript += get_class_method_js(TabsElement, 'render', true);
                    javascript += TabElement.toString() + "\n";
                    javascript += register_element.name + "('" + TabElement.prototype.base + "', true, " + TabElement.name + ");\n";
                    javascript += get_element_params_js(TabElement);
                    javascript += get_class_method_js(TabElement, 'render', true);
                }

                if (AccordionElement.prototype.base in bases) {
                    javascript += AccordionElement.toString() + "\n";
                    javascript += register_animated_element.name + "('" + AccordionElement.prototype.base + "', true, " + AccordionElement.name + ");\n";
                    javascript += get_element_params_js(AccordionElement);
                    javascript += get_class_method_js(AccordionElement, 'showed', true);
                    javascript += get_class_method_js(AccordionElement, 'render', true);
                    javascript += ToggleElement.toString() + "\n";
                    javascript += register_element.name + "('" + ToggleElement.prototype.base + "', true, " + ToggleElement.name + ");\n";
                    javascript += get_element_params_js(ToggleElement);
                    javascript += get_class_method_js(ToggleElement, 'render', true);
                    javascript += get_class_method_js(ToggleElement, 'showed', true);
                }

                if (CarouselElement.prototype.base in bases) {
                    javascript += CarouselElement.toString() + "\n";
                    javascript += register_animated_element.name + "('" + CarouselElement.prototype.base + "', true, " + CarouselElement.name + ");\n";
                    javascript += get_element_params_js(CarouselElement);
                    javascript += CarouselElement.name + ".prototype.frontend_render = true;\n";
                    javascript += get_class_method_js(CarouselElement, 'showed', true);
                    javascript += get_class_method_js(CarouselElement, 'render', true);
                    javascript += SlideElement.toString() + "\n";
                    javascript += register_element.name + "('" + SlideElement.prototype.base + "', true, " + SlideElement.name + ");\n";
                    javascript += SlideElement.name + ".prototype.frontend_render = true;\n";
                    javascript += get_class_method_js(SlideElement, 'showed', true);
                    javascript += get_class_method_js(SlideElement, 'render', true);
                }

                if (ContainerElement.prototype.base in bases) {
                    javascript += ContainerElement.toString() + "\n";
                    javascript += register_animated_element.name + "('" + ContainerElement.prototype.base + "', true, " + ContainerElement.name + ");\n";
                    javascript += get_element_params_js(ContainerElement);
                    javascript += get_class_method_js(ContainerElement, 'showed', true);
                    javascript += get_class_method_js(ContainerElement, 'load_container', true);
                    javascript += get_class_method_js(ContainerElement, 'update_dom', true);
                    javascript += get_class_method_js(ContainerElement, 'render', true);
                    javascript += get_class_method_js(ContainerElement, 'recursive_render', true);
                }

                if (ScrollMenuElement.prototype.base in bases) {
                    javascript += ScrollMenuElement.toString() + "\n";
                    javascript += register_element.name + "('" + ScrollMenuElement.prototype.base + "', false, " + ScrollMenuElement.name + ");\n";
                    javascript += get_class_method_js(ScrollMenuElement, 'showed', true);
                }

                if (FormElement.prototype.base in bases) {
                    javascript += azexo_submit_form.toString() + "\n";
                    javascript += FormElement.toString() + "\n";
                    javascript += register_animated_element.name + "('" + FormElement.prototype.base + "', true, " + FormElement.name + ");\n";
                    javascript += get_class_method_js(FormElement, 'showed', true);
                    javascript += azexo_get_recaptcha_publickey.toString() + "\n";                    
                }

                if ('azexo_elements' in window) {
                    javascript += "window.azexo_elements = [];\n";
                    for (var i = 0; i < window.azexo_elements.length; i++) {
                        if (window.azexo_elements[i].base in bases)
                            javascript += "window.azexo_elements.push(" + get_element_object_js(window.azexo_elements[i], true) + ");\n";
                    }
                }
                if ('azexo_form_elements' in window) {
                    javascript += "window.azexo_form_elements = [];\n";
                    for (var i = 0; i < window.azexo_form_elements.length; i++) {
                        if (window.azexo_form_elements[i].base in bases)
                            javascript += "window.azexo_form_elements.push(" + get_element_object_js(window.azexo_form_elements[i], true) + ");\n";
                    }
                }
                if ('azexo_extend' in window) {
                    javascript += "window.azexo_extend = [];\n";
                    for (var i = 0; i < window.azexo_extend.length; i++) {
                        javascript += "window.azexo_extend.push(" + get_object_js(window.azexo_extend[i], true) + ");\n";
                    }
                }

                javascript += create_azexo_elements.toString() + "\n";
                javascript += create_azexo_elements.name + "();\n";
                javascript += create_azexo_form_elements.toString() + "\n";
                javascript += create_azexo_form_elements.name + "();\n";
                javascript += make_azexo_extend.toString() + "\n";
                javascript += make_azexo_extend.name + "();\n";
//                javascript += create_template_elements.toString() + "\n";
//                javascript += create_template_elements.name + "();\n";
//                javascript += create_cms_elements.toString() + "\n";
//                javascript += create_cms_elements.name + "();\n";

                javascript += "})(window.jQuery);\n";
                return javascript;
            }
            function get_js(element) {
                var html = '';
//                if (p == 'ax-') {
//                    element.js[window.azexo_baseurl + 'azexo-bootstrap.min.js'] = true;
//                }
//                element.js[window.azexo_baseurl + 'js/underscore-min.js'] = true;
//                element.js[window.azexo_baseurl + 'js/smoothscroll.js'] = true;
//                element.js[window.azexo_baseurl + 'jquery-waypoints/waypoints.min.js'] = true;
                for (var url in element.js)
                    html += '<script src="' + url + '"></script>\n';
                return html;
            }
            function get_css(element) {
                var html = '';
//                if (p == 'ax-') {
//                    element.css[window.azexo_baseurl + 'azexo-bootstrap.min.css'] = true;
//                }
//                element.css[window.azexo_baseurl + 'azexo_composer.css'] = true;
                for (var url in element.css)
                    html += '<link rel="stylesheet" type="text/css" href="' + url + '">\n';
                return html;
            }
            this.recursive_update_data();
            this.recursive_clear_animation();
            var dom = $('<div>' + $(this.dom_content_element).html() + '</div>');
            $(dom).find('.az-element > .controls').remove();
            $(dom).find('> .controls').remove();
            $(dom).find('.az-empty').remove();
            $(dom).find('.ui-resizable-e').remove();
            $(dom).find('.ui-resizable-s').remove();
            $(dom).find('.ui-resizable-se').remove();
            $(dom).find('.ui-draggable').removeClass('ui-draggable');
            $(dom).find('.ui-resizable').removeClass('ui-resizable');
            $(dom).find('.ui-sortable').removeClass('ui-sortable');
            $(dom).find('.az-element.az-container > .az-ctnr').empty();
            //$(dom).find('[data-az-id]').removeAttr('data-az-id'); 
            
            var javascript = '';
            if(check_dinamic(element) || 'an_start' in attributes || 'an_scenes' in attributes)
                javascript = "<script type=\"text/javascript\">\n//<![CDATA[\n" + get_javascript() + "//]]>\n</script>\n";
            return get_css(element) + get_hover_styles(element) + get_js(element) + javascript + $(dom).html();
        },
        click_save_container: function(e) {
            e.data.object.save_container();
            return false;
        },
        save_container: function() {
            var element = this;
            if ('html_content' in this || true) {
                azexo_add_js({
                    path: 'js/json2.min.js',
                    loaded: 'JSON' in window,
                    callback: function() {
                        var html = element.get_container_html();
                        azexo_save_container(element.attrs['container'].split('/')[0], element.attrs['container'].split('/')[1], html);
                    }
                });
            } else {
                if (this.attrs['container'] != '') {
                    var shortcode = this.get_children_shortcode();
                    azexo_save_container(this.attrs['container'].split('/')[0], this.attrs['container'].split('/')[1], shortcode);
                }
            }
        },
        load_container: function() {
            var element = this;
            if (this.attrs['container'] != '') {
                azexo_load_container(this.attrs['container'].split('/')[0], this.attrs['container'].split('/')[1], function(shortcode) {
                    var match = /^\s*\<[\s\S]*\>\s*$/.exec(shortcode);
                    if (match) {
                        element.loaded_container = element.attrs['container'];
                        $(shortcode).appendTo(element.dom_content_element);
                        element.parse_html(element.dom_content_element);
                        $(element.dom_element).attr('data-az-id', element.id);
                        element.html_content = true;
                        for (var i = 0; i < element.children.length; i++) {
                            element.children[i].recursive_render();
                        }
                        element.dom_content_element.empty();
                        if (window.azexo_editor) {
                            element.show_controls();
                            element.update_sortable();
                        }
                        element.attach_children();
                        for (var i = 0; i < element.children.length; i++) {
                            element.children[i].recursive_showed();
                        }
                        $(document).trigger('scroll');
                    } else {
                        if (!azexo_frontend) {
                            element.loaded_container = element.attrs['container'];
                            element.parse_shortcode(shortcode);

                            $(element.dom_element).attr('data-az-id', element.id);
                            if (window.azexo_editor) {
                                element.show_controls();
                                element.update_sortable();
                            }
                            for (var i = 0; i < element.children.length; i++) {
                                element.children[i].recursive_render();
                            }
                            element.attach_children();
                            if (element.parent != null) {
                                element.parent.update_dom();
                            }
                            for (var i = 0; i < element.children.length; i++) {
                                element.children[i].recursive_showed();
                            }
                            $(document).trigger('scroll');
                        }
                    }
                });
            }
        },
        clone: function() {
            ContainerElement.baseclass.prototype.clone.apply(this, arguments);
            this.rendered = true;
        },
        recursive_render: function() {
            if (azexo_frontend) {
                this.render($, p, fp);
                this.children = [];
            } else {
                ContainerElement.baseclass.prototype.recursive_render.apply(this, arguments);
            }
            if (window.azexo_editor) {
                this.show_controls();
                this.update_sortable();
            }
        },
        update_dom: function() {
            if (this.loaded_container != this.attrs['container']) {
                this.children = [];
                $(this.dom_content_element).empty();
                this.rendered = false;
                if (this.parent != null) {
                    ContainerElement.baseclass.prototype.update_dom.apply(this, arguments);
                }
            }
        },
        showed: function($, p, fp) {
            ContainerElement.baseclass.prototype.showed.apply(this, arguments);
            var element = this;
            this.add_js({
                path: 'jquery-waypoints/waypoints.min.js',
                loaded: 'waypoint' in $.fn,
                callback: function() {
                    $(element.dom_element).waypoint(function(direction) {
                        if (!element.rendered) {
                            element.rendered = true;
                            element.load_container();
                        }
                    }, {offset: '100%', triggerOnce: true});
                    $(document).trigger('scroll');
                }});
        },
        render: function($, p, fp) {
            this.dom_element = $('<div class="az-element az-container"><div class="az-ctnr"></div></div>');
            this.dom_content_element = $(this.dom_element).find('.az-ctnr');
            ContainerElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    RowElement.prototype.params.push(make_param_type({
        type: 'textfield',
        heading: t('Menu item title'),
        param_name: 'menu_item_title',
        description: t('Title which will be used in scroll menu.'),
        tab: t('Menu'),
    }));
    function ScrollMenuElement(parent, parse) {
        ScrollMenuElement.baseclass.apply(this, arguments);
        this.menu_items = {};
        for (var id in azexo_elements.elements_instances) {
            var el = azexo_elements.elements_instances[id];
            if (el instanceof RowElement) {
                if (el.attrs['menu_item_title'] != '') {
                    this.menu_items[id] = el.attrs['menu_item_title'];
                }
            }
        }
        var element = this;
        var add_update_element = function(sender, id) {
            $('body')[fp + 'scrollspy']({
                target: '#' + element.id + '.navbar-collapse',
                offset: element.navbar_height,
            });
//            $('body')[fp+'scrollspy']('refresh');
            var el = azexo_elements.get_element(id);
            if (el instanceof RowElement) {
                if (el.attrs['menu_item_title'] != '') {
                    element.menu_items[id] = el.attrs['menu_item_title'];
                    element.replace_render();
                    element.showed($, p, fp);
                } else {
                    if (id in element.menu_items) {
                        delete element.menu_items[id];
                        element.replace_render();
                        element.showed($, p, fp);
                    }
                }
            }
        };
        azexo_elements.attachEvent("add_element", function(sender, data) {
            add_update_element(sender, data.id)
        });
        azexo_elements.attachEvent("edited_element", add_update_element);
        azexo_elements.attachEvent("delete_element",
                function(sender, id) {
                    $('body')[fp + 'scrollspy']({
                        target: '#' + element.id + '.navbar-collapse',
                        offset: element.navbar_height,
                    });
//                    $('body')[fp+'scrollspy']('refresh');
                    var el = azexo_elements.get_element(id);
                    if (el instanceof RowElement) {
                        delete element.menu_items[id];
                        element.replace_render();
                        element.showed($, p, fp);
                    }
                }
        );
        azexo_elements.attachEvent("update_sorting",
                function(sender, ui) {
                    $('body')[fp + 'scrollspy']({
                        target: '#' + element.id + '.navbar-collapse',
                        offset: element.navbar_height,
                    });
//                    $('body')[fp+'scrollspy']('refresh');
                    var id = $(ui.item).closest('[data-az-id]').attr('data-az-id');
                    var el = azexo_elements.get_element(id);
                    if (element.id == id) {
                        $(el.dom_element).find('.' + p + 'navbar')[fp + 'affix']({
                            offset: {
                                top: $(el.dom_element).find('.' + p + 'navbar').offset().top,
                                bottom: 0,
                            }
                        });
                    }
                }
        );
    }
    register_element('az_scroll_menu', false, ScrollMenuElement);
    mixin(ScrollMenuElement.prototype, {
        name: t('Scroll Menu'),
        icon: 'fa fa-sitemap',
        description: t('One page scroll menu'),
        params: [
            make_param_type({
                type: 'image',
                heading: t('Logo'),
                param_name: 'logo',
                description: t('Select image from media library.'),
            }),
            make_param_type({
                type: 'link',
                heading: t('Logo link'),
                param_name: 'logo_link',
            }),
        ].concat(ScrollMenuElement.prototype.params),
        showed: function($, p, fp) {
            this.navbar_height = $(this.dom_element).find('.' + p + 'navbar').height();
            ScrollMenuElement.baseclass.prototype.showed.apply(this, arguments);
            var element = this;
            this.add_js({
                path: 'scrollTo/jquery.scrollTo.min.js',
                loaded: 'scrollTo' in $.fn,
                callback: function() {
                    $('#' + element.id + ' ul li a').unbind('click');
                    $('#' + element.id + ' ul li a').bind('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $.scrollTo(this.hash, 1000);
                        return false;
                    });
                }
            });
            if (element.dom_element != null) {
                $('body')[fp + 'scrollspy']({
                    target: '#' + element.id + '.navbar-collapse',
                    offset: element.navbar_height,
                });
                $(element.dom_element).find('.' + p + 'navbar')[fp + 'affix']({
                    offset: {
                        top: $(element.dom_element).find('.' + p + 'navbar').offset().top,
//                        offset: {top: $(element.dom_element).find('.'+p+'navbar').height()},
                        bottom: 0,
                    }
                }).on('affix.' + fp + 'bs.affix resize', function() {
                    $(element.dom_element).height($(element.dom_element).find('.' + p + 'navbar').height());
                    $('body')[fp + 'scrollspy']({
                        target: '#' + element.id + '.navbar-collapse',
                        offset: element.navbar_height,
                    });
//                    $('body')[fp+'scrollspy']('refresh');
                });
            }
        },
        render: function($, p, fp) {
            this.dom_element = $('<div class="az-element az-scroll-menu"><nav  class="' + p + 'navbar ' + p + 'navbar-default ' + this.attrs['el_class'] + '" role="navigation" style="' + this.attrs['style'] + '"><div class="' + p + 'container-fluid"></div></nav></div>');
            var header = $('<div class="' + p + 'navbar-header"><button type="button" class="' + p + 'navbar-toggle" data-toggle="collapse" data-target="#' + this.id + '"><span class="' + p + 'sr-only">' + t('Toggle navigation') + '</span><span class="' + p + 'icon-bar"></span><span class="' + p + 'icon-bar"></span><span class="' + p + 'icon-bar"></span></button><a class="' + p + 'navbar-brand" href="' + this.attrs['logo_link'] + '"></a></div>');
            function render_image(value, width, height) {
                if ($.isNumeric(width))
                    width = width + 'px';
                if ($.isNumeric(height))
                    height = height + 'px';
                var img = $('<img src="' + value + '" alt="">');
                if (width.length > 0)
                    $(img).attr('width', width);
                if (height.length > 0)
                    $(img).attr('height', height);
                return img;
            }
            var img = render_image(this.attrs['logo'], '100%', '');
            $(header).find('a.' + p + 'navbar-brand').append(img);
            var collapse = $('<div class="' + p + 'collapse ' + p + 'navbar-collapse" id="' + this.id + '"></div>');
            var links = '<ul class="' + p + 'nav ' + p + 'navbar-nav">';
            for (var id in this.menu_items) {
                links += '<li><a href="#' + id + '">' + this.menu_items[id] + '</a></li>';
            }
            links += '</ul>';
            $(collapse).append(links);
            $(this.dom_element).find('.' + p + 'container-fluid').append(header).append(collapse);
            ScrollMenuElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//    
//
//
    function FormElement(parent, parse) {
        FormElement.baseclass.apply(this, arguments);
    }
    register_animated_element('az_form', true, FormElement);
    mixin(FormElement.prototype, {
        name: t('Form'),
        icon: 'fa fa-envelope-o',
        description: t('Form container. Can contain form elements for user input and any number of any other elements types.'),
        category: t('Layout'),
        params: [
            make_param_type({
                type: 'textfield',
                heading: t('Name'),
                param_name: 'name',
                description: t('Required.'),
                required: true,
            }),
            make_param_type({
                type: 'textfield',
                heading: t('Submit button title'),
                param_name: 'submit_title',
                value: t('Submit'),
            }),
            make_param_type({
                type: 'textfield',
                heading: t('Submited message'),
                param_name: 'submited_message',
                value: t('Submited'),
            }),
        ].concat(FormElement.prototype.params),
        is_container: true,
        show_settings_on_create: true,
        get_button: function() {
            return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'text-overflow" data-az-element="' + this.base + '" style="width:100%;"><i class="' + p + 'text-primary ' + this.icon + '"></i><p>' + this.name + '</p><p class="' + p + 'text-muted ' + p + 'small">' + this.description + '</p></div>';
        },
        get_empty: function() {
            return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('You can add form element by mouse over this button: ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-plus-sign"></span> ' + t('You can see all submissions by click on this button: ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-list-alt"></span></div></div>';
        },
        show_controls: function() {
            if (window.azexo_editor) {
                FormElement.baseclass.prototype.show_controls.apply(this, arguments);
                var element = this;
                $('<button title="' + title("Show submissions") + '" class="control show-submissions ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-list-alt" > </button>').appendTo(this.controls).click({object: this}, this.click_show_submissions);

                var buttons = '<div class="form-fields ' + p + 'btn-group ' + p + 'btn-group-sm">';
                for (var key in FormDataElement.prototype.form_elements) {
                    var e = FormDataElement.prototype.form_elements[key].prototype;
                    buttons += '<button title="' + title("Add") + ' ' + e.name + '" class="control ' + p + 'btn ' + p + 'btn-default ' + e.icon + '" data-az-element="' + key + '"></button>';
                }
                buttons += '</div>';

                var columns = $('<button title="' + title("Add form field") + '" class="control set-columns ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon ' + p + 'glyphicon-plus-sign"> </button>').appendTo(this.controls)[fp + 'popover']({
                    animation: false,
                    placement: p + 'right',
                    html: 'true',
                    trigger: 'manual',
                    //container: 'body',
                    content: buttons,
                }).hover(function() {
                    $(this)[fp + 'popover']('show');
                    $(element.controls).find('.' + p + 'popover .control').each(function() {
                        $(this).click(function() {
                            var base = $(this).attr('data-az-element');
                            var constructor = BaseElement.prototype.elements[base];
                            var child = new constructor(element, false);
                            child.update_dom();
                            element.update_dom();
                            element.update_empty();
                            if (child.show_settings_on_create)
                                child.edit();
                            return false;
                        });
                    });
                    $(element.dom_element).mouseleave(function() {
                        $(columns)[fp + 'popover']('hide');
                        $(columns).css('display', '');
                    });
                });
            }
        },
        update_sortable: function() {
            if (window.azexo_editor) {
                $(this.dom_content_element).sortable({
                    items: '> .az-element',
                    connectWith: '.az-form .az-ctnr',
                    handle: '> .controls > .drag-and-drop',
                    update: this.update_sorting,
                    placeholder: 'az-sortable-placeholder',
                    forcePlaceholderSize: true,
                    over: function(event, ui) {
                        ui.placeholder.attr('class', ui.helper.attr('class'));
                        ui.placeholder.removeClass('ui-sortable-helper');
                        ui.placeholder.addClass('az-sortable-placeholder');
                        //$(this).closest('[data-az-id]')
                    }
                });
            }
        },
        click_show_submissions: function(e) {
            e.data.object.show_submissions();
            return false;
        },
        show_submissions: function() {
            var element = this;
            var container = element.get_my_container();
            azexo_load_submissions(container.attrs['container'].split('/')[0], container.attrs['container'].split('/')[1], element.attrs['name'], function(data) {
                $('#az-form-modal').remove();
                var header = '<div class="' + p + 'modal-header"><button type="button" class="' + p + 'close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="' + p + 'modal-title">' + element.attrs['name'] + ' ' + t(" submissions") + '</h4></div>';
                var footer = '<div class="' + p + 'modal-footer"></div>';
                var modal = $('<div id="az-form-modal" class="' + p + 'modal azexo"><div class="' + p + 'modal-dialog ' + p + 'modal-lg"><div class="' + p + 'modal-content">' + header + '<div class="' + p + 'modal-body"></div>' + footer + '</div></div></div>').prependTo('body');

                var columns = {};
                for (var dt in data) {
                    var submission = $.parseJSON(data[dt]);
                    for (var key in submission) {
                        if (!(key in columns))
                            columns[key] = true;
                    }
                }
                var rows = [];
                for (var dt in data) {
                    var submission = $.parseJSON(data[dt]);
                    var row = {};
                    for (var key in columns) {
                        if (key in submission) {
                            row[key] = submission[key];
                        } else {
                            row[key] = '';
                        }
                    }
                    rows.push(row);
                }

                var table = $('<table></table>');
                var head = $('<thead><tr></tr></thead>').appendTo(table);
                for (var name in columns) {
                    $(head).find('tr').append('<th>' + name + '</th>')
                }
                var body = $('<tbody></tbody>').appendTo(table);
                for (var i = 0; i < rows.length; i++) {
                    var row = $('<tr></tr>').appendTo(body);
                    for (var name in columns) {
                        $('<td>' + rows[i][name] + '</td>').appendTo(row);
                    }
                }

                azexo_add_css('DataTables/media/css/jquery.dataTables.min.css', function() {
                });
                azexo_add_js({
                    path: 'DataTables/media/js/jquery.dataTables.min.js',
                    callback: function() {
                        $(table).dataTable();
                    }
                });
                $(modal).find('.' + p + 'modal-body').append(table);
//                $('#az-form-modal').find('.save').click(function() {
//                    $('#az-form-modal')[fp+'modal']("hide");
//                    return false;
//                });
                $('#az-form-modal')[fp + 'modal']('show');
            });
        },
        showed: function($, p, fp) {
            FormElement.baseclass.prototype.showed.apply(this, arguments);
            var element = this;
            this.add_external_js('http://www.google.com/recaptcha/api/js/recaptcha_ajax.js', function() {
                if ('recaptcha_publickey' in window) {
                    Recaptcha.create(window.recaptcha_publickey, 'captcha_' + element.id,
                            {
                                theme: "clean",
                            }
                    );
                } else {
                    azexo_get_recaptcha_publickey(function(data) {
                        Recaptcha.create(data, 'captcha_' + element.id,
                                {
                                    theme: "clean",
                                }
                        );
                    });
                }
            });
            $(element.dom_element).submit(function() {
                var container = element.get_my_container();
                azexo_submit_form(container.attrs['container'].split('/')[0], container.attrs['container'].split('/')[1], element.attrs['name'], $(element.dom_element).serialize(), function(data) {
                    if (data) {
                        (element.dom_element).prepend(get_alert(element.attrs['submited_message']));
                    }
                });
                return false;
            });
        },
        render: function($, p, fp) {
            var element = this;
            this.dom_element = $('<form class="az-element az-form ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '" role="form" enctype="multipart/form-data"></form>');
            this.dom_content_element = $('<div class="az-ctnr"></div>').appendTo(this.dom_element);
            $('<div class="' + p + 'form-group"><div id="captcha_' + this.id + '"></div></div>').appendTo(this.dom_element);
            $('<div class="' + p + 'form-group"><button class="' + p + 'btn ' + p + 'btn-lg ' + p + 'btn-primary" type="submit">' + this.attrs['submit_title'] + '</button></div>').appendTo(this.dom_element);
            FormElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function FormDataElement(parent, parse) {
        FormDataElement.baseclass.apply(this, arguments);
    }
    extend(FormDataElement, AnimatedElement);
    mixin(FormDataElement.prototype, {
        form_elements: {},
        params: [
            make_param_type({
                type: 'textfield',
                heading: t('Name'),
                param_name: 'name',
                description: t('Required.'),
                required: true,
            }),
            make_param_type({
                type: 'checkbox',
                heading: t('Field is required?'),
                param_name: 'required',
                value: {
                    'yes': t("Yes, please"),
                },
            }),
        ].concat(FormDataElement.prototype.params),
    });
    function register_form_data_element(base, Element) {
        extend(Element, FormDataElement);
        Element.prototype.base = base;
        FormDataElement.prototype.elements[base] = Element;
        FormDataElement.prototype.tags[base] = Element;
        FormDataElement.prototype.form_elements[base] = Element;
    }
//
//
//
    function create_azexo_elements() {
        if ('azexo_elements' in window) {
            for (var i = 0; i < window.azexo_elements.length; i++) {
                var element = window.azexo_elements[i];
                var ExternalElement = function(parent, parse) {
                    ExternalElement.baseclass.apply(this, arguments);
                }
                register_animated_element(element.base, element.is_container, ExternalElement);
                element.baseclass = ExternalElement.baseclass;
                element.params = element.params.concat(ExternalElement.prototype.params);
                mixin(ExternalElement.prototype, element);
                for (var j = 0; j < ExternalElement.prototype.params.length; j++) {
                    var param = ExternalElement.prototype.params[j];
                    var new_param = make_param_type(param);
                    ExternalElement.prototype.params[j] = new_param;
                }
            }
        }
    }
    create_azexo_elements();
//
//
//
    function create_azexo_form_elements() {
        if ('azexo_form_elements' in window) {
            for (var i = 0; i < window.azexo_form_elements.length; i++) {
                var element = window.azexo_form_elements[i];
                var ExternalElement = function(parent, parse) {
                    ExternalElement.baseclass.apply(this, arguments);
                }
                register_form_data_element(element.base, ExternalElement);
                element.baseclass = ExternalElement.baseclass;
                element.params = element.params.concat(ExternalElement.prototype.params);
                mixin(ExternalElement.prototype, element);
                for (var j = 0; j < ExternalElement.prototype.params.length; j++) {
                    var param = ExternalElement.prototype.params[j];
                    var new_param = make_param_type(param);
                    ExternalElement.prototype.params[j] = new_param;
                }
            }
        }
    }
    create_azexo_form_elements();
//
//
//
    function make_azexo_extend() {
        if ('azexo_extend' in window) {
            for (var base in window.azexo_extend) {
                var element = window.azexo_extend[base];
                var params = element.params;
                element.params = {};
                var reigstered_element = BaseElement.prototype.elements[base];
                mixin(reigstered_element.prototype, element);
                for (var i = 0; i < params.length; i++) {
                    var param = make_param_type(params[i]);
                    reigstered_element.prototype.params.push(param);
                }
            }
        }
    }
    make_azexo_extend();
//
//
//
    function create_template_elements() {
        azexo_get_elements(function(elements) {
            if (_.isObject(elements)) {
                azexo_elements.create_template_elements(elements);
            }
        });
    }
    create_template_elements();
    function create_cms_elements() {
        azexo_get_cms_element_names(function(elements) {
            if (_.isObject(elements)) {
                azexo_elements.create_cms_elements(elements);
            }
        });
    }
    create_cms_elements();

})(window.jQuery, false, '', '', {}, {}, {}, null, [], {});
