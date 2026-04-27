import React, { useMemo, useState, useCallback } from "react";
import { AuthContext } from "@/providers";
import realConfig from "@/config";

const { AUTH_STATES } = realConfig;

/**
 * withAuth is both a decorator factory and a decorator itself.
 * 
 * Usage 1 (Factory): decorators: [withAuth({ user: { ... }, isAuthenticated: true })]
 * Usage 2 (Direct):  decorators: [withAuth]
 * Usage 3 (Args):    story.args = { auth: { user: { ... } } }
 */
export default function withAuth(overrides) {
    // Detect if this is a Storybook decorator call: (Story, context)
    const isDecoratorCall = typeof overrides === "function" && 
                          arguments.length === 2 && 
                          typeof arguments[1] === "object" && 
                          arguments[1] !== null &&
                          "args" in arguments[1];

    const AuthDecorator = (Story, context) => {
        // Priority 1: Configuration from Storybook args
        const argsAuth = context?.args?.auth || {};
        
        // Priority 2: Overrides passed to the factory
        let factoryOverrides = {};
        if (!isDecoratorCall) {
            if (typeof overrides === "function") {
                factoryOverrides = overrides(context);
            } else if (overrides && typeof overrides === "object") {
                factoryOverrides = overrides;
            }
        }

        const initialValues = {
            user: null,
            accessToken: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            authState: AUTH_STATES.STATE_IDLE,
            ...factoryOverrides,
            ...argsAuth,
        };

        const [user, setUser] = useState(initialValues.user);
        const [accessToken, setAccessToken] = useState(initialValues.accessToken);
        const [loading, setLoading] = useState(initialValues.loading);
        const [error, setError] = useState(initialValues.error);

        const login = useCallback(async (email, password) => {
            setLoading(true);
            setError(null);
            // Simulate a delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (password === 'password') {
                const isAdmin = email.startsWith('admin');
                const isSuperUser = email.startsWith('superUser');
                const mockUser = { 
                    id: 'mock-id', 
                    name: email.split('@')[0], 
                    email, 
                    isAdmin, 
                    isSuperUser 
                };
                setUser(mockUser);
                setAccessToken('mock-access-token');
                setLoading(false);
                return { user: mockUser, accessToken: 'mock-access-token' };
            } else {
                setError('Invalid password (mock)');
                setLoading(false);
                throw new Error('Invalid password (mock)');
            }
        }, []);

        const logout = useCallback(() => {
            setUser(null);
            setAccessToken(null);
        }, []);

        const publicCall = useCallback(async (body, options, endpoint) => {
            console.log('Mock publicCall', { endpoint, body, options });
            return { success: true, message: `Mocked public response for ${endpoint.url}` };
        }, []);

        const secureCall = useCallback(async (body, options, endpoint) => {
            console.log('Mock secureCall', { endpoint, body, options });
            if (!accessToken) {
                throw new Error('Unauthorized (mock)');
            }
            return { success: true, message: `Mocked secure response for ${endpoint.url}` };
        }, [accessToken]);

        const derivedAuthState = useMemo(() => {
            if (!accessToken || !user) return initialValues.authState;
            if (user.isSuperUser) return AUTH_STATES.STATE_SUPERUSER;
            if (user.isAdmin) return AUTH_STATES.STATE_ADMIN;
            return AUTH_STATES.STATE_AUTHORISED;
        }, [accessToken, user, initialValues.authState]);

        const value = useMemo(() => ({
            user,
            accessToken,
            loading,
            error,
            auth: login,
            logout,
            publicCall,
            secureCall,
            isAuthenticated: !!accessToken,
            authState: derivedAuthState,
            ...factoryOverrides, // Allow overriding functions/states directly
            ...argsAuth,
        }), [user, accessToken, loading, error, login, logout, publicCall, secureCall, derivedAuthState, factoryOverrides, argsAuth]);

        return (
            <AuthContext.Provider value={value}>
                <Story />
            </AuthContext.Provider>
        );
    };

    if (isDecoratorCall) {
        return AuthDecorator(arguments[0], arguments[1]);
    }

    return AuthDecorator;
}
