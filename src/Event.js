class Event
{
    /**
     *
     * @param name
     * @param param
     */
    static trigger(name, param = null) {
        let event = new CustomEvent(name, {
            detail: param
        });

        document.dispatchEvent(event);

        return event;
    }

    /**
     *
     * @param object
     * @param event
     * @param callback
     * @param use
     */
    static addEvent(object, event, callback, use = false) {
        if(this._eventList === undefined) {
            this._eventList = []
        }

        object.addEventListener(event, (e) => {
            callback(e);
        }, use);

        this._eventList.push(event);
    }

    /**
     *
     * @returns {Array} registered events
     */
    static getEvents() {
        return this._eventList;
    }
}