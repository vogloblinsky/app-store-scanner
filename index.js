var searchitunes = require('searchitunes'),
    jsonfile = require('jsonfile'),
    httpreq = require('httpreq'),
    file = 'app-store-data.json';

jsonfile.readFile(file, function(err, obj) {
    if (err) {
        searchData();
    } else {
        parseData();
    }
});

var searchData = function() {
    searchitunes({
            entity: 'software',
            term: 'game',
            limit: 200
        },
        function(err, data) {
            if (err) {
                console.log('Search failed: %s', err.message);
            } else {
                jsonfile.writeFile(file, data, function(err) {
                    console.error(err)
                });
            }
        }
    );
};

var parseData = function() {
    var data = require('./' + file),
        i = 0,
        j = leng = name = null,
        len = data.results.length;

    var loopApp = function() {
            if (i < len) {
                name = data.results[i].trackCensoredName.toLowerCase().replace(/ /g, '-');
                j = 0;
                leng = data.results[i].screenshotUrls.length;

                loopScreenShots();
            }
        },
        loopScreenShots = function() {
            if (j < leng) {
                httpreq.download(
                    data.results[i].screenshotUrls[j],
                    __dirname + '/screenshots/' + name + '-' + j + '.jpg',
                    function(err, progress) {
                        if (err) return console.log(err);
                        //console.log(progress);
                    },
                    function(err, res) {
                        if (err) return console.log(err);
                        console.log(data.results[i].screenshotUrls[j]);
                        //console.log(res);
                        j++
                        loopScreenShots();
                    });
            } else {
                i++;
                loopApp();
            }
        };

    loopApp();
};
