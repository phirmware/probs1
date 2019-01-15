var mongoose = require('mongoose');
var express = require('express');

var subscribeSchema = new mongoose.Schema({
    name:String,
    emails:[]
});

var Subscribers = mongoose.model('subscribers',subscribeSchema);
module.exports = Subscribers;