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

// ✅ PATCH: extend ChatBox props
export interface chatBoxInterface extends optionalClassName {
  /**
   * Keep the user on the current page (don’t router.push to /chat/[id]).
   * Default behavior in ChatBox will be true.
   */
  disableNavigate?: boolean;

  /**
   * Optional hook fired when the user submits a query.
   * Useful to log recents, update side panels, etc.
   */
  onSubmitQuery?: (query: string, uuid: string) => void;
}

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
