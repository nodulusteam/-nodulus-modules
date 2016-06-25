/// <reference path="../typings/main.d.ts" />
declare var dal: any;
declare var consts: any;
declare var express: any;
declare var app: any;
declare var router: any;
declare var util: any;
declare var path: any;
declare var fs: any;
declare var JSZip: any;
declare var moment: any;
declare var mkdirp: any;
declare var appRoot: string;
declare var serverRoot: string;
declare var modules_configuration_path: any;
declare var deleteFolderRecursive: (folderpath: string) => void;
declare class ModuleUtiliity {
    constructor();
    install(module_name: string, callback: Function): void;
    uninstall(module_name: string, callback: Function): void;
    timestamp(): string;
    npm_install(packagePair: any, callback: Function): void;
    replaceAll(replaceThis: string, withThis: string, inThis: string): string;
    deleteFolderRecursive(folderpath: string): void;
    list(callback: Function): void;
    validateModuleName(module_name: string, callback: Function): any;
    createPackage(module_name: string, callback: Function): void;
    pack(module_name: string, callback: Function): void;
}
