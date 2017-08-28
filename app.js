var express 	= require('express'),
	app			= express(),
	path		= require('path'),
	bodyParser  = require('body-parser'),
	server		= require('http'),
	os			= require('os'),
	io			= require('socket.io');

// view engine (ejs)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// set static path for assets
app.use(express.static(path.join(__dirname, 'public')));


// start tcp server
server = server.createServer(app);

io = io.listen(server);

server.listen(3000);

console.log('Server running...');


// handle server requests
io.on('connection', function(socket) {

	// handle update socket request
	socket.on('update dashboard', function() {

		var freeMemory  		= os.freemem(),
			totalMemory 		= os.totalmem(),
			usedMemory			= totalMemory - freeMemory,
			usedMemoryRounded	= Math.round(((totalMemory - freeMemory) / 1024 / 1024 / 1024) * 10) / 10;
			freeMemoryRounded	= Math.round((freeMemory / 1024 / 1024 / 1024) * 10) / 10,			// bytes to gebibytes
			totalMemoryRound	= Math.round((totalMemory / 1024 / 1024 / 1024) * 10) / 10,			// bytes to gebibytes
			usedMemoryInPercent = Math.round((100 * usedMemory / totalMemory) * 10) / 10,
			usedMemoryInPercent = (usedMemoryInPercent>100?100:usedMemoryInPercent);

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
	// socket.emit('update dashboard');
});