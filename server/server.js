// Encapsulate the meetup api gubbins.
var meetup = {

    api: 'https://api.meetup.com',

    key: Meteor.settings.meetupApiKey,

    group_id: Meteor.settings.group_id,

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

        opts.key = this.key;

        opts.group_id = this.group_id;

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

// Get data from meetup and insert or update a local collection with the data
function sync(method, opts, collection, idField){
    meetup[method](opts, function(err, resp){
        if(err) return;
        resp.data.results.forEach(function(doc){
            console.log('Upserting ' + method, doc.name ? doc.name : doc[idField] /*, doc */);
            updateOrInsert(collection, doc, idField);
        });
    });
}

// get /events data from api.meetup.com; add or update the Events collection.
function syncEvents(){
    sync('events', { status: 'past,upcoming,cancelled' }, Events, 'id');
}

// get /photos data from api.meetup.com; add or update the Photos collection.
function syncPhotos(){
    sync('photos', {}, Photos, 'photo_id');
}

function syncMembers(){
    sync('members', { omit: 'topics', page: 300 }, Members, 'id'); // TODO: handle paging...
}

// It begins. Get meetup data and push it into local collections. Rinse. Repeat.
Meteor.startup(function(){
    
    // TODO: sanity check we have a key and group_id

    // syncEvents();

    // syncPhotos();

    // syncMembers();

    Meteor.setInterval(syncEvents, 1000 * 60);

    Meteor.setInterval(syncPhotos, 1000 * 60);
    
    Meteor.setInterval(syncMembers, 1000 * 60);
});
