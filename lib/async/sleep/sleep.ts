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