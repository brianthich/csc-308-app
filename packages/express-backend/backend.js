import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

// Search Methods
const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserById = (id) => {
  return users["users_list"].find((user) => user["id"] === id);
};

const findUserByNameJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

// User Changes
const addUser = (user) => {
  user.id = getRandomID();
  users["users_list"].push(user);
  return user;
};

function getRandomID() {
  let letters = "";
  let numbers = "";
  for (let i = 0; i < 3; i++) {
   letters += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
   numbers += Math.floor(Math.random() * 10);
  }
  return letters + numbers;
} 

// Get Resource Methods
app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } 
  else {
    res.send(result);
  }
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job != undefined) {
    let result = findUserByNameJob(name, job);
    result = { users_list: result };
    res.send(result);
  } 
  else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } 
  else {
    res.send(users);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Resource Methods
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const newUser = addUser(userToAdd);
  res.status(201).json(newUser);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } 
  else {
    users["users_list"] = users["users_list"].filter((user) => user["id"] !== id);
    res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
