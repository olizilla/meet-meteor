// Prioritsed subscribtion... Get the importantThings first.
Meteor.subscribe('importantThings', function(){
	console.log('Got the important things');
	
	Meteor.subscribe('things', function(){
		console.log('Got the things');
	});
});

Template.upcomingMeetup.events = function(){
	return Events.find({time: { $gt: Date.now() }}, { sort: [['time', 'asc']]}).fetch();
};

Template.previousMeetup.events = function(){
	return Events.find({time: { $lt: Date.now() }}, { sort: [['time', 'desc']]}).fetch();
};

Template.upcomingMeetup.fromNowFormat = function(ms){
		return moment(ms).fromNow();
};

Template.upcomingMeetup.calandarFormat = function(ms){
	return moment(ms).calendar();
};

Template.upcomingMeetup.isoFormat = function(ms){
	return moment(ms).format();
};

Template.upcomingMeetup.dateTimeFormat = function(ms){
	return moment(ms).format('MMMM Do YYYY, h:mm a');
};

Template.upcomingMeetup.createMap = function(venue) {

	var mapId = "venue-" + venue.id;
	
	setTimeout(function() {
		
		if(!venue) {
			return;
		}
		
		var map = L.map(mapId, {
			zoomControl:false,
			attributionControl:false
		});

		map.on('click', function(){
			map.setView(latlon, 16);
		})
		
		L.tileLayer('http://{s}tile.stamen.com/toner/{z}/{x}/{y}.png', {
			"minZoom":      0,
			"maxZoom":      20,
			"subdomains":   ["", "a.", "b.", "c.", "d."],
			"scheme":       "xyz"
		}).addTo(map);

		var latlon = [venue.lat, venue.lon];
		
		var marker = L.marker(latlon, {
			title: venue.name,
			riseOnHover:true
		});
		
		marker.on('click', function(){
			map.setView(latlon, 16);
		})

		marker.addTo(map);

		map.setView(latlon, 16);
		
	}, 1000);

	return '<div id="' + mapId + '" class="map"></div>';
};

Template.previousMeetup.dateFormat = function(ms){
	return moment(ms).format('MMMM Do YYYY');
};

Template.previousMeetup.toFixed = function(number){
	return parseFloat(number).toFixed(1); // rounded to 1 decimal place.
};

Template.photos.photos = function(){
	return Photos.find({}, { sort: [['created', 'desc']]}).fetch();
};

Template.members.members = function(){
	return Members.find({}, { sort: [['joined', 'desc']]}).fetch();
};

Template.upcomingMeetup.rendered = onLoad;

Template.previousMeetup.rendered = onLoad;

Template.photos.rendered = onLoad;

Template.members.rendered = function(){
	$(this.findAll('.loading')).removeClass('loading');
	membersGraph({width: 120, height: 50});
};

function onLoad(){
	$(this.findAll('.loading')).removeClass('loading');
}

Meteor.startup(function(){
	// Connection status indicator... Add the status as a body class, and title attr to logo.
	Deps.autorun(function(){
		var status = Meteor.status().status;
		var statusHolder = $('body');
		statusHolder.removeClass('connected connecting failed waiting');
		statusHolder.addClass(status);
		$('.logo').attr('title', 'Meteor status: ' + status);
	});
});
