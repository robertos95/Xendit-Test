const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    isSoftDeleted: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Comment', commentSchema);