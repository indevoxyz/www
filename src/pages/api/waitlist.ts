export const prerender = false;
import type { APIRoute } from "astro";
import { db, Waitlist, eq } from "astro:db";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
      .where(eq(Waitlist.email, email))
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
      email,
    });

    const count = await db.select().from(Waitlist).all();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully joined the waitlist!",
        count: count.length,
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
    const waitlist = await db.select().from(Waitlist).all();

    return new Response(
      JSON.stringify({
        count: waitlist.length,
        waitlist: waitlist.map((entry) => ({
          id: entry.id,
          email: entry.email,
          createdAt: entry.createdAt,
          referrals: entry.referrals,
        })),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Waitlist fetch error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch waitlist." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
