var mongoose = require('mongoose');

var problemSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    genres:Array,
    country:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    twitter_url:{
        type:String,
        default:''
    },
    comments:[]
});

var Problem = mongoose.model('problem',problemSchema);
module.exports = Problem;