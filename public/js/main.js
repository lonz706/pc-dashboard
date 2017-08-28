var interval,
	socket,
	running = false;

$(function() {
	socket = io.connect();

	socket.on('update frontend', function(data) {

		$('#used_memory').html(data.used_memory);

		$('#total_memory').html(data.total_memory);

		$('#used_mem_in_percent').html(data.used_mem_in_percent);

		$('#used_mem_in_percent_diagramm').css('width', data.used_mem_in_percent+'%');

	});

	updateDashboard();

	startInterval();

	$('.auto-updater').click(switchAutoUpdater);

	$('.settings').click(toggleSettings);

	$('#save-settings').click(saveSettings);
});

function switchAutoUpdater() {
	if(isRunning()) {
		stopInterval();
		$(this).toggleClass('deactivated').attr('title', 'Live-Feed aktivieren');
	} else {
		startInterval();
		$(this).toggleClass('deactivated').attr('title', 'Live-Feed deaktivieren');
	}
}

function toggleSettings() {
	$('.settings-box').toggleClass('collapsed').slideToggle();

	if($('.settings-box').hasClass('collapsed')) {
		$('.settings').html('<i class="fa fa-sliders" aria-hidden="true"></i>').attr('title', 'Einstellungen');
	} else {
		$('.settings').html('<i class="fa fa-times" aria-hidden="true"></i>').attr('title', 'Einstellungen schließen');
	}
}

function saveSettings() {
	var formJSON = $('#settings-form').serialize();
	console.log(formJSON);

	// $.post('/submit-settings', formJSON, function(data) {

	// });

	$('.settings').click();
}

function updateDashboard() {
	socket.emit('update dashboard');
}

function startInterval() {
	if(!isRunning()) {
		setRunning(true);
		interval = setInterval(function() {
			updateDashboard();
		}, 1000);
	}
}

function stopInterval() {
	if(isRunning()) {
		setRunning(false);
		clearInterval(interval);
	}
}

function setRunning(bool) {
	this.running = bool;
}

function isRunning() {
	return running;
}