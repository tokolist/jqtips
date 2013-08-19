/*
jqTips based on Cameron Zemek's Hovertip ideas
Author: Pelesh Yaroslav aka Tokolist (http://tokolist.com)
License: MIT (http://en.wikipedia.org/wiki/MIT_License)
*/

(function($) {
    $.fn.jqTips = function(options) {
        var defaults = {
			source: 'title',
			selector: '.jqtips-title:first',
            offset: [10, 10],
            className: 'jqtips',
			delay: 700,
			removeTitle: true,
			removeAlt: true,
			ajaxUrl: '',
			cacheAjax: true,
			ajaxPreloader: 'Loading&hellip;',
			ajaxErrorText: 'Request error',
			getAjaxData: function(element){
				return {
					rel: element.attr('rel')
				};
			},
            show: function(tooltip) {
                tooltip.fadeIn(150);
            },
            hide: function(tooltip) {
				tooltip.hide();
            }
        };

        options = $.extend(defaults, options);


        this.each(function() {

			var element = $(this);
			var delayTimer;
			var ajaxLoaded = false;
			var ajaxObject = null;

			var updatePosition = function(event) {
				var tooltipWidth = tooltip.outerWidth();
				var tooltipHeight = tooltip.outerHeight();
				var $window = $(window);
				var windowWidth = $window.width() + $window.scrollLeft();
				var windowHeight = $window.height() + $window.scrollTop();
				var posX = event.pageX + options.offset[0];
				var posY = event.pageY + options.offset[1];
				if (posX + tooltipWidth > windowWidth) {
					// Move left
					posX = windowWidth - tooltipWidth;
				}
				if (posY + tooltipHeight > windowHeight) {
					// Move tooltip to above cursor
					posY = event.pageY - options.offset[1] - tooltipHeight;
				}
				tooltip.css({
					left: posX,
					top: posY
				});
			}

			var tooltip = $('<div/>');

			if(options.source == 'title'){
				tooltip.text(element.attr('title'));
			} else if(options.source == 'sibling') {
				var siblings = element.siblings(options.selector);
				
				if(siblings.length > 0){
					tooltip.html(siblings.html());
					siblings.remove();
				}
			}

			if(options.removeTitle){
				element.removeAttr('title')
					.find('*')
					.removeAttr('title');
			}

			if(options.removeAlt){
				element.removeAttr('alt')
					.find('*')
					.removeAttr('alt');
			}

			tooltip.addClass(options.className)
				.hide()
				.appendTo('body');
			

			element.mousemove(function(event){
				window.clearTimeout(delayTimer);
				
				if(tooltip.is(':visible')){
					options.hide(tooltip);
				}

				updatePosition(event);
				delayTimer = window.setTimeout(function(){
					if(options.source == 'title' || options.source == 'sibling'){
						if(tooltip.html() != ''){
							options.show(tooltip);
						}
					} else if(options.source == 'ajax'){
						if(ajaxObject==null && (!options.cacheAjax || (options.cacheAjax && !ajaxLoaded))){
							tooltip.html(options.ajaxPreloader);
							options.show(tooltip);

							ajaxObject = $.ajax({
								cache: false,
								data: options.getAjaxData(element),
								url: options.ajaxUrl,
								dataType: 'html',
								error: function(){
									tooltip.html(options.ajaxErrorText);
								},
								success: function(data){
									ajaxLoaded = true;
									ajaxObject = null;
									tooltip.html(data);
									updatePosition(event);
								}
							})
						} else {
							options.show(tooltip);
						}
					}
				}, options.delay);
			})
			.mouseleave(function(){
				window.clearTimeout(delayTimer);

				if(tooltip.is(':visible')){
					options.hide(tooltip);
				}
			})
        });
    }
})(jQuery); 