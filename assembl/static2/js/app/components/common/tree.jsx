import React from 'react';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, WindowScroller } from 'react-virtualized';
import { getDomElementOffset, scrollToPosition } from '../../utils/globalFunctions';

/*
  TODO: avoid globalList
  TODO: InnerComponentFolded should be able to toggle the item
*/

let globalList;

const cache = new CellMeasurerCache({
  defaultHeight: 600,
  minHeight: 500,
  fixedWidth: true
});

// override overscanIndicesGetter to not remove from the dom the top posts above current scrolling position
// to fix various issue with scrolling with WindowScroller
function overscanIndicesGetter({ cellCount, overscanCellsCount, stopIndex }) {
  return {
    overscanStartIndex: 0,
    overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
  };
}

class Child extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderToggleLink = this.renderToggleLink.bind(this);
    this.expandCollapse = this.expandCollapse.bind(this);
    this.resizeTreeHeight = this.resizeTreeHeight.bind(this);
    this.scrollToElement = this.scrollToElement.bind(this);
    this.state = { expanded: true };
  }

  resizeTreeHeight() {
    if (globalList) {
      cache.clear(this.props.rowIndex, 0);
      globalList.recomputeRowHeights(this.props.rowIndex); // recompute height only for row (top post) starting at rowIndex
    }
  }

  expandCollapse(event) {
    event.stopPropagation();
    this.setState((state) => {
      return { expanded: !state.expanded };
    }, this.resizeTreeHeight);
  }

  renderToggleLink(expanded, indented) {
    return (
      <div
        ref={(el) => {
          this.scrollAnchor = el;
        }}
        onClick={(event) => {
          if (expanded) {
            this.scrollToElement();
          }
          this.expandCollapse(event);
        }}
        className={indented ? 'expand-indented' : 'expand'}
      >
        {expanded ? <span className="assembl-icon-minus-circled" /> : <span className="assembl-icon-plus-circled" />}
      </div>
    );
  }

  scrollToElement() {
    const elmOffset = getDomElementOffset(this.scrollAnchor).top - 20;
    setTimeout(() => {
      scrollToPosition(elmOffset, 200);
    }, 100);
  }

  render() {
    const {
      hidden,
      lang,
      activeAnswerFormId,
      children,
      InnerComponent,
      InnerComponentFolded,
      level,
      rowIndex, // the index of the row (i.e. level 0 item) in the List
      SeparatorComponent
    } = this.props;
    const cssClasses = () => {
      let cls = `level level-${level}`;
      if (level > 0) {
        cls += ' border-left child-level';
      }
      if (level > 3) {
        cls += ' no-shift';
      }
      if (level > 4) {
        cls += ' padding-right';
      }
      if (hidden) {
        cls += ' hidden';
      }
      return cls;
    };
    const numChildren = children ? children.length : 0;
    const expanded = this.state.expanded;
    const forwardProps = { ...this.props };
    delete forwardProps.activeAnswerFormId;
    delete forwardProps.children;
    return (
      <div className={cssClasses()}>
        <InnerComponent
          {...forwardProps}
          needToShowAnswerForm={activeAnswerFormId === this.props.id}
          measureTreeHeight={this.resizeTreeHeight}
        />
        {numChildren > 0 ? this.renderToggleLink(expanded, level < 4) : null}
        {numChildren > 0
          ? children.map((child, idx) => {
            return (
              <Child
                hidden={!expanded}
                key={idx}
                {...child}
                lang={lang}
                activeAnswerFormId={activeAnswerFormId}
                rowIndex={rowIndex}
                level={level + 1}
                InnerComponent={InnerComponent}
                InnerComponentFolded={InnerComponentFolded}
                SeparatorComponent={SeparatorComponent}
              />
            );
          })
          : null}
        {numChildren > 0 && !expanded
          ? <div
            className="postfolded-container"
            onClick={(event) => {
              if (expanded) {
                this.scrollToElement();
              }
              this.expandCollapse(event);
            }}
          >
            <div className="post-folded">
              <InnerComponentFolded nbPosts={numChildren} />
            </div>
          </div>
          : null}
      </div>
    );
  }
}
Child.defaultProps = {
  level: 0,
  hidden: false
};

const cellRenderer = ({ index, key, parent, style }) => {
  const { lang, activeAnswerFormId, data, InnerComponent, InnerComponentFolded, SeparatorComponent } = parent.props;
  const childData = data[index];
  return (
    <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
      <div style={style}>
        {index > 0 ? <SeparatorComponent /> : null}
        <Child
          {...childData}
          lang={lang}
          activeAnswerFormId={activeAnswerFormId}
          rowIndex={index}
          InnerComponent={InnerComponent}
          InnerComponentFolded={InnerComponentFolded}
          SeparatorComponent={SeparatorComponent}
        />
      </div>
    </CellMeasurer>
  );
};

const Tree = ({
  lang,
  activeAnswerFormId,
  data,
  InnerComponent, // component that will be rendered in the child
  InnerComponentFolded, // component that will be used to render the children when folded
  noRowsRenderer,
  SeparatorComponent // separator component between first level children
}) => {
  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => {
        return (
          <AutoSizer
            disableHeight
            onResize={() => {
              cache.clearAll();
              return globalList.recomputeRowHeights();
            }}
          >
            {({ width }) => {
              return (
                <List
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  autoHeight
                  rowHeight={cache.rowHeight}
                  deferredMeasurementCache={cache}
                  lang={lang}
                  activeAnswerFormId={activeAnswerFormId}
                  data={data}
                  InnerComponent={InnerComponent}
                  InnerComponentFolded={InnerComponentFolded}
                  noRowsRenderer={noRowsRenderer}
                  ref={function (ref) {
                    globalList = ref;
                  }}
                  rowCount={data.length}
                  overscanIndicesGetter={overscanIndicesGetter}
                  overscanRowCount={10}
                  rowRenderer={cellRenderer}
                  SeparatorComponent={SeparatorComponent}
                  width={width}
                  className="tree-list"
                />
              );
            }}
          </AutoSizer>
        );
      }}
    </WindowScroller>
  );
};

Tree.defaultProps = {
  InnerComponentFolded: () => {
    return null;
  }
};

export default Tree;