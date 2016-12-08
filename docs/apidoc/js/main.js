jQuery(function() {
	var $sidebar = $('#sidebar'),
		$nav = $('.nav'),
		$main = $('main');

	var found = true;

	var $el;

	$("section > div.highlighter-rouge:first-of-type").each(function(i) {
		var $that = $(this).prev().before("<ul class=\"languages\"></ul>"),
		$this = $(this),
		$languages = $that.prev(),
		$notFirst = $this.nextUntil(":not(div.highlighter-rouge):not(h3)").filter(":not(h3)"),
		$all = $this.add($notFirst).filter(":not(h3)");

		listLanguages($all, $languages);

		$all.add($languages).wrapAll("<div class=\"code-viewer\"></div>");

		$this.css('display', 'block');
		$notFirst.css('display', 'none');

		$languages.find('a').first().addClass('active');

		$languages.find('a').click(function() {
			$all.css('display', 'none');
			$all.eq($(this).parent().index()).css('display', 'block');

			$languages.find('a').removeClass('active');
			$(this).addClass('active');
			return false;
		});

		if ($languages.children().length === 0) {
			$languages.remove();
		}
	});

	function listLanguages($el, $insert) {
		$el.each(function(i) {
			var title = $(this).attr('title');
			title = $(this).prev().text()
			if (title) {
				$insert.append("<li><a href=\"#\">" + title + "</a></li>");
				$(this).prev().remove();
			}
		});
	}

	var href = $('.sidebar a').first().attr("href");

	if (href !== undefined && href.charAt(0) === "#") {
		setActiveSidebarLink();

		$(window).on("scroll", function(evt) {
			setActiveSidebarLink();
		});
	}

	function setActiveSidebarLink() {
			$('.sidebar a').removeClass('active');
				var $closest = getClosestHeader();
				$closest.addClass('active');
				document.title = $closest.text();

	}
});

function getClosestHeader() {
	var $links = $('.sidebar a'),
	top = window.scrollY,
	$last = $links.first();

	if (top < 300) {
		return $last;
	}

	if (top + window.innerHeight >= $("main").height()) {
		return $links.last();
	}

	for (var i = 0; i < $links.length; i++) {
		var $link = $links.eq(i),
		href = $link.attr("href");

		if (href !== undefined && href.charAt(0) === "#" && href.length > 1) {
			var $anchor = $(href);

			if ($anchor.length > 0) {
				var offset = $anchor.offset();

				if (top < offset.top - 300) {
					return $last;
				}

				$last = $link;
			}
		}
	}
	return $last;
}
