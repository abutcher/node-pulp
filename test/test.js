#!/bin/env node

var pulp = require('../node-pulp.js');

pulp.getRepos(function(d) { console.log(d) });
pulp.getRepo('abutcher-test9-re', function(d) { console.log(d) });
pulp.getRepoPackages('abutcher-test20-re', function(d) { console.log(d) });
pulp.searchPackages('httpd', function(d) { console.log(d) });
pulp.searchRepos({"id": {"$regex": ".*-stage"}}, function(d) { console.log(d) });
