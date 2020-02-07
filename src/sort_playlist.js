const { parseFile } = require('./csv_utils');
const { promises: fs } = require('fs');

const totalIndex = '../data/total_index.csv';

const playlistName = 'blues-08.02';

const songMapper = (row) => row[0];

async function main() {
  const existingSongs = await parseFile(totalIndex);
  const songsNamesInList = await parseFile(`../data/${playlistName}_songs.csv`, songMapper);
  let songsInList = [];
  const missingSongs = [];
  for (const songName of songsNamesInList) {
    const song = existingSongs.find((it) => it.name === songName);
    if (!song) {
      missingSongs.push(songName);
      continue;
    }
    songsInList.push(song);
  }
  if (missingSongs.length) {
    console.log(missingSongs);
    throw new Error('There are missing songs');
  }
  songsInList = songsInList.sort((a, b) => a.tempo - b.tempo);
  let friendlyFormat = '';
  for (const song of songsInList) {
    friendlyFormat += `${song.name}    ${song.tempo}   ${song.notes}\n`;
  }
  await fs.writeFile(`../data/${playlistName}.txt`, friendlyFormat);
}

main().catch((e) => {
  console.log('Error in main');
  console.log(e);
});
