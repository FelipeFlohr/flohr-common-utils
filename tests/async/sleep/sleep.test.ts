import { Sleep } from "../../../lib";

describe("Tests the \"Sleep\" class", () => {
    it("should wait for one seconds", async () => {
        const startDate = new Date().getTime();
        await Sleep.sleep(1000);
        const endDate = new Date().getTime();

        expect(endDate - startDate).toBeGreaterThanOrEqual(1000);
        expect(endDate - startDate).toBeLessThanOrEqual(1100);
    });
});