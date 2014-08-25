#!/bin/env node

var pulp = require('../node-pulp.js');

pulp.getRepos(function(d) { console.log(d) });
pulp.getRepo('abutcher-test-re', function(d) { console.log(d) });
pulp.getRepoPackages('abutcher-test20-re', {"unit": ["name", "version"]}, undefined, undefined, function(d) { console.log(d) });
pulp.searchPackages(["name", "version"], {"name": {"$regex": ".*httpd.*"}}, undefined, undefined, function(d) { console.log(d) });
pulp.searchRepos(["display_name"], {"id": {"$regex": ".*-stage"}}, undefined, undefined, function(d) { console.log(d) });
