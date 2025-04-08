export interface childProps {
  children: React.ReactNode;
}
export interface classNameInterface {
  className: string;
}

export interface optionalClassName {
  className?: string;
}

export interface bodyInterface extends childProps, optionalClassName {}

export interface chatBoxInterface extends optionalClassName {}

export interface chatComponentInterface
  extends childProps,
    classNameInterface {}

interface optionalImageArgs {
  callback?: (index: number) => void;
  cancelRequired?: boolean;
}

export interface imageUploadsInterface extends optionalImageArgs {
  images: string[];
}

export interface imageDisplayInterface extends optionalImageArgs {
  src: string;
  index: number;
}

export interface intentInterface extends childProps, classNameInterface {
  text: string;
}
