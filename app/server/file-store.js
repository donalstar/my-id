var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI({host: 'localhost', port: '5001', procotol: 'http'});

function trim(s) {
    return ( s || '' ).replace(/^\s+|\s+$/g, '');
}

module.exports = {

    /**
     * Read from file
     *
     * @param file_id
     * @param callback
     */
    readFromFile: function (file_id, callback) {

        ipfs.object.get([file_id])
            .then(function (result) {
                console.log('FROM IPFS --- ' + result.data);

                data = result.data.replace(/[^a-zA-Z0-9]/g, '');

                callback(null, data);
            })
            .catch(function (err) {
                callback(err, null);
            });
    },

    /**
     *
     * @param value
     * @param callback
     */
    storeValue: function (value, callback) {

        ipfs.files.add([new Buffer(value)], function (err, res) {
            if (err || !res) return console.log(err);

            ipfs.object.get([res[0].path])
                .then(function (result) {
                    callback(null, res[0].path);
                })
                .catch(function (err) {
                    callback(null, err);
                })
        });

    }
};