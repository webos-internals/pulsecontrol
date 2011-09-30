var Foundations = IMPORTS.foundations;

var PalmCall = Foundations.Comms.PalmCall;

var Future = IMPORTS.foundations.Control.Future;

var DB = Foundations.Data.DB;
	
var exec = IMPORTS.require('child_process').exec;

var DB_KIND = "org.webosinternals.pulsecontrol:1";

var SERVICE_ID = "org.webosinternals.pulsecontrol.srv";

var SERVICES_DIR = "/media/cryptofs/apps/usr/palm/services";

var ControlAssistant = function() {
};
  
ControlAssistant.prototype.run = function(future) {
	if((!this.controller.args) || (!this.controller.args.action))
		future.result = { returnValue: false };
//	else if(this.controller.args.action == "subscribe")
//		this.init(future);
	else {
		future.nest(this.load());
		
		future.then(this, function(future) {
			var config = future.result;
		
			if(this.controller.args.action == "reset")
				this.reset(future, config, this.controller.args);
			else if(this.controller.args.action == "apply")
				this.apply(future, config, this.controller.args);
			else if(this.controller.args.action == "check")
				this.check(future, config, this.controller.args);
			else if(this.controller.args.action == "connect")
				this.connect(future, config, this.controller.args);
			else if(this.controller.args.action == "disconnect")
				this.disconnect(future, config, this.controller.args);
			else
				future.result = { returnValue: false };
		});
	}
};

//

ControlAssistant.prototype.load = function() {
	var future = DB.find({ from: DB_KIND, limit: 2 });
	
	future.then(this, function(future) {
		var result = future.result;
		
		var len = result.results ? result.results.length : 0;
		
		if (len === 0) {
			future.result = {_kind: DB_KIND, paServers: [], 
				tcpServer: false, wifiSinks: []};
		} else if (len > 1)
			throw new Error("More than 1 preferences object found");
		else
			future.result = result.results[0];
	});
		
	return future;
};

//

ControlAssistant.prototype.reset = function(future, config, args) {
	var cmd = SERVICES_DIR + "/" + SERVICE_ID + "/bin/papctl.sh reset";

	exec(cmd, function(future, error, stdout, stderr) {
		if(error !== null) { 
			error.errorCode = error.code;

			future.exception = error;
		}
		else {
			future.nest(PalmCall.call("palm://com.palm.applicationManager/", "launch", {
				'id': "org.webosinternals.pulsecontrol", 'params': {'dashboard': "none"}}));
		
			future.then(this, function(future) {
				future.result = { returnValue: true };
			});
		}
	}.bind(this, future));
};

//

