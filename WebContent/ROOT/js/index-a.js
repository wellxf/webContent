$(function() {
	function e(e) {
		var o = $(".gorgeous-dots > li").length, i = $(".gorgeous-dots li.active"), a = i
				.data("index");
		"undefined" == typeof e && (e = a + 1), e > o - 1 && (e = 0);
		var n = $(".gorgeous-dots li:eq(" + e + ")"), t = n.data("index");
		if (t != a) {
			i.removeClass("active"), n.addClass("active");
			var d = $(".gorgeous-panel > div:eq(" + a + ")"), s = $(".gorgeous-panel > div:eq("
					+ t + ")");
			d.removeClass("active animation"), s.addClass("active"),
					setTimeout(function() {
						s.addClass("animation")
					}, 20)
		}
	}
	function o() {
		window.homeSliderClock && clearInterval(homeSliderClock),
				window.homeSliderClock = setInterval(function() {
					e()
				}, 6e3)
	}
	$(".gorgeous-dots li").click(function() {
		e($(this).data("index")), o()
	}), o()
});

