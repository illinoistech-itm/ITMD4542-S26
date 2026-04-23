import jwt from "jsonwebtoken";

let secret = "this-is-a-secret";
let token = jwt.sign({ foo: "bar", email: "bbailey4@iit.edu" }, secret);

console.log(token);

let decoded = jwt.verify(token, secret);

console.log(decoded);
