const { writeToFile, parseFile } = require('./csv_utils');

const totalIndex = '../data/total_index.csv';
const targetFile = '../data/new_songs.csv';


async function main() {
  const songsToInsert = await parseFile(targetFile);
  const existingSongs = await parseFile(totalIndex);
  for (const song of songsToInsert) {
    const existingSong = existingSongs.find((it) => it.name === song.name);
    if (existingSong) {
      console.log('Song exist skip insert');
      console.log(existingSong);
      continue;
    }
    existingSongs.push(song);
  }
  await writeToFile(totalIndex, existingSongs);
}

main().catch((e) => {
  console.log('Error in main: ', e);
});
