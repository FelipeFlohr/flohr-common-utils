import AsyncArray from "./async/array/async_array";
import BrowserSleep from "./async/sleep/browser_sleep";
import NodeSleep from "./async/sleep/node_sleep";
import Sleep from "./async/sleep/sleep";
import EsLintConfigs from "./linter/eslint_configs";

/**
 * Entrypoint of the library. Contains only
 * exports.
 * @since 25/02/2023
 * @author Felipe Matheus Flohr
 */
export {
    EsLintConfigs,
    AsyncArray,
    Sleep,
    NodeSleep,
    BrowserSleep
};
