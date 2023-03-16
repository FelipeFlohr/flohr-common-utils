/**
 * Error thrown when there is a
 * tentative of using "Queue.close()"
 * in a already closed/not running
 * queue.
 * 
 * @since 13/03/2023
 * @author Felipe Matheus Flohr
 */
export default class QueueAlreadyClosedError extends Error {
    public constructor() {
        super("Queue is already closed.");
    }
}