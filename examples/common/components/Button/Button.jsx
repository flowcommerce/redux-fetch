import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import styles from './Button.css';

const Button = ({
  as: ElementType,
  children,
  className,
  content,
  fluid,
  format,
  leftIcon,
  rightIcon,
  size,
  ...unhandledProps
}) => {
  const rootClassName = classnames(styles.button, {
    [styles.fluid]: fluid,
    [styles.small]: size === 'small',
    [styles.medium]: size === 'medium',
    [styles.large]: size === 'large',
    [styles.flat]: format === 'flat',
    [styles.solid]: format === 'solid',
    [styles.outline]: format === 'outline',
  }, className);

  if (!isNil(children)) {
    return (
      <ElementType {...unhandledProps} className={rootClassName}>
        {children}
      </ElementType>
    );
  }

  return (
    <ElementType {...unhandledProps} className={rootClassName}>
      {leftIcon && React.cloneElement(leftIcon, {
        className: classnames(styles.leftIcon, leftIcon.props.className),
      })}
      {content}
      {rightIcon && React.cloneElement(rightIcon, {
        className: classnames(styles.rightIcon, rightIcon.props.className),
      })}
    </ElementType>
  );
};

Button.displayName = 'Button';

Button.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  children: PropTypes.node,
  className: PropTypes.string,
  content: PropTypes.string,
  format: PropTypes.oneOf(['flat', 'solid', 'outline']),
  fluid: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

Button.defaultProps = {
  as: 'button',
  children: undefined,
  className: '',
  content: undefined,
  format: 'solid',
  leftIcon: undefined,
  rightIcon: undefined,
  size: 'medium',
};

export default Button;
