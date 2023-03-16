/**
 * Sleep utility class.
 * @since 25/02/2023
 * @author Felipe Matheus Flohr
 */
export default class Sleep {
    /**
     * Waits the given duration.
     * @param duration Duration in ms.
     * @returns A empty promise.
     * @since 25/02/2023
     * @author Felipe Matheus Flohr
     */
    public static sleep(duration: number): Promise<void> {
        return new Promise<void>(res => {
            setTimeout(() => {
                res();
            }, duration);
        });
    }

    /**
     * Creates a Promise that never
     * resolves.
     * @returns An eternal promise.
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public static forever(): Promise<void> {
        return new Promise<void>(res => {
            // eslint-disable-next-line no-constant-condition
            if (false) {
                res();
            }
        });
    }

    /**
     * Creates a Promise that resolves
     * when the condition returns true.
     * @param condition Function that
     * returns a boolean.
     * @param tick The "setInterval"
     * interval in milliseconds. Default
     * is 500ms.
     * @returns An empty promise.
     */
    public static until(condition: () => boolean, tick = 500): Promise<void> {
        return new Promise<void>(res => {
            const interval = setInterval(() => {
                if (condition()) {
                    res();
                    clearInterval(interval);
                }
            }, tick);
        });
    }

    /**
     * Since it only exports static methods,
     * there is no need for instantiate this class.
     * It is only marked as "protected" for
     * inheritance.
     * @since 25/02/2023
     * @author Felipe Matheus Flohr
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected constructor() {}
}