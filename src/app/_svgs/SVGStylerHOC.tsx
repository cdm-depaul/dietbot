import React from 'react';
import { classNameProp } from './interface';

export const withSVGStylerHOC = <P extends classNameProp>(
  Component: React.ComponentType<P>
) => {
  const WrappedComponent = ({ className, ...rest }: P) => {
    return (
      <Component className={`w-5 h-5 mr-1 ${className}`} {...(rest as P)} />
    );
  };

  return WrappedComponent;
};
