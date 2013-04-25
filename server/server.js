var meetupEventsUrl = 'http://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=Meteor-London&desc=false&offset=0&format=json&page=20&fields=&sig_id=11394360&sig=a0cdf7ab7db53b06be0b4679905ee8ad771749df';

Meteor.startup(function(){
	requestMeetupData();
	Meteor.setInterval(requestMeetupData, 1000 * 60);
});

var requestMeetupData = function(){
	console.log('Requesting meetup data');

	Meteor.http.get(meetupEventsUrl, function(error, result){
		console.log('Response: ' + result.statusCode /*, result.data */);

		if(result.statusCode !== 200 || !result.data.results){
			// bad ju ju
			console.log("Couldn't untangle the response.");
			return; 
		}

		result.data.results.forEach(function(meetupEvent){
			var gotIt = Events.findOne({id: meetupEvent.id });
			if (!gotIt){
				console.log('Adding event:', meetupEvent.name);
				Events.insert(meetupEvent);
			} else{
				console.log('Updating event:', meetupEvent.name);
				Events.update(gotIt._id, meetupEvent);
			}			
		});
	});
};

/* example response

TTP/1.1 200 success
{
"results": [
{
"visibility": "public",
"status": "upcoming",
"maybe_rsvp_count": 0,
"venue": {
"id": 12878792,
"lon": -0.09643,
"repinned": true,
"name": "Timber Yard",
"address_1": "61-67 Old Street",
"lat": 51.52423,
"country": "gb",
"city": "London"
},
"id": "112837102",
"utc_offset": 3600000,
"time": 1366911000000,
"waitlist_count": 0,
"created": 1365172760000,
"yes_rsvp_count": 40,
"updated": 1366128380000,
"event_url": "http://www.meetup.com/Meteor-London/events/112837102/",
"description": "<p><span><strong>Build a demo</strong>, a thingamy, a doodad, a whatever, as trivial or fancy as you like. Then, the clever bit, we meet up and compare notes. The fancy can show off their wares and the curious can learn a trick or two.</span></p>
<p>Bonus points awarded for:</p>
<ul>
<li><span>Deploying things to meteor.com</span></li>
<li>Trying out the new new <a href="http://meteor.com/blog/2013/04/04/meteor-060-brand-new-distribution-system-app-packages-npm-integration">Meteor 0.6 release</a></li>
<li><span>Offering to host</span></li>
<li>Sponsoring the food and drink</li>
<li>Good questions</li>
<li>Offering to do a full-on presentation with slides, a title, and all the trimmings</li>
</ul>
<p><span>Feeling</span> <span>code-shy but curious? That's fine too. Have a go at installing meteor and come along to the meetup to see the kind of magic you could be building. If you get stuck, just message the group and someone will be able to help.</span></p>",
"headcount": 0,
"name": "Show & Tell & Ale",
"group": {
"id": 6576382,
"group_lat": 51.5099983215332,
"name": "Meteor London",
"group_lon": -0.10000000149011612,
"join_mode": "open",
"urlname": "Meteor-London",
"who": "Meteorites"
}
}
],
"meta": {
"lon": "",
"count": 1,
"signed_url": "http://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=Meteor-London&desc=false&offset=0&format=json&page=20&fields=&sig_id=11394360&sig=a0cdf7ab7db53b06be0b4679905ee8ad771749df",
"link": "http://www.meetup.com/2/events",
"next": "",
"total_count": 1,
"url": "http://www.meetup.com/2/events?key=386376393134573d397448321d3044&status=upcoming&order=time&limited_events=False&group_urlname=Meteor-London&desc=false&offset=0&format=json&page=20&fields=&sign=true",
"id": "",
"title": "Meetup Events v2",
"updated": 1366128380000,
"description": "Access Meetup events using a group, member, or event id. Events in private groups are available only to authenticated members of those groups. To search events by topic or location, see [Open Events](/meetup_api/docs/2/open_events).",
"method": "Events",
"lat": ""
}
}
*/