var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    img: {
        type: String,
        unique: true
    },
    url: {
        type: String,
        unique: true
    },
    blurb: {
        type: String,
        unique: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

articleSchema.methods.makeSaved = function() {
    this.saved = true
    return this.saved
};
//Creates the model from the above schema 
var Article = mongoose.model("Article", articleSchema);

module.exports = Article;

