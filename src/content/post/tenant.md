---
title: "Single-tenant vs Multi-tenant: What I Wish I Knew When I Started"
publishDate: "16 October 2025"
description: "Understanding the pros and cons of single-tenant and multi-tenant architectures"
tags: ["cloud", "architecture", "SaaS"]
---
I should be coding right now, but instead, I went down the single-tenant vs multi-tenant rabbit hole. Then I got lost in videos, articles, and posts that all said different things.

One person says multi-tenant is the only way to scale. Another says single-tenant is the only way to be secure. And someone always warns: “If you choose wrong, your SaaS will fail.”

It’s really not that serious. I just wanted a simple explanation without all the technical words and drama. So here’s the version I wish I had read earlier.

---

**TL;DR**

* **Multi-Tenant (Apartments):** Cheaper, easier to update, and perfect when you’re starting.
* **Single-Tenant (Houses):** Private, secure, and flexible, but expensive and hard to maintain.
* **Hybrid (Schema-per-Tenant):** Each tenant has its own schema in the same database. It’s more complex but gives better separation.
* **Security:** Multi-tenant apps must have strong data separation. One missing ``WHERE`` clause can leak data.

If you’re building your first SaaS, multi-tenant is usually the better choice.

---

### The Analogy (Houses vs. Apartments)

**Single-Tenant = Everyone Has Their Own House**

Each customer has a private house, their own driveway, kitchen, and mailbox. In SaaS, that means a separate app and database for each one.

**Advantages:**

* **Very secure:** If one house is broken into, others are safe.
* **Easy to customize:** You can change things for one client without affecting others.
* **No noisy neighbors:** No performance issues between users.

**Disadvantages:**

* **Expensive:** More infrastructure means higher costs (servers, databases, monitoring)
* **Hard to update:** You must update each app separately.
* **More maintenance:** fixing one problem often means fixing it many times.

**When to use it:**

- When you work with enterprise clients who specifically ask for it.
- If you’re in a highly regulated industry (healthcare, finance, etc.) that needs strong compliance (HIPAA, SOC 2, and so on).
- When your users want custom deployments or on-premise hosting.
- If you actually have funding or a big budget to handle the extra infrastructure.

**Multi-Tenant = One Big Apartment Building**

Everyone lives in the same building, but each apartment has a lock. In SaaS, it means one app and one database, but data is separated by tenant IDs.

**Advantages:**

* **Much cheaper:** Resources are shared.
* **Easier to update:** One update affects all tenants.
* **Simple to add new tenants:** New signups are just new rows in your database.

**Disadvantages:**

* **Security must be perfect:** one small mistake can expose another tenant’s data.
* **The "noisy neighbor" problem:**: A heavy user can slow down others.
* **Harder to customize:** Individual tenant customizations are more complex
* **More complex queries:** Every query needs tenant filtering logic

**When to use it:**

- You're bootstrapping or indie hacking
- You want to launch and iterate fast
- Your users have similar needs (same features, pricing tiers)
- You're using modern frameworks with built-in tenant isolation

**Schema-per-Tenant = Separate Floors in the Same Building**

One database server, but each tenant gets their own schema (namespace).

**How it works:**

- Each tenant has tables like ``tenant_123.users``, ``tenant_123.orders``
- Your app switches schemas based on who's logged in
- Better separation than row-level filtering, cheaper than separate databases

**Advantages:**

- Better isolation than pure multi-tenant
- Easier to backup/restore individual tenants
- Still cheaper than full single-tenant
- Can migrate specific tenants to their own database later

**Disadvantages:**

- More complex than simple multi-tenant
- Some ORMs don't handle this well
- Database connection pooling gets trickier
- Migration scripts need to run on all schemas

**Popular tools:**

- **Django:** django-tenants (formerly django-tenant-schemas)
- **Node.js:** Knex.js with schema switching, or Prisma with multi-schema support
- **Ruby on Rails:** Apartment gem
- **Postgres:** Built-in schema support
---

### Security (The Scary Part)

Multi-tenant security means more than just adding a ``tenant_id`` column.

**Three Levels of Protection:**

1. **Database:** Use row-level security or tenant views.
2. **Application:** Always filter queries by tenant.
3. **API:** Make sure tokens connect users to the right tenant.

**Common mistakes:**
- Forgetting `WHERE tenant_id = ?` → Instant data leak
- Wrong JWT token → Can access another tenant's data
- Admin panels that bypass tenant filters → Privacy nightmare
- Sharing caches across tenants → Information disclosure

**Tools That Help:**

- **Supabase:** Built-in RLS, auth hooks, and tenant isolation patterns
- **Prisma:** Row-level security middleware and tenant filtering
- **PostgREST:** API that enforces Postgres RLS automatically
- **Django Tenants:** Mature library for schema-per-tenant in Django
- **PlanetScale:** Database branching makes tenant testing easier

**Security Best Practices:**

- Use Postgres RLS as your backup layer
- Choose an ORM that enforces tenant filtering by default
- Include tenant_id in all JWT tokens
- Create separate admin roles with explicit permissions
- Test with multiple tenants in every environment
- Log all cross-tenant access attempts
- Use database-level constraints where possible

---

### Why I chose multi-tenant

1. **I'm bootstrapping.** Single-tenant would be too expensive
2. **My users don't need custom setups.**
3. **I want to move fast.** One update for all tenants
4. **I can always switch later** Big clients could get single-tenant setups.

---

### What Should You Do?

**Go multi-tenant if:**
* You're bootstrapping or self-funded.
* You want to launch fast.
* Your users have similar needs.
* You don’t deal with heavy security rules.
* Infrastructure costs matter

**Go Schema-per-Tenant If:**
* You want better isolation than pure multi-tenant
* You plan to offer data export/backup per tenant
* You might need to migrate large clients later
* Your users have moderately different needs
* You're okay with more complex migrations

**Go single-tenant if:**
* You work with enterprise clients.
* You have funding for infrastructure.
* You need strict data separation.
* You offer custom setups.
* Clients demand it (and pay for it)

### Final Thoughts

I spent too much time reading about this when I should have been coding.

Big SaaS companies like Notion, Vercel, Shopify, and Zoom also started simple and are still multi-tenant. Slack started multi-tenant, now hybrid.

The real problem isn’t “choosing wrong”, it’s never launching at all.

Many companies eventually use both: multi-tenant for most users and single-tenant for large clients like Stripe or GitHub.

If you’re still deciding, start simple. Build, launch, and learn. You can always improve later.