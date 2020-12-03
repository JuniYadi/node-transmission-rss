const { program } = require('commander')
const Parser = require('rss-parser')
const parser = new Parser();
const Transmission = require('transmission')

// rss feed fetch and add to transmission
program
    .option('--url <value>', 'URL dari RSS Feed')
    .option('--host <value>', 'IP or Hostname Transmission')
    .option('--user <value>', 'Username Transmission')
    .option('--pass <value>', 'Password Transmission')
    .option('--port <number>', 'Port Transmission')
    .option('--ssl <boolean>', 'Use SSL to Access Transmission', 'true')
    .option('--path <value>', 'Path URL RPC Transmission')
    .parse(process.argv);


// get url rss
const {
    url, host, user, pass, port, ssl, path
} = program

const runTransmission = async () => {

    const transmission = new Transmission({
        host: host,
        port: port,
        ssl: ssl,
        username: user,
        password: pass,
        url: path ? path : '/transmission/rpc'
    })
    
    transmission.sessionStats(function(err, result){
        if(err){
            console.log(err);
        } else {
            console.log(result)
            // console.table(result['cumulative-stats']);
            // console.table(result['current-stats']);
        }
    });
    
    // get feeds from command
    const feed = await parser.parseURL(url)
    // loop data
    feed.items.forEach(item => {
        // console.log(item.link);

        transmission.addUrl(item.link, function(err, result){
            if (err) {
                return console.log(err);
            }

            const id = result.id;
            console.log('Just added a new torrent.');
            console.log('Torrent ID: ' + id);
        })
    });
}

runTransmission()