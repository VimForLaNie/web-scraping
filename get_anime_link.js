const cheerio = require('cheerio');
const request = require('request');

request({
    method: 'GET',
    url: 'https://www.anime-sugoi.com/'
}, (err, res, body) => {

    if (err) throw err;

    let $ = cheerio.load(body);
    // console.log($);
    let bound = $('div.panel-body');
    let test = bound.find('div.col-xs-6.col-sm-4.col-md-3.center_lnwphp');
    let links = [];
    for (const key in test) {
        if (test.hasOwnProperty(key)) {
            const element = test[key];
            let link = $(element).find('a').attr('href');
            (link !== undefined) ? links.push(link.trim()) : null;
        }
    }
    links = links.filter((e) => {
        return (e != 'https://www.anime-sugoi.com/index.html');
    });
    console.log(links);
    module.exports(links);
});