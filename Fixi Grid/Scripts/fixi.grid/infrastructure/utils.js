var fixiGridUtils;
(function (fixiGridUtils) {
    function groupBy(array, field) {
        var dict = {};
        array.forEach(function (item) {
            if (!dict[item[field]])
                dict[item[field]] = [];
            dict[item[field]].push(item);
        });
        return dict;
    }
    fixiGridUtils.groupBy = groupBy;
    function toTimeString(date) {
        var hour = date.getHours();
        var zz = "AM";
        if (hour > 12) {
            hour -= 12;
            zz = "PM";
        }
        var minute = date.getMinutes().toString();
        if (minute.length == 1)
            minute = "0" + minute;
        return hour + ":" + minute + " " + zz;
    }
    fixiGridUtils.toTimeString = toTimeString;
})(fixiGridUtils || (fixiGridUtils = {}));
//# sourceMappingURL=utils.js.map