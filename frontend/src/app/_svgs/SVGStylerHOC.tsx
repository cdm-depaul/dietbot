'use client';
import React, { memo } from 'react';
import { className } from './interface';

/**
 * Higher-Order Component for adding common styling to all the icons including text with ::before pseudo selector.
 * @sameera-g-mathad If you don't want the default behaviour of ::before, then use ***hover-none*** class in your css styling.
 * @param Component
 * @returns
 */
export const withSVGStylerHOC = <P extends className>(
  Component: React.ComponentType<P>
) => {
  const WrappedComponent = memo(
    ({ className, ...rest }: P) => {
      return (
        <Component
          className={`w-5 h-5 mr-1 stroke-stone-400 hover-text before:w-24 before:h-7 before:text-stone-500 before:bg-stone-50 before:rounded-lg before:shadow-md text-sm border-stone-300  fill-stone-400 ${className}`}
          {...(rest as P)}
        />
      );
    },
    (prevProps, nextProps) => {
      return prevProps === nextProps;
    }
  );

  return WrappedComponent;
};
