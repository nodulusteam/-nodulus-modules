var consts = require('@nodulus/config').consts;
var config = require('@nodulus/config').config;
if (!config.appSettings.modules) {
    var local_config_template = require('./templates/config.json');
    config.mergeConfiguration(local_config_template.logs, 'modules');
}

if (!config.modulesSettings) {
    var local_modules_template = require('./templates/modules.json');
    config.modulesSettings = local_modules_template;
}