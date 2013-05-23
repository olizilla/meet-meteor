Meteor.startup(function(){

	// Set group name from settings rather than waiting for a subscription to complete
	var groupName = Meteor.settings.public.group.name;
	
	console.log(groupName + ' is alive.');
	
	document.title = groupName;
	
	document.getElementById('group-name').innerHTML = groupName;
});

// Prioritsed subscribtion... Get the importantThings first.
Meteor.subscribe('importantThings', function(){
	console.log('Got the important things');
	
	Meteor.subscribe('things', function(){
		console.log('Got the things');
	});
});

Template.upcomingMeetup.events = function(){
	return Events.find({time: { $gt: Date.now() }}, { sort: [['time', 'desc']]}).fetch();
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

Template.upcomingMeetup.dateTimeFormat = function(ms){
	return moment(ms).format('MMMM Do YYYY, h:mm a');
};

Template.upcomingMeetup.createMap = function(venue) {
	
	setTimeout(function() {
		
		if(!venue) {
			return;
		}
		
		var map = L.map('tmp-map', {
			zoomControl:false,
			attributionControl:false
		});
		
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

		marker.addTo(map);

		map.setView(latlon, 16);
		
	}, 1000);
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

Template.sponsors.sponsors = function(){
	return Groups.findOne() ? Groups.findOne().sponsors : null;
};

Template.upcomingMeetup.rendered = onLoad;
Template.previousMeetup.rendered = onLoad;
Template.photos.rendered = onLoad;
Template.sponsors.rendered = onLoad;
Template.members.rendered = function(){
	var loadings = $(this.find('.loading'));
	loadings.removeClass('loading');
	membersGraph({width: 120, height: 50});
};

function onLoad(){
	var loadings = $(this.find('.loading'));
	loadings.removeClass('loading');
}
