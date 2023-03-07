/**
 * Exception thrown in the "reduce" method of the AsyncArray
 * API. Thrown whenever the initial value and the array is
 * empty.
 */
export default class ReduceWithoutInitialValueError extends Error {
    /**
     * Constructor of the class
     * @param cause The cause for the error. Determines if the
     * cause was the empty array or the undefined initial value
     */
    public constructor(cause: UndefinedInitialValueCause) {
        super(`Cannot reduce ${ReduceWithoutInitialValueError.getExceptionCause(cause)}.`);
    }

    private static getExceptionCause(cause: UndefinedInitialValueCause): string {
        switch (cause) {
            case UndefinedInitialValueCause.EMPTY_ARRAY:
                return "empty array";
            case UndefinedInitialValueCause.UNDEFINED_INITIAL_VALUE:
                return "undefined initial value";
        }
    }
}

/**
 * Enum containing the possibles
 * causes for the exception be thrown
 */
export enum UndefinedInitialValueCause {
    EMPTY_ARRAY,
    UNDEFINED_INITIAL_VALUE,
}