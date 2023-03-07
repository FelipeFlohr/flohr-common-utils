import ReduceWithoutInitialValueError, { UndefinedInitialValueCause } from "./errors/reduce_without_initial_value";

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
        if (parallel) {
            const promises = this.array.map(callback);
            return await Promise.all(promises);
        }

        const resArray: U[] = [];
        for (let i = 0; i < this.array.length; i++) {
            const item = this.array[i];
            const res = await callback(item, i, this.array);
            resArray.push(res);
        }

        return resArray;
    }

    /**
     * Calls the callback function for all elements in
     * the array. The return of a function is accumulated
     * through all iterations. Returns the accumulated
     * value.
     * @param callback Callback function that accepts up
     * to four arguments: the previous value, the current
     * value, the iteration's index and the array used
     * in the method.
     * @param config Configuration object. Has two properties:
     * "parallel" indicating if the reduce callback should
     * be called simultaneously for all items and
     * "acceptEmptyInitialValue" which indicates if the method
     * should throw an error if the initial value or the
     * array is empty (be aware that if "acceptEmptyInitialValue"
     * is true, then the return may be an undefined value).
     * Default is: parallel = false; acceptEmptyInitialValue = true.
     * @param initialValue Initial value to be used. If no
     * value is passed, then it will use the first element
     * of the array.
     * @throws ReduceWithoutInitialValueError if "acceptEmptyInitialValue"
     * is false and the initial value or the array is empty/undefined.
     * @returns The accumulated result of the callback calls.
     * Be aware that if "acceptEmptyInitialValue" is true, then it may
     * return an undefined value.
     * @since 07/03/2023
     * @author Felipe Matheus Flohr
     */
    public async reduce(callback: (previousValue: T, currentValue: T, index: number, array: T[]) => Promise<T>, config?: AsyncReduceConfigEmptyTrue, initialValue?: T): Promise<T | undefined>;
    /**
     * Calls the callback function for all elements in
     * the array. The return of a function is accumulated
     * through all iterations. Returns the accumulated
     * value.
     * @param callback Callback function that accepts up
     * to four arguments: the previous value, the current
     * value, the iteration's index and the array used
     * in the method.
     * @param config Configuration object. Has two properties:
     * "parallel" indicating if the reduce callback should
     * be called simultaneously for all items and
     * "acceptEmptyInitialValue" which indicates if the method
     * should throw an error if the initial value or the
     * array is empty (be aware that if "acceptEmptyInitialValue"
     * is true, then the return may be an undefined value).
     * Default is: parallel = false; acceptEmptyInitialValue = true.
     * @param initialValue Initial value to be used. If no
     * value is passed, then it will use the first element
     * of the array.
     * @throws ReduceWithoutInitialValueError if "acceptEmptyInitialValue"
     * is false and the initial value or the array is empty/undefined.
     * @returns The accumulated result of the callback calls.
     * Be aware that if "acceptEmptyInitialValue" is true, then it may
     * return an undefined value.
     * @since 07/03/2023
     * @author Felipe Matheus Flohr
     */
    public async reduce(callback: (previousValue: T, currentValue: T, index: number, array: T[]) => Promise<T>, config?: AsyncReduceConfigEmptyFalse, initialValue?: T): Promise<T>;
    public async reduce(callback: (previousValue: T, currentValue: T, index: number, array: T[]) => Promise<T>, config?: AsyncReduceConfig, initialValue?: T): Promise<T | undefined> {
        if (config?.acceptEmptyInitialValue === false) {
            if (initialValue == undefined && this.array.length === 0) {
                throw new ReduceWithoutInitialValueError(UndefinedInitialValueCause.UNDEFINED_INITIAL_VALUE);
            } else if (this.array.length === 0) {
                throw new ReduceWithoutInitialValueError(UndefinedInitialValueCause.EMPTY_ARRAY);
            }
        } else {
            if (initialValue == undefined && this.array.length === 0) {
                return undefined;
            }
        }

        let val = initialValue != undefined ? initialValue : this.array[0];

        await this.forEach(async (item, i) => {
            val = await callback(val, item, i, this.array);
        }, config?.parallel === true);

        return val;
    }
}

/**
 * Configuration type used
 * in the "reduce" method.
 */
export type AsyncReduceConfig = {
    readonly parallel?: boolean
    readonly acceptEmptyInitialValue?: boolean
}

/**
 * Configuration type that holds
 * "acceptEmptyInitialValue" as true.
 */
export type AsyncReduceConfigEmptyTrue = {
    readonly parallel?: boolean
    readonly acceptEmptyInitialValue: true
}

/**
 * Configuration type that holds
 * "acceptEmptyInitialValue" as false
 * or undefined.
 */
export type AsyncReduceConfigEmptyFalse = {
    readonly parallel?: boolean
    readonly acceptEmptyInitialValue: false | undefined
}