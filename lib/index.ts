import AsyncArray from "./async/array/async_array";
import ReduceWithoutInitialValueError, {
    UndefinedInitialValueCause,
} from "./async/array/errors/reduce_without_initial_value";
import Sleep from "./async/sleep/sleep";
import EsLintConfigs from "./linter/eslint_configs";
import QueueAlreadyClosedError from "./queue/errors/queue_already_closed";
import QueueAlreadyRunningError from "./queue/errors/queue_already_running";
import Queue from "./queue/queue";
import StringUtils from "./types/string_utils";

/**
 * Entrypoint of the library. Contains only
 * exports.
 * @since 25/02/2023
 * @author Felipe Matheus Flohr
 */
export {
    EsLintConfigs,
    AsyncArray,
    ReduceWithoutInitialValueError,
    UndefinedInitialValueCause,
    Sleep,
    StringUtils,
    Queue,
    QueueAlreadyRunningError,
    QueueAlreadyClosedError
};
