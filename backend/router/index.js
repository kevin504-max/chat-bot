const express = require('express');
const applicationRoutes = require('./chatApplicationRoutes.js');

module.exports = app => {
    app.use(express.json(), applicationRoutes);
}