// TODO: Split the API methods out in to the server folder.
var express = require('express'),
	connect = require('connect'),
	moment = require('moment'),
	_ = require('lodash'),
	app = express();

var api = require('./server/api'),
	email = require('./server/email'),
	groupCache = require('./server/cache');
groupCache.start();

app.use('/bower_components', express.static('./bower_components'));
app.use(express.static('./app'));

app.use(connect.json());
app.use(connect.urlencoded());

app.post('/query', function(req, res) {
	var body = _.defaults(req.body || {}, {
		type: 'NONE',
		when: 'ANY',
		time: 'NONE',
		people: 'NONE',
		ages: 'ANY',
		childcare: false
	});

	var form = {};
	if (body.childcare) { form.childcare = 1; }
	if (body.type !== 'NONE') { form.udf_pulldown_1_id = body.type; }
	if (body.people !== 'NONE') { form.udf_pulldown_2_id = body.people; }
	if (body.ages !== 'ANY') { form.udf_pulldown_3_id = body.ages; }
	if (body.when !== 'ANY') { form.meet_day_id = body.when; }
	if (body.time !== 'NONE') { form.meet_time_id = body.time; }

	api.search(form, function(err, items) {
		items = items.map(function(item) {
			var cached = groupCache.fetch(item.id);
			if (cached) {
				item = _.defaults(item, cached);
			}
			return item;
		});
		return res.send({ success: !err, result: err || items });
	});
});
app.post('/contact', function(req, res) {
	var body = _.defaults(req.body || {}, {
		group_name: '',
		owner_name: '',
		owner_email_primary: '',
		name: '',
		email: '',
		phone: ''
	});
	if (!body.email) {
		return res.send({ success: false, result: 'You must provide an email and a group.' });
	}

	email({
		to: body.owner_email_primary,
		replyTo: body.email,
		subject: '[JGROUPS] ' + (body.name || 'Someone') + ' Wants to Join Your JGroup!',
		text: 'Hi ' + body.owner_name + '!\n\n'
		+ (body.name || 'Someone') + ' is interested in joining your J-Group! Would you reach out to them as soon as you can to connect with them?\n\n'
		+ '\tJGroup: ' + body.group_name + '\n'
		+ '\tName: ' + (body.name || 'Not Provided') + '\n'
		+ '\tEmail: ' + body.email + '\n'
		+ '\tPhone: ' + (body.phone || 'Not Provided') + '\n'
		+ '\nHave a great day!'
		+ '\nThe Journey'
	}, function(err) {
		return res.send({ success: !err, result: err });
	});
});
app.post('/group', function(req, res) {
	var params = [
		'yourname', 'youremail', 'yourphone',
		'name', 'description',
		'udf_group_pulldown_1_id', 'udf_group_pulldown_2_id', 'udf_group_pulldown_3_id',
		'meeting_day_id', 'meeting_time_id',
		'meeting_location_street_address', 'meeting_location_city', 'meeting_location_state', 'meeting_location_zip'
	];
	var data = _.defaults(req.body || {});
	for (var i = 0; i < params.length; i++) {
		if (!data[params[i]]) {
			return res.send({ success: false, result: 'Please fill out all fields.' });
		}
	}

	// TODO: Figure out how to look up users in CCB. But until then, hard code the leader to be Abby.
	data.main_leader_id = 1530;

	data.meeting_location_state = data.meeting_location_state.toUpperCase();
	switch (data.meeting_location_state) {
		case 'MARYLAND':
			data.meeting_location_state = 'MD';
			break;
		case 'DELAWARE':
			data.meeting_location_state = 'DE';
			break;
		case 'NEW JERSEY':
			data.meeting_location_state = 'NJ';
			break;
		case 'PENNSYLVANIA':
			data.meeting_location_state = 'PA';
			break;
	}
	data.name = '[REVIEW] ' + data.name + ' (' + groupType(data.udf_group_pulldown_1_id) + ')';

	data.description = data.description + '\n'
	+ '\n- Start Time: ' + moment(data.meeting_time_start).format('hh:mm A')
	+ '\n- End Time: ' + moment(data.meeting_time_end).format('hh:mm A')
	+ '\n- Leader Name: ' + data.yourname
	+ '\n- Leader Email: ' + data.youremail
	+ '\n- Leader Phone: ' + data.yourphone;

	var creator = {
		name: data.yourname,
		email: data.youremail,
		phone: data.yourphone
	};
	delete data.yourname;
	delete data.youremail;
	delete data.yourphone;

	data.public_search_listed = false;
	data.listed = false;
	data.group_type_id = '1';

	api.hitAPI({
		method: 'POST',
		url: 'https://yourjourney.ccbchurch.com/api.php?srv=create_group',
		form: data
	}, function(err, httpResponse, body) {
		if (err) {
			return res.send({ success: !err, result: err });
		}
		var groupID = body.split('<group id="')[1].split('"')[0];
		email({
			replyTo: data.youremail,
			subject: '[JGROUPS] ' + data.name,
			text: 'Hello friend!\n\n'
			+ (creator.name) + ' is interested in starting a J-Group! Would you reach out to them as soon as you can to connect with them?\n\n'
			+ '\tJGroup: ' + data.name + '\n'
			+ '\tEmail: ' + creator.email + '\n'
			+ '\tPhone: ' + (creator.phone || 'Not Provided') + '\n'
			+ '\tCCB Link: https://elevatelife.ccbchurch.com/group_edit.php?ax=edit&group_id=' + groupID + '\n'
			+ '\nHave a great day!'
			+ '\nThe Journey'
		}, function(err) {
			if (err) {
				console.error(err);
			}
			return res.send({ success: true });
		});
	});


});

var server = app.listen(process.env.PORT || 5000, function() {
	console.log('Listening on port %d', server.address().port);
	console.log('http://localhost:' + server.address().port + '/');
});


function groupType(id) {
	id = '' + id;
	switch (id) {
		case '1':
			return 'Activity';
		case '2':
			return 'Discussion';
		case '3':
			return 'Care';
		case '4':
			return 'Code Red';
		default:
			return 'NextGen';
	}
}
