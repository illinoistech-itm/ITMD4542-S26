// const { randomInt, randomUUID } = await import("node:crypto");
import { randomInt, randomUUID } from "node:crypto";

console.log(randomInt(0, 10));
console.log(randomUUID());
