var Report = require('istanbul').Report,
    util = require('util'),
    utils = require('istanbul').utils;

var DashingReporter = function(opts) {
    Report.call(this);
    opts = opts || {};

    this.writeReport = function (collector /*, sync */) {
        var self = this;

        var summaries = [];
        collector.files().forEach(function (file) {
            summaries.push(utils.summarizeFileCoverage(collector.fileCoverageFor(file)));
        });
        var finalSummary = utils.mergeSummaryObjects.apply(null, summaries);

        var metrics = finalSummary['statements'];
        var postData = {
            'auth_token': opts.auth_token,
            'value': metrics.pct
        };

        var request = require('request');

        console.log('Sending coverage report to dashboard.')
        request.post(
            opts.url,
            { json: postData },
            function (error, response, body) {
                console.log('Posted to dashboard.  Response: ' + JSON.stringify(response, null, 2));
            }
        );

        this.emit('done');
    };
};

DashingReporter.TYPE = 'dashing';
util.inherits(DashingReporter, Report);

module.exports = DashingReporter;