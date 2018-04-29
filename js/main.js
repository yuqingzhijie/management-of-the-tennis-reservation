var price = {
	'weekday': {
		'8': 25, '9': 25, '10': 25,
		'11': 40, '12': 40, '13': 40, '14': 40,
		'15': 30, '16': 30, '17': 30,
		'18': 90, '19': 90,
		'20': 70, '21': 70
	},
	'weekend': {
		'8': 50, '9': 50, '10': 50, '11': 50,
		'12': 70, '13': 70, '14': 70, '15': 70, '16': 70,
		'17': 90, '18': 90, '19': 90, '20': 90, '21': 90
	}
};
var rate = {
	'weekday': 0.7,
	'weekend': 0.3
};
var orderList = {
	X: {},
	N: {},
	G: {},
	H: {}
};

var input = document.getElementById('order');
var orderBtn = document.getElementById('orderBtn');
var countBtn = document.getElementById('countBtn');
var screen = document.querySelector('.screen');

orderBtn.onclick = function() {
	// var content = input.value;
	// var status = testInput(content);
	var itemArr = input.value.split(' ');
	var userId = itemArr[0];
	var date = itemArr[1];
	var time = itemArr[2];
	var place = itemArr[3];
	var cancel = itemArr[4];
	var other = itemArr[5];

	//字符串格式不正确
	if (!testUser(userId) || !testDate(date, time)|| !testPlace(place) || !(cancel =='Cancel' || typeof isCancel == 'undefined') || typeof other != "undefined") {
		screen.innerHTML += 'Error: the booking is invalid!</br>';
		return;
	}

	//处理时间逻辑,当startTime >= endTime时预定失败
	var timeArr = time.split('~');
	var startTime = parseInt(timeArr[0].split(':')[0]);
	var endTime = parseInt(timeArr[1].split(':')[0]);
	var item = {};

	if (startTime >= endTime) {
		screen.innerHTML += 'Error: the booking is invalid!</br>';
		return;
	}

	var itemStartTime, itemEndTime;
	orderList[place][date] = orderList[place][date] || [];

	//取消处理
	if (cancel == 'Cancel') {
		for (var i = 0, len = orderList[place][date].length; i < len; i++) {
			item = orderList[place][date][i];
			if (startTime == item.startTime && endTime == item.endTime && item.userId == userId && !item.hasPenalty) {
				screen.innerHTML += 'Success: the booking is accepted!</br>';
				item.hasPenalty = true;
				return;
			}
		}
		screen.innerHTML += 'Error: the booking being cancelled does not exist!</br>';
		return;
	}

	//时间冲突处理
	if (orderList[place][date]) {
		for (var i = 0, item; item = orderList[place][date][i++]; ) {

			itemStartTime = item.startTime;
			itemEndTime = item.endTime;

			if ((startTime >= itemStartTime && startTime < itemEndTime) || (endTime > itemStartTime && endTime <= itemEndTime)) {
				screen.innerHTML += 'Error: the booking conflicts with existing bookings!</br>';
				return;
			}

		}
	}

	//保存,可以直接push保存,但考虑要进行统计等操作,实行有序插入
	var index = 0;
	for (var i = 0, item; item = orderList[place][date][i++]; ) {
		if (startTime < item.endTime) { break; }
		index++;
	}
	orderList[place][date].splice(index, 0, {
		userId: userId,
		startTime: startTime,
		endTime: endTime
	});
	screen.innerHTML += 'Success: the booking is accepted!</br>';
};

countBtn.onclick = income;

function income() {
	var total = 0;

	screen.innerHTML += 'income summary:</br>' + '------</br>';
	for (var place in orderList) {
		screen.innerHTML += 'place: ' + place + '</br>';
		total += deal(place);//deal对每个地方进行统计
	}
	screen.innerHTML += '------</br>' + 'total: ' + total + 'yuan</br>';
}

//测试用户
function testUser(userId) {
	return /X\d{3}/.test(userId);
}

/*
测试时间
注意三点: 1.格式是否符合，即在8点到22点间
         2.时间是否存在，如2018-4-55就不存在
         3.时间是否是将来，过去的不能预订
 */
function testDate(date, time) {
	if (!/(0[89]|1\d|2[01]):00~(09|1\d|2[0-2]):00/.test(time)) {
		return false;
	}
	var orderDate = new Date((date + ' ' + time.split('~')[0]).replace(/-/g, '/'));
	var nowDate = new Date();
	return (orderDate != 'Invalid Date') && (orderDate > nowDate);
}

//测试地点
function testPlace(place, placeList) {
	placeList = placeList || ['X', 'N', 'G', 'H'];
	for (var i = 0, item; item = placeList[i++]; ) {
		if (item === place) { return true; }
	}
	return false;
}


function deal(place) {
	//对日期排序
	var dateArr = Object.keys(orderList[place]).sort(function(date1, date2) {
		return new Date(date1) - new Date(date2);
	});
	var subTotal = 0;

	for (var i in dateArr) {
		var dayOrderList = orderList[place][dateArr[i]];
		var day = new Date(dateArr[i]).getDay();

		if (day > 0 && day < 6) {
			subTotal += count(dayOrderList, dateArr[i], 'weekday');
		}
		else {
			subTotal += count(dayOrderList, dateArr[i], 'weekend');
		}
	}

	screen.innerHTML += 'subtotal: ' + subTotal + 'yuan</br>';
	(place != 'H') && (screen.innerHTML += '</br>');

	return subTotal;
}

function count(list, date, type) {
	var subTotal = 0;

	list.forEach(function(item) {
		var sum = 0;
		var msg = "";

		//考虑浮点数相乘不精确，先乘以10000化为整数，再除以10000
		for (var startTime = item.startTime; startTime < item.endTime; startTime++) {
			if (!item.hasPenalty) {
				sum += price[type][startTime];
			}
			else {
				sum += price[type][startTime] * (rate[type] * 10000) / 10000;
			}
		}

		msg = date + ' ' + item.startTime + ':00~' + item.endTime +':00 ' + sum + 'yuan';
		subTotal += sum;
		screen.innerHTML += msg + '</br>';
	});

	return subTotal;
}
//X994 2018-02-08 18:00~20:00 X