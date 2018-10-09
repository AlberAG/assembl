/* eslint react/no-multi-comp: "off" */
// @flow
import * as React from 'react';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, WindowScroller } from 'react-virtualized';

import NuggetsManager from '../nuggetsManager';
import Child from './treeItem';

type ChildType = TreeItem & {
  [string]: any
};

type Props = {
  contentLocaleMapping: Map<string, any>,
  identifier: string,
  phaseId?: string,
  initialRowIndex: ?number,
  lang: string,
  data: Array<ChildType>,
  InnerComponentFolded: ({ nbPosts: number }) => React.Node,
  InnerComponent: any => React.Node,
  SeparatorComponent: () => React.Node,
  noRowsRenderer: () => React.Node,
  InnerComponentHeight?: number | (({ index: number }) => number)
};

class Tree extends React.Component<Props> {
  componentDidMount() {
    // Reset the global prevStopIndex to not overfetch posts when changing idea
    // or to avoid recreating all dom nodes if we go back to the same idea.
    this.cache.clearAll();
    this.prevStopIndex = 0;
    const { initialRowIndex } = this.props;
    if (this.listRef && initialRowIndex !== null) {
      this.listRef.scrollToRow(initialRowIndex);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { data } = this.props;
    if (data.length !== nextProps.data.length) {
      this.cache.clearAll();
      // If a new top post has been created, clear the cache
      // and rerender the List by changing its key
      // to be sure to recalculate the heights of all top posts.
      // Reset prevStopIndex because globalList.recomputeRowHeights() only update the 10 first top posts
      // because Grid.recomputeGridSize that is called by globalList.recomputeRowHeights
      // doesnt take into account our hack in overscanIndicesGetter.
      // This means that the posts after the 10th post are removed from the dom
      // and will be recreated when scrolling, losing the previous expand/collapse local state.
      this.prevStopIndex = 0;
    }
  }

  nuggetsManager: NuggetsManager = new NuggetsManager();

  prevStopIndex: number = 0;

  cache: CellMeasurerCache = new CellMeasurerCache({
    defaultHeight: 500,
    minHeight: 185,
    fixedWidth: true
  });

  listRef: List | null = null;

  // override overscanIndicesGetter to not remove from the dom the posts once rendered
  // to fix various issue with scrolling with WindowScroller
  overscanIndicesGetter = ({
    cellCount,
    overscanCellsCount,
    stopIndex
  }: {
    cellCount: number,
    overscanCellsCount: number,
    stopIndex: number
  }) => {
    let overscanStopIndex;
    if (cellCount === 1) {
      // overscanIndicesGetter is called for columns, not rows
      // use default implementation
      overscanStopIndex = Math.min(cellCount - 1, stopIndex + overscanCellsCount);
    } else {
      this.prevStopIndex = Math.max(this.prevStopIndex, stopIndex);
      overscanStopIndex = Math.min(cellCount - 1, this.prevStopIndex + overscanCellsCount);
    }
    return {
      overscanStartIndex: 0,
      overscanStopIndex: overscanStopIndex
    };
  };

  cellRenderer = ({
    index,
    key,
    parent,
    style
  }: {
    index: number,
    key: string,
    parent: { props: Props },
    style: { [string]: string }
  }) => {
    const {
      data,
      identifier,
      phaseId,
      lang,
      InnerComponent, // component that will be rendered in the child
      InnerComponentFolded, // component that will be used to render the children when folded
      SeparatorComponent // separator component between first level children
    } = this.props;

    const childData = data[index];
    return (
      <CellMeasurer cache={this.cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        <div style={style}>
          {index > 0 ? <SeparatorComponent /> : null}
          <Child
            key={childData.id}
            {...childData}
            identifier={identifier}
            phaseId={phaseId}
            lang={lang}
            rowIndex={index}
            contentLocaleMapping={parent.props.contentLocaleMapping}
            InnerComponent={InnerComponent}
            InnerComponentFolded={InnerComponentFolded}
            SeparatorComponent={SeparatorComponent}
            nuggetsManager={this.nuggetsManager}
            listRef={this.listRef}
            cache={this.cache}
          />
        </div>
      </CellMeasurer>
    );
  };

  render() {
    const { contentLocaleMapping, data, lang, noRowsRenderer, InnerComponentHeight } = this.props;
    return (
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <AutoSizer
            disableHeight
            onResize={() => {
              this.cache.clearAll();
              // $FlowFixMe listRef is not null
              this.listRef.recomputeRowHeights();
              this.nuggetsManager.update();
            }}
          >
            {({ width }) => (
              <List
                contentLocaleMapping={contentLocaleMapping}
                height={height}
                // pass lang to the List component to ensure that the rows are rendered again if we change the site language
                lang={lang}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                autoHeight
                // TOFIX: temporary monkey patch - will be fixed with DEVAS-1764 (Reply to a comment)
                rowHeight={InnerComponentHeight || this.cache.rowHeight}
                // rowHeight={this.cache.rowHeight}
                deferredMeasurementCache={this.cache}
                noRowsRenderer={noRowsRenderer}
                ref={(ref) => {
                  // Add a guard because the List component's ref is recalculated many times onScroll
                  // Causing other components that have listRef as prop to re-render 4x-6x times.
                  if (!this.listRef) {
                    this.listRef = ref;
                  }
                }}
                rowCount={data.length}
                overscanIndicesGetter={this.overscanIndicesGetter}
                overscanRowCount={1}
                rowRenderer={this.cellRenderer}
                width={width}
                className="tree-list"
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  }
}

export default Tree;