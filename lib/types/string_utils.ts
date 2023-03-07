/**
 * String utility class
 * @since 07/03/2023
 * @author Felipe Matheus Flohr
 */
export default class StringUtils {
    /**
     * Returns true if the string is empty
     * @param val String to check
     * @returns true if is empty
     * @since 07/03/2023
     * @author Felipe Matheus Flohr
     */
    public static isEmpty(val: string) {
        return val.trim() === "";
    }

    /**
     * Returns true if the string is not empty
     * @param val String to check
     * @returns true if is not empty
     * @since 07/03/2023
     * @author Felipe Matheus Flohr
     */
    public static isNotEmpty(val: string) {
        return !this.isEmpty(val);
    }

    /**
     * This class only contains static methods,
     * therefore it is not necessary to instantiate
     * it.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}
}