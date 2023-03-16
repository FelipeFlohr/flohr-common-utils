/**
 * An abstraction of the array
 * used specifically in the Queue.
 * It provides some basic callbacks
 * for when an item is added or
 * removed.
 * @template T The type of the array.
 * 
 * @since 13/03/2023
 * @author Felipe Matheus Flohr
 */
export default class QueueArray<T> {
    /**
     * Callback called whenever
     * an item is added.
     * 
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public onAdd?: (item: T) => void | Promise<void>;
    /**
     * Callback called whenever
     * an item is removed.
     * 
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public onRemove?: (item: T) => void | Promise<void>;
    /**
     * Array holding the items.
     * 
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    private readonly array: T[];

    public constructor() {
        this.array = [];
    }

    /**
     * Adds an item to the array.
     * @param item Item to be add.
     * 
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public add(item: T): void {
        this.array.push(item);
        if (this.onAdd) {
            this.onAdd(item);
        }
    }

    /**
     * Removes an item from the array
     * using the item's index.
     * @param index Item index.
     * 
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public remove(index: number): void {
        const item = this.array[index];
        this.array.splice(index, 1);
        if (this.onRemove) {
            this.onRemove(item);
        }
    }

    /**
     * Moves an item from this array
     * to another array.
     * @param itemIndex Item index
     * to be moved from this array.
     * @param destiny Array to which
     * the item will be added.
     * 
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public moveToAnotherArray(itemIndex: number, destiny: QueueArray<T>): void {
        const item = this.array[itemIndex];
        this.remove(itemIndex);
        destiny.add(item);
    }

    /**
     * Returns the length of the
     * array.
     * @returns Length of the array. 
     */
    public getLength(): number {
        return this.array.length;
    }

    /**
     * Returns a copy of the
     * array.
     * @returns Copy of the array. 
     */
    public getArray(): T[] {
        return [...this.array];
    }
}