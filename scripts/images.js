const fs = require('fs');
const http = require('http');

if (!fs.existsSync('data/images')) fs.mkdirSync('data/images');

const data = JSON.parse(fs.readFileSync('data/repokemon.json'));

let i = 0;
const length = data.length;

const download = function (d) {
  if (i >= length) return;
  const id = d.id;
  if (fs.existsSync('data/images/' + id + '.png')) {
    download(data[++i]);
  } else {
    console.log(
      'GET assets.tamigucho.com/assets/cms2/img/tamipedia/full/' + id + '.png',
    );
    http.get(
      {
        hostname: 'assets.tamigucho.com',
        path: '/assets/cms2/img/tamipedia/full/' + id + '.png',
      },
      function (res) {
        let body = '';
        res.setEncoding('binary');
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          fs.writeFileSync('data/images/' + id + '.png', body, 'binary');
          download(data[++i]);
        });
      },
    );
  }
};

download(data[i]);
