import {
    Queue, Sleep,
} from "../../lib";

describe("Tests the async queue", () => {
    it("should throw an exception if there is a start tentative and the queue is already running", () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            const queue = new Queue<void, void>(() => {}, 2, false);
            queue.start();
            queue.start();
        }).toThrow();
    });

    it("should resolve promises within the max amount and queue the rest", () => {
        const queue = new Queue<number, void>(async () => {
            await Sleep.sleep(500);
        }, 2, false);
        queue.add(1, 2, 3);

        const initDate = new Date();
        queue.onEnd = () => {
            const finishDate = new Date();
            const timeSpent = finishDate.getTime() - initDate.getTime();

            expect(timeSpent).toBeLessThanOrEqual(1100);
            expect(timeSpent).toBeGreaterThanOrEqual(1000);
        };
        queue.start();
    });

    it("should resolve the promises one at a time", () => {
        const queue = new Queue<number, void>(async () => {
            await Sleep.sleep(100);
        }, 1, false);
        queue.add(1, 2, 3);

        const initDate = new Date();
        queue.onEnd = () => {
            const finishDate = new Date();
            const timeSpent = finishDate.getTime() - initDate.getTime();

            expect(timeSpent).toBeLessThanOrEqual(650);
            expect(timeSpent).toBeGreaterThanOrEqual(300);
        };
        queue.start();
    });

    it("should keep a queue alive", async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const queue = new Queue<void, void>(() => {}, 2, true);
        queue.start();

        await Sleep.sleep(1000);
        expect(queue.isRunning).toBeTruthy();
        await queue.close();
    });

    it("should not keep a queue alive", async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const queue = new Queue<void, void>(() => {}, 2, false);
        queue.start();

        await Sleep.sleep(1300);
        expect(queue.isRunning).toBeFalsy();
    });
});
