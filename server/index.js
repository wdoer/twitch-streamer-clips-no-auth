const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origins: ['*'] } });

// server
io.on('connection', (socket) => {
  socket.on('getStreamer', (streamer) => {
    getData(streamer);
  })
  // disconenct
  socket.on('disconnect', () => { })
})

http.listen(3000, () => { })

// get streamer clips data
const getData = async (streamer) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://twitchtracker.com/${streamer}/clips#${getCurrentDate() - 1}-${getCurrentDate()}`);
  await page.waitForSelector('.clip-tp');

  const html = await page.content();
  const $ = cheerio.load(html);

  const clips = [];

  $('.clip-tp').each(function () {
    let clip = {}
    clip.url = `https:${$(this).attr('data-litebox')}`;
    clip.thumbnail = $(this).find('.clip-thumbnail').attr('src');
    clip.name = $(this).find('.clip-thumbnail').attr('alt');
    clip.duration = $(this).find('.clip-duration').text();
    clip.views = $(this).find('.clip-views').text();
    clip.date = $(this).find('.clip-created').text();

    clips.push(clip);
  });

  await browser.close();

  io.emit('getStreamer', clips);
  // return await clips;
};

// utils funcs
function getCurrentDate() {
  return new Date().toJSON().slice(0, 10).replace(/-/g, '');
}