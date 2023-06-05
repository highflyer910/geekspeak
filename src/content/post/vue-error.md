---
title: "How I Fixed 404 Errors in My Vue Project Deployed on Netlify"
publishDate: "5 June 2023"
description: "How to fix a 404 error in Vue application"
tags: ["vue", "netlify", "error"]
---

Recently, I ran into an issue when deploying my Vue project on Netlify. Everything worked perfectly fine on my local environment, but when I tried to access the pages directly through their URLs (e.g. `https://example.com/about`), I got 404 errors. After some research and experimentation, I found two solutions that worked for me.

**Solution 1**: Configure Netlify Server to Redirect Requests to Index.html

The first solution involves configuring the Netlify server to redirect all requests to the `index.html` file. This is necessary because when using Vue's client-side routing with HTML5 history mode, the app relies on the browser's history API to handle navigation and URL updates. However, when the app is deployed on a static host like Netlify, the server will not be able to handle these client-side routes properly.

To redirect all requests to the `index.html` file, you can add a `_redirects` file to the root of your Netlify project with the following contents:

```
/*    /index.html   200
```

This tells Netlify to redirect all requests to the `index.html` file. This way, your Vue app's router will handle the routing and serve the appropriate pages.

**Solution 2**: Configure Netlify with netlify.toml
The second solution involves configuring your Vue app using the `netlify.toml` file. This file allows you to customize various settings for your Vue project on Netlify.

Here's an example configuration that you can use:

```
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

In this configuration, the `[[redirects]]` section specifies a redirect rule that tells Netlify to redirect all requests to the `index.html` file.

Customize this configuration based on your project's specific requirements. For example, if you need to set up additional redirect rules or other settings, you can add them to the `[[redirects]]` section or other appropriate sections of the `netlify.toml` file.

Once you have created the `netlify.toml` file, make sure to commit it to your project's repository and push it to your Netlify site. Netlify will automatically detect the `netlify.toml` file and use it to configure your site.

I hope you find these solutions helpful. Good luck!
