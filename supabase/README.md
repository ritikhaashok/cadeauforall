Migration application instructions

Options to apply `supabase/sql/add_sizes_and_colors.sql` to your database:

1. Supabase Studio (recommended for quick testing)

   - Go to your Supabase project -> SQL Editor -> New Query
   - Paste the contents of `add_sizes_and_colors.sql` and Run

2. Supabase CLI (recommended for reproducible migrations)

   - Install: `npm i -g supabase` or follow Supabase docs
   - Initialize migrations in your repo (`supabase init`) if not already done
   - Create a migration file and copy contents, or run:
     `supabase db diff --file supabase/sql/add_sizes_and_colors.sql`
   - Apply migrations with:
     `supabase db push` or `supabase db migrate` depending on your workflow

3. psql / any SQL client
   - Get the connection string for the target database and run:
     `psql "<CONN_STR>" -f supabase/sql/add_sizes_and_colors.sql`

Safety notes:

- Always apply to local/dev first and validate your app behavior.
- Back up or snapshot production DB before running migrations on production.
- If you use Row Level Security, add/update policies for the new tables/columns.
- Test the new columns (e.g., adding cart items with size/color) before rolling out.
