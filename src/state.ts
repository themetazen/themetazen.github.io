export function State() {
    this.actions = {};
    this.subscriptions = [];
    this.history = [];
}

State.prototype.subscribe = function(elem: any, action: string | number, callback: { apply: (arg0: any, arg1: any) => void; }) {
    this.subscriptions[action] = this.subscriptions[action] || [];
    this.subscriptions[action].push(function(data: any) {
        callback.apply(elem, data);
    });
}

State.prototype.dispatch = function(action: string | number, data: any[]) {
    if (!Array.isArray(data)) {
        data = [data];
    } else if (Array.isArray(data)) {
        data = data || [];
    }

    this.history.push([action, data]);

    if ("function" === typeof this[action]) {
        this[action].apply(this, data);
    }

    data.push(action);
    data.push(this);

    this.subscriptions[action] = this.subscriptions[action] || [];
    this.subscriptions[action].forEach(
        function(subscription: (arg0: any) => void) {
            subscription(data);
        }
    );
}