import EventEmitter from "events";
import Sleep from "./sleep";

/**
 * Sleep utility class suited only for
 * Node.js
 * @since 25/02/2023
 * @author Felipe Matheus Flohr
 */
export default class NodeSleep extends Sleep {
    /**
     * Sleeps until the given condition becomes true.
     * @param condition Callback to execute the condition.
     * @returns An empty promise.
     * @since 25/02/2023
     * @author Felipe Matheus Flohr
     */
    public static until(condition: () => boolean | Promise<boolean>): Promise<void> {
        const emitter = new EventEmitter();
        const listener = async () => {
            if (await condition()) {
                emitter.removeListener("event", listener);
                emitter.emit("done");
            }
        };

        emitter.on("event", listener);
        return new Promise<void>(res => {
            emitter.once("done", res);
        });
    }
}