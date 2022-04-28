const mongoose = require('mongoose');
const exampleSchema = new mongoose.Schema({
    authorName: String,
    createDate: String,
    description: String,
    title: String,
    tags: String,
    examples: String
});

const Example = mongoose.model("Example",exampleSchema);

module.exports = Example;