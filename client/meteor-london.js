Meteor.startup(function(){
  console.log('Meteor London is alive.');
});

Template.meetupEvent.nextEvent = function(){
  return Events.findOne();
};