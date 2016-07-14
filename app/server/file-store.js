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

        ipfs.block.get(file_id)
            .then(function (result) {

                let buff = '';

                result
                    .on('data', function (data) {
                        buff += data;
                    })
                    .on('end', function () {
                        callback(null, buff);
                    })
                ;

            })
            .catch(function (err) {
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