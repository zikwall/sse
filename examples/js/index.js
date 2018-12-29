window.onload = () => {

    /**
     * or using attach events on {Open, Close, Error}
     * let sse = new SSE('https://event-stream/index', true
     *      event => {
     *          console.log('Hip!');
     *      },
     *      event => {
     *          console.log('Hop!');
     *      }
     *      event => {
     *          console.log('Ops!');
     *      }
     * );
     */
    let sse = new SSE('https://event-stream/index');

    /**
     * add custom event
     */
    sse.addDocumentEvent('beforePin', event => {
        sse.toConsole('I\'m beforePin text! In time: ' + event.detail.timestamp, 'event');
    });

    // use system events
    sse.addDocumentEvent(sse.getEvents().onBeforeInit, event => {
        sse.toConsole('I\'m beforeInit event text!' , 'event');
    });

    sse.addDocumentEvent(sse.getEvents().onBeforeClose, event => {
        sse.toConsole('I\'m beforeClose event text!', 'event');
    });

    sse.addDocumentEvent(sse.getEvents().onBeforeOpen, event => {
        sse.toConsole('I\'m beforeOpen event text!', 'event');
    });

    sse.addSourceEvent('pin', event => {
        /**
         * trigger custom event
         */
        Event.trigger('beforePin', {
            timestamp: (new Date()).getTime()
        });

        sse.toConsole(event.data);
    }, false);

    sse.addSourceEvent('activate', event => {
        sse.toConsole(event.data);
        sse.close();
    });

    sse.addSourceEvent('timeout', event => {
        sse.toConsole(event.data);
        sse.toConsole('Close connection by timeout', 'info');
        sse.close();
    });
}