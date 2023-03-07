/**
 * The Array API but it accepts asynchronous
 * functions as callbacks.
 * @template T The type of the array.
 * @since 25/02/2023
 * @author Felipe Matheus Flohr
 */
export default class AsyncArray<T> {
    private readonly array: Array<T>;

    /**
     * Instantiates the class. Requires an array.
     * @param array The array to use in the methods.
     * @since 25/02/2023
     * @author Felipe Matheus Flohr
     * @template T Type of the array.
     */
    public constructor(array: Array<T>) {
        this.array = array;
    }

    /**
     * Iterates through the array calling the provided
     * callback.
     * @param callback Callback function which is going
     * to be call in each iteration. Needs to return a
     * Promise.
     * @param parallel If true, the forEach is going to
     * be used in a "Promise.all", creating an array of
     * callbacks and calling it all at the same time
     * (returns only when all the promises have been resolved).
     * If false, the forEach will work just like a regular
     * synchronous for-each loop, but waits until the
     * previous Promise have been resolved. (default value = true)
     * @since 25/02/2023
     * @author Felipe Matheus Flohr
     */
    public async forEach(callback: (value: T, index: number, array: T[]) => Promise<void>, parallel = true): Promise<void> {
        if (parallel) {
            const promises = this.array.map(callback);
            await Promise.all(promises);
        } else {
            for (let i = 0; i < this.array.length; i++) {
                const item = this.array[i];
                await callback(item, i, this.array);
            }
        }
    }

    /**
     * Calls the callback for each element of the array
     * then returns the array of the manipulated data.
     * @param callback Callback function which is going
     * to be call in each iteration. Needs to return a
     * Promise of the type U.
     * @param parallel If true, the map is going to
     * be used in a "Promise.all", creating an array of
     * callbacks and calling it all at the same time
     * (returns only when all the promises have been resolved).
     * If false, the map will work just like a regular
     * synchronous map loop, but waits until the previous
     * Promise have been resolved. (default value = true)
     * @returns An array of the type U.
     * @template U The return type of the callback.
     * @since 25/02/2023
     * @author Felipe Matheus Flohr
     */
    public async map<U>(callback: (value: T, index: number, array: T[]) => Promise<U>, parallel = true): Promise<U[]> {
        const result: U[] = [];

        const thisAsync = new AsyncArray(this.array);
        await thisAsync.forEach(async (item, index, array) => {
            result.push(await callback(item, index, array));
        }, parallel);

        return result;
    }
}