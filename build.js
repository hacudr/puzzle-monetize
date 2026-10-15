// Copies just the files the app needs into dist/, ready to upload to a host: node build.js
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'puzzles'), { recursive: true });

for (const file of ['index.html', 'style.css', 'app.js', 'sound.js', 'store.js', 'sw.js', 'manifest.webmanifest']) {
  fs.copyFileSync(path.join(__dirname, file), path.join(dist, file));
}
for (const dir of ['icons', 'frames']) {
  fs.cpSync(path.join(__dirname, dir), path.join(dist, dir), { recursive: true });
}

// only the pictures listed in puzzles.json, not the full-size originals
const list = JSON.parse(fs.readFileSync(path.join(__dirname, 'puzzles', 'puzzles.json'), 'utf8'));
for (const file of ['puzzles.json', 'artists.json', 'periods.json']) {
  fs.copyFileSync(path.join(__dirname, 'puzzles', file), path.join(dist, 'puzzles', file));
}
for (const p of list) {
  const to = path.join(dist, 'puzzles', p.image);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'puzzles', p.image), to);
  const thumb = path.join(__dirname, 'puzzles', 'thumbs', p.image);
  if (fs.existsSync(thumb)) {
    fs.mkdirSync(path.join(dist, 'puzzles', 'thumbs'), { recursive: true });
    fs.copyFileSync(thumb, path.join(dist, 'puzzles', 'thumbs', p.image));
  }
}
console.log(`dist/ is ready with ${list.length} puzzles`);
