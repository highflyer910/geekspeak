---
title: "Smooth Page Transitions with Zero Libraries: The View Transitions API"
publishDate: "11 November 2025"
description: "Learn how to implement smooth page transitions in your web apps using the native View Transitions API without relying on external libraries."
tags: ["Web Development", "Frontend", "View Transitions API"]
---
I recently started using the View Transitions API in one of my projects, and honestly, it felt like unlocking a hidden superpower for the web. I had to share it.

Not long ago, this API was just a Chrome experiment. But as of 2025, it’s officially everywhere, supported in Chrome, Edge, Safari, and Firefox, covering over 85% of browsers. It’s now powering everything from e-commerce sites to dashboards and blogs, making transitions feel native and seamless.

Here’s what I’ve learned using it, and why you’ll probably want to add it to your toolkit too.

### What Is the View Transitions API?

The View Transitions API animates between two page states, toggling a UI mode, opening a modal, or moving between pages. It works whether you're updating part of a page or navigating between entirely different pages.

The trick: give an element the same `view-transition-name` before and after the update. The browser retains the element’s identity and morphs it, automatically handling position, size, and content blending.

No libraries. No keyframes. Just native transitions that are easy to use.

### The Core Pattern (Only 3 Steps!)

To apply a transition to an in-page element (like a card changing from a grid to a list view):

**1. Name your element in CSS**

```css
.content.active {
  view-transition-name: main-content;
}
```

**2. Keep your element in the DOM (toggle its state)**

```html
<div class="content card-view active">Card content</div>
```

**3. Wrap your state change in `startViewTransition()`**

```JS
document.startViewTransition(() => {
  // Toggle state - the element keeps the same view-transition-name
  content.classList.toggle('card-view');
  content.classList.toggle('grid-view');
});
```

**That's it! The browser handles the animation.**
💡 Tip: Avoid using `element.innerHTML = '...'` or re-rendering components that replace the DOM completely, which breaks the element’s identity and stops the smooth transition.
Instead, just toggle classes or, if you’re using a framework like React, make sure elements keep stable keys so the DOM node stays the same.

### See It in Action
I built a small SPA demo to test how smooth the View Transitions API can be. It uses directional animations and custom effects, and honestly, it feels surprisingly close to a native app.

Pages slide left and right, hero sections move up and down, and the back button even reverses the animation automatically.

👉 **[View Live Demo on CodePen](https://codepen.io/HighFlyer910/pen/WbwebvQ)**

Try it yourself:
- Click between pages to see forward animations (slides right-to-left)
- Use the back button to see reverse animations (slide left to right)
- Watch the hero section move up and down on its own
- Open DevTools and inspect the ``::view-transition-*`` pseudo-elements to see how the browser does it!

### Advanced Technique #1: Directional Back Navigation
Want your back button to slide the other way? Here’s how to make your SPA navigation feel more like a native app:

**The JavaScript**
We listen for the popstate event (which fires on back/forward navigation) and briefly add a class to the root element to trigger reverse animations.
```JS
function handlePopState(e) {
  const page = e.state?.page || 'home';
  
  if (document.startViewTransition) {
    // Add class to trigger reverse animations
    document.documentElement.classList.add('back-transition');
    
    document.startViewTransition(() => {
      renderPage(page, false);
    }).finished.then(() => {
      // Clean up after animation completes
      document.documentElement.classList.remove('back-transition');
    });
  } else {
    renderPage(page, false);
  }
}

window.addEventListener('popstate', handlePopState);
```
**The CSS**
We target the global transition, which is automatically assigned the name root.
```css
/* Forward navigation (default) */
::view-transition-old(root) {
  animation: 0.3s ease-in both slide-to-left;
}

::view-transition-new(root) {
  animation: 0.3s ease-out both slide-from-right;
}

/* Reverse navigation (back button) */
.back-transition ::view-transition-old(root) {
  animation: 0.3s ease-in both slide-to-right; 
}

.back-transition ::view-transition-new(root) {
  animation: 0.3s ease-out both slide-from-left;
}
```
This creates that iOS/Android feeling where navigation direction matches user intent!

### Advanced Technique #2: Custom Animations for Specific Elements

You can animate different parts of the page independently using named transitions.
For example, while your main content slides horizontally, a hero section can move vertically or fade, and the browser syncs it all perfectly for you.

**Hero Section with Vertical Slide**
```css
.hero {
  view-transition-name: hero;
}

::view-transition-old(hero) {
  animation: 0.3s ease-in both slide-down-out;
}

::view-transition-new(hero) {
  animation: 0.3s 0.1s ease-out both slide-up-in; 
}

@keyframes slide-down-out {
  to { opacity: 0; transform: translateY(40px); }
}

@keyframes slide-up-in {
  from { opacity: 0; transform: translateY(40px); }
}
```
The result? A smooth motion where each element moves on its own but still feels perfectly connected, just like a well-crafted native app.

### When to Use It (and When Not To)

Great for:
- Toggling states (like dark mode or list ↔ grid views)
- Page navigation in SPAs
- Opening modals or dialogs
- Simple UI transitions that need a touch of polish
Skip it for:
- Complex, multi-step animations (GSAP or Framer Motion are better here)
- Situations that need precise timing across many elements
- Critical interactions where you need guaranteed fallback behavior
**Accessibility Tip:**
Always respect ``prefers-reduced-motion``, as some users are sensitive to motion, and fast transitions can make them uncomfortable.

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    /* Instantly complete the animation */
    animation-duration: 0.01ms; 
    animation: none !important;
  }
}
```

**Minimal Fallback (Just in Case)**
While browser support is excellent, a tiny fallback never hurts:

```JS
if (document.startViewTransition) {
  document.startViewTransition(updateDOM);
} else {
  updateDOM(); // instant update
}
```
You can also use CSS ``@supports`` to provide a subtle ``transition`` fallback for older browsers:
```css
@supports not (view-transition-name: test) {
  .content { 
    transition: opacity 0.2s; 
  }
}
```

### Final Thoughts

The View Transitions API is a surprisingly powerful tool that can turn clunky page changes into smooth, polished experiences, with minimal code.

Directional transitions and custom element animations let your web app feel closer to a native app, all with just vanilla CSS and JS.

So next time you update a view, just give it a `view-transition-name`.
It’s that simple, and the page instantly feels smoother.