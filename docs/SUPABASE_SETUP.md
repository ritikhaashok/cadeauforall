# Supabase Setup

1. Create a new Supabase project: https://app.supabase.com/

   - Note your project **URL** and **anon key** (and service role key for server-only operations).

2. In the Supabase dashboard go to Database → SQL Editor and run `supabase/sql/initial_schema.sql` from this repo (copy & paste the contents).

3. Optionally, open the Table Editor (Studio) to edit the seeded products and testimonials visually.

4. Add environment variables locally:

   - Copy `.env.example` to `.env.local` and set `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

5. Install the client library in the project:

   - `npm install @supabase/supabase-js`

6. You can fetch products server-side from `src/lib/supabaseClient.js`:

```js
import { supabase } from "@/lib/supabaseClient";

export default async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, currency")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
```

7. To add RLS policies or allow signed-in users to modify their cart, use Supabase policies and the service role key for server-side-only operations.

8. I created a `.env.local` file for you with the `SUPABASE_URL` and `SUPABASE_ANON_KEY` you provided so your local app can connect immediately. **Do not commit `.env.local` to version control** — it is already ignored by the repository's `.gitignore` (env files are excluded).

9. Contact submissions table and storage (optional but recommended)

   - Run `supabase/sql/create_contact_submissions.sql` in the Supabase SQL Editor to create the `contact_submissions` table where phone numbers, optional descriptions, image URLs, and timestamps will be stored.

   - Create a Storage bucket named `contact-uploads` in Supabase Studio (Storage → Create new bucket). To make uploaded images publicly accessible, set the bucket to **public**.

   - Once the table and bucket exist, the contact form will upload images to `contact-uploads` and insert a row into `contact_submissions` automatically. If the bucket is missing or upload fails, the server falls back to saving the uploaded file locally under `public/uploads` and still inserts a local path into the database.

If you want, I can also set up server-only secrets (for example, `SUPABASE_SERVICE_ROLE_KEY`) in your production environment and add recommended RLS policies; tell me if you'd like me to continue with RLS and cart APIs.
