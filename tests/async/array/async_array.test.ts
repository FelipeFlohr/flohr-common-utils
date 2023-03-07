import { AsyncArray, Sleep } from "../../../lib";

describe("Tests of the Async Array class", () => {
    it("should resolve the promises in parallel", () => {
        const promises = [
            () => Sleep.sleep(1000),
            () => Sleep.sleep(1000),
            () => Sleep.sleep(1000)
        ];

        const asyncArray = new AsyncArray(promises);

        const initDate = new Date().getTime();
        asyncArray.forEach(async f => {
            return await f();
        }, true);
        const finalDate = new Date().getTime();

        expect(finalDate - initDate).toBeLessThanOrEqual(1100);
    });

    it("should resolve the promises in sequence", () => {
        const promises = [
            () => Sleep.sleep(500),
            () => Sleep.sleep(500),
            () => Sleep.sleep(500)
        ];

        const asyncArray = new AsyncArray(promises);

        const initDate = new Date().getTime();
        asyncArray.forEach(async f => {
            return await f();
        }, false);
        const finalDate = new Date().getTime();

        expect(finalDate - initDate).toBeLessThanOrEqual(1600);
    });

    it("should map the array in parallel", async () => {
        const first = async () => {
            await Sleep.sleep(500);
            return 1;
        };
        const second = async () => {
            await Sleep.sleep(300);
            return 2;
        };
        const third = async () => {
            await Sleep.sleep(100);
            return 3;
        };

        const promises = [
            first,
            second,
            third
        ];
        const result = await new AsyncArray(promises).map(async (i) => {
            return i();
        }, true);

        expect(result[0]).toBe(3);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(1);
    });

    it("should map the array in sequence", async () => {
        const first = async () => {
            await Sleep.sleep(100);
            return 1;
        };
        const second = async () => {
            await Sleep.sleep(150);
            return 2;
        };
        const third = async () => {
            await Sleep.sleep(200);
            return 3;
        };

        const promises = [
            first,
            second,
            third
        ];
        const result = await new AsyncArray(promises).map(async (i) => {
            return i();
        }, true);

        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);
    });
});