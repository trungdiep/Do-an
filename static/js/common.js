(function($, window, document, undefined){

	/* Detects if inputâ€™s placeholder is supported;
		 If not, show the hidden labels. */

	if (!Modernizr.input.placeholder) {
		var labels = document.getElementsByTagName('label');
		for (var i = 0; i < labels.length; i++) {
			if ( labels[i].getAttribute('hidden') != null ) {
				labels[i].setAttribute('style', 'display: inline-block;');
			}
		}
	}



	$(function(){
		$("#result-list .column").eq(0).hide();

		// Grid column nth-child
		// IE8ç”¨nth-childè¨­å®š
		var set_gridColumnNthChild = function(){

			if(window.isIE && window.ieVersion < 9) {

				// grid.css

				var target = 'grid--1 > .column, .grid--2 > .column:nth-child(2n+1), .grid--3 > .column:nth-child(3n+1), .grid-mix.grid--3 > .column:nth-child(2n+1), .grid--4 > .column:nth-child(4n+1), .grid--5 > .column:nth-child(5n+1), .grid--6 > .column:nth-child(6n+1), .grid-mix.grid--6 > .column:nth-child(2n+1), .grid-mix.grid--12 > .column:nth-child(2n+1), .grid-n--2 > .column:nth-child(2n+1), .grid-n--4 > .column:nth-child(4n+1), .grid-mix.grid-n--4 > .column:nth-child(2n+1), .grid-mix.grid-n--8 > .column:nth-child(2n+1), .grid-w--1 > .column, .grid-w--2 > .column:nth-child(2n+1), .grid-w--3 > .column:nth-child(3n+1), .grid-w--4 > .column:nth-child(4n+1), .grid-w--6 > .column:nth-child(6n+1) ';
				$(target).css({clear: 'left'});

				var resetTarget = '.grid-mix.grid--3 > .column:nth-child(3n+1), .grid-mix.grid--4 > .column:nth-child(4n+1)';
				$(resetTarget).css({clear: ''});

				var narrowTarget = '.narrow-contents .grid-n--2.narrow .column:nth-child(2n+1), .narrow-contents .grid-n--3 .column:nth-child(3n+1)';
				$(narrowTarget).css({marginLeft: '14%'});

				// slots.css

				var secondaryLineTarget = ' .slots .grid--2 > .column:nth-child(n+3), .slots .grid--3 > .column:nth-child(n+4), .slots .grid-mix.grid--3 > .column:nth-child(n+3), .slots .grid--4 > .column:nth-child(n+5), .slots .grid-mix.grid--4 > .column:nth-child(n+4), .slots .grid--6 > .column:nth-child(n+7), .slots .grid-mix.grid--6 > .column:nth-child(n+3), .slots .grid-mix.grid--12 > .column:nth-child(n+3), .slots .grid-n--2 > .column:nth-child(n+3), .slots .grid-n--3 > .column:nth-child(n+4), .slots .grid-n--4 > .column:nth-child(n+5), .slots .grid-n--6 > .column:nth-child(n+7), .slots .grid-n--8 > .column:nth-child(n+3)';
				$(secondaryLineTarget).css({paddingTop: '1em'});

				$("#result-list .column:nth-child(n+3):nth-child(odd)").css("clear", "both");

			}

		};
		set_gridColumnNthChild();

		// SPç”¨ ãƒ¡ã‚¤ãƒ³ãƒŠãƒ“é–‹é–‰ã‚¢ãƒ‹ãƒ¡
		$('.main-navigation .js-toggle-head').on('click', function(){
			var tgl = $(this).closest('.js-toggle').find('.sub-navigation');
			if(tgl.css('display') == 'none'){
				tgl.slideDown(200);
			} else {
				tgl.slideUp(200);
			}
		});


		// Breadcrumb
		if($('.js-nav-breadcrumb').length) {
			var tmp_w = $(window).width();

			var set_breadcrumb = function(w) {
				$('.js-nav-breadcrumb .is-compact').removeClass('is-compact');

				// olã®å¹…ãŒç”»é¢å¹…ã‚’ä¸‹å›žã‚‹ã¾ã§ãƒ‘ãƒ³ããšã‚’å·¦ã‹ã‚‰ã€Œãƒ»ãƒ»ãƒ»ã€ã«å¤‰æ›´
				// SP = window width < 768
				if(w < 768) {

					var grid_w = $('.js-nav-breadcrumb .grid-1').width();
					var full_w = $('.js-nav-breadcrumb ol').width();
					while ((grid_w < full_w) && (full_w > 0)) {
						$('.js-nav-breadcrumb li:not(.is-compact):first a').closest('li').addClass('is-compact');
						full_w = $('.js-nav-breadcrumb ol').width();

						if($('.js-nav-breadcrumb:first li:not(.is-compact) a').length == 0){
							break;
						}
					}
				}
			}

			// ä¸€åº¦ã‚¯ãƒªãƒƒã‚¯ã§éš ã‚Œã¦ã„ã‚‹æ–‡å­—ã‚’è¡¨ç¤ºã—<a>ã‚’æœ‰åŠ¹åŒ–
			var act_cancel = function(){
				event.preventDefault();
				$(this).closest('.is-compact').removeClass('is-compact');
				$(this).off('click', act_cancel);
			}
			$('.js-nav-breadcrumb').on('click', 'li.is-compact a', act_cancel);

			$(window).on('resize', function(){
				var w = $(window).width();
				if(tmp_w != w) {
					tmp_w = w;
					set_breadcrumb(w);
				}
			});
			set_breadcrumb(tmp_w);
		}

		// Tab
		var set_tab = function(){
			if($('.js-tab').length > 0) {
				$('.js-tab > li').each(function(){
					var anchor = $(this).find('a');

					/* ç”»é¢é·ç§»ã•ã›ãšã‚¿ãƒ–æŠ¼ä¸‹æ™‚ã«ä½•ã‹ã•ã›ãŸã„ã¨ãã¯ã“ã“ã«å®šç¾©
					anchor.on('click', function(){

						// ã‚¿ãƒ–æŠ¼ä¸‹æ™‚ã®å‹•ä½œ

						return false;
					});
					*/

					// reset location.href
					$(this).on('click', function(){
						try {
							anchor.trigger('click');
						}
						catch(e) {
							location.href = anchor.attr('href') || '';
						}
					});
				});
			}
		};
		set_tab();

		// ã‚¹ãƒšãƒƒã‚¯ï¼ˆã‚¿ãƒƒãƒã‚¤ãƒ™ãƒ³ãƒˆï¼‰
		var winSizeForTap;
		$(window).on('resize', function(){
			// UAåˆ¤å®š ã‚¯ãƒ©ã‚¹åã®ä»˜ä¸Žãƒ»å‰Šé™¤
			var ua = window.navigator.userAgent;
			winSizeForTap = false;
			$('.spec-icons .details').addClass('is-close');

			if( ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0 ||
				(ua.indexOf('Android') > 0) && (ua.indexOf('Mobile') > 0) ||
				ua.indexOf('Windows Phone') > 0 ){
				winSizeForTap = true;
			} else {
				$('.spec-icons .balloon').hover(function(){
					$('.details').addClass('is-close');
					$(this).find('.details').removeClass('is-close');
				},
				function(){
					$(this).find('.details').addClass('is-close');
				});
				//tabã§ãƒ•ã‚©ãƒ¼ã‚«ã‚¹ãŒå½“ãŸã£ãŸæ™‚
				$('.spec-icons .balloon')
				.focus( function () {
					$('.details').addClass('is-close');
					$(this).find('.details').removeClass('is-close');
				})
				.blur(function(){
					if($(this).find('.details').find('a').length == 0){
						$(this).find('.details').addClass('is-close');
					} else {
						$(this).find('a:last-of-type').blur(function(){
							$(this).closest('.details').addClass('is-close');
						});
					}
				});
			}
		});

			// SPã¨Tablet ã‚¿ãƒƒãƒ—æ™‚ã®å‹•ã
			$('body').on('touchend', function(){
				if (winSizeForTap) {
					var target = $(event.target);

					if ( target.hasClass('details') || target.parents('div').hasClass('details') ) {
						if( target.get(0).tagName.toLowerCase() != 'a'){
							// detailsã‚’ã‚¯ãƒªãƒƒã‚¯
							return false;
						}
					}

					else if( target.parents('div').hasClass('balloon') ){
						var detalis = target.closest('.balloon').children('.details');

						// ãƒãƒ«ãƒ¼ãƒ³è¡¨ç¤º
						if( detalis.hasClass('is-close')){
						$('.spec-icons .balloon .details').addClass('is-close');
							detalis.removeClass('is-close');
						} else {
							$('.spec-icons .balloon .details').addClass('is-close');
						}
						return false;
					}

					else {
						// ãã®ä»–ã‚’ã‚¯ãƒªãƒƒã‚¯ã§detailsã‚’éžè¡¨ç¤º
						$('.spec-icons .balloon .details').addClass('is-close');
					}
				}
			});

		// Toggle ã‚¢ã‚³ãƒ¼ãƒ‡ã‚£ã‚ªãƒ³
		$('.js-toggle').each(function(){
			if($(window).width() < 768){
				if($(this).hasClass('is-close')){
					$(this).find('.js-toggle-body').hide();
				}
			}
			$(this).find('.js-toggle-head').on('click', function(){
				$(this).closest('.js-toggle').toggleClass('is-close');
				$(this).find('.icon').toggleClass('visually-hidden');
				if($(window).width() < 768){
					$(this).closest('.js-toggle').find('.js-toggle-body').slideToggle(200);
				}
			});

			$(window).on('resize', function(){
				if($(window).width() < 768){
					$('.js-toggle.is-close').find('.js-toggle-body').hide();
				} else {
					$('.js-toggle.is-close').find('.js-toggle-body').show();
				}
			});
		});

		// js-toggle-nav ã‚³ãƒ³ãƒ†ãƒ³ãƒ„ãƒŠãƒ“
		$('.js-toggle-nav').each(function(){
			$('.js-toggle-nav').find('.sub-navigation').show();
			$('.js-toggle-nav.is-close').find('.sub-navigation').hide();

			$(this).find('.js-toggle-head').on('click', function(){
				$(this).parents('.js-toggle-nav').toggleClass('is-close');
				$(this).parents('.js-toggle-nav').find('.sub-navigation').slideToggle(200);
			});
		});


		// more ã€Œã‚‚ã£ã¨è¦‹ã‚‹ãƒœã‚¿ãƒ³ã€
		$('.js-more').each(function(){
			// anime
			var spd = 250;
			var easing = 'swing';

			var moreConts = $(this).closest('.js-more').find('.more-body, .feature-conts');
			var wrapHeight = moreConts.outerHeight() + 'px';

			moreConts.css({height:wrapHeight});

			// ã‚¯ãƒªãƒƒã‚¯æ™‚
			$(this).find('.js-more-head').on('click', function(){

				if($(this).hasClass('more-head-close')) {
					var moreTop = $(this).closest('.js-more-top').offset().top;
					moreConts.animate({height: wrapHeight}, spd);
					$('html,body').animate({scrollTop:moreTop}, 300, easing);
					$(this).closest('.js-more').toggleClass('is-close');
				}

				else {
					var contHeight = $(this).closest('.js-more').find('.js-cont-wrap').outerHeight(true) + 'px';
					moreConts.animate({height: contHeight}, spd);
					$(this).closest('.js-more').toggleClass('is-close');
				}

			});

		});

        $('.js-more-list').each(function(){
            var size_li = $(".display-list li").size();

            var x_first = $(".featured-specs").size();

            $('.display-list li:lt('+x_first+')').show();
            $(".show-more").hide();

            $(".js-more-list-head").click(function(e)
            {
                if ($(this).hasClass('more-head-close'))
                {
                    $('.display-list li:gt('+(x_first-1)+')').hide();
                    $(".js-more-list-head > button").text('More').append('<span aria-hidden="true" class="icon icon-ah-b-grey-light"></span>');
                    $(".js-more-list-head").removeClass('more-head-close').addClass('more-head');
                    $(this).closest('.js-more-list').toggleClass('is-close');
                    return false;
                }
                else
                {
                    $('.display-list li:lt('+size_li+')').show();
                    $(".js-more-list-head > button").text('Close').append('<span aria-hidden="true" class="icon icon-ah-t-grey-light"></span>');
                    $(".js-more-list-head").removeClass('more-head').addClass('more-head-close');
                    $(this).closest('.js-more-list').toggleClass('is-close');
                    return false;
                }

            });
        });

		// topicsã®ã€Œã‚‚ã£ã¨è¦‹ã‚‹ãƒœã‚¿ãƒ³ã€
		var w = $(window).width();
		if (w < 768) {

			var moreTopics = $('.detail-list .contents-body .column');
			var topicsCloseButton = $('.detail-list .more-btn .column');
			var topicsButton = $('.detail-list .more-btn');

			moreTopics.slice(2).css('display','none');
			topicsCloseButton.css('display','block');
			$('.js-more').each(function(){
				$(this).find('.js-more-head').on('click', function(){
					moreTopics.css('display','block');
					topicsButton.css('display','none');
				});
			});
		}//(w > x) if else

		// textarea é«˜ã•
		var w = $(window).width();
		if (w < 768) {

			var textareaField = $('.content-field textarea');
			textareaField.attr('rows','7');
		}//(w > x) if else

		// Smooth Scroll
		var smoothScroll = function(){
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var $target = $(this.hash);
				$target = $target.length && $target || $('[name="' + this.hash.slice(1) +'"]');
				if ($target.length) {
					var targetOffset = $target.offset().top;
					$('html,body').animate({scrollTop: targetOffset}, 500);
                    $target.focus();
					return false;
				}
			}
		}
		$('a[href*=#]').on('click', smoothScroll);

		// pagetop

		$(window).scroll(function () {
			var s = $(this).scrollTop();
			var sb = $(this).scrollTop() + $(window).height();
			if(s > 300) {
				$('#page-top').addClass('fixed');
				if (w < 768 && sb > ($('#page-top').offset().top + 15)) {
					$('#page-top').removeClass('fixed');
				}
			}else if(s < 300){
				$('#page-top').removeClass('fixed');
			}
		});
		var top_flag= true;
		$('#page-top a').off('click', smoothScroll).on('click', function(e){
			if(top_flag){
				top_flag = false;
				$('html,body').animate({scrollTop: 0}, 500);
				setTimeout(function(){
					top_flag = true;
				},600);
			}else{
				return false;
			}
			return false;
		});


		// Print
		var act_print = function(){
			window.print();
		}
		$('.js-print').on('click', act_print);


		// Color change
		$('.js-color-change').each(function(){

			var code = $(this).find('.js-color-code');
			var picture = $(this).find('.js-color-pictures');

			var set_color = function(id){
				code.html(id);
				picture.find('img').each(function(){
					if($(this).data('color-code') == id) {
						$(this).addClass('is-current');
					}
					else {
						$(this).removeClass('is-current');
					}
				});
			}
			$(this).find('.js-color-names li').on('click', function(e){
				e.preventDefault();
				set_color($(this).data('color-code'));
			});

			// initialize
			set_color($(this).find('.js-color-names li:first').data('color-code'));

		});


		// color-variation

		$('.color-variation .mouseover-color').each(function(){
			$(this).prev().attr('tabindex', 0);
		});


		// Overlay
		$('.js-overlay-window').each(function(){

			$(this).css({
				height: '60%',
				top: '15%'});

			var overlay = $(this).hide();
			var nowScroll = 0;

			// Background Screen
			var s = $('<div class="overlay-screen"></div>').css({
				opacity: 0.7 // for IE8
			})
			.hide()
			// Add Close Event
			.on('click', function(){
				overlay.trigger('overlayClose');
			});
			overlay.after(s);

			// Set Open Event
			var act_overlayOpen = function(){
				nowScroll = $(window).scrollTop();

				s.fadeIn(600);
				overlay.fadeIn(200);

				$(this).css({
					height:'80%',
					top: '8%'
				});

			}
			overlay.on('overlayOpen', act_overlayOpen);

			// Set Close Event
			var act_overlayClose = function(){

				$(this).css({
					height: '60%',
					top: '15%'});

				s.fadeOut(600);
				overlay.fadeOut(200);

				if (Modernizr.mq("screen and (min-width: 48.0em)")) {
					$('html,body').scrollTop(nowScroll);
				}

				return false;
			}
			overlay.on('overlayClose', act_overlayClose);

			// Call Close Event
			overlay.find('.js-close').on('click', function(){
				overlay.trigger('overlayClose');
			});

			// Call Open Event
			$('.js-overlay-open').on('click', function(){
				var t = $(this).data('overlay-target');
				$('#' + t).trigger('overlayOpen');
				return false;
			});

		});

	});

	//js_window_open-650-700 ãƒãƒƒãƒ—ã‚¢ãƒƒãƒ—ã‚ªãƒ¼ãƒ—ãƒ³
	$('.js_window_open-650-700').on('click', function(){
		var ua = window.navigator.userAgent;
		if( ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0 ||
			(ua.indexOf('Android') > 0) && (ua.indexOf('Mobile') > 0) ||
			ua.indexOf('Windows Phone') > 0 ){
			window.open(this.href, "WindowName");
		} else {
			window.open(this.href,"WindowName","width=650,height=700,resizable=yes,scrollbars=yes");
		}
		return false;
	});


})(jQuery, this, this.document);