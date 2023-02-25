import nodeConfigs from "./configs/node.eslintrc.json";
import browserConfigs from "./configs/browser.eslintrc.json";
import reactConfigs from "./configs/react.eslintrc.json";

/**
 * Export static fields containing the ESLint settings
 * for multiple environments
 * @since 25/02/2023
 * @author Felipe Matheus Flohr
 */
export default class EsLintConfigs {
    /**
     * Node lint settings.
     * @since 25/02/2023
     * @author Felipe Matheus Flohr
     */
    public static readonly node = nodeConfigs;
    /**
     * Browser lint settings (no framework specific).
     * @since 25/02/2023
     * @author Felipe Matheus Flohr
     */
    public static readonly browser = browserConfigs;
    /**
     * React lint settings.
     * @since 25/02/2023
     * @author Felipe Matheus Flohr
     */
    public static readonly react = reactConfigs;

    /**
     * The class only exports static properties,
     * therefore it's not necessary to instantiate
     * it.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}
}