import express from "express";
const router = express.Router();

let todos = [{ text: "hello world", id: 0 }];
let idCounter = 1;

/* GET todos listing. */
router.get("/", function (req, res, next) {
  res.render("todos", { title: "Todos", todos: todos });
});

router.get("/add", function (req, res, next) {
  res.render("addtodo", { title: "Add a Todo" });
});

router.post("/add", function (req, res, next) {
  //console.log(req.body);
  if (req.body.todoin !== "") {
    todos.push({ text: req.body.todoin, id: idCounter });
    idCounter += 1;
    res.redirect("/todos");
  } else {
    res.render("addtodo", {
      msg: "Todo text can not be empty to add a todo!",
      title: "Add a Todo",
    });
  }
});

router.get("/delete/:id", function (req, res, next) {
  let todo = todos.find((aTodo) => aTodo.id === parseInt(req.params.id));
  res.render("deletetodo", { title: "Delete a Todo", todo: todo });
});

router.post("/delete/:id", function (req, res, next) {
  let filteredTodos = todos.filter(
    (aTodo) => aTodo.id !== parseInt(req.params.id),
  );
  todos = filteredTodos;
  res.redirect("/todos");
});

router.get("/edit/:id", function (req, res, next) {
  let id = Number(req.params.id);
  if (isNaN(id)) {
    res.redirect("/todos");
  }
  let todo = todos.find((aTodo) => aTodo.id === id);
  if (todo) {
    res.render("edittodo", { title: "Edit a Todo", todo: todo });
  } else {
    res.redirect("/todos");
  }
});

router.post("/edit/:id", function (req, res, next) {
  for (t in todos) {
    if (todos[t].id === parseInt(req.params.id)) {
      todos[t].text = req.body.todoin;
    }
  }
  res.redirect("/todos");
});

export default router;
