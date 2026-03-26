import Link from "next/link";

export default function About() {
  return (
    <div className="flex-1 flex items-start justify-center">
      <h1 className="text-4xl font-bold">About Page</h1>
      <Link href="/" className="ml-4 text-blue-500 hover:underline">
        {" "}
        Go back to Home
      </Link>
    </div>
  );
}
