const fs = require('fs');
const path = require('path');

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

const dbGlobals = find('discodb.config.json');
module.exports = dbGlobals;