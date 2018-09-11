//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('redis').createClient("redis://h:pdaa6da9b365ac950be600939997c4add73743bbdb1252f740a26c52affbfbb20@ec2-52-202-245-120.compute-1.amazonaws.com:8009");

// define the Express app
const app = express();

// the database
const questions = [];

// enhance your app security with Helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

db.on("error", function (err) {
    console.log("Error " + err);
});

app.get('/', (req, res) => {
    db.lrange(["players", 0, 100], (err, reply) => {
        const players = reply.map(player => JSON.parse(player));
        res.send(players);
    });
});


// get a specific question
app.get('/:id', (req, res) => {
    db.lrange(["players", 0, 100], (err, reply) => {
        const players = reply.map(player => JSON.parse(player));
        const player = players.filter(q => (q.id === parseInt(req.params.id)));
        if (player.length > 1) return res.status(500).send();
        if (player.length === 0) return res.status(404).send();
        res.send(player[0]);
    });
});

// insert a new question
app.post('/', (req, res) => {
    console.log(req.body);
    const {name, photo, position} = req.body;
    console.log(name, photo, position, req.body);
    db.llen("players", (err, playerCount) => {
        const newPlayer = {
            id: playerCount + 1,
            name,
            playing: false,
            photo,
            position
        };

        db.lpush(["players", JSON.stringify(newPlayer)]);
        res.status(200).send();
    });

});

// insert a new answer to a question
app.post('/answer/:id', (req, res) => {
    const {answer} = req.body;

    const question = questions.filter(q => (q.id === parseInt(req.params.id)));
    if (question.length > 1) return res.status(500).send();
    if (question.length === 0) return res.status(404).send();

    question[0].answers.push({
        answer,
    });

    res.status(200).send();
});

// start the server
app.listen(8081, () => {
    console.log('listening on port 8081');
});

