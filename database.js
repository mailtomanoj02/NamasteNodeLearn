const mongodb = require("node:module");
const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://ManojFoodhub:ManojFoodhubPassword@nodelearnnamste.dgw8r.mongodb.net/devTinder/";

const client = new MongoClient(url);

// Database Name
const dbName = "TestHelloWorld";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("HelloWorld");
  const updateResult = await collection.updateOne(
    { firstName: "ganesh" },
    { $set: { age: 30 } }
  );
  console.log("Updated documents =>", updateResult);

  // the following code examples can be pasted here...
  await collection.deleteOne({ firstName: "ganesh" });
  console.log(await collection.countDocuments({}));
  await collection.rename("HelloWorld");

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
