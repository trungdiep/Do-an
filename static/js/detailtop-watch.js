/* Title:       Products Detail Top (Watch and Calculator)
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Version:     1.0
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */

/* Swiper Initialize
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

$(function(){

	// Main Visual
	$('.js-slide-mainvisual').each(function(){

		// Main
		var myMainvisualSlideshows = new setMainvisualSlideshows($(this), 4);

		// Clone Zoom Slideshow
		var cloneSlideshows = $('.js-slide-mainvisual').clone();
		cloneSlideshows.css('opacity',1);
		cloneSlideshows.find('.swiper-slide').removeClass('zoom').removeClass('js-zoom');
		cloneSlideshows.find('.swiper-slide-duplicate').remove();

		$('#slide-zoom .slide-mainvisual').append(cloneSlideshows);
		var myZoomSlideshows = new setMainvisualSlideshows($('#slide-zoom .js-slide-mainvisual'));

		$('#slide-zoom').on('overlayOpen', function(){
			myZoomSlideshows.resetSlider(true);
		});

		// ã‚µãƒ ãƒã‚¤ãƒ«ãŒä¸€ã¤ã®æ™‚ã¯éžè¡¨ç¤º
		var listsNumber = $('.js-slide-mainvisual:first-child .slide-mainvisual-thumbs .swiper-slide').length;
		if (listsNumber < 2) {
			$('.thumbs').hide();
		}
		if (listsNumber < 5) {
			$('.swiper-nav').hide();
		};
		if (listsNumber < 7) {
			$('#slide-zoom .swiper-nav').hide();
		};
		

		// Overlay Open
		$('.js-slide-mainvisual .js-zoom').on('click', function(){

			$('#slide-zoom').trigger('overlayOpen');
			return false;

		});

		// Set Current
		set_current = function(zoom){
			var nowScroll = zoom? 0 : $(window).scrollTop();
			$(window).scrollTop(nowScroll);
			var parent = zoom ? myMainvisualSlideshows : myZoomSlideshows;
			var child = zoom ? myZoomSlideshows : myMainvisualSlideshows;
			max = parent.pagenationSlideshow.slides.length;
			var target = parent.mainSlideshow.activeIndex - 1;
			var current = target >= max ? 0 : target;
			child.pagenation.find('.swiper-slide:eq(' + current + ')').addClass('is-active').siblings().removeClass('is-active');
			child.mainSlideshow.swipeTo(current);
		};
		$('#slide-zoom').on('overlayOpen', function(){
			set_current(true);
		});
		$('#slide-zoom').on('overlayClose', function(){
			set_current(false);
		});

	});


		// ã‚¹ãƒšãƒƒã‚¯ï¼ˆã‚¿ãƒƒãƒã‚¤ãƒ™ãƒ³ãƒˆï¼‰
		var winSizeForTap;
		$('#specification-watch li .details').closest('li').attr('tabindex', 0).addClass('balloon');
		$(window).on('load resize', function(){
			// UAåˆ¤å®š ã‚¯ãƒ©ã‚¹åã®ä»˜ä¸Žãƒ»å‰Šé™¤
			var ua = window.navigator.userAgent;
			winSizeForTap = false;

			if( ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0 ||
				(ua.indexOf('Android') > 0) && (ua.indexOf('Mobile') > 0) ||
				ua.indexOf('Windows Phone') > 0 ){
				winSizeForTap = true;
			} else {
				$('#specification-watch li.balloon')
					.on('mouseover', function(){
						$(this).find('.details').removeClass('is-close');
					})
					.on('mouseleave', function(){
						$(this).find('.details').addClass('is-close');
					})
					.focus(function(){
						$('#specification-watch .balloon li .details').addClass('is-close');
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

				else if( target.closest('li').hasClass('balloon')  ){
					var detalis = target.closest('.balloon').children('.details');

					// ãƒãƒ«ãƒ¼ãƒ³è¡¨ç¤º
					if( detalis.hasClass('is-close')){
					$('.no-style-list .balloon .details').addClass('is-close');
						detalis.removeClass('is-close');
					} else {
						$('.no-style-list .balloon .details').addClass('is-close');
					}
					return false;
				}

				else {
					// ãã®ä»–ã‚’ã‚¯ãƒªãƒƒã‚¯ã§detailsã‚’éžè¡¨ç¤º
					$('.no-style-list .balloon .details').addClass('is-close');
				}
			}
		});


	
});