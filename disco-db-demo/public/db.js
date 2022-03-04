import Dexie from '../node_modules/dexie/dist/modern/dexie';

const db = new Dexie('myDatabase');
db.version(1).stores({
  notes: '++id, _id, username, title, content, createdAt, updatedAt',
  failed_requests: '++id',
});

export async function dexieTest(username, _id, title, content, createdAt, updatedAt) {
  const id = await db.notes.add({
    username,
    _id, 
    title, 
    content, 
    createdAt, 
    updatedAt
  })
  return console.log('data added sucessfully', id);
}

export async function dexieQuery() {
  const someFriends = await db.notes
  .where('username').equals('test1234').toArray();
  return console.log('here is the data: ', someFriends);
}

export async function dexieDelete(username) {
  const del = await db.notes
  .where('username').equals(username).delete();
  return console.log('cleared notes table', del);
}

// export { dexieDelete, dexieTest, dexieQuery  }

