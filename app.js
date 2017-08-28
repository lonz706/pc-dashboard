var express 	= require('express'),
	app			= express(),
	path		= require('path'),
	bodyParser  = require('body-parser'),
	server		= require('http'),
	os			= require('os'),
	io			= require('socket.io');


// setup view engine (ejs)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// set static path for assets (*.css, *.js, etc.)
app.use(express.static(path.join(__dirname, 'public')));


// start tcp server
server = server.createServer(app);

io = io.listen(server);

server.listen(3000);

console.log('Server running...');


// handle tcp-server requests
io.on('connection', function(socket) {

	// handle update socket request
	socket.on('update dashboard', function() {

		var freeMemory  		= os.freemem(),																// free memory in bytes
			totalMemory 		= os.totalmem(),															// total memory in bytes
			usedMemory			= totalMemory - freeMemory,													// total memory calculated by free- and total memoey
			usedMemoryRounded	= Math.round(((totalMemory - freeMemory) / 1024 / 1024 / 1024) * 10) / 10;	// used memory rounded with two decimal numbers
			freeMemoryRounded	= Math.round((freeMemory / 1024 / 1024 / 1024) * 10) / 10,					// round free memory in gebibytes with two decimal numbers
			totalMemoryRound	= Math.round((totalMemory / 1024 / 1024 / 1024) * 10) / 10,					// round used memory in gebibytes with two decimal numbers
			usedMemoryInPercent = Math.round((100 * usedMemory / totalMemory) * 10) / 10,					// calculate used memory in percent with two decimal numbers
			usedMemoryInPercent = (usedMemoryInPercent>100?100:usedMemoryInPercent);						// if usedMemory > 100 = set to 100 to prevent view-errors

		var data = {
			used_memory: usedMemoryRounded,
			total_memory: totalMemoryRound,
			used_mem_in_percent: usedMemoryInPercent
		};

		socket.emit('update frontend', data);
	});

});


// catch /-request
app.get('/', function(req, res) {
	res.render('index');
});

app.post('/submit-settings', function(req, res) {
	console.log(req.query);
});