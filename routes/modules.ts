﻿/*                 _       _           
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
var config = require('@nodulus/config').config;
if (!config.appSettings.modules) {
    var local_config_template = require('../templates/config.json');
    config.mergeConfiguration(local_config_template.logs, 'modules');
}



var express = require('express');
var app = express();

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


var deleteFolderRecursive = (folderpath: string) => {
    if (fs.existsSync(folderpath)) {
        fs.readdirSync(folderpath).forEach((file: string, index: number) => {
            var curPath = path.join(folderpath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}




router.get("/listsearch", (req: any, res: any) => {
    //var glob = require("glob")
    var arrRes: Array<any> = ['schemas', 'dma', 'scripter', 'cms', 'codulus', 'zipem', 'terminals'];
    res.json(arrRes);
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
router.get("/navigation", (req: any, res: any) => {

    new ModuleUtility().list((data: any) => {
        var arr: Array<any> = [];
        for (var x in data) {
            if (data[x].navigation && data[x].navigation.length > 0)
                arr.push(data[x].navigation[0]);
        }

        res.json(arr);

    })
});
router.get("/list", (req: any, res: any) => {

    new ModuleUtility().list((data: any) => {
        var arr: Array<any> = [];
        for (var x in data) {
            arr.push(data[x]);
        }

        res.json(arr);

    })
})
router.get("/listnav", (req: any, res: any) => {

    new ModuleUtility().list((data: any) => {
        var arr: Array<any> = [];
        for (var x in data) {
            if (data[x].navname !== undefined)
                arr.push(data[x]);
        }

        res.json(arr);

    })
})

router.get("/nodulus_mapping.js", (req: any, res: any) => {

    var str = " var nodulus_mapping =";
    new ModuleUtility().list((data: any) => {
        var mapping_result: any = {};
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

    })
})
router.post("/pack", (req: any, res: any) => {

    new ModuleUtility().pack(req.body.name, (data: any) => {

        res.json(data);

    })
});
router.post('/install', (req: any, res: any) => {
    if (!req.body)
        return res.sendStatus(400);

    var module_name = req.body.name;

    if (module_name === "" || module_name === undefined) {
        global.debug("module name is missing");
        return res.sendStatus(400);
    }
    new ModuleUtility().installFromNpm(module_name, (err: any, manifest_json: any) => {
        if (err !== null)
            return res.sendStatus(400);


        res.json(manifest_json);

    });






});
router.post('/create', (req: any, res: any) => {
    if (!req.body)
        return res.sendStatus(400);

    var module_name = req.body.name;

    if (module_name === "" || module_name === undefined)
        return res.sendStatus(400);
    new ModuleUtility().validateModuleName(module_name, (exists: boolean) => {
        if (exists)
            return res.json({ "Error": "module name exists" });

        new ModuleUtility().createPackage(module_name, (err: any, manifest_json: any) => {
            if (err !== null)
                return res.sendStatus(400);


            res.json(manifest_json);

        })
    })







});
router.post('/uninstall', (req: any, res: any) => {
    if (!req.body) return res.sendStatus(400);

    var module_name = req.body.name;

    new ModuleUtility().uninstall(module_name, (err: any, result: boolean) => {

        res.json({ "status": "ok" });

    });
});


router.post('/updates', (req: any, res: any) => {
    process.send("update nodulus");
    res.json({ "status": "ok" });
});


module.exports = router;



