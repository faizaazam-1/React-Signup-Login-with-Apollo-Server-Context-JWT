const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: { type:String, required: true  },
    email: { type:String , unique:true, required: true  },
    password: { type:String, required: true },
    token: { type:String}
});

module.exports = model('User', userSchema);