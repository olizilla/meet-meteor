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
    "meetupApiKey": "Your secrets go here"
}
```

- Launch a meteor, passing it the path to the settings.json
```shell
meteor --settings settings.json
```

- If all is well, the app will pull the latest event data for Meteor London from Meetup.com, and render it for you at http://localhost:3000

TODO
----
Refactor server logic:
- Get upcoming events info
- Get group info
- Get additional info, photos, ratings for past events.

in that order.
