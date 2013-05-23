Meteor London
=============

**The meatier meetup site for meteor meetups**

An exercise in pulling data from http://api.meetup.com via serverside Meteor.http requests, to terraform a better life.

Feel free to re-use it for your meetup, hack it or otherwise noodle it to your hearts content, it's [free as in Hugs](http://blog.izs.me/post/48281002063/free-as-in-hugs-licence)

Getting started
---------------

- Clone the code, install the Meteor.
- Create an meetup api key via: http://www.meetup.com/meetup_api/key/
- Create a [settings.json](https://github.com/olizilla/meteor-london/blob/master/example-settings.json) file for your super secret meetup api key like so:

```json
{
    "meetupApiKey": "get your key from http://www.meetup.com/meetup_api/key/",
    "public": {
    	"group":{
    		"id":"6576382", 
    		"name": "Meteor London"
    	}
    }
}
```

- Launch a meteor, passing it the path to the settings.json
```shell
meteor --settings settings.json
```
or use the handy `run.sh`
- If all is well, the app will pull the latest event data for Meteor London from Meetup.com, and render it for you at http://localhost:3000

An aside for the interested reader
----------------------------------
The reason for passing in your meetup api key is to keep it out of the source code, so it doesn't get committed, and others can provide there own.
Your meetup api key is supposed to be secret, so we don't go passing it to the client.
`server.js` uses the api key to contact api.meetup.com and sync it's interesting data to local Meteor collections.

I've added a prioritised subscription two-step dance so clients on slow connections get the most important data first.
Ideally we'd set the main header from the group data, but as an ux optimisation we set it from the settings, so that it appears on page load rather than after the first data subscription.

The rest is experiment. Feel free to add some of your own, submit pull requests or add issues.

TODO
----
- Add collection for demo'd things, so each past event can have a list of urls to things shown.
- Allow RSVP & Checkins, via accounts-meetup auth.
- MOAR GRAPHS.

