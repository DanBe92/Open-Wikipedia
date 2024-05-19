import { MongoClient } from 'mongodb';

let dbConnection;

export function connectToDb(callback)  {
    MongoClient.connect('mongodb://localhost:27017/Wikipedia')
    .then((client) => {
        dbConnection = client.db()
        // dbConnection.collection('user').find().forEach(user => console.log(user))
        return callback()
    })
    .catch(err => {
        console.log(err);
        return callback(err)
    })
}

export function getDb() { dbConnection };
