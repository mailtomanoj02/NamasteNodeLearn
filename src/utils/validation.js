const validator = require("validator");
const signUpValidation = (body) => {
  if (Object.keys(body).length === 0) {
    throw new Error("Data can't be empty");
  }

  const { firstName, lastName, emailId, password } = body ?? {};

  if (validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }
  if (firstName.length > 20) {
    throw new Error("First name is too long");
  }
  if (lastName.length > 10) {
    throw new Error("Last name is too long");
  }
};

const loginValidation = (body) => {
  const { emailId, password } = body ?? {};

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }
  if (!validator || validator.isEmpty(password)) {
    throw new Error("Password field is required");
  }
};

const validateEditProfiledata = (body) => {
  const restrictedFields = ["emailId", "password"];
  if (Object.keys(body).some((key) => restrictedFields.includes(key))) {
    throw new Error(
      "Cannot update the fields in the list: " + restrictedFields
    );
  }
  return true;
};
const validatForgotPasswordData = (body) => {
  const allowedFields = ["newPassword", "oldPassword"];
  const bodyArr = Object.keys(body);
  if (
    bodyArr?.length === 2 &&
    bodyArr.every((key) => allowedFields.includes(key))
  ) {
    if (!validator.isStrongPassword(body.newPassword)) {
      throw new Error("Please Enter a Strong password");
    }
  } else {
    throw new Error("Invalid Data was sent");
  }
};

module.exports = {
  signUpValidation,
  loginValidation,
  validateEditProfiledata,
  validatForgotPasswordData,
};
