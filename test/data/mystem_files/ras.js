function initFilters() {
	return '#sug-text textarea, #caseType input[type=text], #caseCategory input[type=text], #sug-participants textarea, #caseCourt input[type=text], #sug-dates .from input[type=text]';
}

//----------- таблица дел ----------------
function setWidthOfTh(){ //Подгоняет ширину ячеек у заголовочной таблицы
	var plaintiffTdWidth = parseInt(($('#b-cases').width() - $('#b-cases thead th').eq(0).width()-$('#b-cases thead th').eq(1).width()-$('#b-cases thead th').eq(2).width()-16*5)/2);
	$('#b-cases thead th').eq(3).width(plaintiffTdWidth);
}
function setWidth(targetElem,initialElem,/*учет паддингов*/plus){
	if(!plus) plus = 0;
	$(targetElem).width($(initialElem).width()+plus);
}



function setWidthColumn() {
	if ($('#b-cases-theader').css('display') == 'table') {
		var theader = $('#b-cases-theader');
		var table = $('#b-cases');
		var headerColumns = $('th', theader);
		var tableRow = $('tr', table)[0];
		var tableColumns = $('td', tableRow);
		var columnsWidth = 0;
		for (var i=0, a = tableColumns.length; i<a; i++) {
			var lastTh =$(headerColumns)[a-1];
			var lastTd =$(tableColumns)[a-1];
			if ($(table).height()>$('#tabe').height()){
				if (i == tableColumns.length-1) {
					$(tableColumns[i]).css({'width':''});
				} else {
					$(tableColumns[i]).css({'width':$(headerColumns[i]).css('width')});
					columnsWidth = columnsWidth + parseInt($(tableColumns[i]).css('width'));
				}
			}
		}
	}
}

function counterPosition() {
	var elem = $('.b-totalcases'),
		container = $(elem).parent(),
		containerHeight = $(container).height(),
		childs = $(container).children(),
		marginTopElement = 0;
	$(childs).each(function() {
		marginTopElement += returnBlockHeight($(this));
		marginTopElement += parseInt($(this).css('marginTop')) + parseInt($(this).css('marginBottom'));
	});

	if (marginTopElement > containerHeight) {
		$(elem).css({'position':'static', 'padding-left': '', 'padding-right': ''});
	} else {
		$(elem).css({'position':'absolute', 'padding-left': '18px'});
	}
}