ControlAssistant.prototype.apply = function(future, config, args) {
	var bin = SERVICES_DIR + "/" + SERVICE_ID + "/bin/papctl.sh";

	if(config.tcpServer)
		var cmd = bin + " enable";
	else
		var cmd = bin + " disable";

	exec(cmd, function(future, config, args, error, stdout, stderr) {
		if(error !== null) { 
			error.errorCode = error.code;

			future.exception = error;
		} else {



/*	var bin = SERVICES_DIR + "/" + SERVICE_ID + "/bin/papctl.sh";

	if(config.tcpServer)
		var cmd = bin + " enable";
	else
		var cmd = bin + " disable";

	exec(cmd, function(future, config, args, error, stdout, stderr) {
		if(error !== null) { 
			error.errorCode = error.code;
console.error("AAAA1");
		//	future.exception = error;
		} else {


			cmd = bin + " disconnect";

			exec(cmd, function(future, config, args, error, stdout, stderr) {
				if(error !== null) { 
					error.errorCode = error.code;

					future.exception = error;
				} else {
						console.error("AAAA2");
					future.nest(PalmCall.call("palm://com.palm.connectionmanager", "getstatus", {}));
		console.error("AAAA2b");
					future.then(this, function(future) {
					console.error("AAAA3");
						if(future.result.wifi) {
							args.$activity = {trigger: future.result};

							this.check(future, config, args);

						console.error("AAAA4");
						}
//						else
							//future.result = { returnValue: true };
					});
				}
			}.bind(this, future, config, args));
		}
	}.bind(this, future, config, args));*/
};

ControlAssistant.prototype.check = function(future, config, args) {
	var addr = null, mode = null, sinks = null;

	if((args.$activity) && (args.$activity.trigger) && (args.$activity.trigger.wifi)) {
		if((future.result.wifi.state == "connected") && (future.result.wifi.ssid)) {
			var ssid = future.result.wifi.ssid.toLowerCase();

			for(var i = 0; i < config.paServers.length; i++) {
				if(config.paServers[i].ssid.toLowerCase() == ssid) {
					sinks = config.wifiSinks.toString();

					addr = config.paServers[i].address;

					mode = config.paServers[i].mode;
										
					break;				
				}
			}
		}

		if((addr != null) && (sinks != null) && (mode == "manual")) {
			future.nest(PalmCall.call("palm://com.palm.applicationManager/", "launch", {
				'id': "org.webosinternals.pulsecontrol", 'params': {'dashboard': "manual",
					'address': addr, 'sinks': sinks}}));

			future.then(this, function(future) {
				future.result = { returnValue: true };
			});
		} else {
			if((addr != null) && (sinks != null)) {
				args = {address: addr, sinks: sinks};
			
				this.connect(future, config, args);
			} else {
				this.disconnect(future, config, args);
			}
		}
	} else {
		future.result = { returnValue: true };
	}
};

//

ControlAssistant.prototype.connect = function(future, config, args) {
	if((args.address) && (args.sinks)) {
		var bin = SERVICES_DIR + "/" + SERVICE_ID + "/bin/papctl.sh";

		var cmd = bin + " connect " + args.address + " " + args.sinks;

		exec(cmd, function(future, addr, sinks, error, stdout, stderr) {
			if(error !== null) { 
				error.errorCode = error.code;

				future.exception = error;
			} else {
				if((stdout) && (stdout.slice(0, 16) == "Connection error")) {
					future.nest(PalmCall.call("palm://com.palm.applicationManager/", "launch", {
						'id': "org.webosinternals.pulsecontrol", 'params': {'dashboard': "error"}}));
				} else if((stdout) && (stdout.slice(0, 17) == "Module load error")) {
					future.nest(PalmCall.call("palm://com.palm.applicationManager/", "launch", {
						'id': "org.webosinternals.pulsecontrol", 'params': {'dashboard': "none"}}));
				} else {			
					future.nest(PalmCall.call("palm://com.palm.applicationManager/", "launch", {
						'id': "org.webosinternals.pulsecontrol", 'params': {'dashboard': "auto",
							'address': addr, 'sinks': sinks}}));
				}
								
				future.then(this, function(future) {
					future.result = { returnValue: true };
				});
			}
		}.bind(this, future, args.address, args.sinks));
	} else {
		future.result = { returnValue: true };
	}
};

ControlAssistant.prototype.disconnect = function(future, config, args) {
	var bin = SERVICES_DIR + "/" + SERVICE_ID + "/bin/papctl.sh";

	var cmd = bin + " disconnect";
	
	exec(cmd, function(future, addr, sinks, error, stdout, stderr) {
		if(error !== null) { 
			error.errorCode = error.code;

			future.exception = error;
		} else {
			console.error("HHH1 " + stdout);

			if((addr) && (sinks)) {
				future.nest(PalmCall.call("palm://com.palm.applicationManager/", "launch", {
					'id': "org.webosinternals.pulsecontrol", 'params': {'dashboard': "manual",
					'address': addr, 'sinks': sinks}}));
			} else {
				future.nest(PalmCall.call("palm://com.palm.applicationManager/", "launch", {
					'id': "org.webosinternals.pulsecontrol", 'params': {'dashboard': "none"}}));
			}
					
			future.then(this, function(future) {
				future.result = { returnValue: true };
			});
		}
	}.bind(this, future, args.address, args.sinks));
};
