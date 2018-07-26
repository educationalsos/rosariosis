// Modules.php JS.
/**
 * Add/replace HTML given the markup and the target ID.
 *
 * @param {string}  html
 * @param {string}  id
 * @param {boolean} replace Replace or add the HTML (optional).
 */
var addHTML = function(html, id, replace) {
	// Get element in pure Javascript
	// jQuery does not handle IDs with brackets [], check _makeMultipleInput().
	var el = document.getElementById( id );

	// Here we use jQuery
	// so inline Javascript gets evaluated!
	if ( replace ) {
		$( el ).html( html );
	} else {
		$( el ).append( html );
	}
}

/**
 * Check all checkboxes given the form,
 * the value/state and the checkboxes name (beginning with).
 *
 * @param  {[type]} form      Form element.
 * @param  {string} value     Checked value.
 * @param  {string} name_like Checkbox name begins with.
 */
var checkAll = function(form, value, name_like) {
	for (var i = 0, max = form.elements.length; i < max; i++) {
		var chk = form.elements[i];

		if (chk.type == 'checkbox' &&
			chk.name.substr(0, name_like.length) == name_like) {

			chk.checked = value;
		}
	}
}

/**
 * Switch menu,
 * used for the Advanced search widgets.
 * Toggles the next adjacent table element visibility.
 *
 * @param  {DOMelement} el The element, this.
 */
var switchMenu = function(el) {
	$(el).toggleClass('switched').nextAll('table').first().toggle();
}

/**
 * IE8 HTML5 tags fix
 *
 * @deprecated Remove when IE8 usage < 1%
 */
for (var tags = 'article|aside|footer|header|hgroup|nav|section'.split('|'), i = 0, max = tags.length; i < max; i++) {
	document.createElement(tags[i]);
}

// Popups
var popups = new popups();

function popups()
{
	this.childs = [];

	this.open = function(url, params) {
		if (!params)
			params = 'scrollbars=yes,resizable=yes,width=800,height=400';

		this.childs.push(window.open(url, '', params));
	};

	this.closeAll = function() {
		for (var i=0, max=this.childs.length; i<max; i++) {
			var child = this.childs[i];
			if (!child.closed)
				child.close();
		}
	};
}

/**
 * touchScroll, enables overflow:auto on mobile
 *
 * @link https://gist.github.com/chrismbarr/4107472
 *
 * @deprecated Remove when Android v.2.3 (Gingerbread) & old Safari (iOS < 5) usage < 1%
 * @link http://chris-barr.com/2010/05/scrolling_a_overflowauto_element_on_a_touch_screen_device/
 */
var touchScroll = function(el) {
	var startY = 0,
		startX = 0;

	el.addEventListener("touchstart", function (e) {
		startY = this.scrollTop + e.touches[0].pageY;
		startX = this.scrollLeft + e.touches[0].pageX;
	}, false);

	el.addEventListener("touchmove", function (e) {
		var tch = e.touches[0];
		if ((this.scrollTop < this.scrollHeight - this.offsetHeight && this.scrollTop + tch.pageY < startY - 5) || (this.scrollTop !== 0 && this.scrollTop + tch.pageY > startY + 5)) e.preventDefault();
		if ((this.scrollLeft < this.scrollWidth - this.offsetWidth && this.scrollLeft + tch.pageX < startX - 5) || (this.scrollLeft !== 0 && this.scrollLeft + tch.pageX > startX + 5)) e.preventDefault();
		this.scrollTop = startY - tch.pageY;
		this.scrollLeft = startX - tch.pageX;
	}, false);
}

function isTouchDevice() {
	try {
		document.createEvent("TouchEvent");
		return true;
	} catch (e) {
		return false;
	}
}

// ColorBox.
if (isTouchDevice()) $(document).bind("cbox_complete", function () {
	touchScroll(document.getElementById("cboxLoadedContent"));
});
else // Add .no-touch CSS class.
	document.documentElement.className += " no-touch";

