const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

async function run() {
    let anime = [];
    for(let page = 1; page <= 58; page++){
        request({
            method: 'GET',
            url: 'https://www.anime-sugoi.com/catalog/0/%E0%B8%AD%E0%B8%99%E0%B8%B4%E0%B9%80%E0%B8%A1%E0%B8%B0%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%94.html&number=' + page.toString()
        }, (err, res, body) => {
    
            if (err) throw err;
    
            let $ = cheerio.load(body);
            let links = [];
            // console.log($);
            let bound = $('div.panel-body');
            let test = bound.find('div.col-xs-6.col-sm-4.col-md-3.center_lnwphp');
    
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
            //console.log(links);
            // /*overwrite*/
            // links = ['https://www.anime-sugoi.com/2276/'];
            // /* -------- */
            
            for (const key in links) {
                if (links.hasOwnProperty(key)) {
                    const element = links[key];
                    request({
                        method: 'GET',
                        url: element.toString(),
                    }, (err, res, body) => {
                        if (err) throw err;
                        let $ = cheerio.load(body);
                        let data = {};
    
                        let title = $('center h3').text();
                        data.title = title;
                        //console.log(title);
                        let vid_links = [];
                        let p = $('.b123 p');
    
                        p.each((i, item) => {
                            let ep = [];
                            let a = $('a', item);
                            // console.log("************************");
                            a.each((ii, item1) => {
                                let l = $(item1).attr('href');
                                if (l !== null || l !== undefined) { ep.push(l); }
                                // console.log(l);
                            });
                            // console.log("************************");
                            if (ep.length !== 0) { vid_links.push(ep); }
                        });
    
                        //console.log($(vid).length);
                        //console.log(vid_links);
    
                        let no_ep = vid_links.length;
                        //console.log(no_ep);
                        data.num_episode = no_ep;
                        data.episodes = vid_links;
                        anime.push(data);
                        fs.writeFile('api.json',JSON.stringify(Object.assign({},anime)),(err) => {
                            if (err) { throw err; }
                            console.log("Write file succesfully;");
                        });
                    }
                    );
                }
            }
        });
    }
}

run();

