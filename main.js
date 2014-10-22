//total stops
var stopsNum = 12;

//total buses
var buses = 4;

//driving time between two contiguous stops
var drivingTime = 5.000;

//each stop passager gerenate time 0.2*[0, 1];
var passagerRate = 1.000;

//each passager boarding time
var boardingTime = 0.040;

var events = [],
	historicEvents = [];

// array index locate stops
var stops = [0,0,0,0,0,0,0,0,0,0,0,0];
var historicStops = [];

var Event = function(){
	var dataSet = {
		time: '',
		type: '',
		stop: '', 
	}
	return dataSet;
}

function initialEvent(){
	//generate five arrival events, stops id are [0, 3, 6, 9];
	var stopId = [0, 3, 6, 9];
	for(i in stopId){
		event = new Event();
		event.time = 1;
		event.type = 'arrival';
		event.stop = stopId[i];
		event.busId = 'bus_'+i;
		events.push(event);
		console.log('Initial arrival event: time:'+ 0 + ' | stop: '+stopId[i] + ' | bus id: '+ event.busId);
	}

	//generate person event on 12 stops.
	for(i = 0; i <= 11; i++){
		event = new Event();
		event.time = 0;
		event.type = 'person';
		event.stop = i;
		events.push(event);
		console.log('Initial person event: time:'+ 0 + ' | stop: '+i);
	}

	stops = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
}

function person(event){
	//update stop queue
	stopId = event.stop;
	stops[stopId] += 1;

	//gernate new person event
	newEvent = new Event();
	newEvent.time = event.time + Math.random() * passagerRate;
	newEvent.type = 'person';
	newEvent.stop = stopId;

	console.log('New '+ newEvent.type +' event: time:'+ newEvent.time + ' | stop: '+ newEvent.stop);

	return newEvent;
}

function boarder(event){
	stopId = event.stop;

	// while loop doing boarder event
	if(stops[stopId]){
		stops[stopId] -= 1;
		//gernate new boarder event
		newEvent = new Event();
		newEvent.time = event.time + boardingTime;
		newEvent.type = 'boarder';
		newEvent.stop = stopId;
		newEvent.busId = event.busId;

		console.log('New '+ newEvent.type +' event: time:'+ newEvent.time + ' | stop: '+ newEvent.stop + ' | bus id: '+ newEvent.busId);
		return newEvent;
	} else {
		// generate arrival event
		newEvent = new Event();
		newEvent.time = event.time + boardingTime;
		newEvent.type = 'arrival';
		newEvent.stop = (stopId + 1) % stopsNum;
		newEvent.busId = event.busId;

		console.log('New '+ newEvent.type +' event: time:'+ newEvent.time + ' | stop: '+ newEvent.stop + ' | bus id: '+ newEvent.busId);
		return newEvent;
	}	
}

function arrival(event){
	stopId = event.stop;

	if(stops[stopId] == 0){
		//gernate new arrival event
		newEvent = new Event();
		newEvent.time = event.time + drivingTime;
		newEvent.type = 'arrival';
		newEvent.stop = (stopId + 1) % stopsNum;
		newEvent.busId = event.busId;	

		console.log('New '+ newEvent.type +' event: time:'+ newEvent.time + ' | stop: '+ newEvent.stop + ' | bus id: '+ newEvent.busId);
		return newEvent;
	} else {
		//gernate new board event
		newEvent = new Event();
		newEvent.time = event.time + boardingTime;
		newEvent.type = 'boarder';
		newEvent.stop = stopId;
		newEvent.busId = event.busId;

		console.log('New '+ newEvent.type +' event: time:'+ newEvent.time + ' | stop: '+ newEvent.stop + ' | bus id: '+ newEvent.busId);
		return newEvent;
	}
}

function currentTime(){
	var d = new Date();
	return d.getTime()/1000;
}

function compare(a,b) {
	if (a.time < b.time)
		return -1;
	if (a.time > b.time)
		return 1;
	return 0;
}

var count = 1;

// initial generate events();
initialEvent();

while(events.length){
	if(count>=1000) break;
	//get next events
	event = events[0];

	//remove it
	events = events.slice(1);

	//push to historic events
	historicEvents.push(event);

	//get right now time
	// clock = time();

	//switch new event
	// eventName = event.type;

	var newEvent = '';

	switch(event.type){
		case 'person':
			newEvent = person(event);
			break;
		case 'arrival':
			newEvent = arrival(event);
			break;
		case 'boarder':
			newEvent = boarder(event);
			break;
		default:
			newEvent = false;
			break;
	}

	//save to new event
	if(newEvent){
		events.push(newEvent);
	}

	//sort the events based on time
	events.sort(compare);

	//save stops historic
	var tmp = [];
	for (var i = 0, len = stops.length; i < len; i++) {
		tmp[i] = stops[i];
	}

	historicStops.push(tmp);
	// historicStops[historicStops.length] = stops;

	count++;
}

console.log(historicEvents);
console.log(historicStops);

//------------ analysis data ------------------

// max num waitting person each stops
var maxNumStops = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// min num waitting person each stops
var minNumStops = [10000000, 10000000, 10000000, 
				10000000, 10000000, 10000000, 
				10000000, 10000000, 10000000,
				10000000, 10000000, 10000000];

// average stops calculate by each event
var averageStops = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

for(i in historicStops){
	for(j in historicStops[i]){
		averageStops[j] += historicStops[i][j];
		if(maxNumStops[j] < historicStops[i][j]){
			maxNumStops[j] = historicStops[i][j];
		}
		if(minNumStops[j] > historicStops[i][j]){
			minNumStops[j] = historicStops[i][j];
		}
	}
}

for(i in averageStops){
	averageStops[i] /= historicStops.length;
}

console.log(averageStops);


// calculate distance between bus each 10 events happens
var snapshotEventCount = 10;

var busAverageStopObj = {
	'bus_0': 0,
	'bus_1': 0,
	'bus_2': 0,
	'bus_3': 0
};

while(historicEvents.length){
	var length = (historicEvents.length > 10) ? 10 : historicEvents.length;
	for (var i = 0; i < length; i++) {
		if(historicEvents[i].type != 'person'){
			busAverageStopObj[historicEvents[i].busId] += parseInt(historicEvents[i].stop);
		}
	}

    historicEvents = historicEvents.slice(length);
}
console.log(busAverageStopObj);


console.log("Max person wait in stops is :");
console.log(maxNumStops);
console.log("Min person wait in stops is :");
console.log(minNumStops);
















