const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const port = 3002

app.use(cors())
app.use(express.static('web'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/web/index.html'))
})

app.get('/videos', function (req, res) {
    var videos_path = path.join(__dirname, '/web/videos')

    // retrieve list of video names
    fs.readdir(videos_path, function(err, items) {
        // to omit hidden files
        items = items.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))
        res.send(items)
    })
})

app.get('/dash-player', function (req, res) {
    // res.sendFile(path.join(__dirname + '/web/dash-client/dash-player-basic.html'))
    // res.sendFile(path.join(__dirname + '/web/dash-client/dash-player-custom-abr.html'))
    
    // final player
    res.sendFile(path.join(__dirname + '/web/dash-client/dash-player-monitoring.html'))
})

app.listen(port, () => console.log(`Sample Server listening on port ${port}!`))