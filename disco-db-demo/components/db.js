import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
  notes: '++id, mongo_id ,username, title, content. createdAt, updatedAt',
});