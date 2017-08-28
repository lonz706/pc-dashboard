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
});

function switchAutoUpdater() {
	if(isRunning()) {
		stopInterval();
		$(this).toggleClass('deactivated');
	} else {
		startInterval();
		$(this).toggleClass('deactivated');
	}
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