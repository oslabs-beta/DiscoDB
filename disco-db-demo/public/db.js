import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

  const db = new Dexie('myDatabase01');
  db.version(0.1).stores({
    notes: '_id, username, title, content, createdAt, updatedAt',
  });

  async function dexieAdd(dataObject) {
    const id = await db.notes.add(dataObject)
    return console.log('data added sucessfully', id);
  }

  async function dexieUpdate(id, dataObject) {
    const update = await db.notes.update(id, dataObject);
    return console.log('data successfully updated', update);
  }
  
  // async function dexieQuery() {
  //   const allNotes = useLiveQuery(
  //     () => {
  //       db.notes.toArray()
  //     });
  //   console.log('here is the data: ', allNotes);
  // }

  async function dexieQuery(username) {
    const someFriends = await db.notes
    .where('username').equals(username).toArray();
    return console.log('here is the data: ', someFriends);
  }

  async function dexieDeleteAll(username) {
    const del = await db.notes
    .where('username').equals(username).delete();
    return console.log('cleared notes table', del);
  }

  async function dexieDeleteOne(id) {
    const del = await db.notes
    .where('_id').equals(id).delete();
    return console.log('cleared note id: ', del);
  }

export { dexieDeleteAll, dexieAdd, dexieQuery, dexieUpdate, dexieDeleteOne }
