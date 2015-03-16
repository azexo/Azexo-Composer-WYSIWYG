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
    $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
        if ( options.dataType == 'script' || originalOptions.dataType == 'script' ) {
            options.cache = true;
        }
    });    
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
    function enc(str) {
        var encoded = "";
        for (i = 0; i < str.length; i++) {
            var a = str.charCodeAt(i);
            var b = a ^ 7;
            encoded = encoded + String.fromCharCode(b);
        }
        return encoded;
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
                    shortcode: btoa(enc(encodeURIComponent(shortcode))),
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
                    shortcode: btoa(enc(encodeURIComponent(shortcode))),
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
                window.azexo_template_elements[name].html = decodeURIComponent(atob(window.azexo_template_elements[name].html));
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
                    url: window.location.href,
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
                        azexo_template_elements[name].html = decodeURIComponent(atob(azexo_template_elements[name].html));
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
    // -- exporter ---
    function azexo_export(site, callback) {
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_export',
                        url: window.location.href,
                        site: site,
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
                        action: 'export',
                        url: window.location.href,
                        site: site,
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
    function azexo_get_sites(callback) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_get_sites',
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
                    action: 'get_sites',
                },
                dataType: "json",
                cache: false,
                context: this
            }).done(function(data) {
                callback(data);
            });
        }
    }
    function azexo_load_site(name, callback) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_load_site',
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
            var url = window.azexo_baseurl + '../azexo_sites/' + name;
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
    function azexo_save_site(name, site) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_save_site',
                    url: window.location.href,
                    name: name,
                    site: site,
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
                    action: 'save_site',
                    name: name,
                    site: site,
                },
                cache: false,
                context: this
            }).done(function(data) {
            });
        }
    }
    function azexo_delete_site(name) {
        if ('ajaxurl' in window) {
            $.ajax({
                type: 'POST',
                url: window.ajaxurl,
                data: {
                    action: 'azexo_delete_site',
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
                    action: 'delete_site',
                    name: name,
                },
                cache: false,
                context: this
            }).done(function(data) {
            });
        }
    }
    function azexo_ftp_get_list(host, username, password, port, directory, callback) {
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_ftp_get_list',
                        host: host,
                        username: username,
                        password: password,
                        port: port,
                        directory: directory,
                    },
                    cache: false,
                    dataType: "json",
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            } else {
                $.ajax({
                    type: 'POST',
                    url: window.azexo_baseurl + 'ajax.php',
                    data: {
                        action: 'ftp_get_list',
                        host: host,
                        username: username,
                        password: password,
                        port: port,
                        directory: directory,
                    },
                    cache: false,
                    dataType: "json",
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            }
        } else {
            callback('');
        }
    }
    function azexo_ftp_upload(site, site_path, files, host, username, password, port, directory, callback) {
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_ftp_upload',
                        url: window.location.href,
                        site: site,
                        site_path: site_path,
                        files: files,
                        host: host,
                        username: username,
                        password: password,
                        port: port,
                        directory: directory,
                    },
                    cache: false,
                    dataType: "json",
                    context: this
                }).done(function(data) {
                    callback(data);
                });
            } else {
                $.ajax({
                    type: 'POST',
                    url: window.azexo_baseurl + 'ajax.php',
                    data: {
                        action: 'ftp_upload',
                        url: window.location.href,
                        site: site,
                        site_path: site_path,
                        files: files,
                        host: host,
                        username: username,
                        password: password,
                        port: port,
                        directory: directory,
                    },
                    cache: false,
                    dataType: "json",
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
    function rgb2hex(rgb) {
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return rgb.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, function(match, r, g, b) {
            return "#" + hex(r) + hex(g) + hex(b);
        });
    }
    function hex2rgb(hex) {
        if (hex.lastIndexOf('#') > -1) {
            hex = hex.replace(/#/, '0x');
        } else {
            hex = '0x' + hex;
        }
        var r = hex >> 16;
        var g = (hex & 0x00FF00) >> 8;
        var b = hex & 0x0000FF;
        return [r, g, b];
    }
    function hsl2rgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0)
                    t += 1;
                if (t > 1)
                    t -= 1;
                if (t < 1 / 6)
                    return p + (q - p) * 6 * t;
                if (t < 1 / 2)
                    return q;
                if (t < 2 / 3)
                    return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    function rgb2hsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [h, s, l];
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
    function get_max_zindex(dom_element) {
        var max_zindex = parseInt($(dom_element).css('z-index'));
        $(dom_element).parent().find('*').each(function() {
            var zindex = parseInt($(this).css('z-index'));
            if (max_zindex < zindex)
                max_zindex = zindex;
        });
        return max_zindex;
    }
    ;
    function set_highest_zindex(dom_element) {
        var zindex = get_max_zindex(dom_element);
        $(dom_element).css('z-index', zindex + 1);
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
        return '<div class="' + p + 'alert ' + p + 'alert-warning ' + p + 'fade ' + p + 'in" role="alert"><button type="button" class="' + p + 'close" data-dismiss="' + p + 'alert"><span aria-hidden="true">×</span><span class="' + p + 'sr-only">' + t('Close') + '</span></button>' + message + '</div>';
    }
    $.fn.closest_descendents = function(filter) {
        var $found = $(),
                $currentSet = this;
        while ($currentSet.length) {
            $found = $.merge($found, $currentSet.filter(filter));
            $currentSet = $currentSet.not(filter);
            $currentSet = $currentSet.children();
        }
        return $found;
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
            var header = '<div class="' + p + 'modal-header"><button type="button" class="' + p + 'close" data-dismiss="' + p + 'modal" aria-hidden="true">&times;</button><h4 class="' + p + 'modal-title">' + element.name + ' ' + t("settings") + '</h4></div>';
            var footer = '<div class="' + p + 'modal-footer"><button type="button" class="' + p + 'btn ' + p + 'btn-default" data-dismiss="' + p + 'modal">' + t("Close") + '</button><button type="button" class="save ' + p + 'btn ' + p + 'btn-primary">' + t("Save changes") + '</button></div>';
            var modal = $('<div id="az-editor-modal" class="' + p + 'modal azexo"><div class="' + p + 'modal-dialog ' + p + 'modal-lg"><div class="' + p + 'modal-content">' + header + '<div class="' + p + 'modal-body"></div>' + footer + '</div></div></div>').prependTo('body');
            var tabs = {};
            for (var i = 0; i < params.length; i++) {
                if (params[i].hidden)
                    continue;
                params[i].element = element;
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
                menu += '<li><a href="#az-editor-tab-' + i + '" data-toggle="' + p + 'tab">' + title + '</a></li>';
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
                $(window).scrollTop(scrollTop);
                $(window).off('scroll.az-editor-modal');
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
                $('#az-editor-modal')[fp + 'modal']("hide");
                callback.call(element, values);
                return false;
            });
            $('#az-editor-modal').find('[data-dismiss="' + p + 'modal"]').click(function() {
                azexo_elements.edit_stack = [];
            });
            var scrollTop = $(window).scrollTop();
            $(window).on('scroll.az-editor-modal', function() {
                $(window).scrollTop(scrollTop);
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
            for (var i = 0; i < v.length; i++) {
                f.find("select[name='" + n + "'] > option[value='" + v[i] + "']").prop('selected', 'selected');
            }
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
                $(param.dom_element).find('[type="submit"]').remove();
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
        if ($('link[href*="' + url + '"]').length || 'azexo_exported' in window) {
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
        if ('loaded' in options && options.loaded || 'azexo_exported' in window) {
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
//
//
//
    function AZEXOElements() {
    }
    mixin(AZEXOElements.prototype, {
        elements_instances: {},
        elements_instances_by_an_name: {},
        template_elements_loaded: false,
        cms_elements_loaded: false,
        edit_stack: [],
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
                        $(el.dom_content_element).empty();
                        el.attach_children();
                        if (window.azexo_editor)
                            el.update_sortable();
                        el.recursive_showed();
                    }
                }
            }
        },
        create_template_elements: function(elements) {
            var urls_to_update = {
                'link[href]': 'href',
                'script[src]': 'src',
                'img[src]': 'src',
            };
            if ('azexo_urls_to_update' in window)
                urls_to_update = $.extend(urls_to_update, window.azexo_urls_to_update);
            var editable = [];
            if ('azexo_editable' in window)
                editable = window.azexo_editable;
            var styleable = [];
            if ('azexo_styleable' in window)
                styleable = window.azexo_styleable;
            var sortable = [];
            if ('azexo_sortable' in window)
                sortable = window.azexo_sortable;
            var synchronizable = [];
            if ('azexo_synchronizable' in window)
                synchronizable = window.azexo_synchronizable;
            var restoreable = [];
            if ('azexo_restoreable' in window)
                restoreable = window.azexo_restoreable;
            var containable = [];
            if ('azexo_containable' in window)
                containable = window.azexo_containable;
            var icons = BaseParamType.prototype.param_types['icon'].prototype.icons.map(function(item, i, arr) {
                return item.replace(/^/, '.').replace(/ /, '.')
            });
            var icon_selector = icons.join(', ');
            for (var path in elements) {
                var name = elements[path].name;
                var template = elements[path].html;
                var thumbnail = '';
                if ('thumbnail' in elements[path])
                    thumbnail = elements[path].thumbnail;
                var section = (template.indexOf('az-rootable') >= 0);

                var TemplateElement = function(parent, position) {
                    var element = this;
                    for (var i = 0; i < this.baseclass.prototype.params.length; i++) {
                        if (this.baseclass.prototype.params[i].param_name == 'content' && this.baseclass.prototype.params[i].value == '') {
                            if ('ajaxurl' in window) {
                                function template_element_urls(dom) {
                                    var folders = element.path.split('|');
                                    folders.pop();
                                    folders = folders.join('/')
                                    function update_url(url) {
                                        if (url.indexOf("azexo_elements") == 0) {
                                            return window.azexo_baseurl + '../' + url;
                                        } else {
                                            if (url.indexOf("/") != 0 && url.indexOf("http://") != 0 && url.indexOf("https://") != 0) {
                                                return window.azexo_baseurl + '../azexo_elements/' + folders + '/' + url;
                                            }
                                        }
                                        return url;
                                    }
                                    for (var selector in urls_to_update) {
                                        var attr = urls_to_update[selector];
                                        $(dom).find(selector).each(function() {
                                            $(this).attr(attr, update_url($(this).attr(attr)));
                                        });
                                    }
                                    $(dom).find('[data-az-url]').each(function() {
                                        var attr = $(this).attr('data-az-url');
                                        $(this).attr(attr, update_url($(this).attr(attr)));
                                    });
                                    $(dom).find('[style*="background-image"]').each(function() {
                                        var style = $(this).attr('style').replace(/background-image[: ]*url\(([^\)]+)\) *;/, function(match, url) {
                                            return match.replace(url, encodeURI(update_url(decodeURI(url))));
                                        });
                                        $(this).attr('style', style);
                                    });
                                }
                                var template = $('<div>' + element.template + '</div>');
                                template_element_urls(template);
                                template = $(template).html();
                                this.baseclass.prototype.params[i].value = template;
                            }
                            break;
                        }
                    }
                    BaseElement.apply(this, arguments);
                }
                register_element(name, false, TemplateElement);
                mixin(TemplateElement.prototype, {
                    baseclass: TemplateElement,
                    template: template,
                    path: path,
                    name: name,
                    icon: 'fa fa-cube',
                    description: t(''),
                    thumbnail: thumbnail,
                    params: [
                        make_param_type({
                            type: 'html',
                            heading: t('Content'),
                            param_name: 'content',
                            value: '',
                        }),
                    ].concat(TemplateElement.prototype.params),
                    show_settings_on_create: false,
                    is_container: true,
                    has_content: true,
                    section: section,
                    category: t('Template-elements'),
                    is_template_element: true,
                    editable: ['.az-editable'].concat(editable),
                    styleable: ['.az-styleable'].concat(styleable),
                    sortable: ['.az-sortable'].concat(sortable),
                    synchronizable: ['.az-synchronizable'].concat(synchronizable),
                    restoreable: ['.az-restoreable'].concat(restoreable),
                    containable: ['.az-containable'].concat(containable),
                    restore_nodes: {},
                    contained_elements: {},
                    show_controls: function() {
                        if (window.azexo_editor) {
                            var element = this;
                            BaseElement.prototype.show_controls.apply(this, arguments);
                            var editor_opener = function() {
                                if (azexo_elements.edit_stack.length > 0) {
                                    var args = azexo_elements.edit_stack.shift();
                                    $(args.node).css('outline-width', '2px');
                                    $(args.node).css('outline-style', 'dashed');
                                    var interval = setInterval(function() {
                                        if ($(args.node).css('outline-color') != 'rgb(255, 0, 0)')
                                            $(args.node).css('outline-color', 'rgb(255, 0, 0)');
                                        else
                                            $(args.node).css('outline-color', 'rgb(255, 255, 255)');
                                    }, 100);
                                    setTimeout(function() {
                                        clearInterval(interval);
                                        $(args.node).css('outline-color', '');
                                        $(args.node).css('outline-width', '');
                                        $(args.node).css('outline-style', '');
                                        open_editor(args.node, args.edit, args.style, function() {
                                            if (azexo_elements.edit_stack.length > 0) {
                                                var s1 = $(args.node).width() * $(args.node).height();
                                                var s2 = $(azexo_elements.edit_stack[0].node).width() * $(azexo_elements.edit_stack[0].node).height();
                                                if (s2 / s1 < 2) {
                                                    editor_opener();
                                                } else {
                                                    azexo_elements.edit_stack = [];
                                                }
                                            }
                                        });
                                    }, 500);
                                }
                            }
                            function open_editor(node, edit, style, callback) {
                                var params = [];
                                var image = '';
                                var link = '';
                                var icon = '';
                                var content = $.trim($(node).text());
                                if (content != '') {
                                    content = $(node).html();
                                }
                                if (edit) {
                                    if ($(node).is(icon_selector)) {
                                        for (var i = 0; i < icons.length; i++) {
                                            if ($(node).is(icons[i])) {
                                                icon = icons[i].split('.');
                                                icon.shift();
                                                icon = icon.join(' ');
                                                break;
                                            }
                                        }
                                        params.push(make_param_type({
                                            type: 'icon',
                                            heading: t('Icon'),
                                            param_name: 'icon',
                                        }));
                                    }
                                    if ($(node).prop("tagName") != 'IMG') {
                                        if (content != '') {
                                            params.push(make_param_type({
                                                type: 'textarea',
                                                heading: t('Content'),
                                                param_name: 'content',
                                            }));
                                        }
                                    } else {
                                        image = $(node).attr('src');
                                        params.push(make_param_type({
                                            type: 'image',
                                            heading: t('Image'),
                                            param_name: 'image',
                                            description: t('Select image from media library.'),
                                        }));
                                    }
                                    if ($(node).prop("tagName") == 'A') {
                                        link = $(node).attr('href');
                                        params.push(make_param_type({
                                            type: 'link',
                                            heading: t('Link'),
                                            param_name: 'link',
                                            description: t('Content link (url).'),
                                        }));
                                    }
                                }
                                if (style) {
                                    params.push(make_param_type({
                                        type: 'textfield',
                                        heading: t('Content classes'),
                                        param_name: 'el_class',
                                        description: t('If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.')
                                    }));
                                    var param_type = make_param_type({
                                        type: 'style',
                                        heading: t('Content style'),
                                        param_name: 'style',
                                        description: t('Style options.'),
                                        tab: t('Style')
                                    });
                                    if (edit)
                                        params.push(param_type);
                                    else
                                        params.unshift(param_type);
                                }
                                $(node).removeClass('editable-highlight');
                                $(node).removeClass('styleable-highlight');
                                $(node).removeClass(icon);
                                var classes = $(node).attr('class');
                                $(node).addClass(icon);
                                if (typeof classes === typeof undefined || classes === false) {
                                    classes = '';
                                }
                                var styles = '';
                                for (var name in node.style) {
                                    if ($.isNumeric(name)) {
                                        styles = styles + node.style[name] + ': ' + node.style.getPropertyValue(node.style[name]) + '; ';
                                    }
                                }
                                styles = rgb2hex(styles);
                                styles = styles.replace(/\-value\: /g, ': ');
                                styles = styles.replace('border-top-color', 'border-color');
                                styles = styles.replace('border-top-left-radius', 'border-radius');
                                styles = styles.replace('border-top-style', 'border-style');
                                styles = styles.replace('background-position-x: 50%; background-position-y: 50%;', 'background-position: center;');
                                styles = styles.replace('background-position-x: 50%; background-position-y: 100%;', 'background-position: center bottom;');
                                styles = styles.replace('background-repeat-x: no-repeat; background-repeat-y: no-repeat;', 'background-repeat: no-repeat;');
                                styles = styles.replace('background-repeat-x: repeat;', 'background-repeat: repeat-x;');
                                BaseParamType.prototype.show_editor(params, {name: t('Content'), attrs: {'content': content, 'link': link, 'image': image, 'el_class': classes, 'style': styles, 'icon': icon}}, function(values) {
                                    if (edit) {
                                        if (icon != '') {
                                            $(node).removeClass(icon);
                                            values['el_class'] = values['el_class'] + ' ' + values['icon'];
                                        }
                                        if ($(node).prop("tagName") == 'A') {
                                            $(node).attr('href', values['link']);
                                        }
                                        if ($(node).prop("tagName") == 'IMG') {
                                            $(node).attr('src', values['image']);
                                        } else {
                                            if (content != '' && values['content'] != '') {
                                                $(node).html(values['content']);
                                            }
                                        }
                                    }
                                    if (style) {
                                        $(node).attr('class', values['el_class']);
                                        $(node).attr('style', values['style']);
                                    }
                                    element.attrs['content'] = $(element.dom_content_element).html();
                                    element.restore_content();
                                    synchronize();
                                    able();
                                    callback();
                                });
                            }
                            function make_node_signature(dom) {
                                var cdom = $(dom).clone();
                                $(cdom).find('*').each(function(){
                                    var elem = this;
                                    while(elem.attributes.length > 0)
                                        elem.removeAttribute(elem.attributes[0].name);                                    
                                });
                                var html = $(cdom).html();
                                html = html.replace(/\s*/g, '');
                                return html;
                            }
                            function synchronize() {
                                sortable_disable();
                                for (var i = 0; i < element.synchronizable.length; i++) {
                                    $(element.dom_content_element).find(element.synchronizable[i]).each(function() {
                                        if ($(this).closest('[data-az-restore]').length == 0) {
                                            $(this).find('.editable-highlight').removeClass('editable-highlight');
                                            $(this).find('.styleable-highlight').removeClass('styleable-highlight');
                                            $(this).find('.sortable-highlight').removeClass('sortable-highlight');
                                            $(this).find('[class=""]').removeAttr('class');
                                            $(this).find('[style=""]').removeAttr('style');
                                            var synchronized = $(this).data('synchronized');
                                            if (synchronized) {
                                                for (var i = 0; i < synchronized.length; i++) {
                                                    $(synchronized[i]).html($(this).html());
                                                }
                                            }
                                            if ($(this).data('current-state')) {
                                                $(document).trigger("azexo_synchronize", {from_node: this, old_state: $(this).data('current-state'), new_state: $(this).html()});
                                            } else {
                                                $(document).trigger("azexo_synchronize", {from_node: this, old_state: make_node_signature(this), new_state: $(this).html()});
                                            }
                                            $(this).data('current-state', make_node_signature(this));
                                            element.attrs['content'] = $(element.dom_content_element).html();
                                            element.restore_content();
                                        }
                                    });
                                }
                                able();
                            }
                            $(document).on("azexo_synchronize", function(sender, data) {
                                sortable_disable();
                                for (var i = 0; i < element.synchronizable.length; i++) {
                                    $(element.dom_content_element).find(element.synchronizable[i]).each(function() {
                                        if ($(this).closest('[data-az-restore]').length == 0) {
                                            $(this).find('.editable-highlight').removeClass('editable-highlight');
                                            $(this).find('.styleable-highlight').removeClass('styleable-highlight');
                                            $(this).find('.sortable-highlight').removeClass('sortable-highlight');
                                            $(this).find('[class=""]').removeAttr('class');
                                            $(this).find('[style=""]').removeAttr('style');
                                            if (this != data.from_node) {
                                                if (make_node_signature(this) == data.old_state) {
                                                    var synchronized = $(data.from_node).data('synchronized');
                                                    if (!synchronized)
                                                        synchronized = [];
                                                    synchronized.push(this);
                                                    synchronized = $.unique(synchronized);
                                                    $(data.from_node).data('synchronized', synchronized);

                                                    synchronized = $(this).data('synchronized');
                                                    if (!synchronized)
                                                        synchronized = [];
                                                    synchronized.push(data.from_node);
                                                    synchronized = $.unique(synchronized);
                                                    $(this).data('synchronized', synchronized);

                                                    $(this).html(data.new_state);
                                                    element.attrs['content'] = $(element.dom_content_element).html();
                                                    element.restore_content();
                                                }
                                            }
                                        }
                                    });
                                }
                                able();
                            });
                            function sortable_disable() {
                                for (var i = 0; i < element.sortable.length; i++) {
                                    $(element.dom_content_element).find(element.sortable[i]).each(function() {
                                        if ($(this).hasClass('ui-sortable')) {
                                            if ($(this).data('sortable')) {
                                                $(this).data('sortable', false);
                                                $(this).sortable('destroy');
                                                $(this).find('.ui-sortable-handle').removeClass('ui-sortable-handle');
                                            }
                                        }
                                    });
                                }
                            }
                            function sortable_enable() {
                                for (var i = 0; i < element.sortable.length; i++) {
                                    $(element.dom_element).find(element.sortable[i]).each(function() {
                                        if ($(this).closest('[data-az-restore]').length == 0) {
                                            $(this).data('sortable', true);
                                            $(this).sortable({
                                                items: '> *',
                                                placeholder: 'az-sortable-placeholder',
                                                forcePlaceholderSize: true,
                                                start: function(event, ui) {
                                                    $(ui.item).removeClass('sortable-highlight').find('.az-sortable-controls').remove();
                                                },
                                                update: function(event, ui) {
                                                    element.attrs['content'] = $(element.dom_content_element).html();
                                                    element.restore_content();
                                                    synchronize();
                                                },
                                                over: function(event, ui) {
                                                    ui.placeholder.attr('class', ui.helper.attr('class'));
                                                    ui.placeholder.removeClass('ui-sortable-helper');
                                                    ui.placeholder.addClass('az-sortable-placeholder');
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                            function able() {
                                for (var i = 0; i < element.restoreable.length; i++) {
                                    $(element.dom_element).find(element.restoreable[i]).off('mouseenter.az-restoreable').on('mouseenter.az-restoreable', function() {
                                        $(this).addClass('restoreable-highlight');
                                    });
                                    $(element.dom_element).find(element.restoreable[i]).off('mouseleave.az-restoreable').on('mouseleave.az-restoreable', function() {
                                        $(this).removeClass('restoreable-highlight');
                                    });
                                    $(element.dom_element).find(element.restoreable[i]).off('click.az-restoreable').on('click.az-restoreable', function(e) {
                                        if ($(this).is('[data-az-restore]')) {
                                            var params = [];
                                            params.push(make_param_type({
                                                type: 'html',
                                                heading: t('HTML'),
                                                param_name: 'html',
                                            }));
                                            var id = $(this).attr('data-az-restore');
                                            var html = element.restore_nodes[id];
                                            BaseParamType.prototype.show_editor(params, {name: t('Content'), attrs: {'html': html}}, function(values) {
                                                element.restore_nodes[id] = values['html'];
                                                element.restore_content();
                                                element.update_dom();
                                                synchronize();
                                            });
                                            return false;
                                        }
                                    });
                                }
                                for (var i = 0; i < element.styleable.length; i++) {
                                    $(element.dom_element).find(element.styleable[i]).off('mouseenter.az-styleable').on('mouseenter.az-styleable', function() {
                                        if ($(this).closest('[data-az-restore]').length == 0)
                                            $(this).addClass('styleable-highlight');
                                    });
                                    $(element.dom_element).find(element.styleable[i]).off('mouseleave.az-styleable').on('mouseleave.az-styleable', function() {
                                        if ($(this).closest('[data-az-restore]').length == 0)
                                            $(this).removeClass('styleable-highlight');
                                    });
                                    $(element.dom_element).find(element.styleable[i]).off('click.az-styleable').on('click.az-styleable', function(e) {
                                        if ($(this).closest('[data-az-restore]').length == 0) {
                                            if ($(this).parent().closest('.styleable-highlight, .editable-highlight').length == 0) {
                                                azexo_elements.edit_stack.push({
                                                    node: this,
                                                    edit: false,
                                                    style: true,
                                                });
                                                editor_opener();
                                                return false;
                                            } else {
                                                azexo_elements.edit_stack.push({
                                                    node: this,
                                                    edit: false,
                                                    style: true,
                                                });
                                            }
                                        }
                                    });
                                }
                                for (var i = 0; i < element.editable.length; i++) {
                                    $(element.dom_element).find(element.editable[i]).off('mouseenter.az-editable').on('mouseenter.az-editable', function() {
                                        if ($(this).closest('[data-az-restore]').length == 0)
                                            $(this).addClass('editable-highlight');
                                    });
                                    $(element.dom_element).find(element.editable[i]).off('mouseleave.az-editable').on('mouseleave.az-editable', function() {
                                        if ($(this).closest('[data-az-restore]').length == 0)
                                            $(this).removeClass('editable-highlight');
                                    });
                                    $(element.dom_element).find(element.editable[i]).off('click.az-editable').on('click.az-editable', function(e) {
                                        if ($(this).closest('[data-az-restore]').length == 0) {
                                            if ($(this).parent().closest('.styleable-highlight, .editable-highlight').length == 0) {
                                                azexo_elements.edit_stack.push({
                                                    node: this,
                                                    edit: true,
                                                    style: true,
                                                });
                                                editor_opener();
                                                return false;
                                            } else {
                                                azexo_elements.edit_stack.push({
                                                    node: this,
                                                    edit: true,
                                                    style: true,
                                                });
                                            }
                                        }
                                    });
                                }
                                var sort_stack = [];
                                var sorted_node = null;
                                var timeoutId = null;
                                function show_controls(node) {
                                    if ($(node).hasClass('sortable-highlight')) {
                                        $(node).find('.az-sortable-controls').remove();
                                        var controls = $('<div class="az-sortable-controls"></div>').appendTo(node);
                                        var clone = $('<div class="az-sortable-clone ' + p + 'glyphicon ' + p + 'glyphicon-repeat" title="' + t('Clone') + '"></div>').appendTo(controls).click(function() {
                                            sortable_disable();
                                            $(node).removeClass('sortable-highlight').find('.az-sortable-controls').remove();
                                            $(node).clone().insertAfter(node);
                                            element.attrs['content'] = $(element.dom_content_element).html();
                                            element.restore_content();
                                            synchronize();
                                            able();
                                            return false;
                                        });
                                        $(clone).css('line-height', $(clone).height() + 'px').css('font-size', $(clone).height() / 2 + 'px');
                                        var remove = $('<div class="az-sortable-remove ' + p + 'glyphicon ' + p + 'glyphicon-remove" title="' + t('Remove') + '"></div>').appendTo(controls).click(function() {
                                            sortable_disable();
                                            $(node).removeClass('sortable-highlight').find('.az-sortable-controls').remove();
                                            $(node).remove();
                                            element.attrs['content'] = $(element.dom_content_element).html();
                                            element.restore_content();
                                            synchronize();
                                            able();
                                            return false;
                                        });
                                        $(remove).css('line-height', $(remove).height() + 'px').css('font-size', $(remove).height() / 2 + 'px');
                                    }
                                }
                                $(element.dom_element).off('mousemove.az-able').on('mousemove.az-able', function() {
                                    if (sorted_node != null && $(sorted_node).hasClass('sortable-highlight')) {
                                        clearTimeout(timeoutId);
                                        timeoutId = setTimeout(function() {
                                            show_controls(sorted_node);
                                        }, 1000);
                                    }
                                });
                                for (var i = 0; i < element.sortable.length; i++) {
                                    (function(i) {
                                        $(element.dom_element).find(element.sortable[i]).find('> *').off('mouseenter.az-sortable').on('mouseenter.az-sortable', function() {
                                            if ($(this).closest('[data-az-restore]').length == 0) {
                                                var node = this;
                                                $(element.dom_element).find('.az-sortable-controls').remove();
                                                $(element.dom_element).find('.sortable-highlight').removeClass('sortable-highlight');
                                                if (sorted_node !== null) {
                                                    clearTimeout(timeoutId);
                                                }

                                                $(node).addClass('sortable-highlight');
                                                sort_stack.push(node);
                                                sorted_node = node;
                                                timeoutId = setTimeout(function() {
                                                    show_controls(node);
                                                }, 1000);
                                            }
                                        });
                                        $(element.dom_element).find(element.sortable[i]).find('> *').off('mouseleave.az-sortable').on('mouseleave.az-sortable', function() {
                                            if ($(this).closest('[data-az-restore]').length == 0) {
                                                var node = this;
                                                $(element.dom_element).find('.az-sortable-controls').remove();
                                                $(element.dom_element).find('.sortable-highlight').removeClass('sortable-highlight');
                                                if (sorted_node !== null) {
                                                    clearTimeout(timeoutId);
                                                }

                                                sort_stack.pop();
                                                if (sort_stack.length > 0) {
                                                    node = sort_stack[sort_stack.length - 1]
                                                    $(node).addClass('sortable-highlight');

                                                    sorted_node = node;
                                                    timeoutId = setTimeout(function() {
                                                        show_controls(node);
                                                    }, 1000);
                                                } else {
                                                    sorted_node = null;
                                                }
                                            }
                                        });
                                    })(i);
                                }
                                sortable_enable();
                            }
                            able();
                            synchronize();
                        }
                    },
                    restore_content: function() {
                        var element = this;
                        var content = $('<div>' + this.attrs['content'] + '</div>');
                        for (var id in this.restore_nodes) {
                            $(content).find('[data-az-restore="' + id + '"]').html(this.restore_nodes[id]);
                        }
                        $(document).trigger('azexo_restore', {dom: content});
                        this.attrs['content'] = $(content).html();
                    },                    
                    get_content: function() {
                        this.restore_content();                                                
                        return BaseElement.prototype.get_content.apply(this, arguments);
                    },                    
                    restore: function(dom) {
                        BaseElement.prototype.restore.apply(this, arguments);
                        for (var id in this.restore_nodes) {
                            $(dom).find('[data-az-restore="' + id + '"]').html(this.restore_nodes[id]);
                        }
                        $(document).trigger('azexo_restore', {dom: dom});
                        $(dom).find('[data-az-restore]').removeAttr('data-az-restore');
                    },
                    showed: function($, p, fp) {
                        BaseElement.prototype.showed.apply(this, arguments);
                        var element = this;
                        if (element.section) {
                            var container = $(element.dom_element).parent().closest('.' + p + 'container, .' + p + 'container-fluid');
                            var container_path = $(element.dom_element).parentsUntil('.' + p + 'container, .' + p + 'container-fluid');
                            var popup = $(element.dom_element).parent().closest('.az-popup-ctnr');
                            var popup_path = $(element.dom_element).parentsUntil('.az-popup-ctnr');

                            if ((container.length > 0 && popup.length == 0) || (container.length > 0 && popup.length > 0 && container_path.length < popup_path.length))
                                $(element.dom_content_element).find('.' + p + 'container, .' + p + 'container-fluid').each(function() {
                                    $(this).removeClass(p + 'container');
                                    $(this).removeClass(p + 'container-fluid');
                                    element.attrs['content'] = $(element.dom_content_element).html();
                                    element.restore_content();
                                    element.section = false;
                                });
                        }
                    },
                    render: function($, p, fp) {
                        var element = this;
                        this.dom_element = $('<div class="az-element az-template ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
                        this.dom_content_element = $('<div></div>').appendTo(this.dom_element);
                        var content = '<div>' + this.attrs['content'] + '</div>';
                        content = $(content);
                        element.restore_nodes = {};
                        for (var i = 0; i < this.restoreable.length; i++) {
                            $(content).find(this.restoreable[i]).each(function() {
                                var id = _.uniqueId('r');
                                $(this).attr('data-az-restore', id);
                                element.restore_nodes[id] = $(this).html();
                            });
                        }
                        this.attrs['content'] = $(content).html();
                        $(this.attrs['content']).appendTo(this.dom_content_element);
                        BaseElement.prototype.render.apply(this, arguments);
                    },
                });
            }
            this.template_elements_loaded = true;
            make_azexo_extend();
            this.try_render_unknown_elements();
            $(function() {
                if (window.azexo_editor && Object.keys(elements).length > 0 && azexo_containers.length > 0) {
                    var menu = {'_': []};
                    for (var path in elements) {
                        var folders = path.split('|');
                        folders.pop();
                        var current = menu;
                        for (var i = 0; i < folders.length; i++) {
                            if (!(folders[i] in current))
                                current[folders[i]] = {'_': []};
                            current = current[folders[i]];
                        }
                        current['_'].push(elements[path]);
                    }
                    var panel = $('<div id="az-template-elements" class="az-left-sidebar azexo"></div>').appendTo('body');
                    var welcome = $('<div id="az-template-elements-welcome" class="azexo">' + t('For adding elements: click on plus-buttons or drag and drop elements from left panel.') + '</div>').appendTo(panel);
                    $(panel).hover(function() {
                        $(welcome).remove();
                    });
                    $('<h3>' + t('Elements') + '</h3>').appendTo(panel);
                    $('<hr>').appendTo(panel);
                    function build_menu(item) {
                        if (Object.keys(item).length === 1 && ('_' in item))
                            return null;
                        var m = $('<ul class="' + p + 'nav az-nav-list"></ul>');
                        for (var name in item) {
                            if (name != '_') {
                                var li = $('<li></li>').appendTo(m).on('mouseenter', function() {
                                    $(this).find('> .az-nav-list').css('display', 'block');
                                });
                                var it = item[name];
                                (function(it) {
                                    $('<a href="#">' + name + '</a>').appendTo(li).click(function() {
                                        var menu_item = this;
                                        $(thumbnails).empty();
                                        $(thumbnails).css('display', 'block');
                                        $(panel).addClass('az-thumbnails');
                                        function get_all_thumbnails(item) {
                                            for (var name in item) {
                                                if (name == '_') {
                                                    for (var i = 0; i < item[name].length; i++) {
                                                        $('<div class="az-thumbnail" data-az-base="' + item[name][i].name + '" style="background-image: url(' + encodeURI(item[name][i].thumbnail) + '); background-position: center center; background-size: cover;"></div>').appendTo(thumbnails);
                                                    }
                                                } else {
                                                    get_all_thumbnails(item[name]);
                                                }
                                            }
                                        }
                                        get_all_thumbnails(it);
                                        $(panel).off('mouseleave').on('mouseleave', function() {
                                            if (!dnd) {
                                                $(panel).css('left', '');
                                                $(panel).removeClass('az-thumbnails');
                                                $(thumbnails).css('overflow-y', 'scroll');
                                                $(thumbnails).css('display', 'none');
                                            }
                                        });
                                        var dnd = false;
                                        var scrollTop = 0;
                                        $(thumbnails).sortable({
                                            items: '.az-thumbnail',
                                            connectWith: '.az-ctnr',
                                            start: function(event, ui) {
                                                dnd = true;
                                                $(panel).css('left', '0px');
                                                $(thumbnails).css('overflow-y', 'visible');
                                                scrollTop = $(window).scrollTop();
                                                $(window).on('scroll.template-elements-sortable', function() {
                                                    $(window).scrollTop(scrollTop);
                                                });
                                            },
                                            stop: function(event, ui) {
                                                dnd = false;
                                                $(panel).css('left', '');
                                                $(panel).removeClass('az-thumbnails');
                                                $(thumbnails).css('overflow-y', 'scroll');
                                                $(thumbnails).css('display', 'none');
                                                $(window).off('scroll.template-elements-sortable');
                                            },
                                            update: function(event, ui) {
                                                var container = azexo_elements.get_element($(ui.item).parent().closest('[data-az-id]').attr('data-az-id'));
                                                var postition = 0;
                                                var children = $(ui.item).parent().find('[data-az-id], .az-thumbnail');
                                                for (var i = 0; i < children.length; i++) {
                                                    if ($(children[i]).hasClass('az-thumbnail')) {
                                                        postition = i;
                                                        break;
                                                    }
                                                }
                                                var element = azexo_elements.create_element(container, $(ui.item).attr('data-az-base'), postition, function() {
                                                });
                                                $(ui.item).detach();
                                                $(menu_item).click();
                                                $(window).scrollTop(scrollTop);
                                            },
                                            placeholder: 'az-sortable-placeholder',
                                            forcePlaceholderSize: true,
                                            over: function(event, ui) {
                                                ui.placeholder.attr('class', ui.helper.attr('class'));
                                                ui.placeholder.removeClass('ui-sortable-helper');
                                                ui.placeholder.addClass('az-sortable-placeholder');
                                            }
                                        });
                                        return false;
                                    });
                                })(it);
                                $(li).append(build_menu(item[name]));
                            }
                        }
                        return m;
                    }
                    $(panel).append(build_menu(menu));
                    $(panel).find('> .az-nav-list > li').on('mouseleave', function() {
                        $(this).find('.az-nav-list').css('display', 'none');
                    });
                    var thumbnails = $('<div id="az-thumbnails"></div>').appendTo(panel);
                }
            });
        },
        create_cms_elements: function(elements) {
            for (var key in elements) {
                var base = 'az_' + key;
                var CMSElement = function(parent, position) {
                    CMSElement.baseclass.apply(this, arguments);
                }
                register_element(base, false, CMSElement);
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
            make_azexo_extend();
            this.try_render_unknown_elements();
        },
        create_element: function(container, base, position, pre_render_callback) {
            var depth = container.get_nested_depth(base);
            if (depth < BaseElement.prototype.max_nested_depth) {

                var constructor = BaseElement.prototype.elements[base];
                if (container instanceof ContainerElement && container.parent == null && !constructor.prototype.section) {
                    var section = new SectionElement(container, position);
                    section.update_dom();
                    var child = new constructor(section, false);
                    pre_render_callback(child);
                    child.update_dom();
                    container.update_empty();
                    section.update_empty();
                } else {
                    var child = new constructor(container, position);
                    pre_render_callback(child);
                    child.update_dom();
                    container.update_empty();
                }
                return child;
            } else {
                alert(t('Element can not be added. Max nested depth reached.'));
            }
            return false;
        },
        make_elements_modal: function(container, pre_render_callback) {
            var disallowed_elements = container.get_all_disallowed_elements();
            var tabs = {};
            for (var id in BaseElement.prototype.elements) {
                if (BaseElement.prototype.elements[id].prototype.hidden)
                    continue;
                if (container.base != 'az_popup') {
                    if (disallowed_elements.indexOf(BaseElement.prototype.elements[id].prototype.base) >= 0)
                        continue;
                }
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
                menu += '<li><a href="#az-elements-tab-' + i + '" data-toggle="' + p + 'tab">' + title + '</a></li>';
            }
            if (window.azexo_online)
                menu += '<li><a href="#az-elements-tab-templates" data-toggle="' + p + 'tab">' + t("Saved templates") + '</a></li>';
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
            if (window.azexo_online)
                tab = $('<div id="az-elements-tab-templates" class="' + p + 'tab-pane ' + p + 'clearfix"></div>');
            $(tabs_content).append(tab);
            $(elements_tabs).append(tabs_content);

            $('#az-elements-modal').remove();
            var header = '<div class="' + p + 'modal-header"><button type="button" class="' + p + 'close" data-dismiss="' + p + 'modal" aria-hidden="true">&times;</button><h4 class="' + p + 'modal-title">' + t("Elements list") + '</h4></div>';
            var elements_modal = $('<div id="az-elements-modal" class="' + p + 'modal azexo" style="display:none"><div class="' + p + 'modal-dialog ' + p + 'modal-lg"><div class="' + p + 'modal-content">' + header + '<div class="' + p + 'modal-body"></div></div></div></div>');
            $('body').prepend(elements_modal);
            $(elements_modal).find('.' + p + 'modal-body').append(elements_tabs);
            $(elements_tabs).find('> ul a:first')[fp + 'tab']('show');
            $(elements_modal).find('[data-az-element]').click(function() {
                var key = $(this).attr('data-az-element');
                var child = azexo_elements.create_element(container, key, false, pre_render_callback);
                if (child) {
                    $('#az-elements-modal')[fp + 'modal']("hide");
                    if (child.show_settings_on_create) {
                        child.edit();
                    }
                }
            });
            if (window.azexo_online)
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
            $(document).trigger("azexo_delete_element", id);
            delete this.elements_instances[id];
        },
        add_element: function(id, element, position) {
            this.elements_instances[id] = element;
            $(document).trigger("azexo_add_element", {id: id, position: position});
        },
    });
//
//
//
    function BaseElement(parent, position) {
        if (azexo_frontend)
            this.id = _.uniqueId('f');
        else
            this.id = _.uniqueId('b');
        if (parent != null) {
            this.parent = parent;
            if (typeof position === 'boolean') {
                if (position)
                    parent.children.push(this);
                else
                    parent.children.unshift(this);
            } else {
                parent.children.splice(position, 0, this);
            }
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
        azexo_elements.add_element(this.id, this, position);
    }
    var classes = {};
    if ('azexo_classes' in window)
        classes = window.azexo_classes;
    BaseElement.prototype = {
        el_classes: $.extend(_.object([p + 'optgroup-bootstrap', p + 'bg-primary', p + 'text-primary', p + 'bg-success', p + 'text-success', p + 'bg-default', p + 'text-default', p + 'text-muted', p + 'small', p + 'text-left', p + 'text-right', p + 'text-center', p + 'text-justify', p + 'pull-left', p + 'pull-right', p + 'center-block', p + 'well', p + 'visible-xs-block', p + 'visible-sm-block', p + 'visible-md-block', p + 'visible-lg-block', p + 'hidden-xs', p + 'hidden-sm', p + 'hidden-md', p + 'hidden-lg'], [t("Bootstrap classes"), t("Background primary style"), t("Text primary style"), t("Background success style"), t("Text success style"), t("Background default style"), t("Text default style"), t("Text muted style"), t("Text small style"), t("Text align left"), t("Text align right"), t("Text align center"), t("Text align justify"), t("Pull left"), t("Pull right"), t("Block align center"), t("Well"), t("Visible on extra small devices, phones (<768px)"), t("Visible on small devices, tablets (≥768px)"), t("Visible on medium devices, desktops (≥992px)"), t("Visible on large devices, desktops (≥1200px)"), t("Hidden on extra small devices, phones (<768px)"), t("Hidden on small devices, tablets (≥768px)"), t("Hidden on medium devices, desktops (≥992px)"), t("Hidden on large devices, desktops (≥1200px)")]), classes),
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
        thumbnail: '',
        is_container: false,
        has_content: false,
        frontend_render: false,
        show_settings_on_create: false,
        wrapper_class: '',
        weight: 0,
        hidden: false,
        disallowed_elements: [],
        show_parent_controls: false,
        highlighted: true,
        style_selector: '',
        section: false,
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
        update_controls_zindex: function() {
            set_highest_zindex(this.controls);
        },
        show_controls: function() {
            if (window.azexo_editor) {
                var element = this;
                this.controls = $('<div class="controls ' + p + 'btn-group ' + p + 'btn-group-xs"></div>').prependTo(this.dom_element);
                setTimeout(function() {
                    element.update_controls_zindex();
                }, 3000);

                $('<span title="' + title("Drag and drop") + '" class="control drag-and-drop ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon ' + p + 'glyphicon-move">' + this.name + '</span>').appendTo(this.controls);

                if (this.is_container && !this.has_content) {
                    $('<button title="' + title("Add") + '" type="button" class="control add ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-plus"> </button>').appendTo(this.controls).click({object: this}, this.click_add);
                    $('<button title="' + title("Paste") + '" type="button" class="control paste ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-hand-down"> </button>').appendTo(this.controls).click({object: this}, this.click_paste);
                }

                $('<button title="' + title("Edit") + '" type="button" class="control edit ' + p + 'btn ' + p + 'btn-warning ' + p + 'glyphicon ' + p + 'glyphicon-pencil"> </button>').appendTo(this.controls).click({object: this}, this.click_edit);
                $('<button title="' + title("Copy") + '" type="button" class="control copy ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-briefcase"> </button>').appendTo(this.controls).click({object: this}, this.click_copy);
                $('<button title="' + title("Clone") + '" type="button" class="control clone ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-repeat"> </button>').appendTo(this.controls).click({object: this}, this.click_clone);
                $('<button title="' + title("Remove") + '" type="button" class="control remove ' + p + 'btn ' + p + 'btn-danger ' + p + 'glyphicon ' + p + 'glyphicon-remove"> </button>').appendTo(this.controls).click({object: this}, this.click_remove);
                if (window.azexo_online)
                    $('<button title="' + title('Save as template') + '" type="button" class="control save-template ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-floppy-save"> </button>').appendTo(this.controls).click({object: this}, this.click_save_template);
                this.update_empty();

                setTimeout(function() {
                    element.controls_position();
                }, 1000);
                $(window).scroll(function() {
                    element.controls_position();
                });

                var element = this;
                if (this.highlighted) {
                    element.middle_click_number = 0;
                    $(this.dom_element).on('mousedown', function(e) {
                        if (e.which == 2) {
                            element.middle_click_number++;
                            var i = 1;
                            var parent = element;
                            var last = false;
                            while (i < element.middle_click_number) {
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
                            $('.az-element').removeClass('az-highlight');
                            if (!last) {
                                if (parent instanceof LayersElement) {
                                    if (parent.layer_number < parent.children.length) {
                                        var layer = parent.children[parent.layer_number];
                                        $(layer.dom_element).find(' > .controls').css('visibility', 'visible').css('opacity', '1').find(' > .control').css('opacity', '1');
                                        $(layer.dom_element).addClass('az-highlight');
                                        element.middle_click_number--;
                                        parent.layer_number++;
                                    } else {
                                        $(parent.dom_element).find(' > .controls').css('visibility', 'visible').css('opacity', '1').find(' > .control').css('opacity', '1');
                                        $(parent.dom_element).addClass('az-highlight');
                                        parent.layer_number = 0;
                                    }
                                } else {
                                    $(parent.dom_element).find(' > .controls').css('visibility', 'visible').css('opacity', '1').find(' > .control').css('opacity', '1');
                                    $(parent.dom_element).addClass('az-highlight');
                                }
                            } else {
                                element.middle_click_number = 0;
                            }
                            return false;
                        }
                    });
                    $(this.dom_element).mouseenter(function(e) {
                        element.middle_click_number = 0;
                        if (element instanceof LayersElement)
                            element.layer_number = 0;
                    });
                    $(this.dom_element).mouseleave(function(e) {
                        if ($(element.dom_element).hasClass('az-highlight')) {
                            $('.controls').css('visibility', '').css('opacity', '');
                            $('.control').css('opacity', '')
                            $('.az-element').removeClass('az-highlight');
                        }
                    });
                }
                if (element.show_parent_controls) {
                    _.defer(function() {
                        var parent = element.parent;
                        if (_.isString(element.show_parent_controls)) {
                            parent = azexo_elements.get_element($(element.dom_element).closest(element.show_parent_controls).attr('data-az-id'));
                        }
                        function update_controls(element) {
                            if ($(parent.controls).find('.' + p + 'btn:not(span)').css('display') == 'none') {
                                $(element.controls).find('.' + p + 'btn:not(span)').css('display', 'inline-block');
                            } else {
                                $(element.controls).find('.' + p + 'btn:not(span)').css('display', 'none');
                            }
                            if ($(element.controls).find('.' + p + 'btn:not(span)').css('display') == 'none') {
                                $(parent.controls).find('.' + p + 'btn:not(span)').css('display', 'inline-block');
                            } else {
                                $(parent.controls).find('.' + p + 'btn:not(span)').css('display', 'none');
                            }
                            $(parent.controls).attr('data-az-cid', $(element.dom_element).attr('data-az-id'));
                            var offset = $(element.dom_element).offset();
                            offset.top = offset.top - parseInt($(element.dom_element).css('margin-top'));
                            $(parent.controls).offset(offset);
                            offset.left = offset.left + $(parent.controls).width() - 1;
                            $(element.controls).offset(offset);
                        }
                        $(element.dom_element).off('mouseenter').on('mouseenter', function() {
                            $(element.dom_element).data('hover', true);
                            if ($(element.dom_element).parents('.azexo-editor').length > 0) {
                                $(parent.controls).css('display', 'block');
                                update_controls(element);
                            }
                        });
                        $(element.dom_element).off('mouseleave').on('mouseleave', function() {
                            $(element.dom_element).data('hover', false);
                            if ($(element.dom_element).parents('.azexo-editor').length > 0) {
                                $(element.controls).css('display', '');
                            }
                        });
                        setInterval(function() {
                            if ($(element.dom_element).parents('.azexo-editor').length > 0) {
                                if (!$(element.dom_element).data('hover') && !$(parent.controls).data('hover')) {
                                    $(element.controls).css('display', '');
                                }
                                if ($(element.dom_element).data('hover')) {
                                    update_controls(element);
                                    $(element.controls).css('visibility', 'visibile');
                                    $(element.controls).css('opacity', '1');
                                }
                                var e = azexo_elements.get_element($(parent.controls).closest('[data-az-cid]').attr('data-az-cid'));
                                if (!_.isUndefined(e))
                                    $(parent.controls).css('display', $(e.controls).css('display'));
                                if (_.isUndefined($(parent.controls).data('spc'))) {
                                    $(parent.controls).off('mouseenter').on('mouseenter', function() {
                                        $(parent.controls).data('hover', true);
                                        var el = azexo_elements.get_element($(this).closest('[data-az-cid]').attr('data-az-cid'));
                                        if (!_.isUndefined(el))
                                            $(el.controls).css('display', 'block');
                                    });
                                    $(parent.controls).off('mouseleave').on('mouseleave', function() {
                                        $(parent.controls).data('hover', false);
                                    });
                                    $(parent.controls).data('spc', true);
                                }
                            }
                        }, 100);
                        $(element.controls).find('span').off('click').on('click', function() {
                            $(element.controls).find('.' + p + 'btn:not(span)').css('display', 'inline-block');
                            $(parent.controls).find('.' + p + 'btn:not(span)').css('display', 'none');
                            update_controls(element);
                            return false;
                        });
                        $(parent.controls).find('span').off('click').on('click', function() {
                            $(parent.controls).find('.' + p + 'btn:not(span)').css('display', 'inline-block');
                            var el = azexo_elements.get_element($(this).closest('[data-az-cid]').attr('data-az-cid'));
                            if (!_.isUndefined(el)) {
                                $(el.controls).find('.' + p + 'btn:not(span)').css('display', 'none');
                                update_controls(el);
                            }
                            return false;
                        });
                        $(element.controls).find('span').trigger('click');
                    });
                }
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
            if (this.thumbnail == '') {
                return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'pull-left ' + p + 'text-overflow" data-az-element="' + this.base + '"><i class="' + p + 'text-primary ' + this.icon + '"></i><div>' + this.name + '</div><div class="' + p + 'text-muted ' + p + 'small">' + this.description + '</div></div>';
            } else {
                return '<div class="' + p + 'well ' + p + 'pull-left" data-az-element="' + this.base + '" style="background-image: url(' + encodeURI(this.thumbnail) + '); background-position: center center; background-size: cover;"></div>';
            }
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
//                        tolerance: "pointer",
//                        distance: 1,
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
        get_hover_style: function() {
            if ('hover_style' in this.attrs)
                return '<style id="hover-style-' + this.id + '">.hover-style-' + this.id + ':hover ' + this.style_selector + ' { ' + this.attrs['hover_style'] + '} </style>';
            else
                return '';
        },
        restore: function(dom) {
        },
        recursive_restore: function(dom) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].recursive_restore(dom);
            }
            this.restore(dom);
        },
        showed: function($, p, fp) {
            if ('pos_left' in this.attrs && this.attrs['pos_left'] != '')
                $(this.dom_element).css("left", this.attrs['pos_left']);
            if ('pos_right' in this.attrs && this.attrs['pos_right'] != '')
                $(this.dom_element).css("right", this.attrs['pos_right']);
            if ('pos_top' in this.attrs && this.attrs['pos_top'] != '')
                $(this.dom_element).css("top", this.attrs['pos_top']);
            if ('pos_bottom' in this.attrs && this.attrs['pos_bottom'] != '')
                $(this.dom_element).css("bottom", this.attrs['pos_bottom']);
            if ('pos_width' in this.attrs && this.attrs['pos_width'] != '')
                $(this.dom_element).css("width", this.attrs['pos_width']);
            if ('pos_height' in this.attrs && this.attrs['pos_height'] != '')
                $(this.dom_element).css("height", this.attrs['pos_height']);
            if ('pos_zindex' in this.attrs && this.attrs['pos_zindex'] != '')
                $(this.dom_element).css("z-index", this.attrs['pos_zindex']);
            if ('hover_style' in this.attrs && this.attrs['hover_style'] != '') {
                $('head').find('#hover-style-' + this.id).remove();
                $('head').append(this.get_hover_style());
                $(this.dom_element).addClass('hover-style-' + this.id);
            }
        },
        render: function($, p, fp) {
            $(this.dom_element).attr('data-az-id', this.id);
        },
        trigger_start_in_animation: function() {
            for (var i = 0; i < this.children.length; i++) {
                if ('trigger_start_in_animation' in this.children[i]) {
                    this.children[i].trigger_start_in_animation();
                }
            }
        },
        trigger_start_out_animation: function() {
            for (var i = 0; i < this.children.length; i++) {
                if ('trigger_start_out_animation' in this.children[i]) {
                    this.children[i].trigger_start_out_animation();
                }
            }
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
            if (element) {
                ui.source = azexo_elements.get_element($(this).closest('[data-az-id]').attr('data-az-id'));
                ui.from_pos = element.get_child_position();
                ui.source.update_sorting_children();
                ui.target = azexo_elements.get_element($(ui.item).parent().closest('[data-az-id]').attr('data-az-id'));
                if (ui.source.id != ui.target.id)
                    ui.target.update_sorting_children();
                ui.to_pos = element.get_child_position();
                $(document).trigger("azexo_update_sorting", ui);
            }
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
            $(document).trigger("azexo_edited_element", this.id);
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
            $(document).trigger("azexo_edited_element", this.id);
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
                    if (content.substring(0, 1) == '[' && content.slice(-1) == ']')
                        this.parse_shortcode('[az_unknown]' + content + '[/az_unknown]');
                    else
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

                var constructor = UnknownElement;
                if (shortcode in BaseElement.prototype.tags) {
                    constructor = BaseElement.prototype.tags[shortcode];
                }
                if (this instanceof ContainerElement && this.parent == null && !constructor.prototype.section) {
                    this.parse_shortcode('[az_section]' + content + '[/az_section]');
                    return;
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
                if ('update_empty' in element)
                    element.update_empty();
                if ('update_empty' in column)
                    column.update_empty();
                if ('update_empty' in row)
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
    function UnknownElement(parent, position) {
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
    if (!('azexo_online' in window))
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
            $('#az-exporter').show();
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
            $('#az-exporter').hide();
        }
    }
    function try_login() {
        if (!('ajaxurl' in window))
            if (!window.azexo_editor || window.azexo_online)
                delete window.azexo_editor;
        azexo_login(function(data) {
            window.azexo_editor = data;
            $(function() {
                toggle_editor_controls();
            })
            if (!data && 'azexo_exporter' in window)
                open_settings_form();
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
        if ('azexo_exporter' in window)
            enable_exporter();
        $.holdReady(false);
    });
    function connect_container(dom_element) {
        if ($(dom_element).length > 0) {
            var html = $(dom_element).html();
            var match = /^\s*\<[\s\S]*\>\s*$/.exec(html);
            if (match || (html == '' && 'ajaxurl' in window)) {
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
                $(container.dom_element).addClass('az-ctnr');
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
                $(container.dom_element).addClass('az-ctnr');
                var type = $(dom_element).attr('data-az-type');
                var name = $(dom_element).attr('data-az-name');
                $(dom_element).replaceWith(container.dom_element);
                $(container.dom_element).attr('data-az-type', type);
                $(container.dom_element).attr('data-az-name', name);
                container.showed($, p, fp);
                if (window.azexo_editor)
                    container.show_controls();
            }
            if (window.azexo_editor) {
                $(container.dom_element).addClass('azexo-editor');
            }
            return container;
        }
        return null;
    }
    var azexo_loaded = false;
    function open_settings_form() {
        $('#az-admin-modal').remove();
        var header = '<div class="' + p + 'modal-header"><button type="button" class="' + p + 'close" data-dismiss="' + p + 'modal" aria-hidden="true">&times;</button><h4 class="' + p + 'modal-title">' + t("Azexo Composer") + '</h4></div>';
        var footer = '<div class="' + p + 'modal-footer"><button type="button" class="' + p + 'btn ' + p + 'btn-default" data-dismiss="' + p + 'modal">' + t("Close") + '</button><button type="button" class="save ' + p + 'btn ' + p + 'btn-primary">' + t("Save changes") + '</button></div>';
        var modal = $('<div id="az-admin-modal" class="' + p + 'modal azexo"><div class="' + p + 'modal-dialog ' + p + 'modal-lg"><div class="' + p + 'modal-content">' + header + '<div class="' + p + 'modal-body"></div>' + footer + '</div></div></div>').prependTo('body');
        var form = null;
        azexo_get_settings_form(function(data) {
            if (data.length > 0 && data != '0' && data != 'false') {
                form = $(data).on('keydown.azexo', function(event) {
                    if (event.keyCode == 13) {
                        $('#az-admin-modal').find('.save').click();
                    }
                });
                $(modal).find('.' + p + 'modal-body').append(form);
                if (window.azexo_editor) {
                    $('<button type="button" class="' + p + 'btn ' + p + 'btn-default" data-dismiss="' + p + 'modal">' + t("Logout") + '</button>').appendTo('#az-admin-modal .modal-footer').click(function() {
                        setCookie('azexo_password', '', null);
                        window.location.reload();
                    });
                }
                $('#az-admin-modal').find('.save').click(function() {
                    azexo_submit_settings_form(form.serialize(), function(data) {
                        if (data)
                            window.location.reload();
                        $('#az-admin-modal')[fp + 'modal']("hide");
                    });
                    return false;
                });
                $('#az-admin-modal')[fp + 'modal']('show');
            }
        });
    }
    function azexo_load() {
        if (azexo_loaded)
            return;
        azexo_loaded = true;
        $('.az-container').each(function() {
            var container = connect_container(this);
            if (container)
                azexo_containers.push(container);
        });
        if (window.azexo_editor) {
            if ($('#azexo-clipboard').length == 0) {
                $('body').prepend('<div id="azexo-clipboard" class="azexo-backend" style="display:none"></div>');
            }
        }
        $('body').on('keydown.azexo', function(event) {
            if (event.ctrlKey && event.altKey) {
                open_settings_form();
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
                            var type = 'textarea';
                            var name = Math.random().toString(36).substr(2);
                            if (window.azexo_online) {
                                type = window.azexo_type;
                                name = window.azexo_name;
                            }
                            container_dom = $('<div class="az-element az-container" data-az-type="' + type + '" data-az-name="' + name + '"></div>').insertAfter(textarea);
                            container_dom.append($(dom).html());
                        }

                        window.azexo_title['Save container'] = t('Generate HTML and JS for all elements which placed in current container element.');
                        var container = connect_container(container_dom);
                        if (container) {
                            azexo_containers.push(container);
                            $(textarea).data('azexo_composer', container);

                            container.save_container = function() {
                                azexo_add_js({
                                    path: 'js/json2.min.js',
                                    loaded: 'JSON' in window,
                                    callback: function() {
                                        _.defer(function() {
                                            if (container.id in azexo_elements.elements_instances) {
                                                var html = container.get_container_html();
                                                if (window.azexo_online) {
                                                    $(textarea).val(html);
                                                } else {
                                                    var type = container.attrs['container'].split('/')[0];
                                                    var name = container.attrs['container'].split('/')[1];
                                                    $(textarea).val('<div class="az-element az-container" data-az-type="' + type + '" data-az-name="' + name + '">' + html + '</div>');
                                                }
                                            }
                                        });
                                    }
                                });
                            };
                            $(document).on("azexo_add_element", container.save_container);
                            $(document).on("azexo_edited_element", container.save_container);
                            $(document).on("azexo_update_element", container.save_container);
                            $(document).on("azexo_delete_element", container.save_container);
                            $(document).on("azexo_update_sorting", container.save_container);
                        }
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
        "": t('No animation'),
        "js": t('JS animation'),
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
    };
    function AnimatedElement(parent, position) {
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
                heading: t('JS animation in'),
                param_name: 'an_js_in',
                tab: t('Animation'),
                value: {},
                dependency: {'element': 'an_in', 'value': ['js'], 'callback': function(caller_param) {
                        var param = this;
                        var element = this.element;
                        function animations_editor_remove() {
                            element.save_js_animations(false);
                            $(element.animations_editor).remove();
                            delete element.animations_editor;
                        }
                        if ('animations_editor' in element) {
                            animations_editor_remove();
                        }
                        function refresh_param() {
                            element.update_js_animations_list();
                            var el = param.dom_element;
                            var v = param.get_value();
                            param.render(v);
                            $(el).replaceWith(param.dom_element);
                        }
                        refresh_param();
                        $(caller_param.dom_element).find('select').off('change.an_js_in').on('change.an_js_in', function() {
                            var v = caller_param.get_value();
                            if (v != 'js') {
                                animations_editor_remove();
                            }
                        });
                        var form = $('<div id="az-js-animation-form" class="' + p + 'clearfix ' + p + 'form-group ' + p + 'well"></div>').insertAfter(this.dom_element);
                        element.show_js_animations_editor(form, false, function() {
                            refresh_param()
                        });
                        $('#az-editor-modal').find('.save').off('mousedown.an_js_in').on('mousedown.an_js_in', function() {
                            element.save_js_animations(false);
                        });
                    }},
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
                type: 'dropdown',
                heading: t('JS animation out'),
                param_name: 'an_js_out',
                tab: t('Animation'),
                value: {},
                dependency: {'element': 'an_out', 'value': ['js'], 'callback': function(caller_param) {
                        var param = this;
                        var element = this.element;
                        function animations_editor_remove() {
                            element.save_js_animations(false);
                            $(element.animations_editor).remove();
                            delete element.animations_editor;
                        }
                        if ('animations_editor' in element) {
                            animations_editor_remove();
                        }
                        function refresh_param() {
                            element.update_js_animations_list();
                            var el = param.dom_element;
                            var v = param.get_value();
                            param.render(v);
                            $(el).replaceWith(param.dom_element);
                        }
                        refresh_param();
                        $(caller_param.dom_element).find('select').off('change.an_js_out').on('change.an_js_out', function() {
                            var v = caller_param.get_value();
                            if (v != 'js') {
                                animations_editor_remove();
                            }
                        });
                        var form = $('<div id="az-js-animation-form" class="' + p + 'clearfix ' + p + 'form-group ' + p + 'well"></div>').insertAfter(this.dom_element);
                        element.show_js_animations_editor(form, false, function() {
                            refresh_param();
                        });
                        $('#az-editor-modal').find('.save').off('mousedown.an_js_out').on('mousedown.an_js_out', function() {
                            element.save_js_animations(false);
                        });
                    }},
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
                type: 'dropdown',
                heading: t('By letters?'),
                param_name: 'an_letters',
                tab: t('Animation'),
                value: {
                    '': t("No"),
                    'sequence': t("Sequence"),
                    'reverse': t("Reverse"),
                    'sync': t("Sync"),
                    'shuffle': t("Shuffle"),
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
                element.clear_animation();
                if (element.attrs['an_letters'] == '') {
                    if (element.attrs['an_in'] == 'js') {
                        $(element.dom_element).css('opacity', '');
                        var name_i = element.attrs['an_js_in'].split('-');
                        var e = azexo_elements.elements_instances_by_an_name[name_i[0]];
                        var scene = e.an_scenes[parseInt(name_i[1])];
                        element.timeline_in = element.make_timeline(scene, function() {
                            element.end_animation();
                        });
                        element.timeline_in.play();
                        element.animation_in = true;
                        element.animated = true;
                    } else {
                        $(element.dom_element).css('opacity', '');
                        $(element.dom_element).removeClass('animated');
                        $(element.dom_element).removeClass(element.attrs['an_in']);
                        $(element.dom_element).removeClass(element.attrs['an_out']);
                        element.animation_in = false;
                        element.animation_out = false;
                        $(element.dom_element).css('animation-duration', element.attrs['an_duration'] + 'ms');
                        $(element.dom_element).css('-webkit-animation-duration', element.attrs['an_duration'] + 'ms');
                        $(element.dom_element).css('animation-fill-mode', element.attrs['an_fill_mode']);
                        $(element.dom_element).css('-webkit-animation-fill-mode', element.attrs['an_fill_mode']);
                        $(element.dom_element).addClass('animated');
                        element.animated = true;
                        if (element.attrs['an_infinite'] == 'yes') {
                            $(element.dom_element).addClass('infinite');
                        }
                        $(element.dom_element).addClass(element.attrs['an_in']);
                        element.animation_in = true;
                    }
                } else {
                    element.animation_letters();
                    $(element.dom_element).css('opacity', '');
                    for (var i = 0; i < element.textillate_elements.length; i++) {
                        $(element.textillate_elements[i]).textillate('in');
                    }
                    element.animation_in = true;
                    element.animated = true;
                }
            }, Math.round(element.attrs['an_in_delay']));
        },
        start_in_animation: function() {
            var element = this;
            if ($(element.dom_element).parents('.azexo-animations-disabled').length == 0) {
                if (element.attrs['an_in'] != '' || element.attrs['an_js_in'] != '') {
                    if (element.animated) {
                        if (element.animation_out) {
                            //still out-animate
                            element.set_in_timeout();
                        } else {
                            if (element.out_timeout > 0) {
                                //plan to in-animate
                                clearTimeout(element.out_timeout);
                                if (!element.hidden_after_in) {
                                    element.set_in_timeout();
                                }
                            }
                        }
                    } else {
                        //no animate, no plan
                        element.set_in_timeout();
                    }
                }
            }
        },
        set_out_timeout: function() {
            var element = this;
            element.out_timeout = setTimeout(function() {
                element.clear_animation();
                if (element.attrs['an_letters'] == '') {
                    if (element.attrs['an_out'] == 'js') {
                        $(element.dom_element).css('opacity', '');
                        var name_i = element.attrs['an_js_out'].split('-');
                        var e = azexo_elements.elements_instances_by_an_name[name_i[0]];
                        var scene = e.an_scenes[parseInt(name_i[1])];
                        element.timeline_out = element.make_timeline(scene, function() {
                            element.end_animation();
                        });
                        element.timeline_out.play();
                        element.animation_out = true;
                        element.animated = true;
                    } else {
                        $(element.dom_element).css('opacity', '');
                        $(element.dom_element).removeClass('animated');
                        $(element.dom_element).removeClass(element.attrs['an_in']);
                        $(element.dom_element).removeClass(element.attrs['an_out']);
                        element.animation_in = false;
                        element.animation_out = false;
                        $(element.dom_element).css('animation-duration', element.attrs['an_duration'] + 'ms');
                        $(element.dom_element).css('-webkit-animation-duration', element.attrs['an_duration'] + 'ms');
                        $(element.dom_element).css('animation-fill-mode', element.attrs['an_fill_mode']);
                        $(element.dom_element).css('-webkit-animation-fill-mode', element.attrs['an_fill_mode']);
                        $(element.dom_element).addClass('animated');
                        element.animated = true;
                        if (element.attrs['an_infinite'] == 'yes') {
                            $(element.dom_element).addClass('infinite');
                        }
                        $(element.dom_element).addClass(element.attrs['an_out']);
                        element.animation_out = true;
                    }
                } else {
                    element.animation_letters();
                    $(element.dom_element).css('opacity', '');
                    for (var i = 0; i < element.textillate_elements.length; i++) {
                        $(element.textillate_elements[i]).textillate('out');
                    }
                    element.animation_out = true;
                    element.animated = true;
                }
            }, Math.round(element.attrs['an_out_delay']));
        },
        start_out_animation: function() {
            var element = this;
            if ($(element.dom_element).parents('.azexo-animations-disabled').length == 0) {
                if (element.attrs['an_out'] != '' || element.attrs['an_js_out'] != '') {
                    if (element.animated) {
                        if (element.animation_in) {
                            //still in-animate
                            element.set_out_timeout();
                        } else {
                            if (element.in_timeout > 0) {
                                //plan to in-animate
                                clearTimeout(element.in_timeout);
                                if (!element.hidden_before_in) {
                                    element.set_out_timeout();
                                }
                            }
                        }
                    } else {
                        //no animate, no plan
                        element.set_out_timeout();
                    }
                }
            }
        },
        clear_animation: function() {
            if (this.animation_in) {
                if (this.hidden_before_in) {
                    $(this.dom_element).css('opacity', '1');
                }
                if (this.hidden_after_in) {
                    $(this.dom_element).css('opacity', '0');
                }
            }
            if (this.animation_out) {
                if (this.hidden_before_in) {
                    $(this.dom_element).css('opacity', '0');
                }
                if (this.hidden_after_in) {
                    $(this.dom_element).css('opacity', '1');
                }
            }
            if (this.attrs['an_letters'] == '') {
                if ($(this.dom_element).hasClass('animated')) {
                    $(this.dom_element).css('animation-duration', '');
                    $(this.dom_element).css('-webkit-animation-duration', '');
                    $(this.dom_element).css('animation-fill-mode', '');
                    $(this.dom_element).css('-webkit-animation-fill-mode', '');
                    $(this.dom_element).removeClass('animated');
                    this.animated = false;
                    $(this.dom_element).removeClass('infinite');
                    if (this.attrs['an_fill_mode'] == '') {
                        $(this.dom_element).removeClass(this.attrs['an_in']);
                        $(this.dom_element).removeClass(this.attrs['an_out']);
                        this.animation_in = false;
                        this.animation_out = false;
                    }
                } else {
                    if ('timeline_in' in this) {
                        this.timeline_in.resume();
                        this.timeline_in.kill();
                        delete this['timeline_in'];
                    }
                    if ('timeline_out' in this) {
                        this.timeline_out.resume();
                        this.timeline_out.kill();
                        delete this['timeline_out'];
                    }
                    this.animation_in = false;
                    this.animation_out = false;
                    this.animated = false;
                }
            } else {
                if ('textillate_elements' in this) {
                    for (var i = 0; i < this.textillate_elements.length; i++) {
                        $(this.textillate_elements[i]).data('textillate', false);
                        $(this.textillate_elements[i]).find('> span').remove();
                        var text = $(this.textillate_elements[i]).find('> ul > li').text();
                        $(this.textillate_elements[i]).find('> ul').remove();
                        $(this.textillate_elements[i]).text(text);
                    }
                    this.textillate_elements = [];
                }
                this.animation_in = false;
                this.animation_out = false;
                this.animated = false;
            }
        },
        end_animation: function() {
            this.in_timeout = 0;
            this.out_timeout = 0;
            if (this.animation_in) {
                this.clear_animation();
                if (this.attrs['an_start'] == 'hover' && !this.hover) {
                    if (this.attrs['an_in'] != this.attrs['an_out']) {
                        this.start_out_animation();
                    } else {
                        if (this.attrs['an_in'] == 'js') {
                            if (this.attrs['an_js_in'] != this.attrs['an_js_out']) {
                                this.start_out_animation();
                            }
                        }
                    }
                }
            }
            if (this.animation_out) {
                this.clear_animation();
                if (this.attrs['an_start'] == 'hover' && this.hover) {
                    if (this.attrs['an_in'] != this.attrs['an_out']) {
                        this.start_in_animation();
                    } else {
                        if (this.attrs['an_in'] == 'js') {
                            if (this.attrs['an_js_in'] != this.attrs['an_js_out']) {
                                this.start_in_animation();
                            }
                        }
                    }
                }
            }
        },
        trigger_start_in_animation: function() {
            if (this.attrs['an_start'] == 'trigger') {
                this.start_in_animation();
            } else {
                AnimatedElement.baseclass.prototype.trigger_start_in_animation.apply(this, arguments);
            }
        },
        trigger_start_out_animation: function() {
            if (this.attrs['an_start'] == 'trigger') {
                this.start_out_animation();
            } else {
                AnimatedElement.baseclass.prototype.trigger_start_out_animation.apply(this, arguments);
            }
        },
        animation_letters: function() {
            var element = this;
            element.textillate_elements = [];
            var c = 0;
            var n = 0;
            $(element.dom_element).find(':not(:has(*)):not(.control)').each(function() {
                var text = $(this).text().trim();
                if (text != '') {
                    c++;
                    var sync = false;
                    var shuffle = false;
                    var reverse = false;
                    switch (element.attrs['an_letters']) {
                        case 'sequence':
                            break;
                        case 'reverse':
                            reverse = true;
                            break;
                        case 'sync':
                            sync = true;
                            break;
                        case 'shuffle':
                            shuffle = true;
                            break;
                    }
                    element.textillate_elements.push(this);
                    $(this).textillate();
                    $(this).textillate({
                        loop: false,
                        autoStart: false,
                        in: {
                            effect: element.attrs['an_in'],
                            delayScale: 1.5,
                            delay: parseInt(element.attrs['an_duration']) / text.length,
                            sync: sync,
                            shuffle: shuffle,
                            reverse: reverse,
                            callback: function() {
                                n++;
                                if (c >= n) {
                                    element.end_animation();
                                }
                            }
                        },
                        out: {
                            effect: element.attrs['an_out'],
                            delayScale: 1.5,
                            delay: parseInt(element.attrs['an_duration']) / text.length,
                            sync: sync,
                            shuffle: shuffle,
                            reverse: reverse,
                            callback: function() {
                                n++;
                                if (c >= n) {
                                    element.end_animation();
                                }
                            }
                        },
                    }).on('inAnimationBegin.tlt outAnimationBegin.tlt', function() {
                        n = 0;
                    });
                    $(this).data('textillate').currentIndex = 0;
                }
            });
        },
        animation: function() {
            var element = this;
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
            if (element.attrs['an_start'] != '') {
                element.in_timeout = 0;
                element.out_timeout = 0;
                element.animated = false;
                element.animation_in = false;
                element.animation_out = false;
                if (element.attrs['an_letters'] != '') {
                    //element.animation_letters();
                } else {
                    $(element.dom_element).off('webkitAnimationEnd.az_animation mozAnimationEnd.az_animation MSAnimationEnd.az_animation oanimationend.az_animation animationend.az_animation');
                    $(element.dom_element).on('webkitAnimationEnd.az_animation mozAnimationEnd.az_animation MSAnimationEnd.az_animation oanimationend.az_animation animationend.az_animation', function() {
                        element.end_animation();
                    });
                }
                var callback = function() {
                    $(parent).off('click.az_animation' + element.id);
                    $(parent).off('mouseenter.az_animation' + element.id);
                    $(parent).off('mouseleave.az_animation' + element.id);
                    switch (element.attrs['an_start']) {
                        case 'click':
                            $(parent).on('click.az_animation' + element.id, function() {
                                if (!element.animated) {
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
                                        if (!element.animated) {
                                            element.start_in_animation();
                                        }
                                    }, {offset: '100%', triggerOnce: true});
                                    $(document).trigger('scroll');
                                }});
                            break;
                        case 'hover':
                            $(parent).on('mouseenter.az_animation' + element.id, function() {
                                element.hover = true;
                                element.start_in_animation();
                            });
                            $(parent).on('mouseleave.az_animation' + element.id, function() {
                                element.hover = false;
                                element.start_out_animation();
                            });
                            break;
                        case 'trigger':
                            break;
                        default:
                            break;
                    }
                };
                element.add_css('animate.css/animate.min.css', false, function() {
                    if (element.attrs['an_letters'] == '') {
                        if (element.attrs['an_js_in'] != '' || element.attrs['an_js_out'] != '') {
                            element.add_js_list({
                                paths: ['ScrollMagic/js/_dependent/greensock/TweenMax.min.js', 'ScrollMagic/js/_dependent/greensock/TimelineMax.min.js'],
                                loaded: ('TimelineMax' in window) && ('TweenMax' in window),
                                callback: callback
                            });
                        } else {
                            callback();
                        }
                    } else {
                        element.add_js_list({
                            paths: ['textillate/assets/jquery.lettering.js', 'js/textillate.js'],
                            loaded: ('textillate' in $.fn) && ('lettering' in $.fn),
                            callback: callback
                        });
                    }
                });
            }
        },
        update_js_animations_list: function() {
            var animations = {};
            for (var name in azexo_elements.elements_instances_by_an_name) {
                for (var i = 0; i < azexo_elements.elements_instances_by_an_name[name].an_scenes.length; i++) {
                    if (azexo_elements.elements_instances_by_an_name[name].an_name == name) {
                        if (azexo_elements.elements_instances_by_an_name[name].an_scenes[i].duration == '-1')
                            animations[name + '-' + i] = i + ' ' + t('scene in') + ' ' + name + ' ' + t('animations set');
                    }
                }
            }
            for (var i = 0; i < this.params.length; i++) {
                if (this.params[i].param_name == 'an_js_in' || this.params[i].param_name == 'an_js_out') {
                    this.params[i].value = animations;
                }
            }
        },
        edit: function() {
            this.update_js_animations_list();
            AnimatedElement.baseclass.prototype.edit.apply(this, arguments);
        },
        clone: function() {
            this.clear_animation();
            AnimatedElement.baseclass.prototype.clone.apply(this, arguments);
        },
        show_js_animations_editor: function(form, scroll, callback) {
            var element = this;
            element.animations_editor = form;
            $('<div class="tree ' + p + 'col-sm-5"></div><div class="options ' + p + 'col-sm-7"></div>').appendTo(form);
            azexo_add_css('jstree/dist/themes/default/style.min.css', function() {
            });
            var help = '';
            if (scroll)
                help = t("Name to identify this element in scroll animations");
            else
                help = t("Name to identify this JS animations set");
            $(form).find('.tree').append('<div class="' + p + 'form-group an-name"><label>' + t("Name") + '</label><div><input class="' + p + 'form-control" name="an_name" type="text" value="' + element.an_name + '" required ></div><p class="' + p + 'help-block">' + help + '</p></div>');
            azexo_add_js({
                path: 'jstree/dist/jstree.min.js',
                loaded: 'jstree' in $.fn,
                callback: function() {
                    var index = {};
                    var index_type = {};
                    var index_parents = {};
                    function scene_title(scene) {
                        switch (scene.duration) {
                            case '-1':
                                return t("Real time scene");
                                break;
                            case '0':
                                return t("Scroll real time scene") + ':' + scene.offset + '|' + scene.triggerHook;
                                break;
                            default:
                                return t("Scroll scene") + ':' + scene.duration + '|' + scene.offset + '|' + scene.triggerHook;
                                break;
                        }
                    }
                    function tween_title(tween) {
                        return t("Tween") + ':' + tween.target + '|' + tween.duration;
                    }
                    function get_scene(id) {
                        $(form).find('.options').empty();
                        if (scroll && index[id].duration != '-1')
                            $(form).find('.options').append('<div class="' + p + 'form-group"><label>' + t("Type") + '</label><div class="' + p + 'radio"><div class="' + p + 'radio"><label><input type="radio" name="type" value="scroll">' + t("Scroll position as time line") + '</label></div><div class="' + p + 'radio"><label><input type="radio" name="type" value="real">' + t("Real time fired by scroll position") + '</label></div></div>');
                        else
                            $('<div class="' + p + 'form-group"><label>' + t("Type") + '</label><div class="' + p + 'radio"><label><input type="radio" name="type" value="library">' + t("Real time, store in library") + '</label></div></div>').appendTo($(form).find('.options')).css('display', 'none');
                        $(form).find('.options [name="type"]').on('change', function() {
                            if ($(this).is(':checked')) {
                                switch ($(this).val()) {
                                    case 'library':
                                        $(form).find('.options .' + p + 'form-group.repeat, .options .' + p + 'form-group.repeatdelay').css('display', 'block');
                                        $(form).find('.options .' + p + 'form-group.duration, .options .' + p + 'form-group.offset, .options .' + p + 'form-group.trigger, .options .' + p + 'form-group.pin').css('display', 'none');
                                        index[id].duration = '-1';
                                        tree.jstree('edit', id, scene_title(index[id]));
                                        break;
                                    case 'scroll':
                                        $(form).find('.options .' + p + 'form-group.duration, .options .' + p + 'form-group.offset, .options .' + p + 'form-group.trigger, .options .' + p + 'form-group.pin').css('display', 'block');
                                        $(form).find('.options .' + p + 'form-group.repeat, .options .' + p + 'form-group.repeatdelay').css('display', 'none');
                                        $(form).find('.options [name="duration"]').val('1000');
                                        index[id].duration = $(form).find('.options [name="duration"]').val();
                                        tree.jstree('edit', id, scene_title(index[id]));
                                        break;
                                    case 'real':
                                        $(form).find('.options .' + p + 'form-group.duration').css('display', 'none');
                                        $(form).find('.options .' + p + 'form-group.repeat, .options .' + p + 'form-group.repeatdelay, .options .' + p + 'form-group.offset, .options .' + p + 'form-group.trigger, .options .' + p + 'form-group.pin').css('display', 'block');
                                        index[id].duration = '0';
                                        tree.jstree('edit', id, scene_title(index[id]));
                                        break;
                                }
                            }
                        });
                        switch (index[id].duration) {
                            case '-1':
                                $(form).find('.options [name="type"][value="library"]').attr('checked', 'checked');
                                break;
                            case '0':
                                $(form).find('.options [name="type"][value="real"]').attr('checked', 'checked');
                                break;
                            default:
                                $(form).find('.options [name="type"][value="scroll"]').attr('checked', 'checked');
                                break;
                        }

                        $(form).find('.options').append('<div class="' + p + 'form-group duration"><label>' + t("Duration") + '</label><div><input class="' + p + 'form-control" name="duration" type="text" value="' + index[id].duration + '"></div><p class="' + p + 'help-block">' + t("The duration of the scene in pixels") + '</p></div>');
                        $(form).find('.options [name="duration"]').on('change', function() {
                            index[id].duration = $(this).val();
                            tree.jstree('edit', id, scene_title(index[id]));
                        });

                        $(form).find('.options').append('<div class="' + p + 'form-group offset"><label>' + t("Offset") + '</label><div><input class="' + p + 'form-control" name="offset" type="text" value="' + index[id].offset + '"></div><p class="' + p + 'help-block">' + t("Offset Value (in pixels) for the Trigger Position.") + '</p></div>');
                        $(form).find('.options [name="offset"]').on('change', function() {
                            index[id].offset = $(this).val();
                            tree.jstree('edit', id, scene_title(index[id]));
                        });

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

                        var hook = ["onEnter", "onCenter", "onLeave"];
                        hook = _.object(hook, hook);
                        $(form).find('.options').append('<div class="' + p + 'form-group trigger"><label>' + t("Trigger hook") + '</label><div>' + get_select(hook, 'trigger-hook', index[id].triggerHook) + '</div><p class="' + p + 'help-block">' + t("Trigger hook") + '</p></div>');
                        $(form).find('.options [name="trigger-hook"]').on('change', function() {
                            index[id].triggerHook = $(this).val();
                            tree.jstree('edit', id, scene_title(index[id]));
                        });
                        $(form).find('.options').append('<div class="' + p + 'form-group pin"><label>' + t("Pin") + '</label><div>' + get_select(_.object(_.keys(azexo_elements.elements_instances_by_an_name), _.keys(azexo_elements.elements_instances_by_an_name)), 'pin', index[id].pin) + '</div><p class="' + p + 'help-block">' + t("Pin element") + '</p></div>');
                        $(form).find('.options [name="pin"]').on('change', function() {
                            index[id].pin = $(this).val();
                        });
                        $(form).find('.options [name="type"]').trigger('change');
                    }
                    function add_scene(duration) {
                        element.an_scenes.push({duration: duration.toString(), offset: 0, triggerHook: 'onCenter', timeline: [], repeat: '0', repeatDelay: '0'});
                        var id = tree.jstree('create_node', '#', {type: 'scene', text: scene_title(element.an_scenes[element.an_scenes.length - 1]), state: {opened: true}}, 'last');
                        index[id] = element.an_scenes[element.an_scenes.length - 1];
                        index_type[id] = 'scene';
                        add_step(id);
                        if (!scroll) {
                            element.an_name = $(form).find('.tree [name="an_name"]').val();
                            if (element.an_name != '') {
                                element.attrs['an_name'] = element.an_name;
                                azexo_elements.elements_instances_by_an_name[element.an_name] = element;
                                $(element.dom_element).attr('data-an-name', element.an_name);
                                var i = element.an_scenes.length - 1;
                                var name = element.an_name;
                                callback();
                            }
                        }
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
                        if (index[scene].duration != '-1') {
                            $(form).find('.options').append('<div class="' + p + 'form-group"><label>' + t("Target") + '</label><div>' + get_select(_.object(_.keys(azexo_elements.elements_instances_by_an_name), _.keys(azexo_elements.elements_instances_by_an_name)), 'target', index[id].target) + '</div><p class="' + p + 'help-block">' + t("Target element") + '</p></div>');
                            $(form).find('.options [name="target"]').on('change', function() {
                                index[id].target = $(this).val();
                                tree.jstree('edit', id, tween_title(index[id]));
                            });
                        }
                        $(form).find('.options').append('<div class="' + p + 'form-group duration"><label>' + t("Duration") + '</label><div><input class="' + p + 'form-control" name="duration" type="text" value="' + index[id].duration + '"></div><p class="' + p + 'help-block">' + t("Duration of the tween in seconds.") + '</p></div>');
                        $(form).find('.options [name="duration"]').on('change', function() {
                            index[id].duration = $(this).val();
                            tree.jstree('edit', id, tween_title(index[id]));
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
                            var group = $('<div><div class="' + p + 'form-group properties"></div><div class="add-property"></div></div>').appendTo(container);
                            for (var pr in obj[name]) {
                                var row = add_property($(group).find('.properties'), pr, obj[name][pr]);
                            }
                            $('<button title="' + title("Add property") + '" class="add-property ' + p + 'btn ' + p + 'btn-default">' + t("Add property") + '</button>').appendTo($(group).find('.add-property')).click(function() {
                                add_property($(group).find('.properties'), '', '');
                                return false;
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
                        if (index[scene].duration != '0' && index[scene].duration != '-1') {
                            $(form).find('.options .' + p + 'form-group.duration').css('display', 'none');
                            $(form).find('.options .' + p + 'form-group.delay').css('display', 'none');
                        }
                    }
                    function add_tween(step) {
                        index[step].tweens.push({target: '', duration: 1, from: {}, to: {}, ease: 'Linear.easeNone', delay: '0'});
                        var id = tree.jstree('create_node', step, {type: 'tween', text: tween_title(index[step].tweens[index[step].tweens.length - 1]), state: {opened: true}}, 'last');
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
                            if ((scroll && element.an_scenes[i].duration != '-1') || (!scroll && element.an_scenes[i].duration == '-1')) {
                                var scene = tree.jstree('create_node', '#', {type: 'scene', text: scene_title(element.an_scenes[i]), state: {opened: true}}, 'last');
                                index[scene] = element.an_scenes[i];
                                index_type[scene] = 'scene';
                                for (var j = 0; j < element.an_scenes[i].timeline.length; j++) {
                                    var step = tree.jstree('create_node', scene, {type: 'step', text: t("Step") + ':' + j.toString(), state: {opened: true}}, 'last');
                                    index[step] = element.an_scenes[i].timeline[j];
                                    index_type[step] = 'step';
                                    index_parents[step] = scene;
                                    for (var k = 0; k < element.an_scenes[i].timeline[j].tweens.length; k++) {
                                        var tween = tree.jstree('create_node', step, {type: 'tween', text: tween_title(element.an_scenes[i].timeline[j].tweens[k]), state: {opened: true}}, 'last');
                                        index[tween] = element.an_scenes[i].timeline[j].tweens[k];
                                        index_type[tween] = 'tween';
                                        index_parents[tween] = step;
                                    }
                                }
                            }
                        }
                    }
                    element.add_scene_to_animations_editor = function(scene) {
                        element.an_scenes.push(scene);
                        var an_scenes = _.clone(element.an_scenes);
                        $(form).find('#jstree .jstree-node').each(function() {
                            tree.jstree('delete_node', $(this).attr('id'));
                        });
                        element.an_scenes = an_scenes;
                        fill_tree();
                    }
                    var buttons = $('<div class="' + p + 'btn-group ' + p + 'btn-group-xs"></div>').appendTo($(form).find('.tree'));
                    $('<button title="' + title("Add scene") + '" class="add-scene ' + p + 'btn ' + p + 'btn-default">' + t("Add scene") + '</button>').appendTo(buttons).click(function() {
                        if (scroll)
                            add_scene('1000');
                        else
                            add_scene('-1');
                        return false;
                    });
                    $('<button title="' + title("Add timeline step") + '" class="add-step ' + p + 'btn ' + p + 'btn-default" disabled>' + t("Add step") + '</button>').appendTo(buttons).click(function() {
                        var ids = tree.jstree('get_selected');
                        add_step(ids[0]);
                        return false;
                    });
                    $('<button title="' + title("Add tween") + '" class="add-tween ' + p + 'btn ' + p + 'btn-default" disabled>' + t("Add tween") + '</button>').appendTo(buttons).click(function() {
                        var ids = tree.jstree('get_selected');
                        add_tween(ids[0]);
                        return false;
                    });
                    $('<button title="' + title("Delete") + '" class="delete ' + p + 'btn ' + p + 'btn-default">' + t("Delete") + '</button>').appendTo(buttons).click(function() {
                        var ids = tree.jstree('get_selected');
                        if (ids.length > 0) {
                            tree.jstree('delete_node', ids[0]);
                        }
                        return false;
                    });
                    var tree = $('<div id="jstree"></div>').appendTo($(form).find('.tree')).jstree({
                        "core": {
                            'check_callback': function(operation, node, node_parent, node_position, more) {
                                return operation === 'rename_node' ? false : true;
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
                }
            });
        },
        save_js_animations: function(scroll) {
            var element = this;
            azexo_add_js({
                path: 'js/json2.min.js',
                loaded: 'JSON' in window,
                callback: function() {
                    if (element.an_name != '') {
                        element.attrs['an_name'] = element.an_name;
                        azexo_elements.elements_instances_by_an_name[element.an_name] = element;
                        $(element.dom_element).attr('data-an-name', element.an_name);
                    }
                    element.attrs['an_scenes'] = btoa(encodeURIComponent(JSON.stringify(element.an_scenes)));
                    if (scroll)
                        element.update_scroll_animation();
                }
            });
        },
        show_controls: function() {
            var element = this;
            if (window.azexo_editor) {
                AnimatedElement.baseclass.prototype.show_controls.apply(this, arguments);
                $('<button title="' + title("Scroll animations") + '" class="control scroll-animation ' + p + 'btn ' + p + 'btn-warning ' + p + 'glyphicon ' + p + 'glyphicon-sort"> </button>').appendTo(this.controls).click(function() {

                    $('#az-js-animation-modal').remove();
                    var header = '<div class="' + p + 'modal-header"><button type="button" class="' + p + 'close" data-dismiss="' + p + 'modal" aria-hidden="true">&times;</button><h4 class="' + p + 'modal-title">' + t("Scroll animation settings") + '</h4></div>';
                    var footer = '<div class="' + p + 'modal-footer"><button type="button" class="' + p + 'btn ' + p + 'btn-default" data-dismiss="' + p + 'modal">' + t("Close") + '</button><button type="button" class="save ' + p + 'btn ' + p + 'btn-primary">' + t("Save changes") + '</button></div>';
                    var modal = $('<div id="az-js-animation-modal" class="' + p + 'modal azexo"><div class="' + p + 'modal-dialog ' + p + 'modal-lg"><div class="' + p + 'modal-content">' + header + '<div class="' + p + 'modal-body"></div>' + footer + '</div></div></div>').prependTo('body');
                    var tabs = $('<div id="az-js-animation-tabs"><ul class="' + p + 'nav ' + p + 'nav-tabs"><li><a href="#script" data-toggle="' + p + 'tab">' + t("Script") + '</a></li><li><a href="#wizards" data-toggle="' + p + 'tab">' + t("Wizards") + '</a></li></ul><div class="' + p + 'tab-content"><div id="script" class="' + p + 'tab-pane"></div><div id="wizards" class="' + p + 'tab-pane"></div></div></div>');
                    $(modal).find('.' + p + 'modal-body').append(tabs);
                    var form = $('<div id="az-js-animation-form" class="' + p + 'clearfix"></div>');
                    $(tabs).find('#script').append(form);
                    $('#az-js-animation-tabs a[href="#script"]')[fp + 'tab']('show');

                    element.show_js_animations_editor(form, true, function() {
                    });

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
                                        element.add_scene_to_animations_editor(scene);
                                        $('#az-js-animation-tabs a[href="#script"]')[fp + 'tab']('show');
                                    } else {
                                        $(tabs).find('#wizard-form').prepend(get_alert(t('Animated target element must be child of the current element.')));
                                    }
                                });
                                break;
                            default:
                                break;
                        }
                    });

                    $('#az-js-animation-modal').find('.save').click(function() {
                        $(form).find('.tree [name="an_name"]')
                        if ($(form).find('.tree [name="an_name"]').val() == '') {
                            $(form).find('.tree .an-name').addClass('has-error');
                            return false;
                        }
                        element.an_name = $(form).find('.tree [name="an_name"]').val();
                        element.save_js_animations(true);
                        $('#az-js-animation-modal')[fp + 'modal']('hide');
                        $(document).trigger("azexo_edited_element", element.id);
                        return false;
                    });
                    $('#az-js-animation-modal')[fp + 'modal']('show');
                    return false;
                });
            }
        },
        make_timeline: function(scene, complete) {
            var options = {};
            if (scene.duration == '0' || scene.duration == '-1') {
                options = {repeat: parseInt(scene.repeat), repeatDelay: parseFloat(scene.repeatDelay)};
            }
            if (complete != null)
                options.onComplete = complete;
            var timeline = new TimelineMax(options);
            for (var j = 0; j < scene.timeline.length; j++) {
                var step = [];
                for (var k = 0; k < scene.timeline[j].tweens.length; k++) {
                    var target = '[data-az-id="' + this.id + '"]';
                    if (scene.timeline[j].tweens[k].target != '')
                        target = '[data-an-name="' + scene.timeline[j].tweens[k].target + '"]';
                    var f = _.keys(scene.timeline[j].tweens[k].from);
                    var t = _.keys(scene.timeline[j].tweens[k].to);
                    if (f.length == 0 && t.length > 0) {
                        var to = scene.timeline[j].tweens[k].to;
                        to.ease = scene.timeline[j].tweens[k].ease;
                        to.delay = parseFloat(scene.timeline[j].tweens[k].delay);
                        step.push(TweenMax.to(target, scene.timeline[j].tweens[k].duration, to));
                    }
                    if (f.length > 0 && t.length == 0) {
                        var from = scene.timeline[j].tweens[k].from;
                        from.ease = scene.timeline[j].tweens[k].ease;
                        from.delay = parseFloat(scene.timeline[j].tweens[k].delay);
                        step.push(TweenMax.from(target, scene.timeline[j].tweens[k].duration, from));
                    }
                    if (f.length > 0 && t.length > 0) {
                        var from = scene.timeline[j].tweens[k].from;
                        from.ease = scene.timeline[j].tweens[k].ease;
                        from.delay = scene.timeline[j].tweens[k].delay;
                        var to = scene.timeline[j].tweens[k].to;
                        to.ease = scene.timeline[j].tweens[k].ease;
                        to.delay = parseFloat(scene.timeline[j].tweens[k].delay);
                        step.push(TweenMax.fromTo(target, scene.timeline[j].tweens[k].duration, from, to));
                    }
                }
                timeline.add(step);
            }
            return timeline;
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
                            if (element.an_scenes[i].duration != '-1') {
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
                                var timeline = element.make_timeline(element.an_scenes[i], null);
                                scene.setTween(timeline);
                            }
                        }
                    }
                }
            });
        },
        showed: function($, p, fp) {
            AnimatedElement.baseclass.prototype.showed.apply(this, arguments);
            this.an_name = '';
            if ('an_name' in this.attrs && this.attrs['an_name'] != '') {
                this.an_name = this.attrs['an_name'];
                azexo_elements.elements_instances_by_an_name[this.an_name] = this;
            }
            this.an_scenes = [];
            if ('an_scenes' in this.attrs && this.attrs['an_scenes'] != '') {
                this.an_scenes = $.parseJSON(decodeURIComponent(atob(this.attrs['an_scenes'])));
                this.update_scroll_animation();
            }
            if ('an_start' in this.attrs && this.attrs['an_start'] != '' && this.attrs['an_start'] != 'no') {
                this.animation();
            }
        },
        render: function($, p, fp) {
            if ('an_name' in this.attrs && this.attrs['an_name'] != '') {
                $(this.dom_element).attr('data-an-name', this.attrs['an_name']);
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
    function SectionElement(parent, position) {
        SectionElement.baseclass.apply(this, arguments);
    }
    register_animated_element('az_section', true, SectionElement);
    mixin(SectionElement.prototype, {
        name: t('Section'),
        icon: 'fa fa-square-o',
        description: t('Bootstrap grid container'),
        category: t('Layout'),
        params: [
            make_param_type({
                type: 'checkbox',
                heading: t('Fluid?'),
                param_name: 'fluid',
                value: {
                    'yes': t("Yes, please"),
                },
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
                description: t('Select the effect you want to apply to the section background.')
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
        ].concat(SectionElement.prototype.params),
        is_container: true,
        section: true,
//        disallowed_elements: ['az_section'], - section is useful for popup element which can be placed anywhere
        get_button: function() {
            return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'text-overflow" data-az-element="' + this.base + '" style="width:100%;"><i class="' + p + 'text-primary ' + this.icon + '"></i><div>' + this.name + '</div><div class="' + p + 'text-muted ' + p + 'small">' + this.description + '</div></div>';
        },
        showed: function($, p, fp) {
            SectionElement.baseclass.prototype.showed.apply(this, arguments);
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
            this.dom_element = $('<div id="' + this.id + '" class="az-element az-section ' + this.attrs['el_class'] + ' " style="' + this.attrs['style'] + '"></div>');
            if (this.attrs['fluid'] == 'yes')
                this.dom_content_element = $('<div class="az-ctnr ' + p + 'container-fluid"></div>').appendTo(this.dom_element);
            else
                this.dom_content_element = $('<div class="az-ctnr ' + p + 'container"></div>').appendTo(this.dom_element);
            SectionElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//

    function RowElement(parent, position) {
        RowElement.baseclass.apply(this, arguments);
        this.columns = '';
        if (!position || typeof position !== 'boolean') {
            this.set_columns('1/1');
        }
        this.attrs['device'] = 'sm';
    }
    register_animated_element('az_row', true, RowElement);
    mixin(RowElement.prototype, {
        name: t('Row'),
        icon: 'fa fa-table',
        description: t('One row to implement a Bootstrap grid layout with responsive ability. You can choose number of columns and thier widths. Used by default.'),
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
                    $(columns)[fp + 'popover']('show');
                    set_highest_zindex($(controls));
                    set_highest_zindex($(controls).find('.' + p + 'popover'));
                    $(controls).find('.' + p + 'popover .set-columns-layout').each(function() {
                        $(this).click({object: element}, element.click_set_columns);
                    });
                    $(element.controls).mouseleave(function() {
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
//                    tolerance: "pointer",
//                    distance: 1,
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
            if (element) {
                for (var i = 0; i < element.children.length; i++) {
                    element.children[i].update_empty();
                }
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
        render: function($, p, fp) {
            this.dom_element = $('<div class="az-element az-row ' + p + 'row ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
            this.dom_content_element = this.dom_element;
            RowElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function ColumnElement(parent, position) {
        ColumnElement.baseclass.call(this, parent, position);
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
        show_parent_controls: true,
//        disallowed_elements: ['az_section'], - section is useful for popup element which can be placed anywhere
        get_empty: function() {
            return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for this row and current column. You can choose columns layout by mouse over (or click) this button: ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-th"></span></div></div>';
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
            $(document).trigger("azexo_update_element", this.id);
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
    function GridElement(parent, position) {
        GridElement.baseclass.apply(this, arguments);
        this.linked_elements_index = {};
        if (!position || typeof position !== 'boolean') {
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
//                    tolerance: "pointer",
//                    distance: 1,
                    start: over,
                    over: over,
                });
            }
        },
        update_sorting: function(event, ui) {
            GridElement.baseclass.prototype.update_sorting.apply(this, arguments);
            var element = azexo_elements.get_element($(this).closest('[data-az-id]').attr('data-az-id'));
            if (element) {
                for (var i = 0; i < element.children.length; i++) {
                    element.children[i].update_empty();
                }
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

                $(document).on("azexo_add_element",
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
                                    if (!data.position || el.base == 'az_column')
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
                $(document).on("azexo_edited_element",
                        function(sender, id) {
                            update_element(true, id);
                        }
                );
                $(document).on("azexo_update_element",
                        function(sender, id) {
                            update_element(false, id);
                        }
                );
                $(document).on("azexo_delete_element",
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
                $(document).on("azexo_update_sorting",
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
            this.dom_content_element = $('<ul class="' + p + 'clearfix"></ul>').appendTo(this.dom_element);
            GridElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function ItemElement(parent, position) {
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
        show_parent_controls: true,
        get_empty: function() {
            return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for this grid element and for current item element. You can add new item via clone current item by click on this button:') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-repeat"></span></div><div class="bottom ' + p + 'well"><strong>' + t('1) Create one item as template. 2) Clone it as much as you want. 3) Customize every item.') + '</strong></div></div>';
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
    function LayersElement(parent, position) {
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
            make_param_type({
                type: 'checkbox',
                heading: t('Responsive?'),
                param_name: 'responsive',
                value: {
                    'yes': t("Yes, please"),
                },
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Original width'),
                param_name: 'o_width',
                hidden: true,
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
                    el.attrs['pos_left'] = parseInt($(dom_element).css("left")) / ($(element.dom_content_element).width() / 100) + "%";
                    el.attrs['pos_top'] = parseInt($(dom_element).css("top")) / ($(element.dom_content_element).height() / 100) + "%";
                    el.attrs['pos_width'] = parseInt($(dom_element).css("width")) / ($(element.dom_content_element).width() / 100) + "%";
                    el.attrs['pos_height'] = parseInt($(dom_element).css("height")) / ($(element.dom_content_element).height() / 100) + "%";
                    to_percents(dom_element);
                    element.attrs['o_width'] = $(element.dom_element).width();
                    $(document).trigger("azexo_update_element", id);
                }
                function to_percents(dom_element) {
                    $(dom_element).css("left", parseInt($(dom_element).css("left")) / ($(element.dom_content_element).width() / 100) + "%");
                    $(dom_element).css("top", parseInt($(dom_element).css("top")) / ($(element.dom_content_element).height() / 100) + "%");
                    $(dom_element).css("width", parseInt($(dom_element).css("width")) / ($(element.dom_content_element).width() / 100) + "%");
                    $(dom_element).css("height", parseInt($(dom_element).css("height")) / ($(element.dom_content_element).height() / 100) + "%");
                }
                $(this.dom_content_element).resizable({
//                    containment: "parent",
                    start: function(event, ui) {
                        for (var i = 0; i < element.children.length; i++) {
                            var dom_element = element.children[i].dom_element;
                            to_percents(dom_element);
                        }
                    },
                    stop: function(event, ui) {
                        element.attrs['width'] = parseInt($(element.dom_content_element).css("width")) / ($(element.dom_element).width() / 100) + "%";
                        $(element.dom_content_element).width(element.attrs['width']);
                        element.attrs['height'] = $(element.dom_content_element).height();
                        $(document).trigger("azexo_update_element", element.id);
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
                            return false;
                        });
                    if (this.children[i].controls.find('.heigth100').length == 0)
                        $('<button title="' + title("100% heigth") + '" class="control heigth100 ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-resize-vertical" > </button>').appendTo(this.children[i].controls).click({object: this.children[i]}, function(e) {
                            e.data.object.attrs['pos_top'] = '0%';
                            $(e.data.object.dom_element).css("top", '0%');
                            e.data.object.attrs['pos_height'] = '100%';
                            $(e.data.object.dom_element).css("height", '100%');
                            return false;
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
                            return false;
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
                            return false;
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
        showed: function($, p, fp) {
            LayersElement.baseclass.prototype.showed.apply(this, arguments);
            var element = this;
            $(window).off('resize.az_layers' + element.id);
            if (this.attrs['responsive'] == 'yes') {
                function get_element_font_size(el, attr) {
                    var v = '';
                    var match = el.attrs[attr].match(/font-size[: ]*([\-\d\.]*)(px|%|em) *;/);
                    if (match != null)
                        v = match[1];
                    return v;
                }
                function update_font_sizes(el, ratio) {
                    //hover font size not updated !!!
                    var fs = get_element_font_size(el, 'style');
                    if (fs != '') {
                        fs = fs * ratio;
                        $(el.dom_element).css('font-size', fs + 'px');
                    }
                    for (var i = 0; i < el.children.length; i++)
                        update_font_sizes(element.children[i], ratio);
                }

                $(window).on('resize.az_layers' + element.id, function() {
                    var width = $(element.dom_element).width();
                    if (!('o_width' in element.attrs) || element.attrs['o_width'] == '')
                        element.attrs['o_width'] = width;
                    var ratio = width / element.attrs['o_width'];
                    $(element.dom_element).css('font-size', ratio * 100 + '%');
                    $(element.dom_content_element).css('height', element.attrs['height'] * ratio + 'px');
                    update_font_sizes(element, ratio);
                });
                $(window).trigger('resize');
            }
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
    function TabsElement(parent, position) {
        TabsElement.baseclass.apply(this, arguments);
        if (!position || typeof position !== 'boolean') {
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
//                    tolerance: "pointer",
//                    distance: 1,
                    over: function(event, ui) {
                        ui.placeholder.attr('class', ui.helper.attr('class'));
                        ui.placeholder.removeClass('ui-sortable-helper');
                        ui.placeholder.addClass('az-sortable-placeholder');
                    }
                });
            }
        },
        update_sorting: function(event, ui) {
            var element = azexo_elements.get_element($(this).attr('data-az-id'));
            if (element) {
                var options = $(this).sortable('option');
                var children = [];
                $(this).find(options.items).each(function() {
                    var id = $(this).find('a[data-toggle="' + p + 'tab"]').attr('href').replace('#', '');
                    children.push(azexo_elements.get_element(id));
                });
                element.children = children;
                for (var i = 0; i < element.children.length; i++)
                    element.children[i].parent = element;
                element.update_dom();
                $(document).trigger("azexo_update_sorting", ui);
            }
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
                menu += '<li><a href="#' + this.children[i].id + '" role="tab" data-toggle="' + p + 'tab">' + this.children[i].attrs['title'] + '</a></li>';
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
    function TabElement(parent, position) {
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
        show_parent_controls: true,
        get_empty: function() {
            return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for this tabs element and for current tab element. ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-plus-sign"></span>' + t(' - add a new tab.') + ' ' + t('Tabs headers are draggable. You can enter tab title by click on this button: ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-pencil"></span></div></div>';
        },
        show_controls: function() {
            if (window.azexo_editor) {
                TabElement.baseclass.prototype.show_controls.apply(this, arguments);
                $(this.controls).find('.drag-and-drop').remove();
                $('<span class="control ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon">' + this.name + '</span>').prependTo(this.controls);
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
    function AccordionElement(parent, position) {
        AccordionElement.baseclass.apply(this, arguments);
        if (!position || typeof position !== 'boolean') {
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
//                    tolerance: "pointer",
//                    distance: 1,
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
    function ToggleElement(parent, position) {
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
        show_parent_controls: true,
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
            this.dom_element = $('<div class="az-element az-toggle ' + p + 'panel ' + type + ' ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"><div class="' + p + 'panel-heading"><h4 class="' + p + 'panel-title"><a data-toggle="' + p + 'collapse" data-parent="#' + this.parent.id + '" href="#' + this.id + '">' + this.attrs['title'] + '</a></h4></div><div id="' + this.id + '" class="' + p + 'panel-collapse ' + p + 'collapse"><div class="' + p + 'panel-body az-ctnr"></div></div></div>');
            this.dom_content_element = $(this.dom_element).find('.' + p + 'panel-body');
            ToggleElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function CarouselElement(parent, position) {
        CarouselElement.baseclass.apply(this, arguments);
        if (!position || typeof position !== 'boolean') {
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
                                if (!_.isUndefined(el)) {
                                    if ('trigger_start_out_animation' in el)
                                        el.trigger_start_out_animation();
                                }
                            }
                        }
                        for (var i = 0; i < visibleItems.length; i++) {
                            if (visibleItems[i] < userItems.length) {
                                var item = userItems[visibleItems[i]];
                                var id = $(item).attr('data-az-id');
                                var el = azexo_elements.get_element(id);
                                if (!_.isUndefined(el)) {
                                    if ('trigger_start_in_animation' in el)
                                        el.trigger_start_in_animation();
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
    function SlideElement(parent, position) {
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
        show_parent_controls: true,
        get_empty: function() {
            return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for this carousel element and for current slide. ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-plus-sign"></span>' + t(' - add a new slide.') + '</div></div>';
        },
        show_controls: function() {
            if (window.azexo_editor) {
                SlideElement.baseclass.prototype.show_controls.apply(this, arguments);
                $(this.controls).find('.clone').remove();
                $(this.controls).find('.drag-and-drop').remove();
                $('<span class="control ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon">' + this.name + '</span>').prependTo(this.controls);
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
            this.dom_element = $('<div class="az-element az-slide az-ctnr ' + this.attrs['el_class'] + ' ' + p + 'clearfix" style="' + this.attrs['style'] + '"></div>');
            this.dom_content_element = this.dom_element;
            SlideElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function PresentationElement(parent, position) {
        PresentationElement.baseclass.apply(this, arguments);
        if (!position || typeof position !== 'boolean') {
            this.add_step();
        }
        if (window.azexo_editor) {
            this.init_scroll_variables();
        }
    }
    register_animated_element('az_presentation', true, PresentationElement);
    mixin(PresentationElement.prototype, {
        name: t('Presentation'),
        icon: 'fa fa-file-powerpoint-o',
        description: t('Content presentation. Every step of presentation can contain any number of any types of elements.'),
        category: t('Layout'),
        params: [
            make_param_type({
                type: 'integer_slider',
                heading: t('Height'),
                param_name: 'height',
                min: '0',
                max: '2000',
                value: '900',
            }),
            make_param_type({
                type: 'checkbox',
                heading: t('Options'),
                param_name: 'options',
                value: {
                    'navigation': t("Navigation"),
                    'auto_play': t("Auto play"),
                    'full_filling': t("Full filling available area"),
                },
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Transition duration'),
                param_name: 'duration',
                min: '0',
                max: '10000',
                value: '1000',
            }),
        ].concat(PresentationElement.prototype.params),
        is_container: true,
        highlighted: false,
        get_button: function() {
            return '<div class="' + p + 'well ' + p + 'text-center ' + p + 'text-overflow" data-az-element="' + this.base + '" style="width:100%;"><i class="' + p + 'text-primary ' + this.icon + '"></i><div>' + this.name + '</div><div class="' + p + 'text-muted ' + p + 'small">' + this.description + '</div></div>';
        },
        init_scroll_variables: function() {
            this.hover = false;
            this.scroll_top = 0;
            this.transition_duration = '0s';
            this.transition_delay = '0s';
        },
        show_controls: function() {
            if (window.azexo_editor) {
                CarouselElement.baseclass.prototype.show_controls.apply(this, arguments);
                $(this.controls).find('.add').remove();
                $(this.controls).find('.paste').remove();
                var element = this;
                $('<button title="' + title("Add step") + '" class="control add-toggle ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon ' + p + 'glyphicon-plus-sign" > </button>').appendTo(this.controls).click({object: this}, this.click_add_step);
                var state = {
                    editing: false,
                    $node: false,
                    data: {
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 0
                    }
                };
                element.config = {
                    rotateStep: 0.1,
                    scaleStep: 0.01,
                    redrawFunction: false,
                    setTransformationCallback: false
                };
                var defaults = {
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 1
                };
                var mouse = {
                    prevX: false,
                    prevY: false,
                    activeFunction: false
                };
                var handlers = {};
                function fixVector(x, y) {
                    var result = {x: 0, y: 0},
                    angle = (element.config.rotation / 180) * Math.PI,
                            cs = Math.cos(angle),
                            sn = Math.sin(angle);
                    result.x = (x * cs - y * sn) * element.config.visualScaling;
                    result.y = (x * sn + y * cs) * element.config.visualScaling;
                    return result;
                }
                handlers.move = function(x, y) {
                    var v = fixVector(x, y);
                    state.data.x = (state.data.x) ? (state.data.x) + v.x : v.x;
                    state.data.y = (state.data.y) ? (state.data.y) + v.y : v.y;
                };
                handlers.scale = function(x) {
                    state.data.scale -= -x * element.config.scaleStep * element.config.visualScaling / 10;
                };
                handlers.rotate = function(x) {
                    state.data.rotate -= -x * element.config.rotateStep;
                };

                var showTimer = null;
//                var redrawTimeout = null;
                function saveData() {
                    var el = azexo_elements.get_element($(state.$node[0]).closest('[data-az-id]').attr('data-az-id'));
                    el.attrs['x'] = state.data.x.toString();
                    el.attrs['y'] = state.data.y.toString();
                    el.attrs['rotate_z'] = state.data.rotate.toString();
                    el.attrs['scale'] = state.data.scale.toString();
                    $(document).trigger("azexo_update_element", el.id);
                }
                function loadData() {
                    state.data.x = parseFloat(state.$node[0].dataset.x) || defaults.x;
                    state.data.y = parseFloat(state.$node[0].dataset.y) || defaults.y;
                    state.data.scale = parseFloat(state.$node[0].dataset.scale) || defaults.scale;
                    state.data.rotate = parseFloat(state.$node[0].dataset.rotate) || defaults.rotate;
                    saveData();
                }
                function redraw() {
//                    clearTimeout(redrawTimeout);
//                    redrawTimeout = setTimeout(function() {
                    state.$node[0].dataset.scale = state.data.scale;
                    state.$node[0].dataset.rotate = state.data.rotate;
                    state.$node[0].dataset.x = state.data.x;
                    state.$node[0].dataset.y = state.data.y;
                    element.impress.initStep(state.$node[0]);
                    saveData();
                    showControls(state.$node);
//                    }, 20);
                }
                function handleMouseMove(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var x = e.pageX - mouse.prevX,
                            y = e.pageY - mouse.prevY;
                    mouse.prevX = e.pageX;
                    mouse.prevY = e.pageY;
                    if (mouse.activeFunction) {
                        mouse.activeFunction(x, y);
                        redraw();
                    }
                    return false;
                }
                if ('step_controls' in element)
                    element.step_controls.remove();
                element.step_controls = $('<div class="az-step-controls ' + p + 'btn-group-vertical"></div>').css('display', 'none');
                $('<span class="number ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon"></span>').prependTo(element.step_controls).click(function() {
                    var n = parseInt($(this).attr('data-step')) - 1;
                    element.impress.goto(element.children[n].id);
                    return false;
                });
                $('<button title="' + title("Move this step") + '" class="control ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-move"> </button>').data('func', 'move').appendTo(element.step_controls);
                $('<button title="' + title("Scale this step") + '" class="control ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-resize-full" > </button>').data('func', 'scale').appendTo(element.step_controls);
                $('<button title="' + title("Rotate this step") + '" class="control ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-refresh" > </button>').data('func', 'rotate').appendTo(element.step_controls);
                function showControls($where) {
                    if ($(element.dom_element).parents('.azexo-editor').length > 0) {
                        var top, left, pos = $where.offset();
                        top = (pos.top > 0) ? pos.top + (100 / element.config.visualScaling) : 0;
                        left = (pos.left > 0) ? pos.left + (100 / element.config.visualScaling) : 0;
                        $(element.step_controls).css('display', 'inline-block').offset({
                            top: top,
                            left: left
                        });
                    } else {
                        $(element.step_controls).hide();
                    }
                }

                var showTimer;
                $(element.step_controls).appendTo(element.dom_element).on('click', 'button', function(e) {
                    return false;
                });
                $(element.step_controls).appendTo(element.dom_element).on('mousedown', 'button', function(e) {
                    e.preventDefault();
                    mouse.activeFunction = handlers[$(this).data('func')];
                    loadData();
                    mouse.prevX = e.pageX;
                    mouse.prevY = e.pageY;
                    $(document).on('mousemove.az_presentation_controls' + element.id, handleMouseMove);
                    return false;
                }).on('mouseenter', function() {
                    clearTimeout(showTimer);
                });
                $(document).off('mouseup.az_presentation_controls' + element.id);
                $(document).on('mouseup.az_presentation_controls' + element.id, function() {
                    mouse.activeFunction = false;
                    $(document).off('mousemove.az_presentation_controls' + element.id);
                });

                $(element.dom_element).on('mouseenter', '.step', function() {
                    var $t = $(this);
                    showTimer = setTimeout(function() {
                        if (!mouse.activeFunction) {
                            var el = azexo_elements.get_element($t.closest('[data-az-id]').attr('data-az-id'));
                            var n = el.get_child_position() + 1;
                            $(element.step_controls).find('span.number').attr('data-step', n);
                            if (el.attrs['name'] != '')
                                n = el.attrs['name'];
                            $(element.step_controls).find('span.number').html(n);
                            state.$node = $t;
                            showControls(state.$node);
                        }
                    }, 500);
                    $t.data('showTimer', showTimer);
                }).on('mouseleave', '.step', function() {
                    //$(element.step_controls).hide();
                    clearTimeout($(this).data('showTimer'));
                });

                $(document).off('scroll.az_presentation' + element.id);
                $(document).on('scroll.az_presentation' + element.id, function(e) {
                    if (element.hover) {
                        window.scrollTo(0, element.scroll_top);
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
                $(element.dom_element).on('mouseenter', function(e) {
                    element.scroll_top = $(document).scrollTop();
                    element.transition_duration = $(element.dom_content_element).css('transition-duration');
                    $(element.dom_content_element).css('transition-duration', '0s');
                    element.transition_delay = $(element.dom_content_element).css('transition-delay');
                    $(element.dom_content_element).css('transition-delay', '0s');
                    element.hover = true;
                });
                $(element.dom_element).on('mouseleave', function(e) {
                    $(element.dom_content_element).css('transition-duration', element.transition_duration);
                    $(element.dom_content_element).css('transition-delay', element.transition_delay);
                    element.hover = false;
                });
                var drag = false;
                $(element.dom_element).on('mousedown', function(e) {
                    if (e.which == 2) {
                        drag = true;
                        mouse.prevX = e.pageX;
                        mouse.prevY = e.pageY;
                        var div = $(element.dom_content_element).find('> div');
                        element.transition_duration = $(div).css('transition-duration');
                        $(div).css('transition-duration', '0s');
                        element.transition_delay = $(div).css('transition-delay');
                        $(div).css('transition-delay', '0s');
                        return false;
                    }
                });
                $(document).off('mouseup.az_presentation' + element.id);
                $(document).on('mouseup.az_presentation' + element.id, function(e) {
                    if (drag) {
                        var div = $(element.dom_content_element).find('> div');
                        $(div).css('transition-duration', element.transition_duration);
                        $(div).css('transition-delay', element.transition_delay);
                        drag = false;
                    }
                });
                $(document).off('mousemove.az_presentation' + element.id);
                $(document).on('mousemove.az_presentation' + element.id, function(e) {
                    if (drag) {
                        var div = $(element.dom_content_element).find('> div');
                        if ($(div).css('transition-duration') != '0s' || $(div).css('transition-delay') != '0s') {
                            element.transition_duration = $(div).css('transition-duration');
                            $(div).css('transition-duration', '0s');
                            element.transition_delay = $(div).css('transition-delay');
                            $(div).css('transition-delay', '0s');
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        var x = e.pageX - mouse.prevX,
                                y = e.pageY - mouse.prevY;
                        mouse.prevX = e.pageX;
                        mouse.prevY = e.pageY;
                        var v = fixVector(x, y);
                        var transform = $(element.dom_content_element).find('> div').css('transform');
                        $(element.dom_content_element).find('> div').css('transform', transform + ' translate(' + v.x + 'px, ' + v.y + 'px)');
                        return false;
                    }
                });
                $(element.dom_element).on('wheel mousewheel', function(e) {
                    if ($(element.dom_content_element).css('transition-duration') != '0s' || $(element.dom_content_element).css('transition-delay') != '0s') {
                        element.transition_duration = $(element.dom_content_element).css('transition-duration');
                        $(element.dom_content_element).css('transition-duration', '0s');
                        element.transition_delay = $(element.dom_content_element).css('transition-delay');
                        $(element.dom_content_element).css('transition-delay', '0s');
                    }
                    var speed = 0.05;
                    var delta = e.originalEvent.wheelDelta / 120;
                    var transform = $(element.dom_content_element).css('transform');
                    var scale = 1 + delta * speed;
                    element.config.visualScaling = element.config.visualScaling / scale;
                    $(element.dom_content_element).css('transform', transform + ' scale(' + scale.toString() + ')');
                });
            }
        },
        update_sortable: function() {
            if (window.azexo_editor) {
                var element = this;
//                $(this.dom_element).resizable({
//                    handles: 's',
//                    stop: function(event, ui) {
//                        element.attrs['height'] = $(element.dom_element).height();
//                        element.update_dom();
//                        element.impress = window.impress(element.id);
//                        element.impress.init();
//                    }
//                });
            }
        },
        click_add_step: function(e) {
            e.data.object.add_step();
            return false;
        },
        add_step: function() {
            var child = new StepElement(this, true);
            child.update_dom();
//            if (('impress' in this) && (this.children.length > 1)) {
//                this.impress.newStep(child.dom_element.get(0));
//            } else {
//                this.update_dom();
//            }
            this.update_dom();
        },
        attach_children: function() {
            if (('impress' in this) && ($(this.dom_content_element).find('> div').length > 0)) {
                for (var i = 0; i < this.children.length; i++) {
                    $(this.dom_content_element).find('> div').append(this.children[i].dom_element);
                }
            } else {
                PresentationElement.baseclass.prototype.attach_children.apply(this, arguments);
            }
        },
        edited: function() {
            PresentationElement.baseclass.prototype.edited.apply(this, arguments);
            this.update_dom();
        },
        showed: function($, p, fp) {
            PresentationElement.baseclass.prototype.showed.apply(this, arguments);
            var element = this;
            this.add_js({
                path: 'js/impress.js',
                loaded: 'impress' in window,
                callback: function() {
                    if (!('impress' in element)) {
                        element.impress = window.impress(element.id);
                    }
                    element.impress.init();
                    if (!('config' in element))
                        element.config = {};
                    element.impress.setTransformationCallback(function(x) {
                        element.config.visualScaling = x.scale;
                        if ('z'in x.rotate)
                            element.config.rotation = ~~(x.rotate.z);
                        else
                            element.config.rotation = ~~(x.rotate);
                    });
                    if (element.children.length > 0)
                        element.impress.goto(element.children[0].id);

                    element.dom_element.get(0).addEventListener("impress:stepenter", function(event) {
                        var id = $(event.target).attr('data-az-id');
                        var el = azexo_elements.get_element(id);
                        if (!_.isUndefined(el)) {
                            if ('trigger_start_out_animation' in el)
                                el.trigger_start_out_animation();
                        }
                    }, false);
                    element.dom_element.get(0).addEventListener("impress:stepleave", function(event) {
                        var id = $(event.target).attr('data-az-id');
                        var el = azexo_elements.get_element(id);
                        if (!_.isUndefined(el)) {
                            if ('trigger_start_in_animation' in el)
                                el.trigger_start_in_animation();
                        }
                    }, false);
                    $(element.dom_element).find('> .' + p + 'pagination > li > .' + p + 'prev').click(function() {
                        element.impress.prev();
                        return false;
                    });
                    $(element.dom_element).find('> .' + p + 'pagination > li > .' + p + 'next').click(function() {
                        element.impress.next();
                        return false;
                    });
                    $(element.dom_element).find('> .' + p + 'pagination > li > .goto').click(function() {
                        element.impress.goto($(this).attr('data-step'));
                        return false;
                    });
                    if (!window.azexo_editor) {
                        $(element.dom_content_element).find('.az-step').each(function() {
                            $(this).on('wheel mousewheel', function(e) {
                                if ($(this).hasClass('active')) {
                                    if (this.offsetHeight == this.scrollHeight) {
                                        if (e.originalEvent.wheelDelta < 0) {
                                            element.impress.next();
                                            return false;
                                        } else {
                                            element.impress.prev();
                                            return false;
                                        }
                                    } else {
                                        if (this.scrollTop == 0 && e.originalEvent.wheelDelta > 0) {
                                            element.impress.prev();
                                            return false;
                                        }
                                        if ((this.offsetHeight + this.scrollTop >= this.scrollHeight) && e.originalEvent.wheelDelta < 0) {
                                            element.impress.next();
                                            return false;
                                        }
                                    }
                                }
                            });
                        });
                    }
                    if ('auto_play' in element) {
                        clearInterval(element.auto_play);
                    }
                    if (_.indexOf(element.attrs['options'].split(','), 'auto_play') >= 0) {
                        element.auto_play = setInterval(function() {
                            element.impress.next();
                        }, 5000);
                    }
                    if (_.indexOf(element.attrs['options'].split(','), 'full_filling') >= 0) {
                        $(element.dom_element).css('height', $(window).height() + 'px');
                        $(element.dom_content_element).find('.az-step').each(function() {
                            $(this).css('height', $(element.dom_element).height() + 'px');
                            $(this).css('width', $(element.dom_element).width() + 'px');
                        });
                    }
                }});
        },
        render: function($, p, fp) {
            delete this['impress'];
            this.dom_element = $('<div class="az-element az-presentation ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
            $(this.dom_element).css('height', this.attrs['height'] + 'px');
            $(this.dom_element).css('overflow', 'hidden');
            this.dom_content_element = $('<div id="' + this.id + '"></div>').appendTo(this.dom_element);
            $(this.dom_content_element).attr('data-transition-duration', this.attrs['duration']);

            if (_.indexOf(this.attrs['options'].split(','), 'navigation') >= 0) {
                var pagination = $('<ul class="' + p + 'pagination"></ul>').appendTo(this.dom_element);
                $('<li><a href="#" class="' + p + 'prev">&laquo;</a></li>').appendTo(pagination);
                for (var i = 1; i <= this.children.length; i++) {
                    if (_.indexOf(this.children[i - 1].attrs['options'].split(','), 'dummy') < 0) {
                        var name = i.toString();
                        if (this.children[i - 1].attrs['name'] != '')
                            name = this.children[i - 1].attrs['name'];
                        $('<li><a href="#" class="goto" data-step="' + this.children[i - 1].id + '">' + name + '</a></li>').appendTo(pagination);
                    }
                }
                $('<li><a href="#" class="' + p + 'next">&raquo;</a></li>').appendTo(pagination);
            }

            PresentationElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function StepElement(parent, position) {
        StepElement.baseclass.apply(this, arguments);
    }
    register_element('az_step', true, StepElement);
    mixin(StepElement.prototype, {
        name: t('Step'),
        params: [
//            make_param_type({
//                type: 'integer_slider',
//                heading: t('Transition duration'),
//                param_name: 'duration',
//                min: '0',
//                max: '100000',
//                value: '1000',
//            }),
            make_param_type({
                type: 'textfield',
                heading: t('Name'),
                param_name: 'name',
            }),
            make_param_type({
                type: 'checkbox',
                heading: t('Options'),
                param_name: 'options',
                value: {
                    'dummy': t("Dummy"),
                },
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Width'),
                param_name: 'width',
                min: '1',
                max: '100000',
                value: '900',
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Height'),
                param_name: 'height',
                min: '1',
                max: '100000',
                value: '700',
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('X coordinate'),
                param_name: 'x',
                min: '-100000',
                max: '100000',
                value: '0',
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Y coordinate'),
                param_name: 'y',
                min: '-100000',
                max: '100000',
                value: '0',
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Z coordinate'),
                param_name: 'z',
                min: '-10000',
                max: '10000',
                value: '0',
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('X rotate'),
                param_name: 'rotate_x',
                min: '-180',
                max: '180',
                value: '0',
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Y rotate'),
                param_name: 'rotate_y',
                min: '-180',
                max: '180',
                value: '0',
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Z rotate'),
                param_name: 'rotate_z',
                min: '-180',
                max: '180',
                value: '0',
            }),
            make_param_type({
                type: 'integer_slider',
                heading: t('Scale'),
                param_name: 'scale',
                min: '0',
                max: '1000',
                value: '1',
                step: '0.01',
            }),
        ].concat(StepElement.prototype.params),
        hidden: true,
        is_container: true,
        show_parent_controls: true,
        disallowed_elements: ['az_presentation'],
        highlighted: false,
        get_empty: function() {
            return '<div class="az-empty"><div class="top-left ' + p + 'well"><h1>↖</h1>' + t('Settings for this presentation element and for current step. Press on "Space" button to going through steps. ') + '<span class="' + p + 'glyphicon ' + p + 'glyphicon-plus-sign"></span>' + t(' - add a new step.') + '</div></div>';
        },
        get_my_shortcode: function() {
            return this.get_children_shortcode();
        },
        show_controls: function() {
            StepElement.baseclass.prototype.show_controls.apply(this, arguments);
            if (window.azexo_editor) {
                $(this.controls).find('.drag-and-drop').remove();
                $('<span class="control ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon">' + this.name + '</span>').prependTo(this.controls);
            }
        },
        update_sortable: function() {
            if (window.azexo_editor) {
                var element = this;
                $(this.dom_element).resizable({
//                    containment: "parent",
                    stop: function(event, ui) {
                        element.attrs['width'] = $(element.dom_element).width();
                        element.attrs['height'] = $(element.dom_element).height();
                        $(document).trigger("azexo_update_element", element.id);
                        if ('impress' in element.parent) {
                            element.impress.initStep(element.dom_element.get(0));
                        }
                    }
                });
            }
        },
        clone: function() {
            var shortcode = StepElement.baseclass.prototype.get_my_shortcode.apply(this, arguments);
            $('#azexo-clipboard').html(btoa(encodeURIComponent(shortcode)));
            for (var i = 0; i < this.parent.children.length; i++) {
                if (this.parent.children[i].id == this.id) {
                    this.parent.paste(i);
                    break;
                }
            }
//            if ('impress' in this.parent) {
//                var child = this.parent.children[this.parent.children.length - 1];
//                this.parent.impress.newStep(child.dom_element.get(0));
//            } else {
//                this.parent.update_dom();
//            }
            this.parent.update_dom();
        },
        edited: function() {
            StepElement.baseclass.prototype.edited.apply(this, arguments);
            var element = this;
            //this.parent.update_dom();
            if ('impress' in element.parent) {
                element.parent.impress.initStep(element.dom_element.get(0));
            }
        },
        remove: function() {
            StepElement.baseclass.prototype.remove.apply(this, arguments);
            this.parent.update_dom();
        },
        render: function($, p, fp) {
            this.dom_element = $('<div id="' + this.id + '" class="az-element az-step az-ctnr step ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
            $(this.dom_element).css('width', this.attrs['width']);
            $(this.dom_element).css('height', this.attrs['height']);
            $(this.dom_element).attr('data-x', this.attrs['x']);
            $(this.dom_element).attr('data-y', this.attrs['y']);
            $(this.dom_element).attr('data-z', this.attrs['z']);
            $(this.dom_element).attr('data-rotate-x', this.attrs['rotate_x']);
            $(this.dom_element).attr('data-rotate-y', this.attrs['rotate_y']);
            //$(this.dom_element).attr('data-rotate-z', this.attrs['rotate_z']);
            $(this.dom_element).attr('data-rotate', this.attrs['rotate_z']);
            $(this.dom_element).attr('data-scale', this.attrs['scale']);
            this.dom_content_element = this.dom_element;
            StepElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function ContainerElement(parent, position) {
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
        hidden: !window.azexo_online,
        saveable: true,
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
                    $(this.controls).find('.js-animation').remove();
                    $(this.controls).find('.drag-and-drop').attr('title', '');
                    $(this.controls).find('.drag-and-drop').removeClass(p + 'glyphicon');
                    $(this.controls).find('.drag-and-drop').removeClass(p + 'glyphicon-move');
                    $(this.controls).find('.drag-and-drop').removeClass('drag-and-drop');
                }
                if (this.saveable)
                    $('<button title="' + title("Save container") + '" class="control save-container ' + p + 'btn ' + p + 'btn-success ' + p + 'glyphicon ' + p + 'glyphicon-save" > </button>').appendTo(this.controls).click({object: this}, this.click_save_container);
            }
        },
        get_my_shortcode: function() {
            return this.get_children_shortcode();
        },
        get_hover_styles: function(element) {
            var hover_styles = '';
            if (element.attrs['hover_style'] != '')
                hover_styles = element.get_hover_style();
            for (var i = 0; i < element.children.length; i++) {
                hover_styles = hover_styles + this.get_hover_styles(element.children[i]);
            }
            return hover_styles;
        },
        get_js: function(element) {
            var html = '';
            for (var url in element.js)
                html += '<script src="' + url + '"></script>\n';
            return html;
        },
        get_css: function(element) {
            var html = '';
            for (var url in element.css)
                html += '<link rel="stylesheet" type="text/css" href="' + url + '">\n';
            return html;
        },
        get_loader: function() {
            var element = this;
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
                if ('an_start' in element.attrs && element.attrs['an_start'] != '') {
                    attributes['an_start'] = true;
                }
                if ('an_letters' in element.attrs && element.attrs['an_letters'] != '') {
                    attributes['an_letters'] = true;
                }
                if ('an_js_in' in element.attrs && element.attrs['an_js_in'] != '') {
                    attributes['an_js'] = true;
                }
                if ('an_js_out' in element.attrs && element.attrs['an_js_out'] != '') {
                    attributes['an_js'] = true;
                }
                for (var i = 0; i < element.children.length; i++) {
                    $.extend(attributes, check_attributes(element.children[i]));
                }
                return attributes;
            }
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

                javascript += BaseElement.toString() + "\n";
                javascript += BaseElement.name + ".prototype.p = '" + p + "';\n";
                javascript += BaseElement.name + ".prototype.fp = '" + fp + "';\n";
                javascript += BaseElement.name + ".prototype.elements = {};\n";
                javascript += BaseElement.name + ".prototype.tags = {};\n";
                javascript += get_element_params_js(BaseElement);
                javascript += get_class_method_js(BaseElement, 'get_hover_style', true);
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
                if ('an_start' in attributes) {
                    javascript += get_class_method_js(BaseElement, 'trigger_start_in_animation', true);
                    javascript += get_class_method_js(BaseElement, 'trigger_start_out_animation', true);
                }
                javascript += register_element.toString() + "\n";
                javascript += UnknownElement.toString() + "\n";
                javascript += register_element.name + "('az_unknown', true, " + UnknownElement.name + ");\n";
                javascript += UnknownElement.name + ".prototype.has_content = true;\n";

                javascript += "window.azexo_baseurl = '" + window.azexo_baseurl + "';\n";
                if ('ajaxurl' in window)
                    javascript += "window.ajaxurl = '" + toAbsoluteURL(window.ajaxurl) + "';\n";
                if ('azexo_lang' in window)
                    javascript += "window.azexo_lang = '" + window.azexo_lang + "';\n";
                javascript += "window.azexo_online = (window.location.protocol == 'http:' || window.location.protocol == 'https:');\n";
                javascript += "var " + azexo_elements_name + " = new " + AZEXOElements.name + "();\n";
                javascript += "var " + scroll_magic_name + " = null;\n";
                javascript += "window.azexo_editor = false;\n";
                if ('azexo_exporter' in window)
                    javascript += "window.azexo_exported = " + window.azexo_exporter.toString() + ";\n";
                javascript += "var " + azexo_containers_name + " = [];\n";
                javascript += "var " + azexo_containers_loaded_name + " = {};\n";
                javascript += connect_container.toString() + "\n";

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
                    javascript += get_class_method_js(AnimatedElement, 'animation', true);
                }
                if ('an_scenes' in attributes || 'an_js' in attributes) {
                    javascript += get_class_method_js(AnimatedElement, 'make_timeline', true);
                }
                if ('an_scenes' in attributes) {
                    javascript += get_class_method_js(AnimatedElement, 'update_scroll_animation', true);
                }
                if ('an_letters' in attributes) {
                    javascript += get_class_method_js(AnimatedElement, 'animation_letters', true);
                }
                if ('an_start' in attributes || 'an_scenes' in attributes)
                    javascript += get_class_method_js(AnimatedElement, 'showed', true);
                javascript += get_class_method_js(AnimatedElement, 'render', true);
                javascript += register_animated_element.toString() + "\n";

                javascript += FormDataElement.toString() + "\n";
                javascript += extend.name + "(" + FormDataElement.name + ", " + AnimatedElement.name + ");\n";
                javascript += FormDataElement.name + ".prototype.form_elements = {};\n";
                javascript += register_form_data_element.toString() + "\n";


                if (SectionElement.prototype.base in bases) {
                    javascript += SectionElement.toString() + "\n";
                    javascript += register_animated_element.name + "('" + SectionElement.prototype.base + "', true, " + SectionElement.name + ");\n";
                    javascript += get_element_params_js(SectionElement);
                    javascript += get_class_method_js(SectionElement, 'showed', true);
                }

                if (RowElement.prototype.base in bases) {
                    javascript += RowElement.toString() + "\n";
                    javascript += register_animated_element.name + "('" + RowElement.prototype.base + "', true, " + RowElement.name + ");\n";
                    javascript += get_element_params_js(RowElement);
                    javascript += RowElement.name + ".prototype.set_columns = function(columns){};\n";
                    javascript += ColumnElement.toString() + "\n";
                    javascript += register_element.name + "('" + ColumnElement.prototype.base + "', true, " + ColumnElement.name + ");\n";
                    javascript += get_element_params_js(ColumnElement);
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
                    javascript += get_element_params_js(LayersElement);
                    javascript += get_class_method_js(LayersElement, 'showed', true);
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
                    javascript += get_element_params_js(SlideElement);
                    javascript += SlideElement.name + ".prototype.frontend_render = true;\n";
                    javascript += get_class_method_js(SlideElement, 'showed', true);
                    javascript += get_class_method_js(SlideElement, 'render', true);
                }

                if (PresentationElement.prototype.base in bases) {
                    javascript += PresentationElement.toString() + "\n";
                    javascript += register_animated_element.name + "('" + PresentationElement.prototype.base + "', true, " + PresentationElement.name + ");\n";
                    javascript += get_element_params_js(PresentationElement);
                    javascript += PresentationElement.name + ".prototype.frontend_render = true;\n";
                    javascript += get_class_method_js(PresentationElement, 'showed', true);
                    javascript += get_class_method_js(PresentationElement, 'render', true);
                    javascript += StepElement.toString() + "\n";
                    javascript += register_element.name + "('" + StepElement.prototype.base + "', true, " + StepElement.name + ");\n";
                    javascript += get_element_params_js(StepElement);
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
                    javascript += get_element_params_js(ScrollMenuElement);
                    javascript += get_class_method_js(ScrollMenuElement, 'showed', true);
                }

                if (FormElement.prototype.base in bases) {
                    javascript += get_alert.toString() + "\n";
                    if ('azexo_form_submit_type' in window)
                        javascript += "window.azexo_form_submit_type = '" + window.azexo_form_submit_type + "';\n";
                    if ('azexo_form_submit_name' in window)
                        javascript += "window.azexo_form_submit_name = '" + window.azexo_form_submit_name + "';\n";
                    if ('recaptcha_publickey' in window)
                        javascript += "window.recaptcha_publickey = '" + window.recaptcha_publickey + "';\n";
                    javascript += azexo_submit_form.toString() + "\n";
                    javascript += FormElement.toString() + "\n";
                    javascript += register_animated_element.name + "('" + FormElement.prototype.base + "', true, " + FormElement.name + ");\n";
                    javascript += get_element_params_js(FormElement);
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

                if (window.azexo_online) {
                    hashCode = function(s) {
                        return s.split("").reduce(function(a, b) {
                            a = ((a << 5) - a) + b.charCodeAt(0);
                            return a & a
                        }, 0);
                    }
                    javascript += jquery_name + "(document).ready(function(){" + connect_container.name + "(" + jquery_name + "('[data-az-hash=\"" + hashCode(javascript) + "\"]'));});\n";
                } else {
                    var type = element.attrs['container'].split('/')[0];
                    var name = element.attrs['container'].split('/')[1];
                    javascript += jquery_name + "(document).ready(function(){" + connect_container.name + "(" + jquery_name + "('[data-az-type=\"" + type + "\"][data-az-name=\"" + name + "\"]'));});\n";
                }

                javascript += "})(window.jQuery);\n";
                return javascript;
            }
            function check_dinamic(element) {
                if (element.constructor.prototype.hasOwnProperty('showed')) {
                    var exception = false;
                    if ('is_cms_element' in element || 'is_template_element' in element)
                        exception = true;
                    switch (element.base) {
                        case 'az_container':
                            if (element.parent == null)
                                exception = true;
                            break;
                        case 'az_image':
                            if (element.attrs['img_link_large'] != 'yes'
                                    && element.attrs['adipoli_start'] == 'none'
                                    && element.attrs['adipoli_hover'] == 'none'
                                    && element.attrs['splits'] != 'yes')
                                exception = true;
                            break;
                        case 'az_section':
                            if (element.attrs['effect'] == '')
                                exception = true;
                            break;
                        default:
                            break;
                    }
                    if (!exception)
                        return true;
                }
                for (var i = 0; i < element.children.length; i++) {
                    if (check_dinamic(element.children[i])) {
                        return true;
                    }
                }
                return false;
            }
            var javascript = '';
            if (check_dinamic(element) || 'an_start' in attributes || 'an_scenes' in attributes) {
                javascript = "<script type=\"text/javascript\">\n//<![CDATA[\n" + get_javascript() + "//]]>\n</script>\n";
            }
            return javascript;
        },
        get_html: function() {
            this.recursive_update_data();
            this.recursive_clear_animation();
            var dom = $('<div>' + $(this.dom_content_element).html() + '</div>');
            this.recursive_restore(dom);
            $(dom).find('.az-element > .controls').remove();
            $(dom).find('> .controls').remove();
            $(dom).find('.az-sortable-controls').remove();
            $(dom).find('.az-step-controls').remove();
            $(dom).find('.az-empty').remove();
            $(dom).find('.ui-resizable-e').remove();
            $(dom).find('.ui-resizable-s').remove();
            $(dom).find('.ui-resizable-se').remove();
            $(dom).find('.editable-highlight').removeClass('editable-highlight');
            $(dom).find('.styleable-highlight').removeClass('styleable-highlight');
            $(dom).find('.sortable-highlight').removeClass('sortable-highlight');
            $(dom).find('.ui-draggable').removeClass('ui-draggable');
            $(dom).find('.ui-resizable').removeClass('ui-resizable');
            $(dom).find('.ui-sortable').removeClass('ui-sortable');
            $(dom).find('.az-element.az-container > .az-ctnr').empty();
            $(dom).find('.az-element.az-cms-element').empty();
            $(dom).find('.g-recaptcha').empty();
            //$(dom).find('[data-az-id]').removeAttr('data-az-id'); 
            return $(dom).html();
        },
        get_container_html: function() {
            return this.get_css(this) + this.get_hover_styles(this) + this.get_js(this) + this.get_loader() + this.get_html();
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
                        $(element.dom_content_element).find('> script').detach().appendTo('head');
                        $(element.dom_content_element).find('> link[href]').detach().appendTo('head');
                        $(element.dom_element).css('display', '');
                        $(element.dom_element).addClass('azexo');

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
                    azexo_elements.try_render_unknown_elements();
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
            if (this.parent == null) {
                if (!element.rendered) {
                    element.rendered = true;
                    element.load_container();
                }
            } else {
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
            }
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
    SectionElement.prototype.params.push(make_param_type({
        type: 'textfield',
        heading: t('Menu item title'),
        param_name: 'menu_item_title',
        description: t('Title which will be used in scroll menu.'),
        tab: t('Menu'),
    }));
    function ScrollMenuElement(parent, position) {
        ScrollMenuElement.baseclass.apply(this, arguments);
        this.menu_items = {};
        for (var id in azexo_elements.elements_instances) {
            var el = azexo_elements.elements_instances[id];
            if (el instanceof SectionElement) {
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
            if (el instanceof SectionElement) {
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
        $(document).on("azexo_add_element", function(sender, data) {
            add_update_element(sender, data.id)
        });
        $(document).on("azexo_edited_element", add_update_element);
        $(document).on("azexo_delete_element",
                function(sender, id) {
                    $('body')[fp + 'scrollspy']({
                        target: '#' + element.id + '.navbar-collapse',
                        offset: element.navbar_height,
                    });
//                    $('body')[fp+'scrollspy']('refresh');
                    var el = azexo_elements.get_element(id);
                    if (el instanceof SectionElement) {
                        delete element.menu_items[id];
                        element.replace_render();
                        element.showed($, p, fp);
                    }
                }
        );
        $(document).on("azexo_update_sorting",
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
                var h = $(element.dom_element).find('.navbar-brand').height();
                $(element.dom_element).find('.navbar-brand img').css('max-height', h + 'px');
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
            var header = $('<div class="' + p + 'navbar-header"><button type="button" class="' + p + 'navbar-toggle" data-toggle="' + p + 'collapse" data-target="#' + this.id + '"><span class="' + p + 'sr-only">' + t('Toggle navigation') + '</span><span class="' + p + 'icon-bar"></span><span class="' + p + 'icon-bar"></span><span class="' + p + 'icon-bar"></span></button><a class="' + p + 'navbar-brand" href="' + this.attrs['logo_link'] + '"></a></div>');
            var img = $('<img src="' + this.attrs['logo'] + '" alt="">');
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
    function FormElement(parent, position) {
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
            make_param_type({
                type: 'textfield',
                heading: t('Action URL'),
                param_name: 'action',
                description: t('URL of server script which will receive submitted form data.'),
            }),
        ].concat(FormElement.prototype.params),
        is_container: true,
        hidden: !window.azexo_online,
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
                if (this.attrs['action'] == '') {
                    $('<button title="' + title("Show submissions") + '" class="control show-submissions ' + p + 'btn ' + p + 'btn-default ' + p + 'glyphicon ' + p + 'glyphicon-list-alt" > </button>').appendTo(this.controls).click({object: this}, this.click_show_submissions);
                }

                var buttons = '<div class="form-fields ' + p + 'btn-group ' + p + 'btn-group-sm">';
                for (var key in FormDataElement.prototype.form_elements) {
                    var e = FormDataElement.prototype.form_elements[key].prototype;
                    buttons += '<button title="' + title("Add") + ' ' + e.name + '" class="control ' + p + 'btn ' + p + 'btn-default ' + e.icon + '" data-az-element="' + key + '"></button>';
                }
                buttons += '</div>';

                var add_field = $('<button title="' + title("Add form field") + '" class="control add-field ' + p + 'btn ' + p + 'btn-primary ' + p + 'glyphicon ' + p + 'glyphicon-plus-sign"> </button>').appendTo(this.controls)[fp + 'popover']({
                    animation: false,
                    placement: p + 'right',
                    html: 'true',
                    trigger: 'manual',
                    //container: 'body',
                    content: buttons,
                }).hover(function() {
                    $(add_field)[fp + 'popover']('show');
                    set_highest_zindex($(element.controls));
                    set_highest_zindex($(element.controls).find('.' + p + 'popover'));
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
                    $(element.controls).mouseleave(function() {
                        $(add_field)[fp + 'popover']('hide');
                        $(add_field).css('display', '');
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
//                    tolerance: "pointer",
//                    distance: 1,
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
            var type = container.attrs['container'].split('/')[0];
            if ('azexo_form_submit_type' in window)
                type = window.azexo_form_submit_type;
            var name = container.attrs['container'].split('/')[1];
            if ('azexo_form_submit_name' in window)
                name = window.azexo_form_submit_name;
            azexo_load_submissions(type, name, element.attrs['name'], function(data) {
                $('#az-form-modal').remove();
                var header = '<div class="' + p + 'modal-header"><button type="button" class="' + p + 'close" data-dismiss="' + p + 'modal" aria-hidden="true">&times;</button><h4 class="' + p + 'modal-title">' + element.attrs['name'] + ' ' + t(" submissions") + '</h4></div>';
                var footer = '<div class="' + p + 'modal-footer"></div>';
                var modal = $('<div id="az-form-modal" class="' + p + 'modal azexo"><div class="' + p + 'modal-dialog ' + p + 'modal-lg"><div class="' + p + 'modal-content">' + header + '<div class="' + p + 'modal-body"></div>' + footer + '</div></div></div>').prependTo('body');

                var columns = {};
                for (var dt in data) {
                    if (data[dt] != '') {
                        var submission = $.parseJSON(data[dt]);
                        for (var key in submission) {
                            if (!(key in columns))
                                columns[key] = true;
                        }
                    }
                }
                var rows = [];
                for (var dt in data) {
                    if (data[dt] != '') {
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
            if (this.attrs['action'] == '') {
                if ('recaptcha_publickey' in window) {
                    $(element.dom_element).find('.g-recaptcha').attr('data-sitekey', window.recaptcha_publickey);
                } else {
                    azexo_get_recaptcha_publickey(function(data) {
                        $(element.dom_element).find('.g-recaptcha').attr('data-sitekey', data);
                    });
                }
                this.add_external_js('https://www.google.com/recaptcha/api.js', function() {
                });
                $(element.dom_element).submit(function() {
                    var container = element.get_my_container();
                    var type = container.attrs['container'].split('/')[0];
                    if ('azexo_form_submit_type' in window)
                        type = window.azexo_form_submit_type;
                    var name = container.attrs['container'].split('/')[1];
                    if ('azexo_form_submit_name' in window)
                        name = window.azexo_form_submit_name;
                    azexo_submit_form(type, name, element.attrs['name'], $(element.dom_element).serialize(), function(data) {
                        if (data) {
                            (element.dom_element).prepend(get_alert(element.attrs['submited_message']));
                        }
                    });
                    return false;
                });
            }
        },
        render: function($, p, fp) {
            var element = this;
            this.dom_element = $('<form action="' + this.attrs['action'] + '" method="post" class="az-element az-form ' + this.attrs['el_class'] + '" style="' + this.attrs['style'] + '" role="form" enctype="multipart/form-data"></form>');
            this.dom_content_element = $('<div class="az-ctnr"></div>').appendTo(this.dom_element);
            $('<div class="' + p + 'form-group"><div class="g-recaptcha"></div></div>').appendTo(this.dom_element);
            $('<div class="' + p + 'form-group"><button class="' + p + 'btn ' + p + 'btn-lg ' + p + 'btn-primary" type="submit">' + this.attrs['submit_title'] + '</button></div>').appendTo(this.dom_element);
            FormElement.baseclass.prototype.render.apply(this, arguments);
        },
    });
//
//
//
    function FormDataElement(parent, position) {
        FormDataElement.baseclass.apply(this, arguments);
    }
    extend(FormDataElement, AnimatedElement);
    mixin(FormDataElement.prototype, {
        form_elements: {},
        show_parent_controls: '.az-form',
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
            make_param_type({
                type: 'textfield',
                heading: t('Title'),
                param_name: 'title',
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
                var ExternalElement = function(parent, position) {
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
                var ExternalElement = function(parent, position) {
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
                var params = [];
                if ('params' in element)
                    params = element.params;
                delete element.params;
                var reigstered_element = BaseElement.prototype.elements[base];
                if (!('extended' in reigstered_element)) {
                    reigstered_element.extended = true;
                    mixin(reigstered_element.prototype, element);
                    for (var i = 0; i < params.length; i++) {
                        var param = make_param_type(params[i]);
                        reigstered_element.prototype.params.push(param);
                    }
                }
            }
        }
    }
    make_azexo_extend();
//
//
//
    function create_template_elements() {
        if (!window.azexo_editor || window.azexo_online)
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
            } else {
                azexo_elements.cms_elements_loaded = true;
            }
        });
    }
    create_cms_elements();
//
//
//
// ------------------EXPORTER------------------------------------
    var original_head = '';
    var original_body = '';
    var original_body_attributes = '';
    var site_name = '';
    var site_containers = {};
    var site_pages = {};
    var site_settings = {theme: [], host: '', username: '', password: '', port: '21', directory: '.'};
    function enable_exporter() {
        function make_absolute_urls(dom) {
            $(dom).find('link[href]').each(function() {
                $(this).attr('href', toAbsoluteURL($(this).attr('href')));
            });
            $(dom).find('script[src]').each(function() {
                $(this).attr('src', toAbsoluteURL($(this).attr('src')));
            });
            $(dom).find('img[src]').each(function() {
                $(this).attr('src', toAbsoluteURL($(this).attr('src')));
            });
            $(dom).find('[style*="background-image"]').each(function() {
                var style = $(this).attr('style').replace(/background-image[: ]*url\(([^\)]+)\) *;/, function(match, url) {
                    return match.replace(url, encodeURI(toAbsoluteURL(decodeURI(url))));
                });
                $(this).attr('style', style);
            });
        }
        function make_theme_styles(settings) {
            var google_fonts = {};
            for (var i = 0; i < settings.length; i++) {
                if (settings[i].type == 'google_font') {
                    var v = settings[i].value;
                    var font = v.split('|')[0];
                    if (!(font in google_fonts)) {
                        google_fonts[font] = {subsets: [], variants: []};
                    }
                    var subset = v.split('|')[1];
                    var variant = v.split('|')[2];
                    google_fonts[font].subsets.push(subset);
                    $.unique(google_fonts[font].subsets);
                    google_fonts[font].variants.push(variant);
                    $.unique(google_fonts[font].variants);
                }
            }
            var styles = '<style>';
            for (var font in google_fonts) {
                var url = encodeURI('http://fonts.googleapis.com/css?family=' + font + ':' + google_fonts[font].variants.join(',') + '&subset=' + google_fonts[font].subsets.join(','));
                styles += '@import url(' + url + ');';
            }
            for (var i = 0; i < settings.length; i++) {
                var v = settings[i].value;
                if (settings[i].type == 'integer_slider') {
                    v += 'px';
                }
                if (settings[i].type == 'image') {
                    v = 'url("' + v + '")';
                }
                if (settings[i].type != 'google_font') {
                    if ('selector' in settings[i] && 'property' in settings[i]) {
                        var important = '';
                        if ('important' in settings[i] && settings[i].important)
                            important = ' !important';
                        if (_.isArray(settings[i].property)) {
                            for (var j = 0; j < settings[i].property.length; j++) {
                                styles += settings[i].selector + '{' + settings[i].property[j] + ': ' + v + important + ';}';
                            }
                        } else {
                            styles += settings[i].selector + '{' + settings[i].property + ': ' + v + important + ';}';
                        }
                    }
                } else {
                    if (v != '' && v.split('|').length == 3) {
                        var font = v.split('|')[0];
                        var variant = v.split('|')[2];
                        if ('selector' in settings[i]) {
                            if ('important' in settings[i] && settings[i].important)
                                styles += settings[i].selector + '{font-family: ' + font + ' !important;font-weight: ' + variant + ' !important;}';
                            else
                                styles += settings[i].selector + '{font-family: ' + font + ';font-weight: ' + variant + ';}';
                        }
                    }
                }
            }
            styles += '</style>';
            return styles;
        }
        function enable_theme_styles() {
            $(theme_styles).detach();
            $(theme_styles).appendTo('body');
            $(theme_styles).empty();
            $(theme_styles).append(make_theme_styles(site_settings.theme));
        }
        function get_page_html(containers, loader, title) {
            var js = {};
            var css = {};
            var dom = $('<div>' + original_body + '</div>');
            for (var i = 0; i < containers.length; i++) {
                var container = containers[i];
                var type = container.attrs['container'].split('/')[0];
                var name = container.attrs['container'].split('/')[1];
                var element = $(dom).find('.az-container[data-az-type="' + type + '"][data-az-name="' + name + '"]');
                $(element).empty();
                $(element).append(container.get_hover_styles(container));
                if (loader) {
                    var azexo_online = window.azexo_online;
                    window.azexo_online = false;
                    $(element).append(container.get_loader());
                    window.azexo_online = azexo_online;
                }
                $(element).append(container.get_html());
                js = $.extend(js, containers[i].js);
                css = $.extend(css, containers[i].css);
            }
            var attributes = '';
            $.each(original_body_attributes, function() {
                attributes = attributes + this.name + '"' + this.value + '" ';
            });
            make_absolute_urls(dom);
            $(dom).find('.azexo-backend').remove();
            $(dom).find('.azexo-editor').removeClass('azexo-editor');
            $(dom).find('.ui-sortable').removeClass('ui-sortable');


            if ('azexo_export_filter' in window) {
                window.azexo_export_filter(dom);
            }

            $(dom).append(make_theme_styles(site_settings.theme));
            var page_body = '<body ' + attributes + '>' + $(dom).html() + '</body>';

            var dom = $('<div>' + original_head + '</div>');
            $(dom).find('.azexo-backend').remove();
            if ('azexo_export_filter' in window) {
                window.azexo_export_filter(dom);
            }

            $(dom).find('title').text(title);
            make_absolute_urls(dom);
            for (var url in js) {
                $(dom).append('<script src="' + toAbsoluteURL(url) + '"></script>');
            }
            for (var url in css) {
                $(dom).append('<link rel="stylesheet" type="text/css" href="' + toAbsoluteURL(url) + '">');
            }
            $(dom).append("<script type='text/javascript'> window.ajaxurl = '" + toAbsoluteURL(window.ajaxurl) + "'; </script>");
            $(dom).append('<script type="text/javascript"> window.azexo_site_name = "' + site_name + '"; </script>');
            var page_head = '<head>' + $(dom).html() + '</head>';
            return '<!DOCTYPE html><html>' + page_head + page_body + '</html>';
        }
        if ($('#az-exporter').length == 0) {
            window.links_select = function(input, delimiter) {
                var options = {};
                for (var name in site_pages) {
                    if (site_pages[name] != null)
                        options[name + '.html'] = site_pages[name].title;
                }
                chosen_select(options, input);
            }
            for (var i = 0; i < azexo_containers.length; i++) {
                azexo_containers[i].saveable = false;
                $(azexo_containers[i].controls).remove();
                azexo_containers[i].show_controls();
            }
            original_head = $('head').html();
            original_body = $('body').html();
            original_body_attributes = $('body').prop("attributes");
            var panel = $('<div id="az-exporter" class="az-right-sidebar ' + p + 'text-center azexo"></div>').appendTo('body');
            var welcome = $('<div id="az-exporter-welcome" class="azexo">' + t('Manage and export your site via right panel.') + '</div>').appendTo(panel);
            $(panel).hover(function() {
                $(welcome).remove();
            });
            $('<hr>').appendTo(panel);
            $('<h4>' + t('Current site') + '</h4>').appendTo(panel);
            var toolbar = $('<div class="' + p + 'btn-toolbar"></div>').appendTo(panel);
            var buttons1 = $('<div class="' + p + 'btn-group ' + p + 'btn-group-xs"></div>').appendTo(toolbar);
            var buttons2 = $('<div class="' + p + 'btn-group ' + p + 'btn-group-xs"></div>').appendTo(toolbar);
            var buttons3 = $('<div class="' + p + 'btn-group ' + p + 'btn-group-xs"></div>').appendTo(toolbar);
            $('<hr>').appendTo(panel);
            function switch_page(name) {
                for (var i = 0; i < azexo_containers.length; i++) {
                    var parent = $(azexo_containers[i].dom_element).parent();
                    $(azexo_containers[i].dom_element).detach();
                    $(site_containers[name][i].dom_element).appendTo(parent);
                }
                azexo_containers = site_containers[name];
                for (var i = 0; i < azexo_containers.length; i++) {
                    if ('to_recursive_showed' in azexo_containers[i]) {
                        azexo_containers[i].recursive_showed();
                        delete azexo_containers[i].to_recursive_show;
                    }
                }
                $(name_input).val(name);
                $(title_input).val(site_pages[name].title);
            }
            function create_container(type_name) {
                var container = new ContainerElement(null, false);
                container.saveable = false;
                container.rendered = true;
                container.attrs['container'] = type_name;
                container.html_content = true;
                container.loaded_container = container.attrs['container'];

                container.render($, p, fp);
                $(container.dom_element).attr('data-az-id', container.id);
                $(container.dom_element).addClass('azexo-editor');
                $(container.dom_element).addClass('azexo');
                container.show_controls();
                container.update_sortable();
                container.showed($, p, fp);
                return container;
            }
            $('<button class="' + p + 'btn ' + p + 'btn-default">' + t('Add page') + '</button>').appendTo(buttons1).click(function() {
                var name = window.prompt(t('Please enter page name'), '');
                if (name != '' && name != null) {
                    site_containers[name] = [];
                    for (var i = 0; i < azexo_containers.length; i++) {
                        site_containers[name].push(create_container(azexo_containers[i].attrs['container']));
                    }
                    add_page(name, name);
                    switch_page(name);
                }
                return false;
            });
            $('<button class="' + p + 'btn ' + p + 'btn-danger">' + t('Remove page') + '</button>').appendTo(buttons1).click(function() {
                if ($(pages).find('a').length > 1) {
                    var name = $(pages).find('.' + p + 'active').text();
                    $(pages).find('.' + p + 'active').remove();
                    var new_name = $(pages).find('a:first-child').addClass(p + 'active').text();
                    switch_page(new_name);
                    delete site_containers[name];
                    site_containers[name] = null;
                }
                return false;
            });
            function get_export_site() {
                var site = {};
                for (var name in site_containers) {
                    if (site_containers[name] != null) {
                        var html = get_page_html(site_containers[name], true, site_pages[name].title);
                        site[name] = btoa(enc(encodeURIComponent(html)));
                    }
                }
                return site;
            }
            $('<button class="' + p + 'btn ' + p + 'btn-success">' + t('ZIP download') + '</button>').appendTo(buttons2).click(function() {
                var site = get_export_site();
                azexo_add_js({
                    path: 'js/json2.min.js',
                    loaded: 'JSON' in window,
                    callback: function() {
                        azexo_export(JSON.stringify(site), function(data) {
                            if (data)
                                window.location = data;
                        });
                    }
                });
                return false;
            });
            $('<h4>' + t('Current site pages') + '</h4>').appendTo(panel);
            var pages = $('<div class="' + p + 'list-group"></div>').appendTo(panel);
            $('<hr>').appendTo(panel);
            var form = $('<div class="' + p + 'text-left"></div>').appendTo(panel);
            $('<h4>' + t('Current page settings') + '</h4>').appendTo(form);
            var name_input = $('<div class="' + p + 'form-group"><label>' + t('File name') + '</label><div><input class="' + p + 'form-control" name="name" type="text"></div><p class="' + p + 'help-block">' + t('"html"-extension will be added during export process') + '</p></div>').appendTo(form).find('input[name="name"]').change(function() {
                var name = $(pages).find('.' + p + 'active').text();
                var new_name = $(this).val();
                site_containers[new_name] = site_containers[name];
                site_containers[name] = null;
                site_pages[new_name] = site_pages[name];
                site_pages[name] = null;
                $(pages).find('a.' + p + 'active:contains("' + name + '")').text(new_name);
                for (var page_name in site_containers) {
                    if (site_containers[page_name] != null) {
                        for (var i = 0; i < site_containers[page_name].length; i++) {
                            $(site_containers[page_name][i].dom_content_element).find('[href="' + name + '.html"]').each(function() {
                                $(this).attr('href', new_name + '.html');
                            });
                        }
                    }
                }
            });
            var title_input = $('<div class="' + p + 'form-group"><label>' + t('Title') + '</label><div><input class="' + p + 'form-control" name="title" type="text"></div><p class="' + p + 'help-block">' + t('') + '</p></div>').appendTo(form).find('input[name="title"]').change(function() {
                var name = $(pages).find('.' + p + 'active').text();
                site_pages[name].title = $(this).val();
            });
            site_containers['index'] = azexo_containers;
            function add_page(name, title) {
                $(pages).find('a').removeClass(p + 'active');
                site_pages[name] = {title: title};
                $('<a href="#" class="' + p + 'list-group-item ' + p + 'active">' + name + '</a>').appendTo(pages).click(function() {
                    if (!$(this).hasClass(p + 'active')) {
                        $(pages).find('a').removeClass(p + 'active');
                        $(this).addClass(p + 'active');
                        switch_page($(this).text());
                    }
                    return false;
                });
            }
            add_page('index', 'Home');
            $(name_input).val('index');
            $(title_input).val('Home');
            //sites management
            var sites_panel = $('<div class="' + p + 'panel ' + p + 'panel-default"><div class="' + p + 'panel-heading" role="tab" id="sites-heading"><h4 class="' + p + 'panel-title"><a data-toggle="' + p + 'collapse" href="#sites-collapse" aria-expanded="false" class="' + p + 'collapsed">' + t('Choose a site for edit') + '</a></h4></div><div id="sites-collapse" class="' + p + 'panel-collapse ' + p + 'collapse" role="tabpanel" aria-labelledby="sites-heading" aria-expanded="false"><div class="' + p + 'panel-body"></div></div></div>').prependTo(panel).find('.' + p + 'panel-body');
            $('<hr>').appendTo(sites_panel);
            var sites_buttons = $('<div class="' + p + 'btn-group ' + p + 'btn-group-xs"></div>').appendTo(sites_panel);
            function add_site(name) {
                $('<option value="' + name + '">' + name + '</option>').appendTo(select_site);
                $(select_site).find('option[value="' + name + '"]').prop('selected', 'selected');
                site_containers = {};
                site_pages = {};
                $(pages).empty();
                site_containers['index'] = [];
                for (var i = 0; i < azexo_containers.length; i++) {
                    site_containers['index'].push(create_container(azexo_containers[i].attrs['container']));
                }
                add_page('index', 'Home');
                switch_page('index');
                $(save_button).click();
            }
            var new_button = $('<button class="' + p + 'btn ' + p + 'btn-default">' + t('New') + '</button>').appendTo(sites_buttons).click(function() {
                var name = window.prompt(t('Please enter site name'), '');
                if (name != '' && name != null) {
                    add_site(name);
                }
            });
            $('<button class="' + p + 'btn ' + p + 'btn-danger">' + t('Delete') + '</button>').appendTo(sites_buttons).click(function() {
                azexo_delete_site($(select_site).find('option:selected').val());
                $(select_site).find('option:selected').remove();
                $(select_site).trigger('change');
            });
            var save_button = $('<button class="az-save-site ' + p + 'btn ' + p + 'btn-primary">' + t('Save') + '</button>').appendTo(buttons2).click(function() {
                var site = {};
                site.settings = site_settings;
                site.current_page = $(name_input).val();
                site.pages = {};
                for (var page_name in site_containers) {
                    if (site_pages[page_name] != null && site_containers[page_name] != null) {
                        site.pages[page_name] = site_pages[page_name];
                        site_pages[page_name].containers = {};
                        for (var i = 0; i < site_containers[page_name].length; i++) {
                            var c = site_containers[page_name][i].attrs['container'];
                            site_pages[page_name].containers[c] = btoa(enc(encodeURIComponent(site_containers[page_name][i].get_children_shortcode())));
                        }
                    }
                }
                azexo_add_js({
                    path: 'js/json2.min.js',
                    loaded: 'JSON' in window,
                    callback: function() {
                        azexo_save_site($(select_site).find('option:selected').val(), JSON.stringify(site));
                    }
                });
            });
            var uploading = false;
            $('<button class="az-publish-site ' + p + 'btn ' + p + 'btn-success">' + t('FTP upload') + '</button>').appendTo(buttons2).click(function() {
                if (!uploading) {
                    $('#az-ftp-modal').remove();
                    var header = '<div class="' + p + 'modal-header"><button type="button" class="' + p + 'close" data-dismiss="' + p + 'modal" aria-hidden="true">&times;</button><h4 class="' + p + 'modal-title">' + t("FTP upload") + '</h4></div>';
                    var footer = '<div class="' + p + 'modal-footer"><button type="button" class="' + p + 'btn ' + p + 'btn-default" data-dismiss="' + p + 'modal">' + t("Close") + '</button></div>';
                    var modal = $('<div id="az-ftp-modal" class="' + p + 'modal azexo"><div class="' + p + 'modal-dialog ' + p + 'modal-sm"><div class="' + p + 'modal-content">' + header + '<div class="' + p + 'modal-body"></div>' + footer + '</div></div></div>').prependTo('body');
                    var body = $(modal).find('.' + p + 'modal-body');
                    var host_input = $('<div class="' + p + 'form-group"><label>' + t("Host") + '</label><div><input class="' + p + 'form-control" name="host" type="text" value="' + site_settings['host'] + '"></div><p class="' + p + 'help-block"></p></div>').appendTo(body).find('input');
                    var username_input = $('<div class="' + p + 'form-group"><label>' + t("Username") + '</label><div><input class="' + p + 'form-control" name="username" type="text" value="' + site_settings['username'] + '"></div><p class="' + p + 'help-block"></p></div>').appendTo(body).find('input');
                    var password_input = $('<div class="' + p + 'form-group"><label>' + t("Password") + '</label><div><input class="' + p + 'form-control" name="password" type="password" value="' + site_settings['password'] + '"></div><p class="' + p + 'help-block"></p></div>').appendTo(body).find('input');
                    var port_input = $('<div class="' + p + 'form-group"><label>' + t("Port") + '</label><div><input class="' + p + 'form-control" name="port" type="text" value="' + site_settings['port'] + '"></div><p class="' + p + 'help-block"></p></div>').appendTo(body).find('input');
                    var directory_input = $('<div class="' + p + 'form-group"><label>' + t("Directory") + '</label><div><input class="' + p + 'form-control" name="directory" type="text" value="' + site_settings['directory'] + '"></div><p class="' + p + 'help-block"></p></div>').appendTo(body).find('input');
                    var connect = $('<button class="' + p + 'btn ' + p + 'btn-primary">' + t("Choose upload directory") + '</button>').appendTo(body).click(function() {
                        site_settings['host'] = $(host_input).val();
                        site_settings['username'] = $(username_input).val();
                        site_settings['password'] = $(password_input).val();
                        site_settings['port'] = $(port_input).val();
                        function show_directory(directory, list) {
                            $(browser).empty().show();
                            $(messages).empty().hide();
                            $(directory_input).val(directory);
                            site_settings['directory'] = directory;
                            if (directory != '.') {
                                var arr = directory.split('/');
                                arr.pop();
                                var dir = arr.join('/')
                                $('<li class="az-directory">' + t('< Up one level') + '</li>').appendTo(browser).click(function() {
                                    azexo_ftp_get_list(site_settings['host'], site_settings['username'], site_settings['password'], site_settings['port'], dir, function(data) {
                                        show_directory(dir, data);
                                    });
                                });
                                for (var i = 0; i < list.length; i++) {
                                    list[i] = list[i].replace(directory + '/', '');
                                }
                            }
                            for (var i = 0; i < list.length; i++) {
                                var path = directory + '/' + list[i];
                                (function(path) {
                                    $('<li class="' + p + 'glyphicon ' + p + 'glyphicon-folder-close">' + list[i] + '</li>').appendTo(browser).click(function() {
                                        azexo_ftp_get_list(site_settings['host'], site_settings['username'], site_settings['password'], site_settings['port'], path, function(data) {
                                            show_directory(path, data);
                                        });
                                    });
                                })(path);
                            }
                        }
                        azexo_ftp_get_list(site_settings['host'], site_settings['username'], site_settings['password'], site_settings['port'], site_settings['directory'], function(data) {
                            if (_.isArray(data)) {
                                $(connect).hide();
                                show_directory(site_settings['directory'], data);
                            } else {
                                alert(data);
                            }
                        });
                    });
                    $(body).find('input').change(function() {
                        site_settings['host'] = $(host_input).val();
                        site_settings['username'] = $(username_input).val();
                        site_settings['password'] = $(password_input).val();
                        site_settings['port'] = $(port_input).val();
                        site_settings['directory'] = $(directory_input).val();
                        if (site_settings['host'] != '' && site_settings['username'] != '' && site_settings['password'] != '' && site_settings['port'] != '') {
                            $(connect).show();
                            $(upload).show();
                        } else {
                            $(connect).hide();
                            $(upload).hide();
                        }
                    })
                    var browser = $('<ul class="az-browser"></ul>').appendTo(body).hide();
                    $('<hr>').appendTo(body);
                    var upload = $('<button class="' + p + 'btn ' + p + 'btn-success">' + t("Upload current site") + '</button>').appendTo(body).click(function() {
                        var site = get_export_site();
                        $(browser).empty().hide();
                        $(messages).empty().show();
                        azexo_add_js({
                            path: 'js/json2.min.js',
                            loaded: 'JSON' in window,
                            callback: function() {
                                var count = 0;
                                var upload_process = function(data) {
                                    if (data['errors'].length > 0) {
                                        for (var i = 0; i < data['errors'].length; i++)
                                            $(messages).append('<div class="' + p + 'alert ' + p + 'alert-danger" >' + data['errors'][i] + '</div>');
                                        uploading = false;
                                    } else {
                                        if (data['uploaded'].length > 0) {
                                            $(messages).append('<div class="' + p + 'alert ' + p + 'alert-info">' + data['uploaded'][0] + ' uploaded</div>');
                                        }
                                        if (data['count'] > 0) {
                                            if (count == 0)
                                                count = data['count'];
                                            $(progress).show().find('.' + p + 'progress-bar').css('width', ((count - data['count']) / count * 100) + '%');
                                            uploading = true;
                                            azexo_ftp_upload(JSON.stringify({}), data['site_path'], JSON.stringify(data['files']), site_settings['host'], site_settings['username'], site_settings['password'], site_settings['port'], site_settings['directory'], upload_process);
                                        } else {
                                            $(progress).show().find('.' + p + 'progress-bar').css('width', '100%');
                                            $(messages).append('<div class="' + p + 'alert ' + p + 'alert-success">' + t('Done') + '</div>');
                                            uploading = false;
                                        }
                                    }
                                }
                                uploading = true;
                                azexo_ftp_upload(JSON.stringify(site), '', JSON.stringify([]), site_settings['host'], site_settings['username'], site_settings['password'], site_settings['port'], site_settings['directory'], upload_process);
                            }
                        });
                    });
                    $(body).find('input').trigger('change');
                    $('<hr>').appendTo(body);
                    var progress = $('<div class="' + p + 'progress"><div class="' + p + 'progress-bar" role="progressbar"></div></div>').appendTo(body).hide();
                    var messages = $('<div class="az-messages"></div>').appendTo(body).hide();
                }
                $('#az-ftp-modal')[fp + 'modal']('show');
            }
            );
            var select_site = $('<select class="' + p + 'form-control"></select>').prependTo(sites_panel).change(function() {
                load_site($(this).find('option:selected').val());
            });
            function load_site(name) {
                azexo_load_site(name, function(data) {
                    var site = $.parseJSON(data);
                    site_name = name;
                    site_containers = {};
                    site_pages = site.pages;
                    site_settings = site.settings;
                    $(pages).empty();
                    for (var page_name in site.pages) {
                        site_containers[page_name] = new Array(azexo_containers.length);
                        for (var c in site.pages[page_name].containers) {
                            var container = create_container(c);
                            container.parse_shortcode(decodeURIComponent(enc(atob(site.pages[page_name].containers[c]))));
                            for (var i = 0; i < container.children.length; i++) {
                                container.children[i].recursive_render();
                            }
                            $(container.dom_content_element).empty();
                            container.attach_children();
                            container.update_empty();
                            container.update_sortable();
                            container.to_recursive_showed = true;

                            for (var i = 0; i < azexo_containers.length; i++) {
                                if (azexo_containers[i].attrs['container'] == c) {
                                    site_containers[page_name][i] = container;
                                    break;
                                }
                            }
                        }
                        add_page(page_name, site.pages[page_name].title);
                    }
                    switch_page(site.current_page);
                    enable_theme_styles();
                    $(pages).find('a').removeClass(p + 'active');
                    $(pages).find('a:contains("' + site.current_page + '")').addClass(p + 'active');
                    $('#az-template-elements-welcome').remove();
                    $('#az-exporter-welcome').remove();
                });
            }
            azexo_get_sites(function(names) {
                for (var i = 0; i < names.length; i++) {
                    $('<option value="' + names[i] + '">' + names[i] + '</option>').appendTo(select_site);
                }
                var current_site = 'My site';
                if ($(select_site).find('option:selected').length > 0)
                    current_site = $(select_site).find('option:selected').val();
                var params = window.location.search.replace('?', '').split('&');
                for (var i = 0; i < params.length; i++) {
                    var param = params[i].split('=');
                    if (param[0] == 'current_site') {
                        current_site = decodeURIComponent(param[1]);
                    }
                }
                if (current_site == 'create-new-site') {
                    $(new_button).click();
                } else {
                    if ($(select_site).find('[value="' + current_site + '"]').length == 0) {
                        add_site(current_site);
                    } else {
                        $(select_site).find('option[value="' + current_site + '"]').prop('selected', 'selected');
                        load_site(current_site);
                    }
                }
            });
            var theme_styles = $('<div></div>').appendTo(panel);
            function make_theme_dialog(settings, callback) {
                var params = [];
                var values = {};
                for (var i = 0; i < settings.length; i++) {
                    params.push(make_param_type(settings[i]));
                    values[settings[i].param_name] = settings[i].value;
                }
                for (var i = 0; i < params.length; i++) {
                    if ('group' in params[i] && params[i].type == 'colorpicker') {
                        params[i].dependency.callback = function(caller_param) {
                            var param = this;
                            function get_hsl(value) {
                                var rgb = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                                if (rgb == null) {
                                    rgb = hex2rgb($.trim(value));
                                } else {
                                    rgb.shift();
                                }
                                var hsl = rgb2hsl(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
                                return hsl;
                            }
                            function hsl_norm(value) {
                                if (value[0] < 0) {
                                    value[0] = value[0] + 1;
                                }
                                if (value[0] > 1) {
                                    value[0] = value[0] - 1;
                                }
                                if (value[1] < 0) {
                                    value[1] = 0;
                                }
                                if (value[1] > 1) {
                                    value[1] = 1;
                                }
                                if (value[2] < 0) {
                                    value[2] = 0;
                                }
                                if (value[2] > 1) {
                                    value[2] = 1;
                                }
                                return value;
                            }
                            var old_v = get_hsl(param.value);
                            param.value = param.get_value();
                            var new_v = get_hsl(param.value);                            
                            var delta = [new_v[0] - old_v[0], new_v[1]/old_v[1], new_v[2]/old_v[2]];
                            if (delta[0] < 0) {
                                delta[0] = delta[0] + 1;
                            }
                            if (delta[0] > 1) {
                                delta[0] = delta[0] - 1;
                            }
                            for (var i = 0; i < param.group.length; i++) {
                                var input = $(param.dom_element).closest('#az-editor-modal').find('[name="' + param.group[i] + '"]');
                                if(input.length > 0) {
                                    var color = $(input).val();
                                    var hsl = get_hsl(color);
                                    var new_v = [hsl[0] + delta[0], hsl[1] * delta[1], hsl[2] * delta[2]];
                                    new_v = hsl_norm(new_v);
                                    var rgb = hsl2rgb(new_v[0], new_v[1], new_v[2]);
                                    $(input).val('rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')');
                                    $(input).trigger('change');
                                }
                            }
                        };
                    }
                }
                BaseParamType.prototype.show_editor(params, {name: t('Theme'), attrs: values}, function(values) {
                    for (var i = 0; i < settings.length; i++) {
                        settings[i].value = values[settings[i].param_name];
                    }
                    callback(settings);
                });
            }
            function make_theme_configuration_dialog(configuration, callback) {
                var params = [];
                params.push(make_param_type({
                    type: 'javascript',
                    heading: t('Configuration'),
                    param_name: 'configuration',
                    value: configuration,
                }));
                BaseParamType.prototype.show_editor(params, {name: t('Theme configuration'), attrs: {configuration: configuration}}, function(values) {
                    callback(values['configuration']);
                });
            }
            $('<button class="az-theme-settings ' + p + 'btn ' + p + 'btn-default">' + t('Theme') + '</button>').appendTo(buttons3).click(function() {
                make_theme_dialog(site_settings.theme, function(new_theme) {
                    site_settings.theme = new_theme;
                    enable_theme_styles();
                })
                return false;
            });
            $('<button class="' + p + 'btn ' + p + 'btn-default">' + t('Configuration') + '</button>').appendTo(buttons3).click(function() {
                azexo_add_js({
                    path: 'js/json2.min.js',
                    loaded: 'JSON' in window,
                    callback: function() {
                        var configuration = JSON.stringify(site_settings.theme, null, "\t");
                        function get_colors_map() {
                            var saturation_min = 0;
                            var properties = ['color', 'background-color', 'border-left-color', 'border-right-color', 'border-top-color', 'border-bottom-color', 'outline-color'];
                            var color_map = {};
                            for (var i = 0; i < document.styleSheets.length; i++) {
                                var styleSheet = document.styleSheets[i];
                                if ('href' in styleSheet && styleSheet.href != null && styleSheet.href.indexOf('azexo_elements') >= 0) {
                                    for (var j = 0; j < styleSheet.cssRules.length; j++) {
                                        var cssRule = styleSheet.cssRules[j];
                                        if (cssRule instanceof CSSStyleRule) {
                                            for (var name in cssRule.style) {
                                                if ($.isNumeric(name)) {
                                                    var property = cssRule.style[name];
                                                    if (properties.indexOf(property) >= 0) {
                                                        var color = cssRule.style.getPropertyValue(cssRule.style[name]);
                                                        var rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                                                        if (rgb != null) {
                                                            var hsl = rgb2hsl(rgb[1], rgb[2], rgb[3]);
                                                            if (hsl[1] > saturation_min) {
                                                                if (!(color in color_map)) {
                                                                    color_map[color] = {};
                                                                }
                                                                if (!(property in color_map[color])) {
                                                                    color_map[color][property] = [];
                                                                }
                                                                color_map[color][property].push(cssRule.selectorText);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            return color_map;
                        }
                        if (configuration == '[]') {
                            var colors_map = get_colors_map();
                            var i = 0;
                            var params = [];
                            for (var color in colors_map) {
                                var selectors_map = {};
                                for (var property in colors_map[color]) {
                                    var selectors = [];
                                    for (var j = 0; j < colors_map[color][property].length; j++) {
                                        selectors.push(colors_map[color][property][j]);
                                    }
                                    selectors = selectors.join(', ');
                                    if (!(selectors in selectors_map)) {
                                        selectors_map[selectors] = [];
                                    }
                                    selectors_map[selectors].push(property);
                                }
                                for (var selectors in selectors_map) {
                                    var param = {
                                        type: 'colorpicker',
                                        tab: t('Colors'),
                                        heading: selectors_map[selectors].join('/') + ' ' + i,
                                        description: selectors,
                                        param_name: 'color' + i,
                                        value: color,
                                        selector: selectors,
                                        property: selectors_map[selectors]
                                    };
                                    params.push(param);
                                    i++;
                                }
                            }
                            var hsls = [];
                            var colors = [];
                            for (var color in colors_map) {
                                var rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                                var hsl = rgb2hsl(rgb[1], rgb[2], rgb[3]);
                                hsls.push(hsl);
                                colors.push(color);
                            }
                            function hue_distance(v1, v2) {
                                var d1 = Math.abs(v1[0] - v2[0]);
                                var d2 = Math.abs((1 - v1[0]) - v2[0]);
                                var d3 = Math.abs(v1[0] - (1 - v2[0]));
                                return Math.min(d1, d2, d3);
                            }
                            var HierarchicalClustering = function(threshold) {
                                this.linkage = "average";
                                this.threshold = threshold == undefined ? Infinity : threshold;
                            }
                            HierarchicalClustering.prototype = {
//                                distance: function(v1, v2) {
//                                    var total = 0;
//                                    for (var i = 0; i < v1.length; i++)
//                                        total += Math.pow(v2[i] - v1[i], 2)
//                                    return Math.sqrt(total);
//                                },
                                distance: hue_distance,
                                merge: function(c1, c2) {
                                    return c1;
                                },
                                cluster: function(items) {
                                    this.clusters = [];
                                    this.dists = [];  // distances between each pair of clusters
                                    this.mins = []; // closest cluster for each cluster
                                    this.index = []; // keep a hash of all clusters by key

                                    for (var i = 0; i < items.length; i++) {
                                        var cluster = {
                                            value: items[i],
                                            key: i,
                                            index: i,
                                            size: 1
                                        };
                                        this.clusters[i] = cluster;
                                        this.index[i] = cluster;
                                        this.dists[i] = [];
                                        this.mins[i] = 0;
                                    }

                                    for (var i = 0; i < this.clusters.length; i++) {
                                        for (var j = 0; j <= i; j++) {
                                            var dist = (i == j) ? Infinity :
                                                    this.distance(this.clusters[i].value, this.clusters[j].value);
                                            this.dists[i][j] = dist;
                                            this.dists[j][i] = dist;

                                            if (dist < this.dists[i][this.mins[i]]) {
                                                this.mins[i] = j;
                                            }
                                        }
                                    }

                                    var merged = this.mergeClosest();
                                    var i = 0;
                                    while (merged) {
                                        merged = this.mergeClosest();
                                    }

                                    this.clusters.forEach(function(cluster) {
                                        // clean up metadata used for clustering
                                        delete cluster.key;
                                        delete cluster.index;
                                    });

                                    return this.clusters;
                                },
                                mergeClosest: function() {
                                    // find two closest clusters from cached mins
                                    var minKey = 0, min = Infinity;
                                    for (var i = 0; i < this.clusters.length; i++) {
                                        var key = this.clusters[i].key,
                                                dist = this.dists[key][this.mins[key]];
                                        if (dist < min) {
                                            minKey = key;
                                            min = dist;
                                        }
                                    }
                                    if (min >= this.threshold) {
                                        return false;
                                    }

                                    var c1 = this.index[minKey],
                                            c2 = this.index[this.mins[minKey]];

                                    // merge two closest clusters
                                    var merged = {
                                        left: c1,
                                        right: c2,
                                        key: c1.key,
                                        size: c1.size + c2.size
                                    };

                                    this.clusters[c1.index] = merged;
                                    this.clusters.splice(c2.index, 1);
                                    this.index[c1.key] = merged;

                                    // update distances with new merged cluster
                                    for (var i = 0; i < this.clusters.length; i++) {
                                        var ci = this.clusters[i];
                                        var dist;
                                        if (c1.key == ci.key) {
                                            dist = Infinity;
                                        }
                                        else if (this.linkage == "single") {
                                            dist = this.dists[c1.key][ci.key];
                                            if (this.dists[c1.key][ci.key] > this.dists[c2.key][ci.key]) {
                                                dist = this.dists[c2.key][ci.key];
                                            }
                                        }
                                        else if (this.linkage == "complete") {
                                            dist = this.dists[c1.key][ci.key];
                                            if (this.dists[c1.key][ci.key] < this.dists[c2.key][ci.key]) {
                                                dist = this.dists[c2.key][ci.key];
                                            }
                                        }
                                        else if (this.linkage == "average") {
                                            dist = (this.dists[c1.key][ci.key] * c1.size
                                                    + this.dists[c2.key][ci.key] * c2.size) / (c1.size + c2.size);
                                        }
                                        else {
                                            dist = this.distance(ci.value, c1.value);
                                        }

                                        this.dists[c1.key][ci.key] = this.dists[ci.key][c1.key] = dist;
                                    }


                                    // update cached mins
                                    for (var i = 0; i < this.clusters.length; i++) {
                                        var key1 = this.clusters[i].key;
                                        if (this.mins[key1] == c1.key || this.mins[key1] == c2.key) {
                                            var min = key1;
                                            for (var j = 0; j < this.clusters.length; j++) {
                                                var key2 = this.clusters[j].key;
                                                if (this.dists[key1][key2] < this.dists[key1][min]) {
                                                    min = key2;
                                                }
                                            }
                                            this.mins[key1] = min;
                                        }
                                        this.clusters[i].index = i;
                                    }

                                    // clean up metadata used for clustering
                                    delete c1.key;
                                    delete c2.key;
                                    delete c1.index;
                                    delete c2.index;

                                    return true;
                                }
                            }
                            var hc = new HierarchicalClustering(0.01);
                            var clusters = hc.cluster(hsls);
                            function get_average(cluster) {
                                if ('value' in cluster) {
                                    return cluster.value;
                                } else {
                                    var vl = get_average(cluster.left);
                                    var vr = get_average(cluster.right);
                                    var v = new Array(vl.length);
                                    for (var i = 0; i < v.length; i++)
                                        v[i] = (vl[i] * cluster.left.size + vr[i] * cluster.right.size) / (cluster.left.size + cluster.right.size);
                                    return v;
                                }
                            }
                            var averages = [];
                            var groups = [];
                            for (var i = 0; i < clusters.length; i++) {
                                var c = get_average(clusters[i]);
                                averages.push(c);
                                groups.push([]);
                            }
                            for (var i = 0; i < hsls.length; i++) {
                                var min = 0;
                                var min_d = Infinity;
                                for (var j = 0; j < averages.length; j++) {
                                    var d = hue_distance(hsls[i], averages[j]);
                                    if (min_d > d) {
                                        min = j;
                                        min_d = d;
                                    }
                                }
                                for (var j = 0; j < params.length; j++) {
                                    if (params[j].value == colors[i]) {
                                        groups[min].push(params[j].param_name);
                                    }
                                }
                            }
                            for (var i = 0; i < averages.length; i++) {
                                var rgb = hsl2rgb(averages[i][0], averages[i][1], averages[i][2]);
                                var param = {
                                    type: 'colorpicker',
                                    heading: t('Color group') + ' ' + i,
                                    param_name: 'color_group_' + i,
                                    value: 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')',
                                    group: groups[i],
                                    dependency: {'element': 'color_group_' + i, 'not_empty': {}},
                                };
                                params.unshift(param);
                            }

                            configuration = JSON.stringify(params, null, "\t");
                        }
                        make_theme_configuration_dialog(configuration, function(new_configuration) {
                            site_settings.theme = $.parseJSON(new_configuration);
                            enable_theme_styles();
                        });
                    }
                });
                return false;
            });
            if (!window.azexo_editor)
                $(panel).hide();
        }
    }

})(window.jQuery, false, '', '', {}, {}, {}, null, [], {});
