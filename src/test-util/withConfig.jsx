import React, { useMemo } from "react";
import realConfig from "@/config";
import { ConfigContext } from "@/providers";

/**
 * withConfig is both a decorator factory and a decorator itself.
 * 
 * Usage 1 (Factory): decorators: [withConfig({ BACKEND_API: '...' })]
 * Usage 2 (Direct):  decorators: [withConfig]
 * Usage 3 (Args):    story.args = { config: { ... } }
 */
export default function withConfig(overrides) {
    // Detect if this is a Storybook decorator call: (Story, context)
    const isDecoratorCall = typeof overrides === "function" && 
                          arguments.length === 2 && 
                          typeof arguments[1] === "object" && 
                          arguments[1] !== null &&
                          "args" in arguments[1];

    const ConfigDecorator = (Story, context) => {
        const baseFakeConfig = useMemo(
            () => ({
                ...realConfig,
                APP_ENV: "storybook",
                API_BASE_URL: realConfig.API_BASE_URL || "http://localhost:3000",
            }),
            []
        );

        const value = useMemo(() => {
            // Priority 1: Configuration from Storybook args
            const argsConfig = context?.args?.config || {};
            
            // Priority 2: Overrides passed to the factory
            let factoryOverrides = {};
            if (!isDecoratorCall) {
                if (typeof overrides === "function") {
                    factoryOverrides = overrides(baseFakeConfig, context);
                } else if (overrides && typeof overrides === "object") {
                    factoryOverrides = overrides;
                }
            }

            return { ...baseFakeConfig, ...argsConfig, ...factoryOverrides };
        }, [baseFakeConfig, context, overrides]);

        return (
            <ConfigContext.Provider value={value}>
                <Story />
            </ConfigContext.Provider>
        );
    };

    if (isDecoratorCall) {
        return ConfigDecorator(arguments[0], arguments[1]);
    }

    return ConfigDecorator;
}