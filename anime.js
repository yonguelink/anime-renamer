const anitomy = require('anitomyscript');
const fs = require('fs-extra');
const path = require('path');

module.exports = async function run (dir) {
  const dirContent = await fs.readdir(dir);

  const animeFiles = dirContent.filter(file => file.endsWith('.mkv'));

  for (const animeFile of animeFiles) {
    const filePath = path.join(dir, animeFile);
    const anime = anitomy.parse(animeFile);
    const folder = path.join(dir, anime.anime_title);
    const newFilePath = path.join(folder, animeFile);

    await fs.ensureDir(folder);
    await fs.move(filePath, newFilePath, {overwrite: true});
  }
};
