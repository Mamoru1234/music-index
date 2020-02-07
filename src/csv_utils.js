const { stringify, parse } = require('csv');
const { promises: fs } = require('fs');

function serializeSong(song) {
  return [song.name, song.tempo, song.notes];
}

function deserializeSong(row) {
  if (row.length !== 3) {
    console.log(row);
    throw new Error('Wrong row received');
  }
  if (isNaN(+row[1])) {
    console.log(+row[1]);
    throw new Error('Wrong song tempo');
  }
  return {
    name: row[0],
    tempo: +row[1],
    notes: row[2],
  }
}


function stringifyAsync(data) {
  return new Promise((res, rej) => {
    stringify(data, (err, output) => {
      if (err) {
        rej(err);
        return;
      }
      res(output);
    });
  });
}

function parseAsync(rawCsv) {
  return new Promise((res, rej) => {
    parse(rawCsv, (err, output) => {
      if (err) {
        rej(err);
        return;
      }
      res(output);
    });
  });
}


async function parseFile(filePath, mapper = deserializeSong) {
  const rawCsv = (await fs.readFile(filePath)).toString();
  const rows = await parseAsync(rawCsv);
  if (!mapper) {
    return rows;
  }
  return rows.map(mapper);
}

async function writeToFile(fileName, songs) {
  const resultRows = songs.map(serializeSong);
  const resultCsv = await stringifyAsync(resultRows);
  await fs.writeFile(fileName, resultCsv);
}

exports.parseFile = parseFile;
exports.writeToFile = writeToFile;
