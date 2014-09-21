/*!
 * Count Everest - jQuery Plugin
 * @version 	1.4.1
 * @requires 	jQuery v1.6 or later
 * @author 		Patrick Baber <support@anacoda.de>
 * @see			http://counteverest.anacoda.de
 *
 */
;(function($, window, document, undefined) {
	//defaults
	var p = 'countEverest',
		def = {
			/**
			 * Use this to specify the day in a month of the target date. The value have to be an integer between 1 and
			 * 31.
			 */
			day: 1,

			/**
			 * Use this to specify the month of the target date. The value have to be an integer between 1 and 12.
			 */
			month: 1,

			/**
			 * Use this to specify the year of the target date in four digits, e.g. 2021
			 */
			year: 2050,

			/**
			 * Use this to specify the hour of the target date. The value have to be an integer between 0 and 23.
			 */
			hour: 0,

			/**
			 * Use this to specify the minute of the target date. The value have to be an integer between 0 and 59.
			 */
			minute: 0,

			/**
			 * Use this to specify the second of the target date. The value have to be an integer between 0 and 59.
			 */
			second: 0,

			/**
			 * Use this to specify the millisecond of the target date. The value have to be an integer between 0 and
			 * 999.
			 */
			millisecond: 0,

			/**
			 * Define the offset from coordinated universal time (UTC) for the location of your target date to sync the
			 * countdown in the browsers of the users around the world. The default value "false" disables the timezone
			 * calculation. If you want to use the feature, set a value from -12 to 14. Decimal values, e.g. 3.5 are
			 * also allowed. Please refer to http://www.timeanddate.com/worldclock/ to find out your correct time zone.
			 * Keep in mind, that the offset from UTC of many location changes, when daylight saving time starts or
			 * ends.
			 *
			 * Example 1: I want to set my countdown to a club opening for 20 March 2014, 8pm. The club is based in
			 * Berlin. The offset from UTC in Berlin is normally 1. I have to set "timeZone: 1".
			 *
			 * Example 2: Same case, but other opening date. We now want to set the target date for the club opening to
			 * 10 May 2014. The daylight saving time in Berlin starts on 29 March this year. For this case I have to
			 * set "timeZone: 2".
			 */
			timeZone: false,

			/**
			 * This is the sizzle selector for the days value inside your countdown wrapper.
			 */
			daysWrapper: '.ce-days',

			/**
			 * This is the sizzle selector for the hours value inside your countdown wrapper.
			 */
			hoursWrapper: '.ce-hours',

			/**
			 * This is the sizzle selector for the minutes value inside your countdown wrapper.
			 */
			minutesWrapper: '.ce-minutes',

			/**
			 * This is the sizzle selector for the seconds value inside your countdown wrapper.
			 */
			secondsWrapper: '.ce-seconds',

			/**
			 * This is the sizzle selector for the deciseconds value inside your countdown wrapper. If this element is
			 * found, the "highspeedTimeout" is used for the countdown calculation. See the explanation below for more
			 * details.
			 */
			decisecondsWrapper: '.ce-dseconds',

			/**
			 * This is the sizzle selector for the milliseconds value inside your countdown wrapper. If this element is
			 * found, the "highspeedTimeout" is used for the countdown calculation. See the explanation below for more
			 * details.
			 */
			millisecondsWrapper: '.ce-mseconds',

			/**
			 * This is the sizzle selector for the unit "days" inside your countdown wrapper.
			 */
			daysLabelWrapper: '.ce-days-label',

			/**
			 * This is the sizzle selector for the unit "hours" inside your countdown wrapper.
			 */
			hoursLabelWrapper: '.ce-hours-label',

			/**
			 * This is the sizzle selector for the unit "minutes" inside your countdown wrapper.
			 */
			minutesLabelWrapper: '.ce-minutes-label',

			/**
			 * This is the sizzle selector for the unit "seconds" inside your countdown wrapper.
			 */
			secondsLabelWrapper: '.ce-seconds-label',

			/**
			 * This is the sizzle selector for the unit "deciseconds" inside your countdown wrapper.
			 */
			decisecondsLabelWrapper: '.ce-dseconds-label',

			/**
			 * This is the sizzle selector for the unit "milliseconds" inside your countdown wrapper.
			 */
			millisecondsLabelWrapper: '.ce-mseconds-label',

			/**
			 * This is the unit label inside "daysLabelWrapper" which is used if the value inside the "daysWrapper" is
			 * greater than 1. "dayLabel" (singular) is used at a value of 1.
			 */
			daysLabel: 'Days',

			/**
			 * Same as above, but this label is only used if the value of the calculated days is 1. Set it to null, if
			 * you want to use the "daysLabel" always.
			 */
			dayLabel: 'Day',

			/**
			 * This is the unit label inside "hoursLabelWrapper" which is used if the value inside the "hoursWrapper" is
			 * greater than 1. "hourLabel" (singular) is used at a value of 1.
			 */
			hoursLabel: 'Hours',

			/**
			 * Same as above, but this label is only used if the value of the calculated hours is 1. Set it to null, if
			 * you want to use the "hoursLabel" always.
			 */
			hourLabel: 'Hour',

			/**
			 * This is the unit label inside "minutesLabelWrapper" which is used if the value inside the
			 * "minutesWrapper" is greater than 1. "minuteLabel" (singular) is used at a value of 1.
			 */
			minutesLabel: 'Minutes',

			/**
			 * Same as above, but this label is only used if the value of the calculated minutes is 1. Set it to null,
			 * if you want to use the "minutesLabel" always.
			 */
			minuteLabel: 'Minute',

			/**
			 * This is the unit label inside "secondsLabelWrapper" which is used if the value inside the
			 * "secondsWrapper" is greater than 1. "minuteLabel" (singular) is used at a value of 1.
			 */
			secondsLabel: 'Seconds',

			/**
			 * Same as above, but this label is only used if the value of the calculated seconds is 1. Set it to null,
			 * if you want to use the "secondsLabel" always.
			 */
			secondLabel: 'Second',

			/**
			 * This is the unit label inside "decisecondsLabelWrapper" which is used if the value inside the
			 * "decisecondsWrapper" is greater than 1. "decisecondLabel" (singular) is used at a value of 1.
			 */
			decisecondsLabel: 'Deciseconds',

			/**
			 * Same as above, but this label is only used if the value of the calculated seconds is 1. If you don't want
			 * to use this, set it to null.
			 */
			decisecondLabel: 'Decisecond',

			/**
			 * This is the unit label inside "millisecondsLabelWrapper" which is used if the value inside the
			 * "millisecondsWrapper" is greater than 1. "millisecondLabel" (singular) is used at a value of 1.
			 */
			millisecondsLabel: 'Milliseconds',

			/**
			 * Same as above, but this label is only used if the value of the calculated milliseconds is 1. If you don't
			 * want to use this, set it to null.
			 */
			millisecondLabel: 'Millisecond',

			/**
			 * After this time in milliseconds the calculation of the countdown is triggered periodically. The default
			 * value fits if you want to show seconds as your smallest time unit, otherwise read the explanation about
			 * the "highspeedTimeout" param bellow.
			 */
			timeout: 1000,

			/**
			 * Same as timeout, but this is only in use if the "decisecondsWrapper" or "millisecondsWrapper" are set to
			 * an existing element. This is necessary for the fast recalculation, which is needed for the presentation
			 * of deciseconds and milliseconds. The default value is the official W3C standard for HTML5 browsers. The
			 * calculation with the "highspeedTimeout" consumes more resources, so use it only when necessary.
			 */
			highspeedTimeout: 4,

			/**
			 * Use this option to force left-hand zeros. Every value will have two digits excluding the year (four
			 * digits) and the milliseconds (3 digits).
			 */
			leftHandZeros: true,

			/**
			 * Wrap each digit with a tag to customize it individual.
			 */
			wrapDigits: true,

			/**
			 * Type of tag which will be used to wrap each digit.
			 */
			wrapDigitsTag: 'span',

			/**
			 * This value is necessary for the calculation of the countdown. Change this value only if you know
			 * what you are doing.
			 */
			dayInMilliseconds: 86400000,

			/**
			 * This value is necessary for the calculation of the countdown. Change this value only if you know
			 * what you are doing.
			 */
			hourInMilliseconds: 3600000,

			/**
			 * This value is necessary for the calculation of the countdown. Change this value only if you know
			 * what you are doing.
			 */
			minuteInMilliseconds: 60000,

			/**
			 * This value is necessary for the calculation of the countdown. Change this value only if you know
			 * what you are doing.
			 */
			secondInMilliseconds: 1000,

			/**
			 * This value is necessary for the calculation of the countdown. Change this value only if you know
			 * what you are doing.
			 */
			decisecondInMilliseconds: 100,

			/**
			 * This option is for a callback function which is called in the initialization process.
			 */
			onInit: null,

			/**
			 * This option is for a callback function which is called BEFORE every recalculation of the countdown
			 * starts. The "timeout" or the "highspeedTimeout" option defines how often the calculation process will
			 * run.
			 */
			beforeCalculation: null,

			/**
			 * This option is for a callback function which is called AFTER every recalculation of the countdown
			 * was performed. The "timeout" or the "highspeedTimeout" option defines how often the calculation process
			 * will run.
			 */
			afterCalculation: null,

			/**
			 * This function is deprecated. It is currently available for compatibility reasons. In the next
			 * release (version 1.2) this callback function will be removed and you have to use "afterCalculation". See
			 * description above for more details.
			 */
			onCalculation: null,

			/**
			 * This option is for a callback function which is only called after a change in the countdown display is
			 * done, like a step from one second to another. This callback will be called after the calculation process.
			 */
			onChange: null,

			/**
			 * This option is for a callback function which is called when the target date is reached.
			 */
			onComplete: null
		};

	//The actual plugin constructor
	function Plugin(e, o) {
		this.element = e;
		this.settings = $.extend({}, def, o);
		this._defaults = def;
		this._name = p;
		this._serverDate = null;		//server date which was submitted by the user
		this._javaScriptDate = null;	//JavaScript date at the time as the server date was submitted
		this.currentDate = null;
		this.targetDate = null;
		this.days = null;
		this.hours = null;
		this.minutes = null;
		this.seconds = null;
		this.deciseconds = null;
		this.milliseconds = null;
		this.daysLabel = null;
		this.hoursLabel = null;
		this.minutesLabel = null;
		this.secondsLabel = null;
		this.decisecondsLabel = null;
		this.millisecondsLabel = null;
		this._intervalId = null;
		this._wrapsExists = {};	//used for intelligent DOM manipulation
		this._oldValues = {};	//used for intelligent DOM manipulation
		this._changed = false;
		this.init();
	}

	Plugin.prototype = {
		init: function() {
			//short handle
			var t = this,
				e = t.element,
				s = t.settings;

			//define for the use in callback
			//t.getOptions = function() {
			//	return t.getOptions();
			//};

			//set timeout lower if milliseconds are used
			if ($(e).find(s.decisecondsWrapper).length > 0 || $(e).find(s.millisecondsWrapper).length > 0) {
				s.timeout = s.highspeedTimeout;
			}

			//onInit callback
			if ($.isFunction(s.onInit)) {
				s.onInit.call(t);
			}

			//run countdown calculation repetitive
			t._intervalId = setInterval(function() {
				t.calculate();
			}, s.timeout);

			//run countdown calculation first time
			t.calculate();
		},
		calculate: function() {
			//short handle
			var t = this,
				s = t.settings,
				dim = s.dayInMilliseconds,
				him = s.hourInMilliseconds,
				iim = s.minuteInMilliseconds,
				seim = s.secondInMilliseconds,
				deim = s.decisecondInMilliseconds,
				dateReached = false;

			//set target date
			t.setTargetDate(new Date(
				s.year,
				s.month - 1,
				s.day,
				s.hour,
				s.minute,
				s.second
			));

			//current and target date
			var cDate = t.getCurrentDate(),
				tDate = t.getTargetDate(),
				cTime = cDate.getTime(),
				tTz = (s.timeZone === false) ? 0 : (((tDate.getTimezoneOffset() / 60) + s.timeZone) * s.hourInMilliseconds),
				tTime = tDate.getTime() - tTz,
				dT = tTime - cTime,
				dTC = dT;

			//callback beforeCalculation
			if ($.isFunction(s.beforeCalculation)) {
				s.beforeCalculation.call(t);
			}

			//set "_changed" flag to false for this calculation step
			t._changed = false;

			var d = Math.floor(dTC / dim);
			dTC = dTC % dim;
			var h = Math.floor(dTC / him);
			dTC = dTC % him;
			var i = Math.floor(dTC / iim);
			dTC = dTC % iim;
			var se = Math.floor(dTC / seim),
				m = dTC % seim,
				ds = Math.floor(m / deim);

			//prevent negative values
			d = t.naturalNum(d);
			h = t.naturalNum(h);
			i = t.naturalNum(i);
			se = t.naturalNum(se);
			m = t.naturalNum(m);
			ds = t.naturalNum(ds);

			//save values
			t.days = d;
			t.hours = h;
			t.minutes = i;
			t.seconds = se;
			t.milliseconds = m;
			t.deciseconds = ds;

			//format values and labels
			t.format();

			//write values to DOM
			t.output();

			//is every displayed value zero
			if (Math.floor(dT / s.timeout) <= 0) {
				dateReached = true;
				if (s.millisecondsWrapper != null || s.decisecondsWrapper != null) {
					dateReached = (dT <= 0) ? true : false;
				}
			}

			//target date is reached
			if (dateReached == true) {
				//onComplete callback
				if ($.isFunction(s.onComplete)) {
					s.onComplete.call(t);
				}
				clearInterval(t._intervalId);
			}

			//callback onCalculation
			if ($.isFunction(s.onCalculation)) {
				s.onCalculation.call(t);
			}

			//callback afterCalculation
			if ($.isFunction(s.afterCalculation)) {
				s.afterCalculation.call(t);
			}
		},
		format: function() {
			//short handle
			var t = this,
				s = t.settings,
				d = t.days,
				h = t.hours,
				i = t.minutes,
				se = t.seconds,
				ds = t.deciseconds,
				m = t.milliseconds,
				sdL = s.dayLabel,
				shL = s.hourLabel,
				siL = s.minuteLabel,
				sseL = s.secondLabel,
				sdsL = s.decisecondLabel,
				smL = s.millisecondsLabel;

			//add left-hand zeros
			if (s.leftHandZeros == true) {
				t.days = t.strPad(d, 2);
				t.hours = t.strPad(h, 2);
				t.minutes = t.strPad(i, 2);
				t.seconds = t.strPad(se, 2);
				t.milliseconds = t.strPad(m, 3);
			}

			//decide which label to use (singular/plural)
			t.daysLabel = (d == 1 && sdL !== null) ? sdL : s.daysLabel;
			t.hoursLabel = (h == 1 && shL !== null)	? shL : s.hoursLabel;
			t.minutesLabel = (i == 1 && siL !== null) ? siL : s.minutesLabel,
			t.secondsLabel = (se == 1 && sseL !== null) ? sseL : s.secondsLabel,
			t.decisecondsLabel = (ds == 1 && sdsL !== null) ? sdsL : s.decisecondsLabel,
			t.millisecondsLabel = (m == 1 && smL !== null) ? smL : s.millisecondsLabel;
		},
		output: function() {
			//short handle
			var t = this,
				s = t.settings;

			//write time labels to DOM
			t.writeLabelToDom(s.daysLabelWrapper, t.daysLabel);
			t.writeLabelToDom(s.hoursLabelWrapper, t.hoursLabel);
			t.writeLabelToDom(s.minutesLabelWrapper, t.minutesLabel);
			t.writeLabelToDom(s.secondsLabelWrapper, t.secondsLabel);
			t.writeLabelToDom(s.decisecondsLabelWrapper, t.decisecondsLabel);
			t.writeLabelToDom(s.millisecondsLabelWrapper, t.millisecondsLabel);

			//write time values to DOM
			t.writeDigitsToDom(s.daysWrapper, t.days, 'ce-days-digit');
			t.writeDigitsToDom(s.hoursWrapper, t.hours, 'ce-hours-digit');
			t.writeDigitsToDom(s.minutesWrapper, t.minutes, 'ce-minutes-digit');
			t.writeDigitsToDom(s.secondsWrapper, t.seconds, 'ce-seconds-digit');
			t.writeDigitsToDom(s.decisecondsWrapper, t.deciseconds, 'ce-dseconds-digit');
			t.writeDigitsToDom(s.millisecondsWrapper, t.milliseconds, 'ce-mseconds-digit');

			//onChange callback if anything has _changed
			if ($.isFunction(s.onChange) && t._changed == true) {
				s.onChange.call(t);
			}
		},
		pause: function() {
			var t = this,
				i = t._intervalId;

			//clear interval
			if (i) {
				clearInterval(i);
			}
		},
		resume: function() {
			var t = this,
				s = t.settings;

			//run countdown calculation repetitive
			t._intervalId = setInterval(function() {
				t.calculate();
			}, s.timeout);
		},
		destroy: function() {
			var t = this,
				i = t._intervalId,
				j = $(t.element);

			//clear interval
			if (i) {
				clearInterval(i);
			}

			//clear wrapper elements
			/*
			$.each(this._wrapsExists, function(index) {
				if (this == true) {
					j.find(index).empty();
				}
			});
			*/
		},
		getOption: function(o) {
			return this.settings[o];
		},
		setOption: function(o, v) {
			this.settings[o] = v;
		},
		setTargetDate: function(d) {
			this.targetDate = d;
		},
		getTargetDate: function() {
			return this.targetDate;
		},
		setCurrentDate: function(d) {
			this.currentDate = d;
		},
		getCurrentDate: function() {
			return new Date();
		},
		getOptions: function() {
			return this.settings;
		},
		naturalNum: function(i) {
			return (i < 0) ? 0 : i;
		},
		strPad: function(i, l, s) {
			var o = i.toString();
			if (!s) {
				s = '0';
			}
			while (o.length < l) {
				o = s + o;
			}
			return o;
		},
		writeLabelToDom: function(e, v) {
			var t = this,
				j = $(t.element);

			//check if the label exists in the DOM
			if (t._wrapsExists[e] == null) {
				t._wrapsExists[e] = (j.find(e).length > 0) ? true : false;
			}

			//new value and the wrapper exists
			if (t._oldValues[e] != v && t._wrapsExists[e]) {
				t._oldValues[e] = v;
				j.find(e).text(v);
				//needed for the onChange callback
				t._changed = true;
			}
		},
		writeDigitsToDom: function(w, v, c) {
			var t = this,
				s = t.settings,
				wd = s.wrapDigitsTag,
				j = $(t.element),
				we = j.find(w),
				wte, //defining at this point is to early, so this variable is only declared at this point
				v = v.toString(),
				vs = [],
				diff;

			//check if the wrapper element exists
			if (t._wrapsExists[w] == null) {
				t._wrapsExists[w] = (we.length > 0) ? true : false;
			}

			//if the wrap doesn't exists, there is no need to write something to the DOM
			if (t._wrapsExists[w] == false) {
				return false;
			}

			//split value in separate digits
			if (s.wrapDigits == true) {
				for (var i = 0; i < v.length; i++) {
					vs[i] = v[i];
				}
			} else {
				vs[0] = v;
			}

			//init array for old values in wrap
			if (typeof t._oldValues[w] == 'undefined') {
				t._oldValues[w] = [];
			}

			//detect difference between old and new value count
			//remove elements
			if (t._oldValues[w].length > vs.length) {
				diff = t._oldValues[w].length - vs.length;

				//remove the unused wrap elements from left to right
				wte = we.find(wd);
				wte.slice(0, diff).remove();

				//update element values
				wte = we.find(wd);
				for (var i = 0; i < vs.length; i++) {
					wte.eq(i).addClass('test').text(vs[i]);
				}

				t._changed = true;
			}
			//add elements
			if (t._oldValues[w].length < vs.length) {
				//no wrap around the digits
				if (s.wrapDigits == false) {
					we.text(vs[0]);
				}
				//with wrap around the digits
				else {
					//if no sibling is inside the wrap, clear also a text node
					if (t._oldValues[w].length == 0) {
						we.text('');
					}

					//update the values and add new digit wraps if needed
					var tmp = '';
					for (var i = 0; i < vs.length; i++) {
						diff = vs.length - t._oldValues[w].length;

						//create digit wraps with text
						if (i < diff) {
							tmp += '<' + wd + ' class="' + c + '">' + vs[i] + '</' + wd + '>';
						}
						//update only text
						else {
							wte = we.find(wd);
							wte.eq(i - diff).text(vs[i]);
						}
					}

					//insert new span
					we.prepend(tmp);
				}

				t._changed = true;
			}
			//the element count is the same, but the values inside could be different
			if (t._oldValues[w].length == vs.length) {
				//no wrap around the digits
				if (s.wrapDigits == false) {
					//value is different, so update the value in the wrap
					if (t._oldValues[w][0] != vs[0]) {
						we.text(vs[0]);
						t._changed = true;
					}
				}
				//with wrap around the digits
				else {
					for (var i = 0; i < vs.length; i++) {
						//value is different so update the value in the digit wrap
						if (t._oldValues[w][i] != vs[i]) {
							wte = we.find(wd);
							wte.eq(i).text(vs[i]);
							t._changed = true;
						}
					}
				}
			}

			//reset old values for the wrapper and set new values as old values
			t._oldValues[w] = [];
			for (var i = 0; i < vs.length; i++) {
				t._oldValues[w][i] = vs[i];
			}
		}
	};

	//a plugin wrapper around the constructor, preventing against multiple instantiations
	$.fn[p] = function(o, p1, p2) {
		var v = null;
		var e = this.each(function() {
			var pr = 'plugin_',
				c = null;
			//initialize plugin or run API methods
			if (!$.data(this, pr + p)) {
				c = new Plugin(this, o)
				$.data(this, pr + p, c);
			} else {
				c = $.data(this, pr + p);

				//call destroy API method or others
				if (o === 'destroy') {
					c.destroy();
					$.data(this, pr + p, null);
					return;
				} else {
					var fn = c[o],
						param = null;
					if (typeof fn === 'function') {
						v = fn.call(c, p1, p2);
					}
					return false;
				}
			}
		});

		return (v) ? v : e;
	};
})(jQuery, window, document);