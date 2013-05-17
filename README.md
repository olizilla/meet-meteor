Meteor London
=============

**The meatier meetup site for meteor meetups**

An exercise in pulling data from http://api.meetup.com via serverside Meteor.http requests, to terraform a better life for ourselves at http://london.meteor.com

Getting started
---------------

- Clone the code, install the Meteor.
- Create an meetup api key via: http://www.meetup.com/meetup_api/key/
- Create a settings.json file for your super secret meetup api key like so:
```json
{
    "meetupApiKey": "Your secrets go here",
    "group_id": "6576382"
}
```

- Launch a meteor, passing it the path to the settings.json
```shell
meteor --settings settings.json
```
or use the handy `run.sh`

- If all is well, the app will pull the latest event data for Meteor London from Meetup.com, and render it for you at http://localhost:3000

TODO
----
- Get sponsor info.
- Get group info from meetup, so this can be re-used by other Meteors.
- Add collection for demo'd things, so each past event can have a list of urls to things shown.
- Allow RSVP & Checkins, via accounts-meetup auth.

