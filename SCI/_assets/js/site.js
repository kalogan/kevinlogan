/* Admissions Only */
$(document).ready(function() {

    var rootUrl = $('#footer').data('root-url');
	var location = window.location.pathname;

	if (location.indexOf('/build/') != -1) {
		rootUrl = 'http://dev.communications.iu.edu/admin-bl/admissionwebsite2014/build/';
	}

	// Change the home icon in sticky nav (the anchor is already cloned in global.js)
	$('nav.main li.show-on-sticky.trident a').attr('href', rootUrl);

	var $sectionNav = $("#section-nav");

	// Set the current nav on the section.  This should work for Admissions "Steps" pages
	$sectionNav.find('a[href="index.html"]:not(.current-trail)').addClass('current');

	// Skirt nav toggler
	$('.skirt-nav .has-children').on('click', '> a', function(e) {
		e.preventDefault();

		var $this = $(this),
			speed = 'fast';

		$this.closest('.has-children')
			.siblings('.open').removeClass('open')
			.find('ul').slideToggle(speed);

		$this.closest('li').toggleClass('open').find('ul').slideToggle(speed);
	});

	var elems = $('.panel.button h2'),
		count = elems.length;

	elems.each( function(i) {
		var $this = $(this),
			text = $this.text(),
			regex = /(Step\s\d:)/gi;

	  	$this.html(text.replace(regex, "<span class='step'>$1</span><br />"));
		if (!--count) $(window).trigger('resize');
	});

	// Home Page
	if ($('#home').length) {

		$('.carousel.events').slick({
			slide: 'article',
			onInit: function(el) {
				$('.slick-slide', el.$list).each(function() {
					$(this).wrapInner('<div class="inner"></div>');
				});
			},
			onSetPosition: function(slick) {
				var _ = this;

				// Place dots/arrows based on image height
				var height = $(_.$slides[0]).find('img').height();
				var position = (_.windowWidth > 640) ? {top: '50%'} : {top: height/2 + 40};

				if (_.$nextArrow !== null) {
					_.$nextArrow.css(position);
				}

				if (_.$prevArrow !== null) {
					_.$prevArrow.css(position);
				}
			}
		});

		var startX, startY, startTime;

		$('.flipper').on('touchstart', function(event){
			var touchObj = event.originalEvent.changedTouches[0];
			startX = touchObj.pageX;
			startY = touchObj.pageY;
		});

		$('.flipper').on('touchend', function(event){
			var touchObj = event.originalEvent.changedTouches[0];

			// get total dist traveled by finger while in contact with surface
			var dist = Math.abs(touchObj.pageY - startY);

			// if the user isn't scrolling, flip the tiles
			if (Math.abs(touchObj.pageY - startY) <= 15) {
				$(this).siblings().removeClass('hover');
				$(this).toggleClass('hover');
			}
		});
	}


	// Social items
	var social = $('#social-grid, #social-carousel');

	if (social.length) {
		// Load the carousel
		$('.carousel-instagram').slick({
			slide: 'div.item',
			slidesToShow: 1,
			centerMode: true,
			centerPadding: '15px'
		});

		// Create the grid
		var masonryJS = rootUrl + '_assets/js/masonry.js';
		var masonryCSS = rootUrl + '_assets/css/social.css';

		// Function comes from global.js
		var test = loadCSS(masonryCSS);

		// Make sure Masonry gets cached
		$.ajaxSetup({
			cache: true
		});

		$.getScript(masonryJS, function() {

			$("#social-grid .item > a").each(function() {
				var $this = $(this),
					img = $this.find('img');

				$this.css({
					backgroundImage: 'url(' + img.attr('src') + ')'
				});

				$this.addClass('modified');
			});

			var container = document.querySelector('#social-grid');
			var msnry = new Masonry( container, {
				columnWidth: ".grid-sizer",
				itemSelector: ".item",
				isInitLayout: false // don't initialize layout since we're dyanimically loading CSS and need a second
			});

			setTimeout( function() {
				msnry.layout();
			}, 200);
		});
	}

	// Include code for virtual tour
	if ( $('.virtualtour_embed').length) {

		(function() {
			var tour = document.createElement('script');
			tour.type = 'text/javascript';
			tour.async = true;
			tour.defer = 'defer';
			tour.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
				'//www.youvisit.com/tour/Embed/js2';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(tour, s);
		})();
	}
});

$(document).ready(function() {
	$('a').on('click', function() {
		// Collect some defaults
		var $this = $(this),
			linkUrl = $this.attr('href'),
			title = $this.text(),
			section = $this.closest('.section'),
			sep = ' - ',
			url = window.location.pathname;

		var defaults = {
			'hitType': 'event',		 // Required.
			'eventAction': 'click',	 // Required.
			'eventCategory': 'Link', // Required.
			'eventLabel': title + sep + linkUrl
		}

		// Include site specific items
		// We are on the apply page
		if ($this.closest('.section.apply').length) {
			defaults.eventCategory = 'Apply Page';
			defaults.eventLabel = $this.closest('.panel').find('h2').text() + sep + linkUrl;

			if ($this.hasClass('external')) {
				defaults.eventCategory = 'Apply Page: External';
			}

			ga('send', defaults);
			return;
		}

		// Home page
		if ($("#home").length) {
			var send = false;
			defaults.eventCategory = 'Home Page';

			// Feature Call to Action
			if ($this.is('.button.cta')) {

				if ($this.closest('.call-to-action').length) {
					defaults.eventLabel = 'Feature CTA: ' + title + sep + linkUrl;
				}
				else {
					defaults.eventLabel = 'CTA Button: ' + title + sep + linkUrl;
				}

				send = true;
			}

			// Stat boxes
			if ($this.closest('.stat').length) {
				defaults.eventLabel = 'Stat: ' + title + sep + linkUrl;
				send = true;
			}

			// Event Slider
			if ($this.closest('.carousel.events').length) {
				defaults.eventLabel = 'Event Slider: ' + title + sep + linkUrl;
				send = true;
			}

			if ($this.closest('.flipper').length) {
				defaults.eventLabel = 'Flip Tiles: ' + title + sep + linkUrl;
				send = true;
			}

			if (send) ga('send', defaults);
			return;
		}

		// Include default items
		// View external links
		if ($this.hasClass('external')) {
			defaults.eventCategory = 'External Link';
			ga('send', defaults);
			return;
		}

		// Track downloads
		if ($this.is('[href*=".pdf"], [href*=".doc"], [href*=".docx"], [href*=".xls"]')) {
			// Regex pattern to match file extension for urls
			// http://stackoverflow.com/questions/6582171/javascript-regex-for-matching-extracting-file-extension
			var patt1 = /\.([0-9a-z]+)(?:[\?#]|$)/i;
			var type = linkUrl.match(patt1);

			defaults.eventCategory = 'Download';
			defaults.eventLabel = type[1] + ': ' + title + sep + linkUrl;
			ga('send', defaults);
			return;
		}

		// Fall through (uncomment to send all links)
		// ga('send', defaults);
	});
});