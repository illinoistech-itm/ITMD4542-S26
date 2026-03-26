// Route handlers live in route.ts files (not page.tsx).
// This file creates a GET endpoint at /api/todos.
// Visit /api/todos in the browser to see the raw JSON response.
export async function GET() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/");
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "error message" }, { status: 500 });
  }
}
