<?php

namespace zikwall\sse\examples;

/**
 * Class Event
 * @package zikwall\sse\examples
 */
class Event
{
    /**
     * @var mixed|null Stream id
     */
    protected $id;

    /**
     * @var mixed|null Event type
     */
    protected $type;

    /**
     * @var mixed|null Data of stream
     */
    protected $data;

    /**
     * @var mixed|null
     */
    protected $retry;

    /**
     * @var mixed|null
     */
    protected $comment;

    /**
     * Event constructor.
     * @param array $event [id=>id, type=>type ,data=>data, retry=>retry, comment=>comment]
     */
    public function __construct(array $event)
    {
        $this->id      = isset($event['id'])      ? $event['id']      : null;
        $this->type    = isset($event['type'])    ? $event['type']    : null;
        $this->data    = isset($event['data'])    ? $event['data']    : null;
        $this->retry   = isset($event['retry'])   ? $event['retry']   : null;
        $this->comment = isset($event['comment']) ? $event['comment'] : null;
    }

    public function __toString()
    {
        $event = [];

        strlen($this->comment) > 0 && $event[] = sprintf(': %s', $this->comment);//:comments
        strlen($this->id) > 0 && $event[]      = sprintf('id: %s', $this->id);
        strlen($this->retry) > 0 && $event[]   = sprintf('retry: %s', $this->retry);//millisecond
        strlen($this->type) > 0 && $event[]    = sprintf('event: %s', $this->type);
        strlen($this->data) > 0 && $event[]    = sprintf('data: %s', $this->data);

        return implode("\n", $event) . "\n\n";
    }
}