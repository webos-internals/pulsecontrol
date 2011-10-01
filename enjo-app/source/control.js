enyo.kind({
	name: "PulseAudioControl.Main",
	kind: enyo.VFlexBox,
	className: 'enyo-fit enyo-vflexbox main',
	
	_ready: false,
	
	_prefs: {paServers: [], tcpServer: false, wifiSinks: ["pmedia"]},
	
	_sinks: ["palarm", "palerts", "pcalendar", "pdefaultapp", "pDTMF", "peffects", "pfeedback", 
		"pflash", "pmedia", "pnavigation", "pnotifications", "pringtones", "pvoicedial", "pvoip", "pvvm"
	],
	
	components: [
		{kind: "AppMenu", components: [
			 {caption: "Reset PulseAudio", onclick: "restartPulseAudio"}
		]},
		
		{name: "controlDashboard", kind: "Dashboard",  smallIcon: "images/icon-dash.png",
			icon: "images/icon.png", onMessageTap: "handleDashboardTap", onIconTap: "handleDashboardTap"},
		
		{name:"errorDialog", kind: "Dialog", components: [
        {content: "There was some unknown error while calling the service!", style: "padding: 5px 15px 10px 15px;"},
        {layoutKind: "HFlexLayout", pack: "center", components: [
            {kind: "Button", caption: "OK", width: "100%", onclick: "hideErrorDialog"}
        ]}
   	]},
   	
		{kind:"Toolbar", className:"enyo-toolbar-light accounts-header", pack:"center", components: [
			{kind: "Image", src: "images/icon.png"},
			{kind: "Control", content: $L("PulseAudio Settings")}
		]},
		{className:"accounts-header-shadow"},
		
    	{name: "mainScroller", kind:"Scroller", flex:1, components: [
	    	{kind:"Pane", flex:1, components:[
				{kind: "HFlexBox", className:"box-center enyo-bg", style: "position: relative;top: -50px;",flex:1, pack:"center", align:"center", components: [
					{kind:"Spinner", name: "getStatusSpinner"},
						{content: $L("Loading PulseAudio Settings...")}
				]},
				{kind:"Control", name:"prefView", className:"box-center enyo-bg", components: [                               
					{layoutKind: "VFlexLayout", align: "center", style: "min-width: 100%;", components: [
					  	{layoutKind: "HFlexLayout", align: "center", style: "width: 500px;max-width: 100%;", components: [
							{kind: "RowGroup", flex: 1, caption: "Client Settings", components: [
								{name: "configuredServers", kind: "VirtualRepeater", onSetupRow: "getConfiguredServer", style: "margin: -10px;", components: [
									{name: "serverItem", kind: "SwipeableItem", style: "padding-top:1px;padding-bottom:0px;", layoutKind: "HFlexLayout", align: "center", flex: 1, tapHighlight: true, onConfirm: "delPulseAudioServer", components: [
										{layoutKind: "HFlexLayout", flex: 1, tapHighlight: true, components: [
											{name: "serverName", kind: "Input", flex:1, style: "margin-left: -14px; margin-right: -2px;", hint: "SSID", onchange: "handleServerName"},
											{name: "serverAddr", kind: "Input", flex:2, style: "margin-left: 0px; margin-right: 5px;", hint: "Address", onchange: "handleServerAddr"},
										]},
										{name: "serverMode", kind: "ListSelector", value: "auto", width: "60px;", onChange: "handleServerMode", items: [
											{caption: "Ask", value: "manual"}, {caption: "Auto", value: "auto"}
										]}
									]}
								]},
								{layoutKind: "HFlexLayout", flex: 1, tapHighlight: true, components: [
									{kind: "Image", src: "images/icon-plus.png", style: "opacity: 0.9; margin: -20px -8px -8px -5px;"},
									{flex: 1, style: "opacity: 0.6; padding-left: 10px; text-transform: capitalize; margin-top: -1px;", content: "Add Network Server", onclick: "addPulseAudioServer"}
								]}
							]}
						]},

						{layoutKind: "HFlexLayout", align: "center", style: "width: 500px;max-width: 100%;", components: [
							{kind: "RowGroup", flex: 1, caption: "Server Settings", components: [
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Allow Client Connections", flex: 1},
									{name: "serverEnabled", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleServerToggle"}
								]},
							]},
						]},
						
						{style: "padding-top:6px;padding-bottom:6px;padding-left:3px;padding-right: 8px;max-width:100%;-webkit-box-sizing: border-box;", components: [
							{name: "applySettingsButton", kind: "Button", className: "enyo-button-affirmative", width: "488px", caption: "Apply Configuration", onclick: "handleApplySettings"},
						]},
						{style: "padding-top:0px;padding-bottom:6px;padding-left:3px;padding-right: 8px;max-width:100%;-webkit-box-sizing: border-box;", components: [
							{kind: "Button", className: "enyo-button-light", width: "488px", caption: "Show Audio Sources", onclick: "handleEditAdvanced"},
						]}
					]},
				]},

				{kind:"Control", name:"sinkView", className:"box-center enyo-bg", components: [                               						
					{layoutKind: "VFlexLayout", align: "center", style: "min-width: 100%;", components: [
						{layoutKind: "HFlexLayout", align: "center", style: "width: 500px;max-width: 100%;", components: [
							{kind: "RowGroup", flex: 1, caption: "Wi-Fi Audio Sources", components: [
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Alarm", flex: 1},
									{name: "palarm", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Alerts", flex: 1},
									{name: "palerts", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Calendar", flex: 1},
									{name: "pcalendar", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Default App", flex: 1},
									{name: "pdefaultapp", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "DTMF", flex: 1},
									{name: "pDTMF", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Effects", flex: 1},
									{name: "peffects", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Feedback", flex: 1},
									{name: "pfeedback", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Flash", flex: 1},
									{name: "pflash", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Media", flex: 1},
									{name: "pmedia", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Navigation", flex: 1},
									{name: "pnavigation", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Notifications", flex: 1},
									{name: "pnotifications", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},					
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Ringtones", flex: 1},
									{name: "pringtones", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Voicedial", flex: 1},
									{name: "pvoicedial", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "Voip", flex: 1},
									{name: "pvoip", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]},
								{kind: "Item", layoutKind: "HFlexLayout", components: [
									{content: "VVM", flex: 1},
									{name: "pvvm", kind: "ToggleButton", onLabel: "On", offLabel: "Off", state: false, onChange: "handleSourceToggle"}
								]}
							]}
						]},
						
						{style: "padding-top:6px;padding-bottom:6px;padding-left:3px;padding-right: 8px;max-width:100%;-webkit-box-sizing: border-box;", components: [
							{kind: "Button", className: "enyo-button-light", width: "488px", caption: "Back", onclick: "handleEditBasic"},
						]}						
					]}
				]}
			]}
		]},

		{name: 'pulseControlSrv', kind: 'PalmService', service: 'palm://org.webosinternals.pulsecontrol.srv', method: 'control',
			onSuccess: "handleServiceSuccess", onFailure: "handleServiceFailure"},
		
		{name: "loadPreferences", kind: "DbService", dbKind: "org.webosinternals.pulsecontrol:1", method: "find", onSuccess: "handlePrefsLoad"},
		{name: "savePreferences", kind: "DbService", dbKind: "org.webosinternals.pulsecontrol:1", method: "put", onSuccess: "handlePrefsSave"}		
	],

	create: function() {
		this.inherited(arguments);

		if(enyo.fetchDeviceInfo().modelNameAscii != "TouchPad")
			enyo.setAllowedOrientation("up");

		this.$.controlDashboard.create();
	
		this.$.getStatusSpinner.show();

		this.$.loadPreferences.call();
	},

	handleDashboardTap: function(inSender, topLayer, event) {
		this.$.controlDashboard.setLayers([]);

		if(topLayer.action) {
			this.$.pulseControlSrv.call({action: topLayer.action, address: topLayer.address, sinks: topLayer.sinks});
		}		
	},

	hideErrorDialog: function() {
		this.$.errorDialog.close();
	},

	handlePrefsLoad: function(inSender, inResponse) {
		if (inResponse.results.length === 0)
			this._prefs = {_kind: "org.webosinternals.pulsecontrol:1", paServers: [], wifiSinks: []};
		else
			this._prefs = inResponse.results[0];	

		for(var i = 0; i < this._prefs.wifiSinks.length; i++) {
			this.$[this._prefs.wifiSinks[i]].setState(true);
		}

		this.$.serverEnabled.setState(this._prefs.tcpServer);

		this._ready = true;

		this.$.configuredServers.render();
	
		this.$.pane.selectViewByName("prefView", true);

		setTimeout(enyo.bind(this.$.getStatusSpinner, "hide"), 1000);
	},

	handlePrefsSave: function(inSender, inResponse) {
		if	(inResponse.results.length === 1) {
			this._prefs._id = inResponse.results[0].id;
						
			this._prefs._rev = inResponse.results[0].rev;
		
			this._ready = true;	
		}
	},

	restartPulseAudio: function(inSender, inEvent) {
		this.$.applySettingsButton.setDisabled(true);

		this.$.pulseControlSrv.call({action: "reset"});
	},

	handleServiceSuccess: function() {
		this.$.applySettingsButton.setDisabled(false);
	},

	handleServiceFailure: function() {
		this.$.applySettingsButton.setDisabled(false);
			
		this.$.errorDialog.open();		
	},

	handleApplySettings: function(inSender, inEvent) {
		this.$.controlDashboard.setLayers([]);

		this.$.applySettingsButton.setDisabled(true);
		
		this.$.pulseControlSrv.call({action: "apply"});
	},

	handleEditAdvanced: function(inSender, inEvent) {
		this.$.mainScroller.scrollIntoView(0,0);

		this.$.pane.selectViewByName("sinkView", true);
	},

	handleEditBasic: function(inSender, inEvent) {
		this.$.mainScroller.scrollIntoView(0,0);
		
		this.$.pane.selectViewByName("prefView", true);
	},

	handleServerName: function(inSender, inEvent) {
		if(this._ready) {
			this._ready = false;

			var index = this.$.configuredServers.fetchRowIndex();
			
			this._prefs.paServers[index].ssid = this.$.serverName.getValue();
	
			this.$.savePreferences.call({objects: [this._prefs]});
		}
	},

	handleServerAddr: function(inSender, inEvent) {
		if(this._ready) {
			this._ready = false;

			var index = this.$.configuredServers.fetchRowIndex();

			this._prefs.paServers[index].address = this.$.serverAddr.getValue();
	
			this.$.savePreferences.call({objects: [this._prefs]});
		}
	},

	handleServerMode: function(inSender, inEvent) {
		if(this._ready) {
			this._ready = false;

			var index = this.$.configuredServers.fetchRowIndex();

			this._prefs.paServers[index].mode = this.$.serverMode.getValue();
	
			this.$.savePreferences.call({objects: [this._prefs]});
		}
	},

	handleServerToggle: function(inSender, inEvent) {
		if(this._ready) {
			this._ready = false;

			this._prefs.tcpServer = this.$.serverEnabled.getState();

			this.$.savePreferences.call({objects: [this._prefs]});
		}		
	},

	handleSourceToggle: function(inSender, inEvent) {
		if(this._ready) {
			this._ready = false;
	
			this._prefs.wifiSinks = [];
	
			for(var i = 0; i < this._sinks.length; i++) {
				if(this.$[this._sinks[i]].getState() == true)
					this._prefs.wifiSinks.push(this._sinks[i]);		
			}

			this.$.savePreferences.call({objects: [this._prefs]});
		}
	},

	getConfiguredServer: function(inSender, inIndex) {
		if((inIndex >= 0) && (inIndex < this._prefs.paServers.length)) {
			if(inIndex == 0)
				this.$.serverItem.applyStyle("border-top", "0px");
			if(inIndex == this._prefs.paServers.length - 1)
				this.$.serverItem.applyStyle("border-bottom", "0px");

			this.$.serverName.setValue(this._prefs.paServers[inIndex].ssid);
			this.$.serverAddr.setValue(this._prefs.paServers[inIndex].address);
			this.$.serverMode.setValue(this._prefs.paServers[inIndex].mode);
						
			return true;
		}		
	},

	addPulseAudioServer: function(inSender, inEvent) {
		this._prefs.paServers.push({ssid: "", address: "", mode: "auto"});

		this.$.configuredServers.render();
	},

	delPulseAudioServer: function(inSender, inIndex) {
		if(this._ready) {
			this._ready = false;
			
			this._prefs.paServers.splice(inIndex, 1);
		
			this.$.configuredServers.render();		
		
			this.$.savePreferences.call({objects: [this._prefs]});		
		}
	}
});
