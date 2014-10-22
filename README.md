## Stevens CS520 HW2 --- bus service problem

> coming soon

initial: 
12 stops
4 buses
driving time between 2 contiguous stops 5s
passager generate 5/1s, each passager time will be clock + (1/5 * rand[0,1])s
boarding time is 0.04s

---total test simulation time will 60s

assumption: there is no passager gerenate during boarding event happens

Main Idea:

events: {
	time: time,
	type: type: person, board, arrive,
	stop: id number,
	bus: id number,
}

distance: use events data to calculate.

mean, max, min person each stop based on events to calculate

person() produce passager at each stops, register into events.

//---------------------------------

events = [];
historicEvents = [];

// array index locate stops
stops = [0,0,0,0,0,0,0,0,0,0,0,0];
historicStops = [];

initial generate events(); 
//generate five arrival events, stops id are [0, 3, 6, 9];
//generate person event on 12 stops.

that = this;

while(events){
	//get next events
	event = events.pop(1);

	//push to historic events
	historicEvents.push(event);

	//get right now time
	clock = time();

	//switch new event
	eventName = event.type;

	updateFunction = 'update' + eventName;

	newEvent = that.updateFunction(event);

	//save to new event
	if(newEvent){
		events.push(newEvent);
	}

	orderByTime(events);

	//save stops historic
	historicStops.push(stops);
}

function person(event){
	//update stop queue
	stopId = event.stopId;
	stops[stopId] += 1;

	//gernate new person event
	event = new Event();
	event.time = time() + rate * speed;
	event.type = 'person';
	event.stop = stopId;

	return event;
}

function boarder(event){
	stopId = event.stopId;

	//update stopId number
	if(stops[stopId]){
		stops[stopId] -= 1;

		//gernate new boarder event
		event = new Event();
		event.time = time() + boardingTime;
		event.type = 'boarder';
		event.stop = stopId;

		return event;
	}

	return false;
}

function arrival(event){
	stopId = event.stopId;

	if(stops[stopId]){
		//gernate new arrival event
		event = new Event();
		event.time = time() + drivingTime;
		event.type = 'arrival';
		event.stop = (stopId + 1) % stops;

		return event;
	} else {
		//gernate new board event
		event = new Event();
		event.time = time() + boardingTime;
		event.type = 'boarding';
		event.stop = stopId;

		return event;
	}
}




