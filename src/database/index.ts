import {Db, MongoClient, MongoError} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

export class Database {
    public static db: Db;
    public static client: MongoClient;

    public static connect = (callback: () => void) => {
        if(process.env.MONGO_URI && process.env.DATABASE) {
            MongoClient.connect(process.env.MONGO_URI, {useUnifiedTopology: true}, (err, client) => {
                if(err) throw new MongoError(err.message);
                Database.client = client;
                Database.db = client.db(process.env.DATABASE);
                callback();
            });
        }else{
            throw new MongoError("Mongo URI not found, please add to the environment variables");
        }
    };

    public static save = (collection: string, toSaveObject: any, callback?: () => void) => {
        if(!Database.client.isConnected()) throw new MongoError("Mongo is disconnected");
        Database.db.collection(collection).insertOne(toSaveObject, (error) => {
            if(error) throw new MongoError("Error saving object");
            callback && callback();
        });
    };

    public static disconnect = (callback: () => void) => {
        Database.client.close(callback);
    }
}