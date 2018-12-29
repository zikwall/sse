/**
 * Class Server Side Events wrap over native JavaScript SSE.
 * Extended Events and fully control, and most importantly easy using
 */
class SSE
{
    /**
     * @param url the path that opens the channel for streaming
     * @param withCredentials boolean
     * @param onOpen argument is callable function used for open gevent on EventSource
     * @param onClose argument is callable function used for close event on EventSource
     * @param onError argument is callable function used for error event on EventSource
     */
    constructor(url, withCredentials = true, onOpen = null, onClose = null, onError = null) {

        this.beforeInit();

        this.source = new EventSource(url, {
            withCredentials: withCredentials
        });

        this.onOpen(onOpen);
        this.onError(onError);
        this.onClose(onClose);

        Event.trigger(this.getEvents().onAfterInit);
    }

    attachEvents() {
        this._events = {
            onBeforeInit: 'beforeInit',
            onAfterInit: 'afterInit',

            onBeforeClose: 'beforeClose',
            onAfterClose: 'afterClose',

            onBeforeOpen: 'beforeOpen',
            onAfterOpen: 'afterOpen',

            onBeforeError: 'beforeError',
            onAfterError: 'afterError',

            onClose: 'onClose',
        };
    }

    beforeInit() {
        if(!window.EventSource) {
            this.toConsole('Oop\'s... EventSource is not supported', 'error');

            return false;
        }

        this.attachEvents();

        Event.addEvent(window, 'beforeunload', () => {
            if(!!this.source && this.source instanceof window.EventSource) {
                /**
                 * or this.close() for use events
                 */
                this.source.close();
            }
        });

        Event.trigger(this.getEvents().onBeforeInit);
    }

    close() {
        Event.trigger(this.getEvents().onBeforeClose);

        Event.trigger(this.getEvents().onClose);
        this.source.close();

        Event.trigger(this.getEvents().onAfterClose);
    }

    onClose(on) {
        if (typeof on !== 'function' || on === null) {
            return false;
        }

        this.addDocumentEvent(this.getEvents().onClose, e => {
            on(e);
        });
    }

    onOpen(on) {
        if (typeof on !== 'function' || on === null) {
            on = e => {
                this.toConsole('Connection open', 'info');
            }
        }

        this.source.onopen = e => {
            Event.trigger(this.getEvents().onBeforeOpen);
            on(e);
            Event.trigger(this.getEvents().onAfterOpen);
        };
    }

    onError(on) {
        if (typeof on !== 'function' || on === null) {
            on = e => {
                if (this.readyState === EventSource.CONNECTING) {
                    this.toConsole('Connection aborterd, reconnection...');
                } else {
                    this.toConsole('Error, state is: ' + this.readyState, 'error');
                    this.source.close();
                }
            }
        }

        this.source.onerror = e => {
            Event.trigger(this.getEvents().onBeforeError);
            on(e);
            Event.trigger(this.getEvents().onAfterError);
        };
    }

    /**
     *
     * @param event
     * @param callback
     * @param use
     */
    addSourceEvent(event, callback, use = false) {
        Event.addEvent(this.source, event, (e) => {
            callback(e);
        }, use);
    }

    /**
     *
     * @param event
     * @param callback
     * @param use
     */
    addDocumentEvent(event, callback, use = false) {
        Event.addEvent(document, event, (e) => {
            callback(e);
        }, use);
    }

    getEvents() {
        return this._events;
    }

    /**
     *
     * @param message
     * @param type
     */
    toConsole(message, type) {
        let preMessage = 'Console Helper';

        switch (type) {
            case 'error':
                console.log("%c" + preMessage + ":%c " + message, 'background: #C12127; color: black;');
                break;
            case 'info':
                console.log("%c" + preMessage + ":%c " + message, 'background: #b9f0d5; color: black;');
                break;
            case 'event':
                console.log("%c" + preMessage + ":%c " + message, 'background: #edeb60; color: black;');
                break;
            case 'warn':
                console.warn(message);
                break;
            default:
                console.log("%c" + preMessage + ":%c " + message, 'background: #b9d7f0; color: black;');
                break;
        }
    }
}