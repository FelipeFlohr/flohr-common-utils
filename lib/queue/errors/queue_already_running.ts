/**
 * Error thrown when there is a
 * tentative of using "Queue.start()"
 * in a already running
 * queue.
 * 
 * @since 13/03/2023
 * @author Felipe Matheus Flohr
 */
export default class QueueAlreadyRunningError extends Error {
    public constructor() {
        super("Queue already running");
    }
}