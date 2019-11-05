const express = require('express')
const multer = require('multer')
const path = require('path')
const exec = require("child_process").exec;
const app = express()
const port = 8080


let script = "python test.py";
let file_dir = 'uploads/test';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

let storage_test = multer.diskStorage({
  destination:function(req, file, cb){
    cb(null, "uploads/test")
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }

})

let upload = multer({storage: storage})
let test = multer({storage:storage_test})


app.listen(port, (err) => {
  if (err){
    console.log(err)
    return
  }console.log(`Example app listening on port ${port}!`)})


app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/index.html')))
app.post('/', upload.single('myFile'), function(req, res, next){
console.log(req.file)})
app.post("/uploadmultiple", test.array('myFiles'), function(req, res, next){
  exec([script, file_dir].join(' '), function(err, stdout, stderr){
    if(err){
        console.log('Failed to run script')
    }
    if(stderr){
        console.log(stderr);
    }
    console.log(stdout);


});

})

 

