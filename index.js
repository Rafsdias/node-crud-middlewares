const express = require("express"); //Require faz import da dependência express

const server = express(); // Chamando a função do express

server.use(express.json()); //Para o express ler json no body da request

const users = ["Arley", "João", "Rafael"];

//Middleware Global
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method} URL:${req.url}`);

  next();

  console.timeEnd("Request");
});

//Middleware Local para verificar se existe o name no body da requisição
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User Name is required" });
  }
  return next();
}

//Middleware Local para verificar se o index que o usuário passar nos parâmetros retorna um user presente dentro do array de "users"
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
}

//Buscar todos os users
server.get("/users", (req, res) => {
  return res.json(users);
});

//Buscar user específico
server.get("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  return res.json(req.user);
});

//Criar novo user
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

//Editar user
server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

//Apagar user
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
