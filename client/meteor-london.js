Meteor.startup(function(){
  console.log('Meteor London is alive.');
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

Template.previousMeetup.dateFormat = function(ms){
	return moment(ms).format('MMMM Do YYYY');
};