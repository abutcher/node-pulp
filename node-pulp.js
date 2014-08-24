var https = require('https');

var host = process.env.NODE_PULP_HOST;
var user = process.env.NODE_PULP_USER;
var pass = process.env.NODE_PULP_PASS;

function pulpGET(path, callback) {

    var auth = 'Basic ' + new Buffer(user + ':' + pass).toString('base64');
    var header = {'Authorization': auth};

    var options = {
	host: host,
	port: 443,
	path: path,
	method: 'GET',
	rejectUnauthorized: false,
	requestCert: true,
	agent: false,
	headers: header
    };

    https.request(options, function(res) {
	var data = '';
	res.setEncoding('utf8');
	res.on('data', function(chunk) {
	    data += chunk;
	});
	res.on('end', function() {
	    callback(JSON.parse(data));
	});
	res.on('error', function(e) {
	    console.error(e);
	});
    }).end();
}

function pulpPOST(path, requestData, callback) {

    var auth = 'Basic ' + new Buffer(user + ':' + pass).toString('base64');

    var header = {
	'Authorization': auth,
	'Content-Type': 'application/json',
	'Content-Length': requestData.length
    };

    var options = {
	host: host,
	port: 443,
	path: path,
	method: 'POST',
	rejectUnauthorized: false,
	requestCert: true,
	agent: false,
	headers: header
    };

    var req = https.request(options, function(res) {
	var data = '';
	res.setEncoding('utf8');
	res.on('data', function(chunk) {
	    data += chunk;
	});
	res.on('end', function() {
	    callback(JSON.parse(data));
	});
	res.on('error', function(error) {
	    console.error(e);
	});
    });

    req.write(requestData);
    req.end();
}

exports.getRepos = function(callback) {
    var data = {
	"criteria": {
	    "fields": [
		"display_name",
		"content_unit_counts"
	    ],
	}
    }

    var dataString = JSON.stringify(data);

    pulpPOST('/pulp/api/v2/repositories/search/', dataString, function(data) {
	callback(data);
    });
}

exports.getRepoPackages = function(repoId, callback) {
    var data = {
	"criteria": {
	    "fields": {
		"unit": [
		    "name",
		    "version"
		]
	    },
	    "type_ids": [
		"rpm"
	    ]
	}
    }

    var dataString = JSON.stringify(data);

    pulpPOST('/pulp/api/v2/repositories/' + repoId + '/search/units/', dataString, function(data) {
	callback(data);
    });
}

exports.searchPackages = function(pkgNameGlob, callback) { 
    var data = {
	"criteria": {
	    "fields": [
		"name",
		"version"
	    ],
	    "filters": {
		"name": {
		    "\$regex": "\.\*" + pkgNameGlob + "\.\*"
		}
	    }
	}
    }


    var dataString = JSON.stringify(data);

    pulpPOST('/pulp/api/v2/content/units/rpm/search/', dataString, function(data) {
	callback(data);
    });
}
