/****************************************************************************
 * InputValidation Class
 ****************************************************************************
 * This class provides a set of common validation functions for form inputs.
 * It includes error messages for various validation conditions, ensuring a
 * standardized approach to input validation.
 *
 * @class InputValidation
 * @module Controllet
 * @version 0.1.0
 ****************************************************************************/

const errorMessages = {
  "en-US": {
    required: "This field is required",
    minLength: "Minimum {0} characters are required",
    maxLength: "Maximum {0} characters allowed",
    numeric: "Please enter a valid number",
    min: "Value must be greater than or equal to {0}",
    max: "Value must be less than or equal to {0}",
    pattern: "Invalid pattern",
  },
  "fr-FR": {
    required: "Ce champ est requis",
    minLength: "Un minimum de {0} caractères est requis",
    maxLength: "Un maximum de {0} caractères est autorisé",
    numeric: "Veuillez entrer un nombre valide",
    min: "La valeur doit être supérieure ou égale à {0}",
    max: "La valeur doit être inférieure ou égale à {0}",
    pattern: "Modèle invalide",
  },
};

class InputValidation {
  constructor(
    inputElement,
    customValidators = {},
    customClasses = {},
    customSuccessMessages = {},
    locale = "fr-FR"
  ) {
    this.inputElement = inputElement;
    this.errors = [];
    this.successMessages = [];
    this.customSuccessMessages = customSuccessMessages;
    this.customValidators = customValidators;
    this.errorMessages = errorMessages[locale];

    this.invalidBoxClass = customClasses.error || "error-message";
    this.invalidInputClass = customClasses.invalidInput || "";
    this.validBoxClass = customClasses.success || "success-message";
    this.validInputClass = customClasses.validInput || "";
  }

  validate() {
    // Skip validation for readonly or disabled inputs
    if (this.inputElement.hasAttribute("readonly") || this.inputElement.hasAttribute("disabled")) {
      return;
    }

    const isRequired = this.inputElement.hasAttribute("required");
    if (isRequired && !this.inputElement.value.trim()) {
      this.errors.push(this.errorMessages.required);
    }

    this.validateAttributes();
    this.runCustomValidations();
  }

  validateAttributes() {
    const attributes = this.inputElement.attributes;

    for (let i = 0; i < attributes.length; i++) {
      const attributeName = attributes[i].name.toLowerCase();

      if (attributeName === "min" || attributeName === "max") {
        this.validateMinMax(attributeName, parseFloat(attributes[i].value));
      } else if (attributeName === "minlength" || attributeName === "maxlength") {
        this.validateMinMaxLength(attributeName, parseInt(attributes[i].value, 10));
      } else if (attributeName === "pattern") {
        this.validatePattern(attributes[i].value);
      }
    }
  }

  validateMinMax(attribute, value) {
    const fieldValue = parseFloat(this.inputElement.value);

    if (isNaN(fieldValue)) {
      return;
    }

    if (attribute === "min" && fieldValue < value) {
      this.errors.push(this.errorMessages.min.replace("{0}", value));
    } else if (attribute === "max" && fieldValue > value) {
      this.errors.push(this.errorMessages.max.replace("{0}", value));
    }
  }

  validateMinMaxLength(attribute, value) {
    const fieldValue = this.inputElement.value.trim();

    if (attribute === "minlength" && fieldValue.length < value) {
      this.errors.push(this.errorMessages.minLength.replace("{0}", value));
    } else if (attribute === "maxlength" && fieldValue.length > value) {
      this.errors.push(this.errorMessages.maxLength.replace("{0}", value));
    }
  }

  validatePattern(pattern) {
    const fieldValue = this.inputElement.value.trim();

    if (pattern && !new RegExp(pattern).test(fieldValue)) {
      this.errors.push(this.errorMessages.pattern);
    }
  }

  async runCustomValidations() {
    const { name } = this.inputElement;
    const { override, validations } = this.customValidators[name] || {};

    if (override) this.errors = []; // Clear previous errors if override is enabled

    if (validations) {
      for (const { errorMessage, condition } of validations) {
        try {
          const isValid = await condition(this.inputElement);
          if (!isValid) this.errors.push(errorMessage);
        } catch (error) {
          console.error(`Error during async validation for ${name}:`, error);
        } finally {
          this.displayErrors();
          this.displaySuccessMessage();
        }
      }
    }
  }

  displayErrors() {
    const existingErrorContainer = this.inputElement.parentNode.querySelector(
      `.${this.invalidBoxClass}`
    );

    if (existingErrorContainer) {
      existingErrorContainer.remove();
      this.invalidInputClass && this.inputElement.classList.remove(`${this.invalidInputClass}`);
    }

    // Display only the first error below the input field or after the label
    if (this.errors.length > 0) {
      const errorContainer = document.createElement("div");
      errorContainer.className = this.invalidBoxClass;
      errorContainer.textContent = this.errors[0];

      this.inputElement.parentNode.appendChild(errorContainer);
      this.invalidInputClass && this.inputElement.classList.add(`${this.invalidInputClass}`);
    }
  }

  displaySuccessMessage() {
    const fieldName = this.inputElement.name || this.inputElement.getAttribute("name");
    const successMessageConfig = this.customSuccessMessages[fieldName];

    const existingSuccessContainer = this.inputElement.parentNode.querySelector(
      `.${this.validBoxClass}`
    );

    if (existingSuccessContainer) {
      existingSuccessContainer.remove();
      this.validInputClass && this.inputElement.classList.remove(`${this.validInputClass}`);
    }

    if (
      this.errors.length === 0 &&
      successMessageConfig &&
      successMessageConfig.condition(this.inputElement)
    ) {
      const successContainer = document.createElement("div");
      successContainer.className = this.validBoxClass;
      successContainer.textContent = successMessageConfig.message;

      // Insert the success container after the input field
      this.inputElement.parentNode.insertBefore(successContainer, this.inputElement.nextSibling);
      this.validInputClass && this.inputElement.classList.add(`${this.validInputClass}`);
    }
  }
}
