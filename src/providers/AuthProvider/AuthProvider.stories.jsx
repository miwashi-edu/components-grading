import React from 'react';
import { withConfig, withAuth, AuthDisplay } from '@/test-util';

export default {
  title: 'Providers/AuthProvider',
  component: AuthDisplay,
  decorators: [withConfig, withAuth],
};

export const Default = {};