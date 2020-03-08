/* Title:       Product Watch Mainvisual Slideshows
   笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
   Version:     1.0
笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏≫煤笏� */

var setMainvisualSlideshows = function(obj, perGroup) {

	var self = this;

	self.main = obj.find('.slide-mainvisual-content');
	self.pagenation = obj.find('.slide-mainvisual-thumbs');

	self.btnPrevious = obj.find('.js-nav-previous');
	self.btnNext = obj.find('.js-nav-next');

	/* Setting Navigation Event
	笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏 */

	self.setNavigationEvent = function(swiper){
		// Pprevious
		self.btnPrevious.off('click').on('click', function(e){
			e.preventDefault();
			swiper.swipePrev();
		});

		// Next
		self.btnNext.off('click').on('click', function(e){
			e.preventDefault();
			swiper.swipeNext();
		});

	}


	/* Setting Navigation Disabled
	笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏 */

	self.setNavigationDisabled = function(swiper){
		if(swiper.activeIndex == NaN){
			swiper.activeIndex = 0;
		}
		// Single Page
		if(swiper.slides.length == swiper.params.slidesPerView) {
			self.btnPrevious.addClass('is-disabled');
			self.btnNext.addClass('is-disabled');
			
		}
		

		// First
		else if(swiper.activeIndex == 0) {
			self.btnPrevious.addClass('is-disabled').siblings().removeClass('is-disabled');
		}

		// Last
		
		else if(swiper.activeIndex == (swiper.slides.length - (swiper.params.slidesPerGroup))) {
			self.btnNext.addClass('is-disabled').siblings().removeClass('is-disabled');
		}
		

		else if(swiper.activeIndex >= 2) {
			self.btnNext.addClass('is-disabled').siblings().removeClass('is-disabled');
		}

		// Other
		else {
			//console.log(swiper.activeIndex);
			self.btnPrevious.removeClass('is-disabled');
			self.btnNext.removeClass('is-disabled');
		}

	}


	/* Main Slideshow
	笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏 */

	function displaySwiper(){
		
		self.pagenation.find('.swiper-slide:eq(0)').addClass('is-active').siblings().removeClass('is-active');
		loadVariant(0);
	}

	self.mainSlideshow = new Swiper(self.main[0], {
		initialSlide: 0,
		loop: true,
		resizeReInit: false,
		autoResize: false,
		simulateTouch: false,
		createPagination: false,
		onSwiperCreated: function(swiper) {
			
			var displayItems = setTimeout( displaySwiper, 100 );
			$('.loading').hide();
			$('.js-slide-mainvisual').show();
			
		},
		onSlideChangeEnd: function(swiper) {

			var target = swiper.activeIndex - 1;
			self.pagenation.find('.swiper-slide:eq(' + target + ')').addClass('is-active').siblings().removeClass('is-active');

			// Youtube for iOS
			var target = $(swiper.slides[swiper.activeIndex]);
			if(target.hasClass('movie')) {
				target.find('iframe').width('100.001%');
			}

		}
	});


	/* Pagenation Slideshow
	笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏 */

	self.pagenationSlideshow = undefined;
	var createSlider = function(isWide) {

		self.pagenationSlideshow = new Swiper(self.pagenation[0], {
			visibilityFullFit: true,
			calculateHeight: true,
			updateOnImagesReady: true,
			simulateTouch: isWide ? false : true,
			autoResize: isWide ? false : true,
			resizeReInit: isWide ? false : true,
			slidesPerView: isWide ? (perGroup || 6) : 'auto',//逕ｻ髱｢縺ｫ陦ｨ遉ｺ縺吶ｋ譫壽焚
			slidesPerGroup: isWide ? (perGroup || 6) : 1,// 遏｢蜊ｰ繧ｯ繝ｪ繝�け縺ｧ遘ｻ蜍輔☆繧区椢謨ｰ

			onInit: function(swiper) {
				self.setNavigationEvent(swiper);
				self.setNavigationDisabled(swiper);
				if(swiper.slides.length<5){
					self.btnNext.addClass('is-disabled');
				}
				if(isWide && Modernizr.csstransitions) {

					// Set Wrapper Style
					swiper.wrapper.style.width = (100 / swiper.params.slidesPerView) * swiper.slides.length + '%';
					swiper.wrapper.style.height = 'auto';
					swiper.wrapper.style.transitionDuration = '0.3s';
					swiper.wrapper.style.webkitTransitionDuration = '0.3s';
					swiper.wrapper.style.transform = 'translate3d(0, 0, 0)';
					swiper.wrapper.style.webkitTransform = 'translate3d(0, 0, 0)';

					// Set Slides Style
					var one_w = 100 / swiper.slides.length;
					var one_p = one_w / (100 / swiper.params.slidesPerView);
					for(var i = 0; i < swiper.slides.length; i ++) {
						swiper.slides[i].style.width = one_w + '%';
						swiper.slides[i].style.height = 'auto';
						swiper.slides[i].style.padding = '0 ' + one_p + '%';
					}

				}

				if(!isWide && $('.thumbs-scroll').length){
					var thumbsW = $('.thumbs-scroll .swiper-wrapper').width();
					$('.thumbs-scroll .swiper-wrapper').width(thumbsW + 1);
				}

			},
			onSlideClick: function(swiper) {
				self.mainSlideshow.swipeTo(swiper.clickedSlideIndex);
			},
			onSlideChangeStart: function(swiper){
				self.setNavigationDisabled(swiper);
			},
			onTouchEnd: function(swiper){
				self.setNavigationDisabled(swiper);
			}

		});

	}


	/* Set Figure Image
	笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏 */

	self.setFigure = function() {

		// Load Image
		obj.find('.swiper-slide').each(function(i, o){
			if(!$(this).hasClass('js-slide-custom')) {

				var slide = $(this);
				var last = obj.find('.swiper-slide').length - 1;
				if(self.mainSlideshow.params.loop) {
					last --;
				}

				var alt = slide.data('img-alt');
				var src = self.tmpViewMode ? slide.data('img-narrow') : slide.data('img-normal');
				var img = $('<img src="' + src + '" alt="' + alt + '">');

				var link = slide.data('link') || false;
				var tag = $(!link ? '<div role="link" tabindex="0" class="aspect-ratio"></div>' : '<a href="' + link + '" class="aspect-ratio"></a>').append(img);
				tag.append('<span class="visually-hidden">Open a larger version of product image</span>');

				if(window.isIE && window.ieVersion < 9) {
					tag.append('<span />');
				}

				slide.html(tag);

				img.ready(function(){
					if(i == last) {
						self.mainSlideshow.resizeFix();
						obj.find('.swiper-wrapper, .swiper-slide').height('auto');
					}
				});

			} else {
				self.mainSlideshow.resizeFix();
				obj.find('.swiper-wrapper, .swiper-slide').height('auto');
			}
		});

		// Narrow Pagenation
		if (self.tmpViewMode) {
			var p = $(window).width() * 0.035;
			obj.find('.slide-mainvisual-thumbs .swiper-slide:first a').css({marginLeft: p});
			obj.find('.slide-mainvisual-thumbs .swiper-slide:last a').css({marginRight: p});
		}

	}


	/* Reset Slider
	笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏 */

	self.resetStopper = false;
	self.tmpViewMode = Modernizr.mq('screen and (max-width: 47.9em)');

	self.resetSlider = function(onInit){

		//  Each Time Reset (no-csstransitions)
		if(!Modernizr.csstransitions) {
			onInit = true;
		}

		if(onInit || (self.tmpViewMode != Modernizr.mq('screen and (max-width: 47.9em)'))) {

			// Set Temporary View Mode
			self.tmpViewMode = Modernizr.mq('screen and (max-width: 47.9em)');

			if(!self.resetStopper) {

				// Set stoper
				self.resetStopper = true;

				// Set Figure Image
				self.setFigure();

				// Create
				if(self.pagenationSlideshow == undefined) {
					createSlider(self.tmpViewMode ? false : true);
				}
				else {
					self.pagenationSlideshow.destroy(true);
					self.pagenationSlideshow = undefined;
					createSlider(self.tmpViewMode ? false : true);
				}

				// Release stoper
				window.setTimeout(function(){
					self.resetStopper = false;
				}, 100);
			}

		}

	}
	$(window).on('resize', self.resetSlider).trigger('resize', self.resetSlider(true));

};