function doSearchRequest(page){
	setColumnHeight({calcColumnsHeight: 'false'});

	var data = returnRequestInfo(page),
		info = $.toJSON(data);

	loading($('#main-column2 .b-case-loading .loading'), 12);

	globals.filterRequest = $.ajax({
		type: 'post',
		cache: false,
		url: config.services.getDecisions,
		dataType: 'json',
		data: info,
		contentType: 'application/json',
		/*beforeSend: function (xhr) {
			xhr.setRequestHeader('x-date-format', 'iso');
		},*/
		success: function (result) {
			var isResultExists = result.Result && result.Result.TotalCount,
				$noResults = $('.b-noResults', '#main-column2');

			if (!isResultExists) {
				var court = $('input.js-input', '#caseCourt').valEx(),
					caseNumber = $('div.tag input', '#sug-cases').eq(0).valEx();
				$('.b-results').addClass('g-hidden');
				$noResults.removeClass('g-hidden');
				$('#b-footer-pages ul').hide();
				new NoResults({
					$court: $('.b-combobox', '#caseCourt').clone(),
					caseNumber: caseNumber,
					container: $noResults,
					request: info
				});
			} else {
				var totalCount = result.Result.TotalCount;
				$('#totalCount').text(totalCount); //"Всего записей" по поиску

				$noResults.addClass('g-hidden');

				reDrawPages({
					linesPerPage: result.Result.PageSize,
					page: result.Result.Page,
					pagesCount: result.Result.PagesCount,
					totalCount: totalCount
				});

				var templateId = data.GroupByCase ? 'casesGroupTable' : 'casesTable';

				$('#b-cases').html($('#' + templateId).tmpl(result.Result));
				if (pageTracker) {
				    pageTracker._trackPageview('/Ras/Search');
				}
				$('.b-results').removeClass('g-hidden');

				if ($('.more', '#b-cases tbody tr')) {
					showHideEntities($('.b-button', '#b-cases tbody tr'));
				}
				typeSwitcher($('.b-type-switcher'));
				if ($('#b-footer-pages ul li').length == 4) {
					$('#b-footer-pages ul').hide();
				} else {
					$('#b-footer-pages ul').show();
				}

				if (!data.GroupByCase) {
					attachEvents({
						container: '#b-cases',
						info: info
					});
				} else {
					attachEvents2({
						info: info
					});
				}
			}

			if (isResultExists) {
				$('#contentHeader .h2').hide();
				$('#groupBySwitcher').show();
				$('#contentHeader .b-found').text('Найдено ' + result.Result.TotalCount + ' документов').show();
				$('.b-feedback').animate({ 'opacity': '0' }, 1000);
				$('.b-feedback').hide();
			} else {
				$('#contentHeader .h2').show();
				$('#groupBySwitcher').hide();
				$('#contentHeader .b-found').hide();
				$('.b-feedback').show();
				$('.b-feedback').animate({ 'opacity': '1' }, 1000);
			}
		},
		complete: function () {
			//highlightFound({filters:$('#sug-participants textarea')});
			globals.filterRequest = '';
			hideLoading();
			stateOfButton();
			setColumnHeight({ calcColumnsHeight: 'false' });
			setWidthColumn();
			//$('#table').scrollTo('0%',300);
		}
	});  //close $.ajax
}

function attachEvents(params) {
	params = params || {};
	params.container = params.container || 'body';
	params.info = params.info || ''; //нужно для подсветки
	var $container = $(params.container);
	$('.js-popupDocumentShow', $container).click(function () {
		var field;
		if ($('#sug-text input[type=text]').length ) {
			field = $('#sug-text input[type=text]');
		} else {
			field = $('#sug-text textarea');
		}
		var li = $(this).closest('li');
		var id = li.find('input[name=id]').val();
		var link = this;
		var href = $(this).attr('href');
		var court = li.find('h2')[0].innerText;
		var instanceLevel = li.find('h2 i')[0].className;
		loading($('#main-column2 .b-case-loading .loading'), 12);
		$.ajax({
			type: "get",
			url: "/Ras/HtmlDocument/" + id + "/?hilightText=" + field.valEx(),
			success: function (xml) {
			    if (pageTracker) {
			        pageTracker._trackPageview('/Ras/HtmlDocument');
			    }
				$('body').addClass('body_popupDocument');
				$('#popupDocumentBody .text').empty();
				$('#popupDocumentBody .text').html(xml);
				$('#popupDocumentHeader .title').text(court);
				$('#popupDocumentHeader .icon')[0].className = instanceLevel || 'icon';
				$('#popupDocumentFooter .download a').attr('href', href);
				if (window.IPRAVO) {
					window.IPRAVO.WIDGET.init();
				}
			},
			complete: function () {
				hideLoading();
				$(link).addClass('visited');
			}
		});
		return false;
	});
}

