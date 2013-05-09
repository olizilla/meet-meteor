Meteor.startup(function(){
  console.log('Meteor London is alive.');
});

Template.upcomingMeetup.events = function(){
  return Events.find({time: { $gt: Date.now() }}).fetch();
};

Template.previousMeetup.events = function(){
  return Events.find({time: { $lt: Date.now() }}).fetch();
};

Template.upcomingMeetup.calandarFormat = function(ms){
	return moment(ms).calendar();
};

Template.upcomingMeetup.dateTimeFormat = function(ms){
	return moment(ms).format('MMMM Do YYYY, h:mm:ss a');
};

Template.previousMeetup.dateFormat = function(ms){
	return moment(ms).format('MMMM Do YYYY');
};