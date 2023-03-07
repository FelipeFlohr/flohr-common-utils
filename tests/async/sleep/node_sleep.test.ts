import { Sleep } from "../../../lib";

describe("Node-suited version of the \"Sleep\" class", () => {
    it("should wait for three seconds", async () => {
        const startDate = new Date().getTime();
        await Sleep.sleep(3000);
        const endDate = new Date().getTime();

        expect(endDate - startDate).toBeGreaterThanOrEqual(3000);
    });
});