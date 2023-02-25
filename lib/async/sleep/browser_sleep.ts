import Sleep from "./sleep";

/**
 * Sleep utility class suited only for
 * Browser environment
 * @since 25/02/2023
 * @author Felipe Matheus Flohr
 */
export default class BrowserSleep extends Sleep {
    /**
     * Sleeps until the given condition becomes true.
     * @param condition Callback to execute the condition.
     * @returns An empty promise.
     * @since 25/02/2023
     * @author Felipe Matheus Flohr
     */
    public static until(condition: () => boolean | Promise<boolean>): Promise<void> {
        return new Promise(res => {
            const observer = new MutationObserver(async () => {
                if (await condition()) {
                    observer.disconnect();
                    res();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
}