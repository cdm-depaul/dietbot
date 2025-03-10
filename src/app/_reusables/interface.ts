export interface className {
  className: string;
}

export interface textInterface {
  text: string;
}

export interface conversationalTyping extends className, textInterface {
  animationDelay?: number;
  animationDuration?: number;
  animationSteps?: number;
  // stepTransition?: string;
}

export interface textAreaInterace extends className {
  placeholder: string;
}
