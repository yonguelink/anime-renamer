const anitomy = require('anitomyscript');
const fs = require('fs-extra');
const path = require('path');

module.exports = async function run (dir) {
  const dirContent = await fs.readdir(dir);

  await Promise.all(dirContent
    .filter(file => file.endsWith('.mkv'))
    .map(async file => {
      const filePath = path.join(dir, file);
      const anime = anitomy.parse(file);
      const folder = path.join(dir, anime.anime_title);
      const newFilePath = path.join(folder, file);

      await fs.ensureDir(folder);
      await fs.move(filePath, newFilePath);

      return newFilePath;
    }));
};
