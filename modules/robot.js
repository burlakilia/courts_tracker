exports.startObserve = function() {
	var robot = new Robot();
	robot.start();
};

function Robot() {

	this.start = function() {
		console.log("start");
	}

}