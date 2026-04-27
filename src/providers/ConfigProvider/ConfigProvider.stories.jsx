import React from 'react';
import {withConfig, ConfigDisplay} from '@/test-util';

export default {
    title: 'Providers/ConfigProvider',
    component: ConfigDisplay,
    args: {},
    decorators: [withConfig]
};

export const Default = {};

export const CustomConfig = {
    args: {
        config: {
            BACKEND_API: 'https://api.example.com',
            THEME: 'dark',
        },
    },
};