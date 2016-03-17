var FixiGridUI;
(function (FixiGridUI) {
    var Utils;
    (function (Utils) {
        function groupBy(array, field) {
            var dict = {};
            array.forEach(function (item) {
                if (!dict[item[field]])
                    dict[item[field]] = [];
                dict[item[field]].push(item);
            });
            return dict;
        }
        Utils.groupBy = groupBy;
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
        Utils.toTimeString = toTimeString;
        function getNodesByClassName($el, className) {
            return $el.get(0).getElementsByClassName(className);
        }
        Utils.getNodesByClassName = getNodesByClassName;
    })(Utils = FixiGridUI.Utils || (FixiGridUI.Utils = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=utils.js.map