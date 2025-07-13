import { defineDb, defineTable, column } from 'astro:db';

const Waitlist = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    email: column.text({ unique: true }),
    createdAt: column.date({ default: new Date() }),
    referrals: column.number({ default: 0 }),
    referredBy: column.text({ optional: true }),
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: {Waitlist}
});
