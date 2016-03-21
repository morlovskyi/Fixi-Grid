namespace FixiGridUI.Utils {
    export function groupBy<T>(array: T[], field: string): { [key: string]: T[] } {
        var dict: { [key: string]: T[] } = {};
        array.forEach((item: any) => {
            if (!dict[item[field]])
                dict[item[field]] = [];

            dict[item[field]].push(item)
        })
        return dict;
    }
    export function toTimeString(date: Date) {
        var hour = date.getHours();
        var zz = "AM"
        if (hour > 12) {
            hour -= 12;
            zz = "PM";
        }
        var minute = date.getMinutes().toString();
        if (minute.length == 1)
            minute = "0" + minute;

        return hour + ":" + minute + " " + zz;
    }
   
    export function getNodesByClassName($el:JQuery, className:string){
        return $el.get(0).getElementsByClassName(className)
    }
}