function attachEvents2(params){
	params = params || {};
	params.info = params.info || '';
	$('.b-documents-group-dl__head i.b-sicon').click(function(){
		var $header = $(this).closest('.b-documents-group-dl__head');
		var $link = $(this);
		var $next = $header.next();
		if(!$next.hasClass('b-documents-group-dl__body')){
			var caseNumber = $('.js-caseNumber', $header).val();
			var loader = new Loader({
				elem: this
			});
			loader.show();

			var info = {
				Count: 500,
				Page: 1,
				Cases:[caseNumber]
			};

			info.DateFrom = Common.date.returnDotNetDate(
				Common.date.returnDateUTC(2000,1,1)
			);
			info.DateTo = Common.date.returnDotNetDate(
				Common.date.returnDateUTC(2030,1,1, 23, 59, 59)
			);

			$.ajax({
				type: 'post',
				//url: '/proxy.php?service=cases_documents_by_case_number',
				url: config.services.getDecisions,
				dataType: 'json',
				data: $.toJSON(info),
				contentType: 'application/json',
				headers: {
					'x-no-json': '1'
				},
				/*beforeSend: function (xhr) {
					xhr.setRequestHeader('x-date-format', 'iso');
				},*/
				success: function(result){
					if(!$link.hasClass('expanded')){//от двойного клика
						var $body = $('<dd class="b-documents-group-dl__body"><ul class="b-document-list"></ul></dd>');

						$body.find('.b-document-list').html($('#casesTable').tmpl(result.Result));
						$header.after($body);
						$link.addClass('expanded');
						$body.slideDown();
						attachEvents({
							container: $body,
							info: params.info
						});
					}
				},
				complete: function(){
					loader.hide();
				}
			});
		}
		else{
			if($next.is(':visible')){
				$next.slideUp();
				$link.removeClass('expanded');
			}
			else{
				$next.slideDown();
				$link.addClass('expanded');
			}
		}
	});
}


function returnRequestInfo(page){
	var info = {};

	info.Page = parseInt(page, 10) || 1;
	info.Count = 25;


	var $active = $('#groupBySwitcher li.active')[0];
	if ($active) {
		info.GroupByCase = ($active.id == 'groupByCase');
	}

	var caseType = $('#caseType .js-select').val(); ;
	if (caseType) {
		info.DisputeTypes = [caseType];
	}

	var caseCategory = $('#caseCategory .js-select').val(); ;
	if (caseCategory) {
		info.DisputeCategories = [caseCategory];
	}

	var court = $('#caseCourt .js-select').val();
	if (court) {
		info.Courts = [court];
	}

	var dates = ($('#selected-dates').val() || '').split(' - ');
	info.DateFrom = (dates[0] || '01.01.2000').replace(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/g, '$3-$2-$1') + 'T00:00:00' || ['', '']; //'2000-01-01T00:00:00'
	info.DateTo = (dates[1] || '01.01.2030').replace(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/g, '$3-$2-$1') + 'T23:59:59' || ['', '']; //'2000-01-01T00:00:00'


	var tags = 'Sides,Judges,Cases,Text'.split(','); //названия тегов
	var groups = 'sug-participants,sug-judges,sug-cases,sug-text'.split(',');

	for(j in tags){
		var tag = tags[j];
		info[tag] = [];
		var field;
		if ($('#' + groups[j]+' input[type=text]').length ) {
			field = $('#' + groups[j] + ' input[type=text]');
		} else {
			field = $('#' + groups[j] + ' textarea');
		}
		field.each(function () {
			var $currentField = $(this);
		    if (tag == 'Text') {
					info[tag] = $currentField.valEx();
					info.InstanceType = $currentField.closest('.tag').find('.b-type-switcher .selected input').val();
				} else
			if (!$currentField.hasClass('g-ph')) {
				if (tag == "Sides") {
					info[tag].push({
						Name: $currentField.valEx(),
						Type: -1//$currentField.closest('.tag').find('.b-type-switcher .selected input').val()
					});
				}
				else if (tag == 'Judges') {
					info[tag].push($currentField.attr('id'));
				} else {
					info[tag].push($currentField.valEx());
				}
			}
		});
	}

	return info;
}


