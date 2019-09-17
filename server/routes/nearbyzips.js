/* eslint-disable no-console */
const express = require('express');
const zipcodes = require('zipcodes');

const router = express.Router();

router.get('/:zipcode/:distance', (request, responds) => {
  const zipsinradius = zipcodes.radius(request.params.zipcode, request.params.distance);

  return responds.send(zipsinradius);
});

module.exports = router;
