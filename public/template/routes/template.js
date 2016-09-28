/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */
  
  
var express = require('@nodulus/core');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var path = require('path');
var dal = require("@nodulus/data");
 
 



router.get("/list", function (req, res) {
    
    res.json({});
});








module.exports = router;



