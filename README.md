# SADEE SOLUTIONS — Real Store + Admin

## What this includes
- Mobile-first storefront inspired by the uploaded marketplace video
- Product cards, product detail view and WhatsApp BUY NOW
- Admin login using Supabase Auth
- Product add/edit/delete
- Product photo upload to Supabase Storage
- Price, description, features, category, featured and active status editing
- Orders table
- Supabase database + RLS SQL

## Setup
1. Create/use your Supabase project.
2. Run `supabase.sql` in Supabase SQL Editor.
3. In Supabase Authentication > Users, create the admin email/password.
4. In SQL Editor run:
   `insert into public.admin_users(email) values ('YOUR_ADMIN_EMAIL');`
5. Edit `config.js` and put your project URL and browser-safe publishable/anon key.
6. Deploy the folder to GitHub Pages, Netlify, Vercel, or another static host.
7. Customer store: `/index.html`
8. Admin: `/admin/index.html`

WhatsApp orders open `+94 76 847 2404` automatically.
