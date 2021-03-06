/*                 _       _
                 | |     | |
  _ __   ___   __| |_   _| |_   _ ___
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016
 */
/// <reference path="../typings/main.d.ts" />
var dal = require('@nodulus/data');
var consts = require('@nodulus/config').consts;
var config = require('@nodulus/config');
if (!config.appSettings.modules) {
    var local_config_template = require('../templates/config.js');
    config.mergeConfiguration(local_config_template.logs, 'modules');
}
if (!config.moduleSettings) {
    var local_modules_template = require('../templates/modules.js');
    config.moduleSettings = local_modules_template;
}
var express = require("@nodulus/core");
var router = express.Router();
var util = require('util');
var path = require('path');
var fs = require("fs-extra");
var JSZip = require("jszip");
var moment = require('moment');
var mkdirp = require('mkdirp');
var ModuleUtility = require('../lib/utility').ModuleUtility;
var appRoot = global.appRoot;
var serverRoot = global.serverAppRoot;
var deleteFolderRecursive = function (folderpath) {
    if (fs.existsSync(folderpath)) {
        fs.readdirSync(folderpath).forEach(function (file, index) {
            var curPath = path.join(folderpath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
router.get("/listsearch", function (req, res) {
    //var glob = require("glob")
    var Scrapper = require('../lib/npm.js');
    var terms = req.query.name;
    if (terms.length < 3)
        return res.json({});
    new Scrapper(terms).search(function (err, results) {
        if (err) {
            return console.error('Error: %s', err);
        }
        res.json(results);
    });
    //  var arrRes: Array<any> = ['schemas', 'dma', 'scripter', 'cms', 'codulus', 'zipem', 'terminals'];
    // fs.readdir(global.nodulsRepo, (err: any, files: Array<string>) => {
    //     var arrRes: Array<any> = [];
    //     if (files) {
    //         for (var i = 0; i < files.length; i++) {
    //             if (files[i].indexOf(".zip") > -1 && files[i].indexOf(req.query.name) > -1)
    //                 arrRes.push(files[i].replace(".zip", ""))
    //         }
    //     }
    //     res.json(arrRes);
    // });
    //     // options is optional
    //     glob(appRoot + "\\nodulus_modules\\*" + req.query.name + "*/*.zip",  function (er, files) {
    //         res.json(files);
    //   // files is an array of filenames.
    //   // If the `nonull` option is set, and nothing
    //   // was found, then files is ["**/*.js"]
    //   // er is an error object or null.
    //     })
});
//var moduleUtility = new ModuleUtiliity();
router.get("/navigation", function (req, res) {
    new ModuleUtility().list(function (data) {
        var arr = [];
        for (var x in data) {
            if (data[x].navigation && data[x].navigation.length > 0)
                arr.push(data[x].navigation[0]);
        }
        res.json(arr);
    });
});
router.get("/list", function (req, res) {
    new ModuleUtility().list(function (data) {
        var arr = [];
        for (var x in data) {
            var version = 0;
            try {
                version = require(x + '/package.json').version;
            }
            catch (e) {
                version = 0;
            }
            var package = { name: x, version: version, state: data[x].state };
            arr.push(package);
        }
        res.json(arr);
    });
});
router.get("/listnav", function (req, res) {
    new ModuleUtility().list(function (data) {
        var arr = [];
        for (var x in data) {
            if (data[x].navname !== undefined)
                arr.push(data[x]);
        }
        res.json(arr);
    });
});
router.get("/nodulus_mapping.js", function (req, res) {
    var str = " var nodulus_mapping =";
    new ModuleUtility().list(function (data) {
        var mapping_result = {};
        for (var x in data) {
            mapping_result[x] = { dependencies: [], scripts: [], styles: [] };
            if (data[x].scripts) {
                for (var sc = 0; sc < data[x].scripts.length; sc++) {
                    mapping_result[x].scripts.push(data[x].scripts[sc]);
                }
            }
            if (data[x].dependencies) {
                for (var dp = 0; dp < data[x].dependencies.length; dp++) {
                    mapping_result[x].dependencies.push(data[x].dependencies[dp]);
                }
            }
            if (data[x].styles) {
                for (var dp = 0; dp < data[x].styles.length; dp++) {
                    mapping_result[x].styles.push(data[x].styles[dp]);
                }
            }
        }
        res.type("application/javascript").send(str + JSON.stringify(mapping_result));
    });
});
router.post("/pack", function (req, res) {
    new ModuleUtility().pack(req.body.name, function (data) {
        res.json(data);
    });
});
router.post('/install', function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    var module_name = req.body.name;
    if (module_name === "" || module_name === undefined) {
        global.debug("module name is missing");
        return res.sendStatus(400);
    }
    new ModuleUtility().installFromNpm(module_name, function (err, manifest_json) {
        if (err !== null)
            return res.sendStatus(400);
        res.json(manifest_json);
    });
});
router.post('/create', function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    var module_name = req.body.name;
    if (module_name === "" || module_name === undefined)
        return res.sendStatus(400);
    new ModuleUtility().validateModuleName(module_name, function (exists) {
        if (exists)
            return res.json({ "Error": "module name exists" });
        new ModuleUtility().createPackage(module_name, function (err, manifest_json) {
            if (err !== null)
                return res.sendStatus(400);
            res.json(manifest_json);
        });
    });
});
router.post('/uninstall', function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    var module_name = req.body.name;
    new ModuleUtility().uninstall(module_name, function (err, result) {
        res.json({ "status": "ok" });
    });
});
router.post('/updates', function (req, res) {
    if (process.send)
        process.send("update nodulus");
    res.json({ "status": process.send ? "ok" : "update service is unavailable" });
});
module.exports = router;