$(document).ready(function () { //=================== ready =========================

	if ($('.more', '#b-cases tbody tr')) {
		showHideEntities($('.b-button', '#b-cases tbody tr'));
	}

	if (!$('#sug-cases input, #sug-participants textarea').hasClass('g-ph')) {
		$('#sug-cases input, #sug-participants textarea').val('');
	}
	$('#b-form-submit').click(function () {
		stateOfButton();
		if (!$('#b-form-submit').hasClass('b-form-submit_noactive')) {
			doSearchRequest(0);
		}
	});

	$('#popupDocumentHeader .close').click(function () {
		$('body').removeClass('body_popupDocument');
	});

	$('#b-footer-pages li a:not(.active)').live('click', function () {
		var match = $(this).attr('href').match(/#page([0-9]+)$/);
		//если список загружен аяксом
		if (match) {
			var page = match[1];
			doSearchRequest(page);
			return false;
		}
	});

	//переключение страниц
	$(window).keydown(function (e) {
		if (e.ctrlKey == true && /^37$|^39$/.test(e.keyCode)) {
			switch (e.keyCode) {
				case 37:
					var aLarr = $('li.larr a')[0];
					if (aLarr) {
						var match = $(aLarr).attr('href').match(/#page([0-9]+)$/);
						if (match) {
							var page = match[1];
							doSearchRequest(page);
						}
					}
					break;
				case 39:
					var aRarr = $('li.rarr a')[0];
					if (aRarr) {
						var match = $(aRarr).attr('href').match(/#page([0-9]+)$/);
						if (match) {
							var page = match[1];
							doSearchRequest(page);
						}
					}
					break;
			}
		}
	});

	//$(window).resize();//?????


	setTimeout(function () {
		setColumnHeight({ calcColumnsHeight: 'false' });
		showHideCalendar();
		setWidthColumn();
		counterPosition();
	}, 1000
	);
	$(window).resize(function () {
		setWidthColumn();
		setColumnHeight({ calcColumnsHeight: 'false' });
		showHideCalendar();
		counterPosition();
	});
	$('#main-column1').resize(function () {
		counterPosition();
	});


	$('.tag input[type=text], .tag textarea, #sug-dates input[type=text]').keypress(function (e) {
		if (e.which == 13 && $('#b-suggest').css('display') != 'block') {
			if (e.ctrlKey == true && $(this).parent().find('.add').length > 0) {
				addCaseTags($(this).parent(), $(this).attr('placeholder'));
				return false;
			} else {
				$(this).blur();
				stateOfButton();
				if ($('#b-form-submit').hasClass('b-form-submit_noactive')) return false;
				if (!globals.filterRequest) {
					doSearchRequest(1);
				}
				return false;
			}
		}
	});
	stateOfButton();
	$('.tag textarea').TextAreaExpander();

	/* Переключение режима
	*********************************************************/
	$('#groupBySwitcher li').click(function () {
		switch ($(this).attr('id')) {
			case 'groupByList':
				document.cookie = 'groupDecisionsByCase=false; path=/';
				$('#groupByList').addClass('active').siblings().removeClass('active');
				break;
			case 'groupByCase':
				document.cookie = 'groupDecisionsByCase=true; path=/';
				$('#groupByCase').addClass('active').siblings().removeClass('active');
				break;
		}
		doSearchRequest(1);

		return false;
	});
	if (returnCookie('groupDecisionsByCase') == 'true') {
		$('#groupByCase').addClass('active').siblings().removeClass('active');
	}
	else {
		$('#groupByList').addClass('active').siblings().removeClass('active');
	}
	/* End Переключение режима
	*********************************************************/

	$('#main-column2').do100percentHeight().css({
		overflow: 'hidden'
	});
	$(window).resize(function () {
		$('#main-column2').do100percentHeight();
	});

	//	//попап для ссылки на андроид-приложение
	//	$('#androidApplication').live('click.popup', function() {
	//		if (navigator.userAgent && /Android/.test(navigator.userAgent)) {//телефон
	//			return true;
	//		} else {//настольный компьютер и др
	//			new AlertDialog({
	//				message: '<p class="g-margins">Чтобы скачать приложение используйте QR-код:</p>' +
	//					'<p><img src="/i/c/qr-code-android.png" alt=""/></p>'
	//			});
	//			return false;
	//		}
	//	})

});
