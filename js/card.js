var cardSpaces = 5;
var middleDistance = 300;

var nxtVal = middleDistance;
middleDistance -= cardSpaces;
$(".next").each(function () {
	$(this).attr("elad-translate", nxtVal);
	$(this).css("transform", "translateX(calc(-50% + " + nxtVal + "px)) rotateY(-70deg) skewY(9deg)");
	nxtVal += cardSpaces;
});

$("[id^=album-]").each(function () {
	let album = $(this);
	album.find('.flip-container').click(function (event) {
		event.stopPropagation();
		album.find(".active").find('.flipper').toggleClass('rotation');
	});
	$(this).find('.right').click(function () {
		if (album.find(".active").next().hasClass("slideItems")) {
			album.find(".active").removeClass("active")
				.addClass("prev")
				.attr("elad-translate", middleDistance)
				.next()
				.addClass("active")
				.removeClass("next")
				.removeAttr("style")
				.attr("elad-translate", "0");

			album.find(".next").each(function () {
				var thisTrans = parseInt($(this).attr("elad-translate")) - cardSpaces;
				$(this).css("transform", "translateX(calc(-50% + " + thisTrans + "px)) rotateY(-70deg) skewY(9deg)");
				$(this).attr("elad-translate", thisTrans);
				nxtVal += cardSpaces;
			});

			album.find(".prev").each(function () {
				var thisTrans = parseInt($(this).attr("elad-translate")) + cardSpaces;
				$(this).css("transform", "translateX(calc(-50% - " + thisTrans + "px)) rotateY(70deg) skewY(-9deg)");
				$(this).attr("elad-translate", thisTrans);
				nxtVal += cardSpaces;
			});
		}
	});
	$(this).find('.left').click(function () {
		if (album.find(".active").prev().hasClass("slideItems")) {
			album.find(".active").removeClass("active")
				.addClass("next")
				.attr("elad-translate", middleDistance)
				.prev()
				.addClass("active")
				.removeClass("prev")
				.removeAttr("style")
				.attr("elad-translate", "0");

			album.find(".next").each(function () {
				var thisTrans = parseInt($(this).attr("elad-translate")) + cardSpaces;
				$(this).css("transform", "translateX(calc(-50% + " + thisTrans + "px)) rotateY(-70deg) skewY(9deg)");
				$(this).attr("elad-translate", thisTrans);
				nxtVal += cardSpaces;
			});

			album.find(".prev").each(function () {
				var thisTrans = parseInt($(this).attr("elad-translate")) - cardSpaces;
				$(this).css("transform", "translateX(calc(-50% - " + thisTrans + "px)) rotateY(70deg) skewY(-9deg)");
				$(this).attr("elad-translate", thisTrans);
				nxtVal += cardSpaces;
			});
		}
	});

});