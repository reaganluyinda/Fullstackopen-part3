const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

let persons = [];

app.use(express.json());
// app.use(morgan("tiny"));

//show static files from dist folder from the frontend build
app.use(express.static("dist"));

morgan.token("body", (request) => JSON.stringify(request.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

//GET request to fetch all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//GET request to fetch info
app.get("/api/info", (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  );
});

//GET request to fetch a person by ID
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

//route for delete request
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

//route for for adding new person

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const newPerson = {
    id: (Math.random() * 1000000).toFixed(0),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
