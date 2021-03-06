'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
var algoliasearch = require('algoliasearch');

const algolia_app_ID = functions.config().algolia.app_id;
const algolia_api_key = functions.config().algolia.api_key;
var client = algoliasearch(algolia_app_ID, algolia_api_key);

const reindexEventIndex = functions.database.ref('events/{eventId}').onUpdate(event => {
    // Only new objects
    if (event.data.previous.exists()) {
        return;
    }
    // Create a temp index
    var tempIndexName = 'events_temp';
    var tempIndex = client.initIndex(tempIndexName);
    var objectsToIndex = [];
    var values = event.data.val();

    for (var key in values){
        if (values.hasOwnProperty(key)){
            var firebaeObject = values[key];
            firebaeObject.objectID = key;
            if (firebaseObject.addressCoords){
                firebaseObject._geoloc = {
                    lat : firebaseObject.addressCoords.lat,
                    lng : firebaseObject.addressCoords.lon
                }
            }
            objectsToIndex.push(firebaeObject);
        }
    }
    index.saveObjects(objectsToIndex, function(err, content){
        if (err){
            throw err;
        }
        //Overwrite main index with temp index
        client.moveIndex(tempIndexName, 'events',function(err, content){
            if (err){
                throw err;
            }
            console.log('Event --> Algolia reimport done');
        });
    });
});

module.exports = reindexEventIndex;