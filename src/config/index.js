import * as defaults from './defaults';

const config = {
  ...defaults,
};

// Check for VITE_ prefixed environment variables to override defaults
Object.keys(defaults).forEach((key) => {
  const envVar = import.meta.env?.[`VITE_${key}`];
  if (envVar !== undefined) {
    config[key] = envVar;
  }
});

export default config;
