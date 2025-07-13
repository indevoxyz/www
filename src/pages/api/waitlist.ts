export const prerender = false;
import type { APIRoute } from "astro";
import { db, Waitlist, eq, sql } from "astro:db";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const existingUser = await db
      .select()
      .from(Waitlist)
      .where(eq(Waitlist.email, email.toLowerCase()))
      .get();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "You're already on the waitlist!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await db.insert(Waitlist).values({
      email: email.toLowerCase(),
    });

    const countResult = await db
      .select({ count: sql`count(*)` })
      .from(Waitlist)
      .get();
    const count = countResult?.count ?? 0;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully joined the waitlist!",
        count: count,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Waitlist error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const GET: APIRoute = async () => {
  try {
    const countResult = await db
      .select({ count: sql`count(*)` })
      .from(Waitlist)
      .get();
    const count = countResult?.count ?? 0;

    return new Response(
      JSON.stringify({
        count: count,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Waitlist fetch error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch waitlist count." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
