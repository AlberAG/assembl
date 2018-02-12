import React from 'react';
import { I18n } from 'react-redux-i18n';
import get from 'lodash/get';

import PostColumn from './postColumn';
import { orderPostsByMessageClassifier } from './utils';
import { getIfPhaseCompletedByIdentifier } from '../../../utils/timeline';

const MultiColumns = ({
  messageColumns,
  posts,
  ideaId,
  width,
  lang,
  contentLocaleMapping,
  initialRowIndex,
  noRowsRenderer,
  refetchIdea,
  routerParams,
  showSynthesis,
  identifier,
  debateData
}) => {
  const columnsArray = orderPostsByMessageClassifier(messageColumns, posts);
  const isPhaseCompleted = getIfPhaseCompletedByIdentifier(debateData.timeline, identifier);
  return (
    <div className="multi-column-container">
      {Object.keys(columnsArray).map((classifier, index) => {
        const col = messageColumns[index];
        const synthesisProps = showSynthesis && {
          classifier: classifier,
          debateData: debateData,
          identifier: identifier,
          mySentiment: get(col, 'columnSynthesis.mySentiment', null),
          routerParams: routerParams,
          sentimentCounts: get(col, 'columnSynthesis.sentimentCounts', 0),
          synthesisId: get(col, 'columnSynthesis.id'),
          synthesisTitle: get(col, 'columnSynthesis.subject', I18n.t('multiColumns.synthesis.title', { colName: col.name })),
          synthesisBody: get(col, 'columnSynthesis.body') || I18n.t('multiColumns.synthesis.noSynthesisYet'),
          // keep the || here, if body is empty string, we want noSynthesisYet message
          hyphenStyle: { borderTopColor: col.color }
        };
        return (
          <PostColumn
            key={classifier}
            synthesisProps={synthesisProps}
            width={width}
            contentLocaleMapping={contentLocaleMapping}
            lang={lang}
            color={col.color}
            classifier={classifier}
            title={col.title}
            data={columnsArray[classifier]}
            initialRowIndex={initialRowIndex}
            noRowsRenderer={noRowsRenderer}
            ideaId={ideaId}
            refetchIdea={refetchIdea}
            identifier={identifier}
            withColumnHeader={!isPhaseCompleted}
          />
        );
      })}
    </div>
  );
};

export default MultiColumns;