var ColorBox = function() {
	var cWidth = 640, cHeight = 390;
	if ( screen.width < 768 ) {
		cWidth = 300; cHeight = 183;
	}

	$('.rt2colorBox').before(function(i){
		if ( this.id ) {
			var $el = $(this);
			// only if content > 1 line & text <= 36 chars.
			if ( $el.text().length > 36 || $el.children().height() > $el.parent().height() ) {
				return '<div class="link2colorBox"><a class="colorboxinline" href="#' + this.id + '"></a></div>';
			}
		}
	});
	$('.colorbox').colorbox();
	$('.colorboxiframe').colorbox({iframe:true, innerWidth:cWidth, innerHeight:cHeight});
	$('.colorboxinline').colorbox({inline:true, maxWidth:'95%', maxHeight:'85%', scrolling:true});
}

// MarkDown.
var md_last_val = {};

var GetMDConverter = function() {
	if ( typeof GetMDConverter.mdc === 'undefined' ) {
		GetMDConverter.mdc = new showdown.Converter({
			tables: true,
			simplifiedAutoLink: true,
			parseImgDimensions: true,
			tasklists: true,
			literalMidWordUnderscores: true
		});
	}

	return GetMDConverter.mdc;
}

var MarkDownInputPreview = function( input_id )
{
	var input = $('#' + input_id),
		html = input.val(),
		md_prev = $('#divMDPreview' + input_id);

	// Send AJAX request only if input modified.
	if ( !md_prev.is(":visible") && html !== '' && md_last_val[input_id] !== html )
	{
		md_last_val[input_id] = html;

		var mdc = GetMDConverter();

		// Convert MarkDown to HTML.
		md_prev.html( mdc.makeHtml( html ) );
	}

	// MD preview = Input size.
	if ( !md_prev.is(":visible") ) {

		md_prev.css({'height': input.css('height'), 'width': input.css('width')});
		//md_prev.parent('.md-preview').css({'max-width': input.css('width')});
	}

	// Toggle MD preview & Input.
	md_prev.toggle();
	input.toggle();
	// Disable Write / Preview tab.
	md_prev.siblings('.tab').toggleClass('disabled');
}

var MarkDownToHTML = function()
{
	$('.markdown-to-html').html(function(i, html){

		var mdc = GetMDConverter();

		return mdc.makeHtml( html );
	});
}

// JSCalendar.
var JSCalendarSetup = function()
{
	$('.button.cal').each(function(i, el){
		var j = el.id.replace( 'trigger', '' );

		Calendar.setup({
			monthField: "monthSelect" + j,
			dayField: "daySelect" + j,
			yearField: "yearSelect" + j,
			ifFormat: "%d-%b-%y",
			button: el.id,
			align: "Tl",
			singleClick: true
		});
	});
}

var ajaxOptions = function(target, url, form) {
	return {
		beforeSend: function (data) {
			// AJAX error hide.
			$('.ajax-error').hide();

			$('.loading').css('visibility', 'visible');
		},
		success: function (data, s, xhr) {
			// See PHP RedirectURL().
			var redirectUrl = xhr.getResponseHeader("X-Redirect-Url");
			if (redirectUrl) {
				url = redirectUrl;
			}
			else if (form && form.method == 'get') {
				var getStr = [];

				// Fix advanced search forms (student & user) URL > 2000 chars.
				if (form.name == 'search') {
					var formArray = $(form).formToArray();

					$(formArray).each(function(i,el){
						// Only add not empty values.
						if (el.value !== '')
							getStr.push(el.name + '=' + el.value);
					});

					getStr = getStr.join('&');
				} else {
					getStr = $(form).formSerialize();
				}

				url += (url.indexOf('?') != -1 ? '&' : '?') + getStr;
			}
			ajaxSuccess(data, target, url);
		},
		error: function(xhr, status, error){ ajaxError(xhr, status, error, url, target, form); },
		complete: function () {
			$('.loading').css('visibility', 'hidden');

			hideHelp();
		}
	};
}

