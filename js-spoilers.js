(function ( $ ) {
	function spoilerToggle(event) {
		var $this = $(this),
	  		$slider = $( $this.attr("data-slider-id") );
		
		if( $slider && $slider.css("display") == "none" ) {
			$this.text("[-]")
				.attr("title", "Hide Spoiler")			
		}
		else {
			$this.text("[+]")
		 		.attr("title", "Show Spoiler")
		}
		
		if ( event.data.spoiler == "inline") {
			$slider.toggle('fast');
		}
		else {
			$slider.slideToggle('fast');
		}
	}
	function addInlineSpoiler(i) {
		var id = "spoiler-sliderI" + i;
		$(this).attr( "id", id )
			.before("<span class='inline-spoiler-toggle' title='Show Spoiler' data-slider-id='#" + id + "'>[+]</span>");
	}
	function addBlockSpoiler(i) {
		var id = "spoiler-sliderB" + i;
		$(this).attr( "id", id )
	  		.before("<div class='block-spoiler'>spoiler <span class='block-spoiler-toggle' title='Show Spoiler' data-slider-id='#" + id + "'>[+]</span></div>");
	}
	$(document).ready(function () {
		$("div.spoiler-text").each(addBlockSpoiler);
		$(".block-spoiler-toggle").click({"spoiler": "block"}, spoilerToggle);
		$("span.spoiler-text").each(addInlineSpoiler);
		$(".inline-spoiler-toggle").click({"spoiler": "inline"}, spoilerToggle);
	});
})( jQuery );