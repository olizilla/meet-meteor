
// Client subscribes to this first. 
Meteor.publish("importantThings", function(){
    return [Groups.find({}), Events.find({time: { $gte: Date.now() -  86400000 }})];
});

// Once importantThings are sync'd then subscribe to the rest
Meteor.publish("things", function(){
    return [Events.find({}), Photos.find({}), Members.find({})];
});

// Encapsulate the meetup api gubbins.
var meetup = {

    api: 'https://api.meetup.com',

    pollFrequency: 1000 * 60 * 10, // poll api.meetup.com every 10 mins

    throttle: 1000 * 2, // 2 seconds between requests

    groups: function group(opts, cb){
        this.get(this.api + '/2/groups', opts, cb);
    },

    events: function events(opts, cb){
        this.get(this.api + '/2/events', opts, cb);
    },

    photos: function photos(opts, cb){
        this.get(this.api + '/2/photos', opts, cb);  
    },

    members: function members(opts, cb){
        this.get(this.api + '/2/members', opts, cb);
    },

    get: function get(url, opts, cb){
        if(!opts){ 
            opts = {}; 
        }
        if(typeof opts === 'function'){ 
            cb = opts; 
        }

        opts.sign = true;

        opts.key = Meteor.settings.meetupApiKey,

        this.queue.push(function(){

            console.log('Requesting:', url, opts.group_urlname);

            // TODO: Handle blocked & throttled error responses.
            Meteor.http.get(url, { params: opts }, function(error, response){

                console.log('GOT:', response.statusCode, url);

                if(!response.data.results){ // bad ju ju
                    var errorMsg = "Response lacks requisit data";
                    console.log(errorMsg, response);
                    cb(errorMsg);
                }

                // OK GO!
                cb(error, response);
            });    
        });

        console.log('Queued request', url, opts.group_urlname);
    },

    queue: [],

    startRequestQueue: function(){
        this.queueIntervalId = Meteor.setInterval(function(){
            var nextRequest = meetup.queue.shift();
            if(nextRequest){
                nextRequest();
            }
        }, meetup.throttle);
    }
};

// Find a doc by meetup id, and overwrite with the latest, or create new.
function updateOrInsert(collection, doc, idField){
    var query = {};
    query[idField] = doc[idField];

    var existingDoc = collection.findOne(query);
    if (existingDoc){
        collection.update(existingDoc._id, doc);
    } else{
        collection.insert(doc);
    }
}

// Get data from meetup and insert or update it to a local collection
function sync(method, opts, collection, idField){
    idField = idField || 'id';

    meetup[method](opts, function(err, resp){
        if(err) return;

        var results = resp.data.results;
        var meta = resp.data.meta;

        results.forEach(function(doc){
            console.log('Upserting ' + method, doc.name ? doc.name : doc[idField] /*, doc */);
            updateOrInsert(collection, doc, idField);
        });

        // Are there more pages of data to get?
        if (meta.next){
            opts.offset = opts.offset || 0;
            opts.offset++;
            console.log('Syncing next page', opts.offset);
            sync(method, opts, collection, idField);
        }
    });
}

// Sync all the things! For each group, sync the interesting data
function syncGroups(){
    var groupUrlNames = Meteor.settings.public.groups;

    groupUrlNames.forEach(function(name, index){
        sync('groups', { group_urlname: name, fields: 'sponsors,short_link', omit:'topics' }, Groups);
        sync('events', { group_urlname: name, fields: 'timezone', status: 'past,upcoming,cancelled' }, Events);
        sync('photos', { group_urlname: name }, Photos, 'photo_id');
        // sync('members', { group_urlname: name, omit: 'topics' }, Members);
    });

    console.log('Next sync in '+ meetup.pollFrequency / 1000 +'s \n');    
}

// It begins. Get meetup data and push it into local collections. Rinse. Repeat.
Meteor.startup(function(){

    console.log('\n#### Intiating Launch Sequence ####\n');

    if (!Meteor.settings || !Meteor.settings.meetupApiKey || !Meteor.settings.public){
        console.error('ABORT! ABORT!');
        console.error('The settings data is invalid. Please pass a settings file on startup.');
        console.error('\n  meteor --settings settings.json\n' );
        console.error('More info here: https://github.com/olizilla/meteor-london/blob/master/README.md');

        return;
    }

    meetup.startRequestQueue(); // We have to throttle the api requests

    syncGroups();
    
    Meteor.setInterval(syncGroups, meetup.pollFrequency);
});
