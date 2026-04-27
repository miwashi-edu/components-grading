import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ConfigContext from './ConfigContext';
import configDefaults from '../../config';

const ConfigProvider = ({ children, config = {} }) => {
  const value = useMemo(() => ({
    ...configDefaults,
    ...config,
  }), [config]);

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

ConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.object,
};

export default ConfigProvider;
