<?php

require_once 'Event.php';
require_once 'SSE.php';

/**
 * Handle for stream. Example, PIN generation for subsequent authorization.
 */

ini_set('max_execution_time', 80);
set_time_limit(80);

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('X-Accel-Buffering: no');


$sse = new SSE();

$time = time() + Pin::getDuration();
$isSend = false;
$pin = (int)Pin::pin(4);

while (true) {

    if($isSend) {

        $pinCache = Pin::getPin($pin);

        // if found PIN
        if($pinCache) {

            // send event ACTIVATE
            $sse->event('activate', [
                'type' => 'event',
                'userMail' => $pinCache['user'],
                'pin' => $pin,
                'message' => 'Pin successfully activated'
            ]);

            // auth use here
            User::auth();

            // delete auth PIN
            Pin::delete($pin);

            if (connection_aborted()) {
                $sse->end(200);
            }
        }

        // expire PIN
        if($time < time()) {
            $sse->event('timeout', [
                'type' => 'event',
                'pin' => $pin,
                'message' => 'PIN timed out!'
            ]);

            //$sse->message(['END-OF-STREAM']);

            $sse->end(200);
        }

        $sse->sleep(1);

    } else {
        // first send PIN event with generation pin-code
        $sse->event('pin', [
            'type' => 'event',
            'pin' => $pin,
            'duration' => Pin::getDuration(),
            'durationType' => 'seconds',
            'expireIn' => date('H:i:s', $time)
        ]);

        $isSend = true;
    }

    $sse->flush();
}

$sse->end(200);