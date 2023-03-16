import getNodeUniqueId from "./helpers/node_unique_id";

/**
 * Class containing helper methods
 * used for generate unique data.
 */
export default class Unique {
    /**
     * Private constructor since it
     * only holds static methods
     * 
     * @since 12/03/2023
     * @author Felipe Matheus Flohr
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    /**
     * Generates an unique ID
     * using "crypto"
     * @returns An unique ID
     * 
     * @since 12/03/2023
     * @author Felipe Matheus Flohr
     */
    public static id(): string {
        const isNode = typeof window === "undefined";
        return isNode ? getNodeUniqueId() : crypto.randomUUID();
    }
}