<?php

namespace zikwall\sse\examples;

/**
 * Class SSE
 * @package zikwall\sse\examples
 */
class SSE
{
    /**
     *
     * @var boolean
     */
    private $_headerSent;

    private function sendHeader() : void
    {
        if (!$this->_headerSent && !headers_sent()) {
            $this->_headerSent = true;
            header("Content-Type: text/event-stream");
            header('Cache-Control: no-cache');
        }
    }

    /**
     * @param $eventType string
     * @param  $data array|null
     * @param $retry int|null
     */
    public function event(string $eventType, array $data = null, int $retry = null) : void
    {
        $this->sendHeader();

        if (is_array($data)) {
            $data = json_encode($data);
        }

        $event = [
            'id'    => uniqid('', true),
            'type'  => $eventType,
            'data'  => (string)$data,
        ];

        if($retry) {
            $event['retry'] = $retry;
        }

        echo new Event($event);
    }

    /**
     * @param string $status
     */
    public function end(string $status) : void
    {
        //\Yii::$app->end($status);
        exit();
    }

    /**
     * @param int $seconds
     */
    public function sleep(int $seconds = 2) : void
    {
        sleep($seconds);
    }

    /**
     * @param array $data
     */
    protected function sendData(array $data) : void
    {
        if (is_array($data)) {
            $data = json_encode($data);
        }

        $messages = explode("\n", $data);

        foreach ($messages as $message) {
            echo "data: {$message}\n";
        }
    }

    /**
     * @param array $data
     */
    public function message(array $data) : void
    {
        $this->sendHeader();

        $this->sendData($data);

        echo "\n";
    }

    /**
     * @param string $id
     * @param array $data
     */
    public function id(string $id, array $data = []) : void
    {
        $this->sendHeader();

        echo "id: {$id}\n";

        $this->sendData($data);

        echo "\n";
    }

    /**
     * @param int $time
     */
    public function retry(int $time) : void
    {
        $this->sendHeader();

        echo "retry: {$time}\n\n";
    }

    public function flush() : void
    {
        $this->sendHeader();

        ob_flush();
        flush();
    }
}