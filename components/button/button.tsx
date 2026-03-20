import React, { forwardRef, Ref } from "react";
import clsx from "clsx";
import CircularLoading from "@/assets/icons/circular-loading";

const variants = {
  primary: "btn btn-primary",
  black: "btn btn-dark",
  white: "btn btn-light",
  gray: "btn btn-secondary",
  blackOutlined: "btn btn-outline-dark",
  whiteOutlined: "btn btn-outline-light",
  giantsOrange: "btn btn-warning", // hoặc custom class nếu cần
} as const;

const sizes = {
  xsmall: "btn-sm px-3 py-1 text-xs",
  small: "btn-sm px-4 py-2",
  medium: "btn-md px-6 py-2.5",
  large: "btn-lg px-8 py-3",
} as const;

type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = object
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicRef<C extends React.ElementType> = C extends "button"
  ? Ref<HTMLButtonElement>
  : React.ComponentPropsWithRef<C>["ref"];

type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = object
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    size?: keyof typeof sizes;
    variant?: keyof typeof variants;
    rounded?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactElement<any>;
    rightIcon?: React.ReactElement<any>;
    loading?: boolean;
    disabled?: boolean;
  }
>;

type ButtonComponent = <C extends React.ElementType = "button">(
  props: ButtonProps<C>
) => React.ReactElement<any> | null;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const Button: ButtonComponent = forwardRef(
  <C extends React.ElementType = "button">(
    {
      as,
      variant = "primary",
      size = "large",
      rounded,
      fullWidth,
      loading,
      disabled,
      className,
      children,
      leftIcon,
      rightIcon,
      onClick,
      type = "button",
      ...props
    }: ButtonProps<C>,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const Component = as || "button";
    
    // Combine Bootstrap classes
    const buttonClasses = clsx(
      "btn", // Base Bootstrap button class
      variants[variant],
      sizes[size],
      rounded && "rounded-pill", // Bootstrap class for rounded buttons
      fullWidth && "w-100", // Bootstrap width 100% class
      loading && "position-relative", // Position relative for loading spinner
      className
    );

    return (
      <Component
        ref={ref}
        className={buttonClasses}
        onClick={!disabled && !loading ? onClick : undefined}
        disabled={disabled || loading}
        type={type}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <span 
            className="spinner-border spinner-border-sm me-2" 
            role="status" 
            aria-hidden="true"
          />
        )}
        
        {/* Left Icon */}
        {!loading && leftIcon && (
          <span className={clsx(children && "me-2")}>
            {leftIcon}
          </span>
        )}
        
        {/* Button Text */}
        {children}
        
        {/* Right Icon */}
        {!loading && rightIcon && (
          <span className={clsx(children && "ms-2")}>
            {rightIcon}
          </span>
        )}
        
        {/* Loading text for screen readers */}
        {loading && <span className="visually-hidden">Loading...</span>}
      </Component>
    );
  }
);

// Display name for dev tools
Button.displayName = "Button";