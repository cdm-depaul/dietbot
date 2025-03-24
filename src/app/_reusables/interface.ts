/**
 * All the interfaces that are used by Components in reusables are present here.
 */

/**
 * Any component that accept children can use this interface or any interface can extend this functionality.
 */
export interface childProps {
  children: React.ReactNode;
}

/**
 * Any component that passes its own styles can use this interface or any interface can extend this functionality.
 */
export interface className {
  className: string;
}

export interface buttonProps extends childProps, className {
  onClick?: () => void;
}

export interface conversationalTyping extends textInterface {
  animationDelay?: number;
  animationDuration?: number;
  animationSteps?: number;
  // stepTransition?: string;
}

export interface fileInputInterface extends className, childProps {
  accept: string;
  onChange: (files: FileList) => void;
}

export interface textInterface extends className {
  text: string;
}

export interface textAreaInterace extends className {
  placeholder: string;
}
