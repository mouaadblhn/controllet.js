<h1 align="center">
    <strong>Controllet.js</strong>
</h1>

<p align="center">
    Easy form validation for a better user experience ⚡
</p>

<div align="center">

[Introduction](#introduction) •
[Features](#features) •
[Getting Started](#getting-started) •
[Documentation](#documentation) •
[Examples](#examples) •
[License](#license)

</div>

<br />

## Introduction

Introducing Controllet.js, a lightweight JavaScript library crafted specifically for seamless form validation. It offers an uncomplicated approach to validate form inputs, displaying error messages, and customizing the user experience.

## Features

- **Input Validation:** Perform common input validations such as required fields, minimum and maximum lengths, numeric ranges, and custom pattern matching.
- **Real-time Feedback:** Get instant feedback as users interact with the form.
- **Custom Validators:** Easily integrate custom validation logic for specific input fields.
- **Automatic Error Messages:** Display error messages in the user's preferred language using automatic language detection.
- **Default Values:** Set default values for form fields.
- **Watch Feature:** Observe changes in specific fields.
- **Success Messages:** Optionally display success messages when certain conditions for an input field are met.
- **Input Modifiers:** Modify the submitted values of inputs before form submission.
- **Dynamic Language Support:** Support multiple languages for error messages with a simple configuration.

## Getting Started

To integrate Controllet into your project, you can include the minified library file `controllet.min.js` available in the `dist` folder. Simply download the file and include it in your HTML file:

```html
<script src="path/to/controllet.min.js"></script>
```

### Initialize Controllet

```js
const formElement = document.getElementById("yourFormId");
const controllet = new Controllet({
  formElement,
  // Add your custom configuration options here
});
```

### Custom Validators

```js
const formElement = document.getElementById("yourFormId");
const controllet = new Controllet({
  formElement,
  username: {
    override: true,
    validations: [
      {
        errorMessage: "Username must start with a letter.",
        condition: (input) => /^[A-Za-z]/.test(input.value),
      },
    ],
  },
});
```

### Modify Submitted Values

```js
const formElement = document.getElementById("yourFormId");
const controllet = new Controllet({
  formElement,
  inputModifiers: {
    password: (value) => (value) => hashFunction(value),
  },
});
```

```js
const formElement = document.getElementById("yourFormId");
const controllet = new Controllet({ formElement });

controllet.handleSubmit((formData) => {
  if (formData.status) {
    // Form submitted successfully
    console.log("Form Data:", formData.data);
  } else {
    // Form has errors
    console.log("Form Errors:", formData.errors);
  }
});
```

## Documentation

Documentation for Controllet.js is currently under development and will be available soon. We are working hard to provide comprehensive guides, and usage examples.

In the meantime, you can refer to the [Examples](#examples) section for practical usage scenarios or explore the source code for detailed comments.

For any specific questions or assistance, feel free to reach out to us on [GitHub Issues](https://github.com/mouaadblhn/controllet.js/issues).

Thank you for your patience!

## Examples

Explore various usage scenarios and configurations with these examples:

- [Job Application Form](examples/job-application.html)

  - Demonstrates a basic form setup with custom validators and styling.

- [User Registration Form](examples/custom-styling-tailwind.html)

  - Shows how to integrate Controller.js in a user registration form.

- [Conference Registration Form](examples/conference-registration.html)

  - Illustrates form validation with date input fields.

- [Realtime Feedback Changes](examples/realtime-feedback.html)
  - Highlights the watch feature to track changes in specific form fields.

Feel free to use and modify these examples to suit your project's needs.

## License

Controllet.js is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
