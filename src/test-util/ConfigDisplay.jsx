import {useConfig} from "@/providers/index.js";
import React from "react";
import styles from "./ConfigDisplay.module.css";

const ConfigDisplay = () => {
    const config = useConfig();
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Current Configuration:</h3>
            <pre className={styles.pre}>{JSON.stringify(config, null, 2)}</pre>
        </div>
    );
};

export default ConfigDisplay;