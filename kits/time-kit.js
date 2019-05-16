function formatShortTime(time, count = 4) {
	const t = Math.floor(time / 86400);
	const h = Math.floor((time / 3600) % 24);
	const m = Math.floor((time / 60) % 60);
	const s = Math.floor(time % 60);
	var timeStr = '';
	if (t > 0) {
		timeStr = timeStr + t + '天';
		count--;
	}
	if (h > 0 && count > 0) {
		timeStr = timeStr + h + '时';
		count--;
	}
	if (m > 0 && count > 0) {
		timeStr = timeStr + m + '分';
		count--;
	}
	if (count > 0) {
		timeStr = timeStr + s + '秒';
	}
	return timeStr;
}

module.exports = {
	formatShortTime
}
