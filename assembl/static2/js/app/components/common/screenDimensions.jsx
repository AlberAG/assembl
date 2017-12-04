// @flow

import * as React from 'react';
import { connect } from 'react-redux';

// Context Provider
class ResizeListener extends React.Component {
  componentDidMount() {
    const { updateScreenDimensions } = this.props;
    updateScreenDimensions();
    window.addEventListener('resize', updateScreenDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.props.updateScreenDimensions);
  }
  render() {
    return React.Children.only(this.props.children);
  }
}

export const ScreenDimensionsProvider = connect(
  () => {
    return {};
  },
  (dispatch) => {
    return {
      updateScreenDimensions: () => {
        dispatch({
          type: 'UPDATE_SCREEN_DIMENSIONS',
          newWidth: window.innerWidth,
          newHeight: window.innerHeight
        });
      }
    };
  }
)(ResizeListener);

/* remove this block when we update flow */

type StatelessFunctionalComponent<Props> = {
  (props: Props, context: any): React.Node,
  displayName?: ?string,
  propTypes?: $Subtype<{ [_: $Keys<Props>]: any }>,
  contextTypes?: any
};

type ComponentType<Props> = StatelessFunctionalComponent<Props> | Class<React.Component<Props, any>>;

type AnyComponent = ComponentType<any>;

/* end of block to be removed */

// HOC
export const withScreenWidth = (WrappedComponent: AnyComponent) => {
  return connect(({ screenWidth }) => {
    return {
      screenWidth: screenWidth
    };
  })(WrappedComponent);
};

export const withScreenHeight = (WrappedComponent: AnyComponent) => {
  return connect(({ screenHeight }) => {
    return {
      screenHeight: screenHeight
    };
  })(WrappedComponent);
};

export const withScreenDimensions = (WrappedComponent: AnyComponent) => {
  return connect(({ screenWidth, screenHeight }) => {
    return {
      screenWidth: screenWidth,
      screenHeight: screenHeight
    };
  })(WrappedComponent);
};