var ajaxError = function(xhr, status, error, url, target, form) {
	var code = xhr.status,
		errorMsg = 'AJAX error. ' + code + ' ';

	if ( typeof ajaxError.num === 'undefined' ) {
		ajaxError.num = 0;
	}

	ajaxError.num++;

	if (code === 0) {
		errorMsg += 'Check your Network';

		if ( url && ajaxError.num === 1 ) {
			window.setTimeout(function () {
				// Retry once on AJAX error 0, maybe a micro Wifi interruption.
				$.ajax(url, ajaxOptions(target, url, form));
			}, 1000);
			return;
		}
	} else if (status == 'parsererror') {
		errorMsg += 'JSON parse failed';
	} else if (status == 'timeout') {
		errorMsg += 'Request Timeout';
	} else if (status == 'abort') {
		errorMsg += 'Request Aborted';
	} else {
		errorMsg += error;
	}

	errorMsg += '. ' + url;

	ajaxError.num = 0;

	// AJAX error popup.
	$('.ajax-error').html(errorMsg).fadeIn();
}

var ajaxLink = function(link) {
	// Will work only if in the onclick there is no error!

	var href,target;

	if ( typeof link == 'string' ) {
		href = link;
		target = 'body';
		if ( href == 'Side.php' ) target = 'menu';
		else if ( href == 'Side.php?sidefunc=update' ) target = 'menu-top';
		else if ( href.indexOf('Bottom.php') === 0 ) target = 'footer';
	} else {
		href = link.href;
		target = link.target;
	}

	if (href.indexOf('#') != -1 || target == '_blank' || target == '_top') // Internal/external/top anchor.
		return true;

	if (!target) {
		if (href.indexOf('Modules.php') != -1) target = 'body';
		else return true;
	}

	$.ajax(href, ajaxOptions(target, href, false));
	return false;
}

var ajaxPostForm = function(form, submit) {
	var target = form.target || 'body';

	if (form.action.indexOf('_ROSARIO_PDF') != -1) // Print PDF.
	{
		form.target = '_blank';
		form.method = 'post';
		return true;
	}
	if (target == '_top')
		return true;

	var options = ajaxOptions(target, form.action, form);
	if (submit) $(form).ajaxSubmit(options);
	else $(form).ajaxForm(options);
	return false;
}

var ajaxSuccess = function(data, target, url) {
	// Change URL after AJAX.
	//http://stackoverflow.com/questions/5525890/how-to-change-url-after-an-ajax-request#5527095
	$('#' + target).html(data);

	var doc = document;

	if (history.pushState && target == 'body' && doc.URL != url) history.pushState(null, doc.title, url);

	ajaxPrepare('#' + target);
}

var ajaxPrepare = function(target) {
	$(target + ' form').each(function () {
		ajaxPostForm(this, false);
	});

	if (target == '#menu' && window.modname) openMenu(modname);

	if (isTouchDevice()) $('.rt').each(function (i, e) {
		touchScroll(e.tBodies[0]);
	});

	var h3 = $('#body h3.title').first().text();
	document.title = $('#body h2').text() + (h3 ? ' | ' + h3 : '');

	submenuOffset();

	if ( target == '#body' || target == 'body' ) {

		openMenu();

		if ( screen.width > 736 ) {
			fixedMenu();
		} else {
			$('#menu').addClass('hide');
		}

		if (scrollTop == 'Y') {
			body.scrollIntoView();
			$('#body').scrollTop(0);
		}

		popups.closeAll();

		MarkDownToHTML();

		ColorBox();

		JSCalendarSetup();

		repeatListTHead( $('table.list') );
	}
}


// Disable links while AJAX (do NOT use disabled attribute).
// http://stackoverflow.com/questions/5985839/bug-with-firefox-disabled-attribute-of-input-not-resetting-when-refreshing
$(document).ajaxStart(function () {
	$('input[type="submit"],input[type="button"],a').css('pointer-events', 'none');
}).ajaxStop(function () {
	$('input[type="submit"],input[type="button"],a').css('pointer-events', '');
});


