const fs = require('fs');
const path = require('path');
// import * as fs from 'fs';
// import path from 'path';

// import { dbGlobals } from './discodb.config.js'

function find(targetPath) {
  return findStartingWith(path.dirname(require.main.filename), targetPath);
}

function findStartingWith(start, target) {
  const file = path.join(start, target);
  try {
    data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (path.dirname(start) !== start) {
      return findStartingWith(path.dirname(start), target);
    }
  }
}

// const dbGlobals = JSON.parse(userConfig);
// console.log(dbGlobals)

const dbGlobals = find('discodb.config.json');
console.log(dbGlobals)

// module.exports = dbGlobals;
export default dbGlobals;