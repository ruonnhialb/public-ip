'use strict';
var dns = require('native-dns');

var type = {
	v4: {
		server: {
			address: '208.67.222.222', // OpenDNS
			port: 53,
			type: 'udp'
		},
		question: dns.Question({
			name: 'myip.opendns.com',
			type: 'A'
		})
	},
	v6: {
		server: {
			address: '2620:0:ccc::2', // OpenDNS
			port: 53,
			type: 'udp'
		},
		question: dns.Question({
			name: 'myip.opendns.com',
			type: 'AAAA'
		})
	}
};

function query(version, cb) {
	var req = dns.Request(type[version]);

	req.on('timeout', function () {
		cb(new Error('Request timed out'));
	});

	req.on('message', function (err, res) {
		var ip = res.answer[0] && res.answer[0].address;

		if (!ip) {
			cb(new Error('Couldn\'t find your IP'));
			return;
		}

		cb(null, ip);
	});

	req.send();
}

function v4(cb) {
	query('v4', cb);
}

function v6(cb) {
	query('v6', cb);
}

module.exports = v4;
module.exports.v4 = v4;
module.exports.v6 = v6;
