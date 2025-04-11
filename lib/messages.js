import { cache } from "react";
import { unstable_cache as nextCache } from "next/cache";
import sql from "better-sqlite3";

const db = new sql("messages.db");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY, 
      text TEXT
    )`);
}

initDb();

export function addMessage(message) {
  db.prepare("INSERT INTO messages (text) VALUES (?)").run(message);
}

export const getMessages = nextCache( // caches the data from datasource
  cache(function getMessages() {
    console.log("Fetching messages from db");
    return db.prepare("SELECT * FROM messages").all();
  }), ['messages'],// tag to identify the cache
  {
    // revalidate: 5 this is update the cache after specified timeframe
    tags: ['msgs'] // this will update the tag where ever in application is been used
  }
);
