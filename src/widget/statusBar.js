var _ = require('underscore');
var util = require('util');
var EventEmitter = require("events").EventEmitter;
require('date-utils');


var StatusBar = function (svn) {
    var _this = this,
        container = $('<div class="toolbar statusbar">');

    this.domNode = container;
    this.status = $('<div>');
    this.repoName = $('<div>');
    this.domNode.append(this.status);
    this.domNode.append(this.repoName);
    

    svn.on('cmd', function (proc, cmd, args) {
        _this.handleCmdRun(proc, cmd, args);
    });
};

util.inherits(StatusBar, EventEmitter);

StatusBar.prototype.handleCmdRun = function (proc, cmd, args) {
    var _this = this;
    var node = $('<div class="process-status loading">' + cmd + " " + (args[0].length > 8 ? args[0].substr(0, 8) + " ..." : args[0])  + '</div>');
    node.attr('title', cmd + " " + args.join(" "));
    this.status.append(node);
    proc.on('close', function () {
        if (_this.status.children().length === 0) {
            _this.status.html("Idle");
        } else {
            node.remove();
        }
    });
};

StatusBar.prototype.setRepo = function (repo) {
    this.repoName.html(repo.name);
};

module.exports = function (svn) {
    return new StatusBar(svn);
};