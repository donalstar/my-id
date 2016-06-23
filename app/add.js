
'use strict'

const ipfs = require('ipfs-api')('localhost', 5001)

const f1 = 'Hello'
const f2 = 'World'

//ipfs.files.add()
//
//  .then(function (id) {
//    console.log('my id is: ', id)
//  })
//  .catch(function(err) {
//    console.log('Fail: ', err)
//  })

ipfs.files.add([new Buffer(f1), new Buffer(f2)], function (err, res) {
  if (err || !res) return console.log(err)

    console.log("HASH " + res[0].path);

  for (let i = 0; i < res.length; i++) {
    console.log(res[i])
  }
})

//ipfs.add(['./files/hello.txt', './files/ipfs.txt'], function (err, res) {
//  if (err || !res) return console.log(err)
//
//  for (let i = 0; i < res.length; i++) {
//    console.log(res[i])
//  }
//})