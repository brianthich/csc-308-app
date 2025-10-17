import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

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
app.get("/users/:id", async (req, res) => {
  const id = req.params["id"];
  await userServices
    .findUserById(id)
    .then((result) => {
      if (result === undefined || result === null)
        res.status(404).send("Resource not found.");
      else res.send({ users_list: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error in the server");
    });
});

app.get("/users", async (req, res) => {
  const name = req.query["name"];
  const job = req.query["job"];
  await userServices
    .getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error in the server");
    });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Resource Methods
app.post("/users", async (req, res) => {
  const user = req.body;
  await userServices
    .addUser(user)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error in the server");
    });
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params["id"];
  await userServices.findUserById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send("Resource not found.");
      }
      return result.deleteOne()
        .then(() =>{
          res.status(204).send();
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("Error in the server");
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error in the server");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
