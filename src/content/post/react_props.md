---
title: "React Props vs State: What's the Difference?"
publishDate: "20 September 2023"
description: "Learn the difference between React props and state in an easy-to-understand way."
tags: ["react"]
---

When I was learning React, I found that understanding the difference between "props" and "state" can be a bit confusing for beginners. In this blog post, I want to share what I've learned in a way that's easy to grasp, with simple code examples, so that even beginners can begin to understand it.

**Props: Passing Data from Parent to Child**

Imagine a React component as a building block of your web application. Props (short for properties) are like the information or instructions you pass to each building block. They allow you to send data from a parent component to a child component. React's data flow between components is always uni-directional.

Here's an example of how data can be passed by using props:

```javascript
// Parent Component
function App() {
	return <ChildComponent name="John" age={30} />;
}

// Child Component
function ChildComponent(props) {
	return (
		<div>
			<p>Name: {props.name}</p>
			<p>Age: {props.age}</p>
		</div>
	);
}
```

In the example above, the `App` component is the parent component, and it passes data to the `ChildComponent` component using props. The `ChildComponent` component receives the data as an object called `props`.

**State: Managing Component-Specific Data**

While props are used for passing data from parent to child, state is used to manage data that can change over time within a component. Unlike props, state is managed within the component itself.

Here's an example of how state can be used in a component:

```javascript
function Counter() {
	const [count, setCount] = useState(0);

	function handleClick() {
		setCount(count + 1);
	}

	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={handleClick}>Increment</button>
		</div>
	);
}
```

In the example above, the `Counter` component uses the `useState` hook to manage its own state. The `count` variable is initialized to 0, and the `setCount` function is used to update the `count` variable when the button is clicked.

**Differences Between Props and State**

Here are the key differences between props and state:

- **Ownership**: Props are owned by the parent component and passed down to child components, while state is owned and managed within the component itself.
- **Mutability**: Props are immutable, meaning they cannot be changed by the child component. State, on the other hand, can be changed using the `setState` function.
- **Usage**: Props are used to pass data from parent to child components, while state is used to manage data that can change over time within a component.

In summary, props and state are both important concepts in React. Props are used to pass data from parent to child components, while state is used to manage data that can change over time within a component. Understanding the differences between props and state is crucial for building React applications.