// On load.
window.onload = function() {
	// Cache <script> resources loaded in AJAX.
	$.ajaxPrefilter('script', function(options) { options.cache = true; });


	$(document).on('click', 'a', function (e) {
		return $(this).css('pointer-events') == 'none' ? e.preventDefault() : ajaxLink(this);
	});

	ajaxPrepare('body');

	// Load body after browser history.
	if (history.pushState) window.setTimeout(function () {
		window.addEventListener('popstate', function (e) {
			ajaxLink(document.URL);
		}, false);
	}, 1);
};

// onunload: Fix for Firefox to execute Javascript on history back.
window.onunload = function(){};

// Check if logged in.
// http://stackoverflow.com/questions/6359327/detect-back-button-click-in-browser
if (window.performance && window.performance.navigation.type == 2) {
	if ( document.URL.indexOf('Modules.php?') )
		window.location.href = 'index.php?modfunc=logout';
}

// ListOutput JS.
var LOSearch = function( ev, val, url ) {
	if ( ev.type === 'click' || ev.keyCode == 13 ) {
		ev.preventDefault();
		return ajaxLink( url + ( val ? '&LO_search=' + encodeURIComponent(val) : '' ) );
	}
}

// Repeat long list table header.
var repeatListTHead = function( $lists )
{
	if ( !$lists.length )
		return;

	$lists.each(function( i, tbl ){
		var trs = $(tbl).children("thead,tbody").children("tr"),
			tr_num = trs.length,
			tr_max = 20;

		// If more than 20 rows.
		if ( tr_num > tr_max ) {
			var th = trs[0];

			// Each 20 rows, or at the end if number of rows <= 40.
			for( var j = (tr_num > tr_max*2 ? tr_max : tr_num-1), trs2th = []; j < tr_num; j += tr_max ) {
				var tr = trs[j];
				trs2th.push(tr);
			}

			// Clone header.
			$(th).clone().addClass('thead-repeat').insertAfter( trs2th );
		}
	});
}


// Side.php JS.
var openMenu = function() {

	$("#selectedMenuLink,#selectedModuleLink").attr('id', '');

	if ( !window.modname || !modname || modname=='misc/Portal.php' ) return;

	$('.wp-submenu a[href$="' + modname + '"]').first().attr('id', 'selectedMenuLink');

	// Add selectedModuleLink.
	$('#selectedMenuLink').parents('.menu-module').children('.menu-top').attr('id', 'selectedModuleLink');
}

// Adjust Side.php submenu bottom offset.
function submenuOffset() {
	$(".adminmenu .menu-top").mouseover(function(){
		var submenu = $(this).next(".wp-submenu"),
			moveup = $("#footer").offset().top - $(this).offset().top - submenu.outerHeight();
		submenu.css("margin-top", (moveup < 0 ? moveup : 0) + 'px');
	});
}

// Bottom.php JS.
var toggleHelp = function() {
	if ($('#footerhelp').css('display') !== 'block') showHelp();
	else hideHelp();
}

var showHelp = function() {
	var $fh = $('#footerhelp');
	if (modname !== showHelp.tmp) {
		$('.loading').css('visibility', 'visible');
		$.get("Bottom.php?bottomfunc=help&modname=" + encodeURIComponent(modname), function (data) {
			showHelp.tmpdata = data;
			$fh.html(data).scrollTop(0);
			if (isTouchDevice()) touchScroll( $fh[0] );
		}).fail( ajaxError ).always( function() {
			$('.loading').css('visibility', 'hidden');
		});

		showHelp.tmp = modname;
	} else if (showHelp.tmpdata && ! $fh.html()) {
		$fh.html(showHelp.tmpdata);
	}
	$fh.show();
	$('#footer').css('height', function (i, val) {
		return parseInt(val,10) + parseInt($fh.css('height'),10);
	});
}

var hideHelp = function() {
	$('#footerhelp').hide();
	$('#footer').css('height', '');
}

var expandMenu = function() {
	$('#menu').toggleClass('hide');
}
