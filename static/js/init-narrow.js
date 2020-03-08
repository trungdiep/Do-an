/* Title:       Narrow Only Slideshows
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Version:     1.0
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */

var setNarrowSlideshows = function (obj) {

    var self = this;



    


    /* Setting Reccomend Slideshow
    â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

    var specificationSlideshow;
    var createSlider = function (isWide) {

        specificationSlideshow = new Swiper(obj.find('.swiper-container')[0], {
            onInit: function (swiper) {
                self.setNavigationEvent(swiper);
                self.setNavigationDisabled(swiper);

                if (isWide && Modernizr.csstransitions) {

                    // Set Wrapper Style
                    swiper.wrapper.style.width = (100 / swiper.params.slidesPerView) * swiper.slides.length + '%';
                    swiper.wrapper.style.height = 'auto';

                    // Set Slides Style
                    var one_w = 100 / swiper.slides.length;
                    var one_p = one_w / (100 / swiper.params.slidesPerView);
                    for (var i = 0; i < swiper.slides.length; i++) {
                        swiper.slides[i].style.width = one_w + '%';
                        swiper.slides[i].style.height = 'auto';
                        swiper.slides[i].style.padding = '0 ' + one_p + '%';
                    }

                }

            },
            onSlideChangeStart: function (swiper) {
                self.setNavigationDisabled(swiper);
            }
        });

    }


    /* Reset Slider
    â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

    self.resetStopper = false;
    self.tmpViewMode = Modernizr.mq('screen and (max-width: 47.9em)');

    self.resetSlider = function (onInit) {

        //  Each Time Reset (no-csstransitions)
        if (!Modernizr.csstransitions) {
            onInit = true;
        }

        if (onInit || (self.tmpViewMode != Modernizr.mq('screen and (max-width: 47.9em)'))) {

            // Set Temporary View Mode
            self.tmpViewMode = Modernizr.mq('screen and (max-width: 47.9em)');

            if (!self.resetStopper) {

                // Set stoper
                self.resetStopper = true;

                // Create
                if (specificationSlideshow == undefined) {
                    createSlider(self.tmpViewMode ? false : true);
                } else {
                    specificationSlideshow.destroy(true);
                    specificationSlideshow = undefined;
                    createSlider(self.tmpViewMode ? false : true);
                }

                // Release stoper
                window.setTimeout(function () {
                    self.resetStopper = false;
                }, 100);
            }

        }

    }
    $(window).on('resize', self.resetSlider).trigger('resize', self.resetSlider(true));
};



/* Initialize
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

$(function () {

    $('.js-slide-narrow').each(function () {
        var myNarrowOnlySlideshows = new setNarrowSlideshows($(this));
    });

});