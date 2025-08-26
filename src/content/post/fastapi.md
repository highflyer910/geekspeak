---
title: "Deploy Your FastAPI App on Vercel: The Complete Guide"
publishDate: "12 July 2025"
description: "Learn how to deploy your fastAPI application on Vercel with this step-by-step guide."
tags: ["FastAPI", "Vercel", "Deployment"]
---

So I was working on this FastAPI project last week and needed to deploy it somewhere. I tried a few different platforms, but Vercel turned out to be simple, much easier than I expected!

**What You Need**

Just basic stuff:

- Your FastAPI app(obviously)
- GitHub account
- Vercel account

That's it. No need for complicated server setup or Docker stuff.

**Getting Your App Ready**

First, make sure your FastAPI app is working. Here's my simple example:

```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Look Ma, I'm deployed!"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
```

Pretty straightforward, right?

**Requirements File**

You need a `requirements.txt` file so Vercel knows what packages to install:

```txt
fastapi==0.104.1
uvicorn==0.24.0
```

Important: Always pin your versions! Trust me, I learned this the hard way when my app broke because of package updates.

**Vercel configuration**

This part is a bit tricky, but not too bad. Create a `vercel.json` file in your project root:

```json
{
	"version": 2,
	"builds": [
		{
			"src": "main.py",
			"use": "@vercel/python"
		}
	],
	"routes": [
		{
			"src": "/(.*)",
			"dest": "main.py"
		}
	]
}
```

This tells Vercel, "hey, this is a Python app, run it like this".

**Small change needed**

Vercel works with ASGI apps (FastAPI is ASGI), but you need to add this:

```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World from FastAPI on Vercel!"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# This is important for Vercel
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Push to GitHub**

Get your code on GitHub:

```bash
git init
git add .
git commit -m "Initial FastAPI app"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

**Deploy time!**

Now the fun part:

1. Go to the Vercel dashboard
2. Click "New Project"
3. Connect your GitHub repo
4. Vercel detects it's Python automatically
5. Click "Deploy"

And... that's it! No server configuration, no SSL certificates, nothing complicated.

**Using CLI instead**

If you prefer the command line (like me):

```bash
# Install Vercel CLI
npm install -g vercel

# Log in via CLI
vercel login

# Deploy
vercel
```

Three commands and you're done!

**Auto-deployment with GitHub Actions**

Want to deploy automatically when you push code? Here's the workflow file:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v3
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Testing your deployment**

After deployment, check these URLs:

- `https://your-app.vercel.app/` - Main page
- `https://your-app.vercel.app/api/health` - Health check
- `https://your-app.vercel.app/docs` - FastAPI docs (this is a cool feature!)

**Things I learned (the hard way)**

- Vercel gives you HTTPS automatically - no need to worry about certificates
- Environment variables are easy to add in the Vercel dashboard
- Every push to main branch = new deployment
- Use `/api` prefix for your routes. Vercel likes it better, especially when you have frontend + backend together

**When something breaks**
Don't worry, it happens to everyone:

1. Check build logs in the Vercel dashboard - they usually show what's wrong
2. Look at your `requirements.txt`, missing packages cause most problems
3. Verify your `vercel.json` configuration
4. Test locally first. If it doesn't work on your computer, it won't work on Vercel

**Final thoughts**

That's it! Your FastAPI app is now running on Vercel's servers worldwide. No need to manage servers or worry about hosting costs (unless you become popular, but that's a good problem to have 😄).
The whole process takes maybe 10-15 minutes once you know what you're doing. Pretty good for getting your API online, I think!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/H2H7DIE8I)
