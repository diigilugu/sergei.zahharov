function setDateButtonAriaLabel(){
	$('.datepicker').each(function() {
		$(this).attr('aria-hidden', 'true');
		const label = (this.title + ' ' + makeDateForLabelToEstFormat(this.value)).trim();
		$(this).siblings('button.ui-datepicker-trigger').attr('aria-label', label);
	});
}

// kuupäev yyyy-mm-dd -> dd-mm-yyyy
function makeDateForLabelToEstFormat(date){
	let dateForLabel = '';
	if(date){
		const dateParts = date.substring(0,10).split('-');
		dateForLabel = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
	}
	return dateForLabel;
}

function makeCalendarAccessible(input){
	var container = document.getElementById('ui-datepicker-div');
	container.setAttribute('role', 'dialog');
	container.setAttribute('aria-label', calendarLabel);
}

function clearDate(inputField){
	inputField.value = '';
	$(inputField).siblings('button.ui-datepicker-trigger').attr('aria-label', inputField.title);
}

function setDate(inputField, newDate){
	inputField.value = newDate;
	$(inputField).siblings('button.ui-datepicker-trigger').attr('aria-label', inputField.title);
}

function openTooltipHelpMessage(calledOutFromElement, tooltipTitle, tooltipMessage) {
	function closeTooltip() {
		$("#calendar-dialog-message").remove();
	};
	closeTooltip();

	$('<div/>', {
		id: 'calendar-dialog-message',
		title: tooltipTitle,
		html: tooltipMessage,
	}).appendTo('body');

	$(window).unbind('keydown.esc');

	$("#calendar-dialog-message").dialog({
		position: {
			my: 'left top+5',
			at: 'left bottom',
			of: calledOutFromElement
		},
		closeOnEscape: true,
		autoOpen: false,
		close: closeTooltip()
	});

	$("#calendar-dialog-message").dialog("open");
	$('#calendar-dialog-message :link').blur();
}
