import { connection } from "next/server";
import { Suspense } from "react";

// The Keystatic admin is a client app; this marker just tells Next.js the route renders at request time.
async function RequestTime() {
  await connection();
  return null;
}

export default function Page() {
  return (
    <Suspense>
      <RequestTime />
    </Suspense>
  );
}

