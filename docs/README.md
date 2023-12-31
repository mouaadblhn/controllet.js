# Controllet Documentation

Welcome to the documentation for Controllet, a JavaScript library for form validation and management. Below, you'll find detailed explanations and examples for various features offered by Controllet.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Usage](#basic-usage)
3. [Input Validation](#input-validation)
4. [Real-time Validation](#real-time-validation)
5. [Custom Validators](#custom-validators)
6. [Default Values](#default-values)
7. [Form Reset](#form-reset)
8. [Locale Support](#locale-support)
9. [Custom Classes](#custom-classes)
10. [Custom Success Messages](#custom-success-messages)
11. [Input Modifiers](#input-modifiers)
12. [Handling Form Submission](#handling-form-submission)
13. [Watching Form Inputs](#watching-form-inputs)
14. [In Conclusion](#in-conclusion)

## Getting Started

To integrate Controllet into your project, you can include the minified library file `controllet.min.js` available in the `dist` folder. Simply download the file and include it in your HTML file:

```html
<script src="path/to/controllet.min.js"></script>
```

## Basic Usage

```js
const formElement = document.getElementById("yourFormId");
const controllet = new Controllet({
  formElement,
  // Add your custom configuration options here
});
```

## Input Validation

Controllet simplifies form validation by supporting built-in HTML attributes like `minlength`, `maxlength`, `min`, `max`, `required`, and `pattern`. These attributes ensure that the entered data meets certain criteria. For example, the following input enforces a minimum length of 6 characters:

```html
<input type="text" id="username" name="username" minlength="6" required />
```

## Real-time Validation

Controllet automatically adds event listeners to form inputs for real-time validation.

```js
// Validation happens as users interact with the form
```

## Custom Validators

Need to go beyond the built-in validation rules? Controllet allows you to define custom validators for specific fields. Imagine a username that must start with a letter. Controllet makes it happen:

```javascript
const form = new Controllet({
  formElement: document.getElementById("form"),
  customValidators: {
    username: {
      override: true,
      validations: [
        {
          errorMessage: "Username must start with a letter.",
          condition: (input) => /^[A-Za-z]/.test(input.value),
        },
        // Add more validations as needed
      ],
    },
  },
});
```

The `override` attribute, when set to `true`, clears any existing validations for the specified field before running your custom validations. This ensures a clean slate for your custom logic to take effect.

## Default Values

Set default values for form fields. This feature comes in handy when you want to provide users with pre-filled information or establish a starting point for their inputs.

```js
const myForm = new Controllet({
  formElement: document.getElementById("myForm"),
  defaultValues: {
    username: "defaultUsername",
    email: "default@example.com",
    newsletter: { checked: true }, // For checkbox
    subscriptionType: { value: "premium", checked: true }, // For radio button
  },
});
```

Form filling just got a whole lot easier!

## Form Reset

Reset your form easily with Controllet:

```js
controllet.reset(); // Soft reset
// or
controllet.reset("hard"); // Hard reset
```

Soft reset keeps default values, while hard reset wipes everything clean.

## Locale Support

Controllet.js supports different locales for error messages.

```js
const myForm = new Controllet({
  formElement: document.getElementById("myForm"),
  locale: "fr-FR", // Set the desired locale (default is 'en-US')
});
```

Currently, the available languages are English (en-US) and French (fr-FR). But hey, stay tuned—more languages are on the way!

## Custom Classes

Customize the classes applied to error and success elements.

```js
const myForm = new Controllet({
  formElement: document.getElementById("myForm"),
  customClasses: {
    error: "my-error-class",
    success: "my-success-class",
    invalidInput: "my-invalid-input-class",
    validInput: "my-valid-input-class",
  },
});
```

## Custom Success Messages

Display custom success messages for specific form fields. Imagine a "Username is available!" message:

```js
const myForm = new Controllet({
  formElement: document.getElementById("myForm"),
  customSuccessMessages: {
    username: {
      message: "Username is available!",
      condition: (input) => isUsernameAvailable(input.value),
    },
    // Add more custom success messages as needed
  },
});
```

The `condition` function takes the input element as an argument, allowing you to define intricate criteria based on user input.

## Input Modifiers

Before submission, Controllet lets you make tweaks with input modifiers:

```js
const myForm = new Controllet({
  formElement: document.getElementById("myForm"),
  inputModifiers: {
    password: (value) => hashPassword(value),
  },
});
```

## Handling Form Submission

Incorporate the `handleSubmit` method to listen for the form submission event and execute your desired actions based on the form's validation status:

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

Additionally, the `formData.raw` attribute provides access to all form elements, enabling advanced DOM manipulations if needed.

## Watching Form Inputs

Ever wish you could keep an eye on specific form fields? With Controllet, you can! The watch feature lets you track interactions with specific form inputs. This is particularly handy for real-time validation and monitoring user behavior.

Here's how you can set it up:

```js
myForm.watch("username", (data) => {
  // Handle real-time validation data for the 'username' field
  console.log("Validation data:", data);
});
```

Now, every time users interact with the "username" input, you'll receive a data package. This package includes details like validation errors, and the input's current value.

## In Conclusion

Congratulations! 🎉 You've now unlocked the full potential of Controllet. We hope this documentation has been a helpful companion on your journey to creating seamless and user-friendly forms.

Remember, Controllet is here to make your life as a developer easier, whether you're building a small contact form or a complex multi-step wizard. As you continue to explore and implement these features, don't hesitate to reach out for support or share your success stories with the community.

Thank you for choosing Controllet! Happy coding! 🚀
