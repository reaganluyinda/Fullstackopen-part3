const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url, { family: 4 })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

// custom validator
const phoneValidator = (value) => {
  const parts = value.split("-");
  if (parts.length !== 2) {
    return false;
  }

  const firstPart = parts[0];
  const secondPart = parts[1];

  if (!/^\d{2,3}$/.test(firstPart)) {
    return false;
  }

  if (!/^\d+$/.test(secondPart)) {
    return false;
  }

  return value.length >= 8;
};

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    required: true,
    validate: { validator: phoneValidator, message: "invalid phone number" },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
