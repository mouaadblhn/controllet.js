/****************************************************************************
 * Controllet Class
 ****************************************************************************
 * The Controllet class is a fundamental part of the Controllet.js library.
 * It handles the validation logic for form inputs, leveraging the
 * InputValidation class for common validation functions.
 *
 * @class Controllet
 * @module Controllet
 * @version 0.1.0
 ****************************************************************************/

class Controllet {
  constructor({
    formElement,
    customValidators,
    defaultValues = {},
    inputModifiers = {},
    customClasses = {},
    customSuccessMessages = {},
    locale = "en-US",
  }) {
    this.formElement = formElement;
    this.customValidators = customValidators;
    this.locale = locale;
    this.errors = [];
    this.submitCallback = null;
    this.defaultValues = defaultValues;
    this.inputModifiers = inputModifiers;
    this.customSuccessMessages = customSuccessMessages;
    this.customClasses = customClasses;
    this.applyDefaultValues();
    this.resetEventListener();
    this.init();
  }

  init() {
    this.formElement.setAttribute("novalidate", true);

    // Add input, change, and input event listeners to update errors dynamically
    const formInputs = this.formElement.querySelectorAll("input, select, textarea");
    formInputs.forEach((input) => {
      ["input", "change"].forEach((eventType) => {
        input.addEventListener(eventType, () => this.validateInput(input));
      });
    });

    this.formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      this.validateForm();
    });
  }

  reset(resetType = "soft") {
    this.formElement
      .querySelectorAll("input, select, textarea")
      .forEach((input) =>
        resetType === "hard"
          ? input.type !== "checkbox" && input.type !== "radio"
            ? (input.value = "")
            : (input.checked = false)
          : this.applyDefaultValues()
      );
  }

  resetEventListener() {
    this.formElement.addEventListener("reset", (event) => {
      event.preventDefault();
      this.clearErrors();
      this.reset();
    });
  }

  clearErrors(invalidBoxClass, invalidInputClass) {
    const errorContainers = this.formElement.querySelectorAll(`.${invalidBoxClass}`);
    errorContainers.forEach((container) => container.remove());

    // Remove custom input class if provideds
    const errorInputs = this.formElement.querySelectorAll(`.${invalidInputClass}`);
    errorInputs.forEach((input) => {
      input.classList.remove(`${invalidInputClass}`);
    });
  }

  clearSuccessMessages(validBoxClass, validInputClass) {
    if (this.formElement && validBoxClass !== "") {
      // Remove success message containers
      const successContainers = this.formElement.querySelectorAll(`.${validBoxClass}`);
      successContainers.forEach((container) => container.remove());
    }

    if (this.formElement && validInputClass !== "") {
      // Remove custom input class if provided
      const successInputs = this.formElement.querySelectorAll(`.${validInputClass}`);
      successInputs.forEach((input) => input.classList.remove(validInputClass));
    }
  }

  applyDefaultValues() {
    Object.keys(this.defaultValues).forEach((fieldName) => {
      const field = this.formElement.querySelector(`[name="${fieldName}"]`);

      if (field) {
        const defaultValue = this.defaultValues[fieldName];

        if (field.type === "checkbox") {
          if (typeof defaultValue === "object" && defaultValue !== null) {
            const valueToCheck =
              defaultValue.value !== undefined ? defaultValue.value : defaultValue;
            const checkbox = this.formElement.querySelector(
              `[name="${fieldName}"][value="${valueToCheck}"]`
            );

            if (checkbox) {
              checkbox.checked = Boolean(defaultValue.checked);
            } else {
              this.formElement.querySelectorAll(`[name="${fieldName}"]`).forEach((checkbox) => {
                checkbox.checked = Boolean(defaultValue.checked);
              });
            }
          } else field.checked = Boolean(defaultValue);
        } else if (field.type === "radio") {
          const valueToCheck = defaultValue.value !== undefined ? defaultValue.value : defaultValue;
          const radio = this.formElement.querySelector(
            `[name="${fieldName}"][value="${valueToCheck}"]`
          );

          if (radio) radio.checked = true;
          else field.checked = Boolean(defaultValue.checked);
        } else field.value = defaultValue;
      } else console.warn(`Field with name "${fieldName}" not found.`);
    });
  }

  handleSubmit(callback) {
    this.submitCallback = callback;
  }

  modifySubmittedValue(input) {
    const modifier = this.inputModifiers[input.name];
    return modifier ? modifier(input.value) : input.value;
  }

  validateInput(input) {
    const validator = new InputValidation(
      input,
      this.customValidators,
      this.customClasses,
      this.customSuccessMessages,
      this.locale
    );
    validator.validate();
    validator.displayErrors();
    validator.displaySuccessMessage();
  }

  serializeForm() {
    const formInputs = this.formElement.querySelectorAll("input, select, textarea");
    const formData = {};

    formInputs.forEach((input) => {
      const { name, type, value, checked, files } = input;

      if (type === "file") {
        formData[name] = files.length === 1 ? files[0] : Array.from(files);
      } else if (type === "checkbox") {
        formData[name] = formData[name] || [];
        if (checked) formData[name].push(value);
      } else if (type === "radio" && checked) {
        formData[name] = value;
      } else {
        formData[name] = value;
      }
    });

    return formData;
  }

  watch(inputName, callback) {
    const inputs = this.formElement.querySelectorAll(`[name="${inputName}"]`);

    if (inputs.length > 0) {
      inputs.forEach((input) => {
        const isTextInput = ["INPUT", "TEXTAREA", "SELECT"].includes(input.tagName);
        const eventName = isTextInput ? "input" : "change";

        const eventListener = () => {
          const validator = new InputValidation(
            input,
            this.customValidators,
            this.customClasses,
            this.customSuccessMessages,
            this.locale
          );
          validator.validate();

          let checked;
          if (input.tagName === "INPUT" && (input.type === "checkbox" || input.type === "radio")) {
            checked = input.checked;
          }

          const data = {
            errors: validator.errors,
            value: isTextInput ? input.value : undefined,
            raw: this.formElement.querySelectorAll("input, select, textarea"),
            ...(checked !== undefined && { checked }),
          };

          callback(data);
        };

        input.addEventListener(eventName, eventListener);
        eventListener();
      });
    } else {
      console.warn(`Input with name "${inputName}" not found.`);
    }
  }

  validateForm() {
    const formInputs = this.formElement.querySelectorAll("input, select, textarea");
    const formData = { status: true, data: {}, errors: [] };
    let firstErrorInput = null; // Keep track of the first input with an error

    let validBoxClass;
    let validInputClass;

    formInputs.forEach((input) => {
      const validator = new InputValidation(
        input,
        this.customValidators,
        this.customClasses,
        this.customSuccessMessages,
        this.locale
      );

      validBoxClass = validator.validBoxClass;
      validInputClass = validator.validInputClass;

      validator.validate();

      if (validator.errors.length > 0) {
        formData.status = false;
        formData.errors.push({ name: input.name, errors: validator.errors });

        if (!firstErrorInput) firstErrorInput = input; // Keep track of the first input with an error
      } else {
        this.modifySubmittedValue(input); // Apply modification before submission
        formData.data[input.name] = input.value;
      }

      validator.displayErrors();
    });

    if (firstErrorInput) {
      firstErrorInput.focus();
    }

    if (this.submitCallback) {
      if (formData.status) {
        this.clearSuccessMessages(validBoxClass, validInputClass);
      }
      this.submitCallback(formData);
    }
  }
}
