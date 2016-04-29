var FixiGridUI;
(function (FixiGridUI) {
    var Models;
    (function (Models) {
        var UIMarkup = (function () {
            function UIMarkup(id) {
                this.cssClasses = {
                    header: "fixiGridHeader",
                    content: "fixiGridContent"
                };
                this.config = {
                    width: 0,
                    height: 0,
                    timeLineWidth: 45
                };
                this.$container = $((typeof (id) == "string") ? document.getElementById(id) : id);
                this.$element = this.$container.append(FixiGridUI.Markup.grid);
                this.d3HeaderComponentContainer = this.d3HeaderSelection;
                this.d3ContentComponentContainer = this.d3ContentSelection.append("g").attr({ transform: "translate(" + this.config.timeLineWidth + ",1)" });
                this.d3TimeLineComponentContainer = this.d3ContentSelection.append("g").attr({ transform: "translate(" + this.config.timeLineWidth + ",1)" });
            }
            Object.defineProperty(UIMarkup.prototype, "$element", {
                get: function () { return this._$element; },
                set: function (value) {
                    this._$element = value;
                    this.headerNode = FixiGridUI.Utils.getNodesByClassName(this.$element, this.cssClasses.header).item(0);
                    this.d3HeaderSelection = d3.select(this.headerNode);
                    this.contentNode = FixiGridUI.Utils.getNodesByClassName(this.$element, this.cssClasses.content).item(0);
                    this.d3ContentSelection = d3.select(this.contentNode);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIMarkup.prototype, "onPrintClick", {
                set: function (handler) {
                    this.$container.find(".print-button").on("click", function () { return handler(); });
                },
                enumerable: true,
                configurable: true
            });
            UIMarkup.prototype.dispose = function () {
                this.$container.off();
                this.$container.empty();
            };
            UIMarkup.prototype.refreshSizeConfiguration = function () {
                this.config.width = this.$container.width() - 25;
                this.config.height = this.$container.height();
                return this.config;
            };
            return UIMarkup;
        }());
        Models.UIMarkup = UIMarkup;
    })(Models = FixiGridUI.Models || (FixiGridUI.Models = {}));
})(FixiGridUI || (FixiGridUI = {}));
//# sourceMappingURL=uimarkup.js.map