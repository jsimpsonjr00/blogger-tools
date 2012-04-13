<style type='text/css'>
	.random-post{
		font-size: 12px;
	 	margin: 0px 5px;
	 	padding-top: 5px;
	 	cursor: pointer;
	}
	.random-post:hover {
		background-color: #e2e2e2;
	  	color: #777777;
	}
	.random-post h4{
		font-weight: normal;
	 	font-size: 11px;
	 	padding: 0px 0px;
	}
	.random-post-thumb img {
		max-height: 50px;
	 	max-width: 50px;
	 	height: auto;
	}
	.random-post-thumb {
		margin: 0px 5px;
	 	overflow: hidden;
	 	float: left;
	}
	.clear {
		clear: both;
	}
</style>
<script>
(function ( $ ) {
	//Simple Template substitutions
	$.tmplSubstitute = function( template, map ){
		transform = function(v){ return v; };
		
		return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,
			function(match, key ){
				//var value = map[key];
				return map[key].toString();
			}
		); // String
	};
	$.fn.bloggerRandomPosts = function ( userOpts ) {
		var $this = $(this);
		var opts = {
			blogStarted: {
				year: 	2005,
				month:	1,
				day:	1
			},
			length: 200,
			format:	"default",
			num:	3
		};
		var postTemplate = 
			"<div id='random-${id}' class='random-post' data-href='${link}'>" +
		 		"<h3><a href='${link}'>${title}</a></h3>" +
		 		"${thumb}" +
		 		"<div class='random-post-body'>${body}...</div>" +
		 		"<div class='clear'></div>" +
		 		"<h4>${date}</h4>" +
			"</div>";
		
		$.extend( opts, userOpts );
		getRandomPost();
		$this.on("click", ".random-post", { }, clickNav );
		
		function clickNav(event) {
		  window.top.location = $(event.currentTarget).attr("data-href");
		}
		function formatDayMonth(strNum){
			if (strNum < 10) {
				strNum = "0" + strNum;
			}
			return strNum;
		};
		function getRandomDate() {
			var start = opts.blogStarted;
			var Now = new Date(),
		 		Start = new Date(start.year, start.month-1, start.day ),
		 		nMinimum = 1000 * 60 * 60 * 24 * 10,
		 		nRand = Math.floor( Math.random() * (Now - Start) );
			
			if(nRand < nMinimum) {
				nRand += nMinimum;
			}
			var dateRand = new Date(Start.getTime() + nRand);
			
			return dateRand.getFullYear() + "-" + formatDayMonth(dateRand.getMonth()+1) + "-" + formatDayMonth(dateRand.getDate());
		};
		function getRandomPost(){  
		    var qs = {};
			var strURL = "http://" + document.domain + "/feeds/posts/" + opts.format + "?alt=json&max-results=50"
		            + "&published-max=" + getRandomDate() + "T00%3A00%3A00%2B01%3A00";
		    $.getJSON(strURL, qs, processRandomPost);
		};
		function processRandomPost(json) {
			if(json.feed.entry != undefined) {
				if( opts.num >= json.feed.entry.length ) {
					for( var i=0; i < json.feed.entry.length; i++ ) {
						renderPost(i, json.feed.entry[i]);
					}
				}
				else {
					var nRandPost = Math.floor(Math.random() * json.feed.entry.length);
				
					for( var i = 0; i < opts.num; i++ ) {
						while ($("#random-" + nRandPost).length > 0) {
							nRandPost = Math.floor(Math.random() * json.feed.entry.length);
						}
						renderPost(nRandPost, json.feed.entry[nRandPost]);
					}
				}
			}
			else {
				getRandomPost();
			}
		};
		
		function buildDateString ( Entry ) {
			//IE doesn't like the string format, so extract year, month, day
			var strDate = Entry.published.$t;
			strDate = strDate.substr(0, strDate.search("T")).split("-");

			var datePost = new Date(strDate[0], strDate[1]-1, strDate[2]);
			return datePost.toLocaleDateString();
		};
		function buildThumb ( Entry, body ) {
			var tmpl = "<div class='random-post-thumb'><img src='${src}'/></div>",
				thumb = { html: "" },
				$body;
			if (Entry.media$thumbnail != undefined) {
				thumb.src = Entry.media$thumbnail.url;
			}
			else {
				$body = $(body);
				var $img = $body.find("img:first");
				if( $img.length > 0 ) { 
					thumb.src = $img.attr("src");
				}
			}
			if( thumb.src !== undefined ) {
				thumb.html = $.tmplSubstitute( tmpl, thumb )
			}
			return thumb.html;
		};
		function extractLink ( Entry ) {
			var href = "";
			for(var i=Entry.link.length-1;i >+ 0; i--) { //find the post link in the sea of possibilities
				if(Entry.link[i].rel == "alternate") {
					href = Entry.link[i].href;
					break;
				}
			}
			return href;
		};
		function extractBody( Entry ) {
			var body = "";
			if(opts.format == "summary") {
				body = Entry.summary.$t;
			}
			else {
				var strCleaned = Entry.content.$t.replace(/<script\b[^>]*>(.*?)\/script>/g, "");
				var $body = $(strCleaned);
				$body.find(".blogger-post-footer").remove();
				body = $body.text().substr(0, opts.length );
			}
			return body;
		};
		function renderPost(nPost, Entry)
		{
			var data = { //set the needed data for rendering this post entry
				id:		nPost,
				title: 	Entry.title.$t,
				link:	extractLink( Entry ),
				date:	buildDateString( Entry ),
				body:	extractBody( Entry )
				
			};
			data.thumb = buildThumb( Entry, data.body );
			
			var $post = $( $.tmplSubstitute( postTemplate, data ) );
			$post.appendTo( $this );
		};
	}
	
	$(document).ready( function () {
		$("#random-posts").bloggerRandomPosts( {
			blogStarted: {
				year: 	"2011",
				month: 	"1",
				day:	"1"
			}
		});
	});
}( jQuery ));
</script>
<div id='random-posts'></div>