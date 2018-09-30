const anitomy = require('anitomyscript');
const fs = require('fs-extra');
const path = require('path');
const {promisify} = require('util');
const sleep = promisify(setTimeout);

module.exports = async function run (dir, tries) {
  if (tries <= 0 || Number.isNaN(tries)) {
    tries = 1;
  }

  const dirContent = await fs.readdir(dir);
  const animeFiles = dirContent.filter(file => file.endsWith('.mkv'));

  for (const animeFile of animeFiles) {
    const filePath = path.join(dir, animeFile);
    const anime = anitomy.parse(animeFile);
    const folder = path.join(dir, anime.anime_title);
    const newFilePath = path.join(folder, animeFile);

    let attempts = 0;
    while (attempts < tries) {
      try {
        await fs.ensureDir(folder);
        await fs.move(filePath, newFilePath, {overwrite: true});
        break;
      } catch (err) {
        ++attempts;
        if (attempts === tries) {
          throw new Error(`Could not move "${anime.anime_title}" from ${filePath} to ${newFilePath}.\nError: ${err}\n`);
        }
        await sleep(1000);
      }
    }
  }
};
