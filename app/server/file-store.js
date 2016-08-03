var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI({host: 'localhost', port: '5001', procotol: 'http'});

module.exports = {

    /**
     * Read from file
     *
     * @param file_id
     * @param callback
     */
    readFromFile: function (file_id, callback) {

        console.log("ipfs : read from file " + file_id);

        ipfs.block.get(file_id)
            .then(function (result) {

                console.log("ipfs : read successful");

                let buff = '';

                result
                    .on('data', function (data) {
                        buff += data;
                    })
                    .on('end', function () {
                        console.log("ipfs : file data " + buff);

                        callback(null, buff);
                    })
                ;

            })
            .catch(function (err) {
                console.log("ipfs : read error " + err);

                if (err.code == 'ECONNREFUSED') {
                    err.message = "Failed to connect to IPFS";
                }

                callback(err, null);
            })
    },

    /**
     *
     * @param value
     * @param callback
     */
    storeValue: function (value, callback) {

        ipfs.block.put(new Buffer(value), function (err, res) {
            var key = res.Key;

            if (err || !res) {
                callback(err, null);
            }
            else {
                callback(null, key);
            }
        });
    }
};