---
title: "I Thought My Backups Were Safe - Until I Tried Restoring One"
publishDate: "6 October 2025"
description: "Let's dive deeper into backup strategies and restoration processes"
tags: ["backup", "restoration", "data_recovery"]
---
Imagine this: you wake up one morning, open your app, and something's wrong. Your database is gone. Your files are corrupted. Or a simple bug deleted everything clean.

You breathe a little easier because you have backups, right? Except… when you try to restore them, they don't work.
They're empty. Or the format is broken. Or restoring takes forever.

That's the painful truth I learned recently:
**A backup is worthless until you've restored it.**

## My Wake-Up Call

Last month, I was refactoring my side project's database schema.
Something went wrong during migration, and I corrupted my SQLite database.

No problem, I thought, I will just restore my weekly backup.
But when I tried, the backup file was also corrupted.
Later I found out I had been copying the database while the app was still running, catching it middle of writing.
So my “backup system” was creating broken files for weeks, and I didn’t know because I never tested restoring one.

I was lucky it was only dev data, but it scared me.
If that had been production?
If that had been production, I could have lost real users’ data, their work, and my project’s reputation.

## What I Learned About Backups While Building Side Projects

Before this, I thought backups were just a checklist: make a copy, sleep peacefully.
But a backup is not magic protection.
It’s just a copy of important things:

- 🧠 **Your codebase** - GitHub or GitLab usually handle this
- 🗄️ **Your database** - Postgres, MySQL, Supabase, Firebase, SQLite…  
- 🖼️ **User files** - images, uploads, documents  
- 🔐 **Configs & secrets** - the `.env` file, API keys, deployment settings 

The real problem:
You don't know if those backups are good until you test restoring them.
Otherwise, it’s like having an emergency plan locked in a drawer.

## How Bigger Teams Handle It

I checked how bigger companies do backups.
**GitLab**, for example, runs restore tests every day and tracks success rates.
**Basecamp** even does “disaster tests,” pretending their main datacenter disappears.

Usually, their process looks like this:
1. Make backups automatically (nightly dumps, snapshots, etc)  
2. Restore them into a test environment (not production)  
3. Check if everything works: database starts, files open, users can log in
4. Get alerts when something fails
5. Simulate disasters to see how fast they can recover
Then I realized:  
I don't need a datacenter, just a smaller version that fits my side project setup.

And actually, many platforms like Supabase, Neon, and Vercel Postgres now have **point-in-time recovery (PITR)** built in. Sometimes even free. So before you create your own backup scripts, check your dashboard first.

### 🧠 What to Back Up

| Type | Backup Method | Test Method |
|------|----------------|-------------|
| **Code** | Push to GitHub/GitLab (with 2FA!) | Clone repo to a fresh folder: `git clone <repo> test-restore && cd test-restore && npm install && npm run dev` |
| **Database** | • SQLite: `sqlite3 mydb.db ".backup backup.db"`<br>• Postgres: `pg_dump mydb > backup.sql`<br>• Managed DBs: Use built-in exports or PITR | Restore to test DB: `sqlite3 test.db < backup.sql` then run a query to verify data. For Supabase/Neon, use their one-click export + local restore. |
| **User Files** | Store in **Backblaze B2**, **S3**, or **Google Cloud Storage** (all offer free tiers). Avoid consumer Dropbox for production data. | Download 3–5 random files monthly and verify they open. Bonus: enable **object lock** or **versioning** to prevent accidental deletion. |
| **Configs & Secrets** | Store in a **password manager** (1Password, Bitwarden) or **encrypted offline vault** (VeraCrypt). **Never in Git—even private repos!** | Run project locally using only saved configs. Use GitHub Secrets or `.env.vault` for CI/CD, not raw `.env` files. |

⚠️ *Important SQLite Tip:*
** Copying a live `.db` file can damage it. Use `.backup` or `VACUUM INTO`:  
 ```bash
 sqlite3 mydb.db "VACUUM INTO backup.db"
 ```
This creates a clean, safe copy even while your app is running.
💡 *Pro tip:* Automate your test restore with a small script:
For example:
```bash
#!/bin/bash
   set -e  # Exit on any error
   rm -f test.db
   sqlite3 test.db ".read latest_backup.sql"
   sqlite3 test.db "SELECT count(*) FROM users;"
   echo "✅ Restore test passed!"
```
You can even run it weekly on GitHub Actions, if it fails, you’ll get an alert.

### ⏰ When to Test

**Monthly (15–30 minutes)**
- Restore one random backup locally  
- Download a few random user files
- Write down anything strange or failed

**Quarterly (1–2 hours)**
- Full local restore: DB + files + app
- Time it - how long does recovery take?
- Update your notes

**Yearly (half day)**
- Pretend your laptop died  
- Can you restore *everything* from your backups and docs?  
- It’s a great test for your memory and process.

⚠️ *Privacy reminder:* 
``If your app stores user data, make sure backups are encrypted at rest.
Most cloud providers do this by default.
And never keep plain emails or passwords in backups.``

## Why It Matters

It’s easy to think backups are only for big companies.
But if you're building side projects or working solo, losing data can kill your project one day. Users won’t wait while you say, *“Oops, I thought I had backups.”*
Now, backups aren’t about peace of mind when I make them;
They’re about peace of mind when I **restore** them.
Because backups aren’t about paranoia, they’re about love for your future self. ❤️