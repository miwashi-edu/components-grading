import {useAuth, useConfig} from "@/providers";
import React from "react";
import styles from "./ConfigDisplay.module.css"; // Reusing the same styling for now or I can create a new one

const AuthDisplay = () => {
    const { auth: login, logout, ...authState } = useAuth();
    const { AUTH_STATES } = useConfig();
    
    // Exclude functions and derived values from the JSON display to keep it clean
    const { publicCall, secureCall, isAuthenticated, ...jsonDisplayState } = authState;
    
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Current Auth State:</h3>
            <pre className={styles.pre}>{JSON.stringify(jsonDisplayState, null, 2)}</pre>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => login('user@example.com', 'password')}>
                    Login as User
                </button>
                <button onClick={() => login('admin@example.com', 'password')}>
                    Login as Admin
                </button>
                <button onClick={() => login('superUser@example.com', 'password')}>
                    Login as SuperUser
                </button>
                <button onClick={logout}>
                    Login as IDLE (Logout)
                </button>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                <strong>Current State:</strong> {authState.authState}
            </div>
        </div>
    );
};

export default AuthDisplay;
