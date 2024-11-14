const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json(), cors());
app.use(express.static('dist'));

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('---');
    next();
}

app.use(requestLogger);

let notes = [
    {
        name: "Carlos Santana",
        number: "9876543210",
        id: "1"
    },
    {
        name: "Elena Garcia",
        number: "8765432109",
        id: "2"
    },
    {
        name: "Miguel Torres",
        number: "7654321098",
        id: "3"
    },
    {
        name: "Sofia Martinez",
        number: "6543210987",
        id: "4"
    },
    {
        name: "Luis Ramirez",
        number: "5432109876",
        id: "5"
    },
    {
        name: "Andrea Suarez",
        number: "4321098765",
        id: "6"
    },
    {
        name: "Gabriel Ortiz",
        number: "3210987654",
        id: "7"
    },
    {
        name: "Daniela Jimenez",
        number: "2109876543",
        id: "8"
    }
];

app.get('/', (req, res) => {
    res.send('<h1>API REST FROM NOTES</h1>');
})

app.get('/persons', (req, res) => {
    res.json(notes);
})

app.delete('/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter(n => n.id !== id);
    res.status(204).end();
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0;
    return maxId + 1;
}

app.post('/persons', (req, res) => {
    const body = req.body;
    if(!body.name || !body.number) {
        return res.status (400).json(
            {error: 'content missing'}
        )
    }
    const note = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    notes = [...notes, note];
    res.json(note);
})

app.put('/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    const note = notes.find(n => n.id === id);
    if (!note) {
        return res.status(404).json({ error: 'person not found' });
    }

    const updatedNote = {
        ...note,
        name: body.name,
        number: body.number
    };

    notes = notes.map(n => n.id !== id ? n : updatedNote);
    res.json(updatedNote);
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
console.log('Server running on port ' + port);

})

