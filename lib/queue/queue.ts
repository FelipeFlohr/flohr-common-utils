import Sleep from "../async/sleep/sleep";
import Unique from "../unique/unique";
import QueueAlreadyClosedError from "./errors/queue_already_closed";
import QueueAlreadyRunningError from "./errors/queue_already_running";
import QueueArray from "./queue_array";

/**
 * A queue for resolving
 * promises.
 * @template T The input type of
 * the process callback.
 * @template U The output type of
 * the process callback.
 *
 * @since 13/03/2023
 * @author Felipe Matheus Flohr
 */
export default class Queue<T, U> {
    /**
     * Callback called when the
     * queue starts.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public onStart?: () => void | Promise<void>;
    /**
     * Callback called when the
     * "onProcess" callback finished.
     * The "data" param is the returning
     * data from the "onProcess" callback.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public onProcessed?: (data: U) => void | Promise<void>;
    /**
     * Callback called when the queue
     * will be closed.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public onEnd?: () => void | Promise<void>;
    /**
     * Callback called when a process
     * throws an error.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public onError?: (data: T, error: unknown) => void | Promise<void>;
    /**
     * Callback called for processing
     * an item.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    private readonly onProcess: (data: T) => U | Promise<U>;

    /**
     * Entities being currently
     * processed.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    private readonly processingEntities: QueueArray<Entity<T>>;
    /**
     * Entities queued up that will
     * be eventually processed.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    private readonly queuedEntities: QueueArray<Entity<T>>;
    private _isRunning: boolean;

    /**
     * Max amount of promises
     * that can be resolved at
     * the same time.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    private readonly maxResolvingPromises: number;
    /**
     * If keep alive is true,
     * then the queue status will be
     * running until someone calls "close()".
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    private readonly keepAlive: boolean;

    /**
     * Creates an instance of the queue.
     * @param onProcess The process callback
     * that will be called for every item.
     * @param maxResolvingPromises The maximum
     * amount of promises that can be resolved
     * at the same time.
     * @param keepAlive If keep alive is true,
     * then the queue status will be running
     * until someone calls "close()".
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public constructor(
        onProcess: (data: T) => U | Promise<U>,
        maxResolvingPromises = 1,
        keepAlive = false
    ) {
        this.processingEntities = new QueueArray();
        this.queuedEntities = new QueueArray();
        this._isRunning = false;

        this.onProcess = onProcess;
        this.maxResolvingPromises = maxResolvingPromises;
        this.keepAlive = keepAlive;

        this.setQueuedEntitiesCallbacks();
        this.setProcessingEntitiesCallbacks();
    }

    public get isRunning(): boolean {
        return this._isRunning;
    }

    /**
     * Adds an item to the
     * array.
     * @param item Item to be add.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public add(item: T): void;
    /**
     * Adds items to the array.
     * @param items Items to be add.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public add(items: T[]): void;
    public add(items: T | T[]): void {
        const id = Unique.id();
        if (Array.isArray(items)) {
            for (const item of items) {
                this.queuedEntities.add({
                    id: id,
                    data: item,
                });
            }
        } else {
            this.queuedEntities.add({
                id: id,
                data: items,
            });
        }
    }

    /**
     * Starts the queue.
     * @throws QueueAlreadyRunningError
     * if "isRunning" is true.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public start(): void {
        if (this.isRunning) {
            throw new QueueAlreadyRunningError();
        }
        this.isRunning = true;

        this.initialKick();

        if (this.onStart) {
            this.onStart();
        }
        if (this.keepAlive) {
            Sleep.until(() => !this._isRunning);
        } else {
            this.checkIsRunning();
        }
    }

    /**
     * Closes the queue.
     * @throws QueueAlreadyClosedError
     * if "isRunning" is false.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    public async close(): Promise<void> {
        if (!this.isRunning) {
            throw new QueueAlreadyClosedError();
        }

        await this.waitForProcessesBeResolved();
        this._isRunning = false;
    }

    /**
     * The initial kick needed for
     * starting the queue.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    private async initialKick(): Promise<void> {
        const promises = this.processingEntities.getArray().map(async (i) => {
            return await this.processItem(i);
        });
        await Promise.all(promises);
    }

    /**
     * Processes an item.
     * @param item Item to be processed.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    private async processItem(item: Entity<T>): Promise<void> {
        try {
            const value = await this.onProcess(item.data);
            if (this.onProcessed) {
                await this.onProcessed(value);
            }
        } catch (e) {
            if (this.onError) {
                await this.onError(item.data, e);
            } else {
                throw e;
            }
        } finally {
            const itemIndex = this.processingEntities
                .getArray()
                .findIndex((i) => i.id === item.id);
            this.processingEntities.remove(itemIndex);
        }
    }

    /**
     * Defines the queuedEntities
     * callbacks.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    private setQueuedEntitiesCallbacks() {
        this.queuedEntities.onAdd = () => {
            if (
                this.processingEntities.getLength() < this.maxResolvingPromises
            ) {
                this.queuedEntities.moveToAnotherArray(
                    0,
                    this.processingEntities
                );
            }
        };
    }

    /**
     * Defined the processingEntities
     * callbacks.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    private setProcessingEntitiesCallbacks() {
        this.processingEntities.onAdd = async (item) => {
            if (this.isRunning) {
                await this.processItem(item);
            }
        };
        this.processingEntities.onRemove = async () => {
            if (
                this.processingEntities.getLength() <
                    this.maxResolvingPromises &&
                this.queuedEntities.getLength() > 0
            ) {
                this.queuedEntities.moveToAnotherArray(
                    0,
                    this.processingEntities
                );
            }
            if (this.processingEntities.getLength() === 0) {
                if (!this.keepAlive && !this.isRunning) {
                    await this.close();
                }
                if (this.onEnd) {
                    this.onEnd();
                }
            }
        };
    }

    /**
     * Creates a promise that will
     * resolves when all processes
     * are resolved.
     * @returns An empty promise.
     *
     * @since 13/03/2023
     * @author Felipe Matheus Flohr
     */
    private async waitForProcessesBeResolved(): Promise<void> {
        return await Sleep.until(() => this.processingEntities.getLength() === 0, 150);
    }

    /**
     * Checks from 500ms to 500ms
     * to see if there is no process
     * to be solved. If there isn't
     * and "keepAlive" is false, then
     * it will close.
     * 
     * @since 15/03/2023
     * @author Felipe Matheus Flohr
     */
    private checkIsRunning(): void {
        const interval = setInterval(async () => {
            console.log(this.processingEntities.getLength() === 0 && this.isRunning);
            if (this.processingEntities.getLength() === 0 && this.isRunning) {
                await this.close();
                clearInterval(interval);
            }
        }, 500);
    }

    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    private set isRunning(val: boolean) {
        if (!this._isRunning) {
            this._isRunning = val;
        }
    }
}

/**
 * The entity model
 * used for creating unique
 * items
 *
 * @since 13/03/2023
 * @author Felipe Matheus Flohr
 */
export interface Entity<T> {
    readonly id: string;
    readonly data: T;
}
