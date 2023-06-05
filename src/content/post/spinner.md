---
title: "Vue.js Gallery Page: Creating a Custom Loader for Better User Experience"
publishDate: "12 May 2023"
description: "How to create a custom loader in Vue application"
tags: ["vue", "loader", "custom"]
---

I was building a Vue app (using the options API) with a gallery page that fetched photos from an API when I found myself struggling with the issue of how to display a loading animation while the photos were loading.

At first, I tried using a simple CSS spinner, but I quickly realized that I wanted more control over that. I then explored using a pre-built library, but while Vue Suspense seemed like a powerful tool, I decided not to use it due to its experimental status.

Finally, I came across a solution that worked perfectly for my needs: creating a custom Vue component to display the spinner. By creating a separate component, I was able to encapsulate the spinner logic and easily reuse it across my app.

I started by creating a new component called **`GalleryLoader.vue`** and adding the spinner code to the template.

![Vue Component Code](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uh89pcr0k0i1vuax7r3q.png)
In my gallery page, I imported the GalleryLoader component and added it to the template with the **`loading`** set to true. Then, in the mounted lifecycle hook, I made the API request to fetch the photos and set the **`loading`** property to false when the photos were loaded.

![Vue.js Code](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kts7wxbvnczxn59oiefr.png)
In this example, the **`GalleryLoader`** component will only be displayed when the **`loading`** is true. When the gallery data is fetched and loaded, the **`loading`** is set to false and the **`GalleryLoader`** component will be hidden.

Using this approach, I was able to create a customizable and reusable spinner component that worked perfectly for my gallery page. By encapsulating the spinner logic in a separate component, I was able to keep my gallery page clean and easy to read, while also improving the user experience by providing feedback during the photo-loading process.

If you're struggling with the same issue, I highly recommend giving the custom component approach a try. Though the best approach will depend on your specific needs and preferences.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/H2H7DIE8I)
