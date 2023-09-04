const { MongoClient } = require('mongodb');
const uri =  process.env.MONGODB;
const databaseName = "telegram";
const collectionName = "session";

const client = new MongoClient(uri);

const session = client.db(databaseName).collection(collectionName);

const updateSession = async (chat_id, data) => {
    const filter = {id: chat_id};
    return await session.updateOne(
        filter,
        {$set: data},
        {
          upsert: true,
        }
    )
    .then(()=>true)
    .catch(()=>false)
}

const deleteSession = async (chat_id) => {
    const filter = {id: chat_id};
    return await session.deleteOne(filter)
    .then(()=>true)
    .catch(()=>false)
}

const getSession = async (chat_id) => {
    const filter = {id: chat_id};
    return await session.findOne(filter)
    .then((response)=>response)
    .catch(()=>false)
}

module.exports = {
     updateSession,
     deleteSession,
     getSession
}