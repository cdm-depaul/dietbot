export interface childProps {
  children: React.ReactNode;
}
export interface className {
  className: string;
}

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

export interface intentInterface extends childProps, className {
  text: string;
}
