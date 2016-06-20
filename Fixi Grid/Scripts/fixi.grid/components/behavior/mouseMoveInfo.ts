namespace FixiGridUI.FixiGridComponents.Behaviors {
    export class MouseMoveInfo {
        public pageX = 0
        public pageY = 0
        public movementX = 0
        public movementY = 0
        public moveEvent: MouseEvent = null;
        get offsetX() {
            if (!this.moveEvent) return 0;
            return this.moveEvent.pageX - this.startEvent.pageX
        }
        get offsetY() {
            if (!this.moveEvent) return 0;
            return this.moveEvent.pageY - this.startEvent.pageY
        }

        constructor(public startEvent: MouseEvent) {
            this.pageX = startEvent.pageX;
            this.pageY = startEvent.pageY;
        }
        public move = (moveEvent: MouseEvent) => {
            this.moveEvent = moveEvent;
            
            this.movementX = this.moveEvent.pageX - this.pageX;
            this.movementY = this.moveEvent.pageY - this.pageY;

            this.pageX = this.moveEvent.pageX;
            this.pageY = this.moveEvent.pageY;
        }
    }
}