// @flow
import React from 'react';
import { Map } from 'immutable';
import { Translate } from 'react-redux-i18n';

import Circle from '../svg/circle';
import { type TokenCategory } from '../../pages/voteSession';

type Props = {
  remainingTokensByCategory: Map<string, number>,
  tokenCategories: ?Array<?TokenCategory>
};

const AvailableTokens = ({ remainingTokensByCategory, tokenCategories }: Props) => (
  <div>
    {tokenCategories &&
      tokenCategories.map((category) => {
        if (category) {
          const { color, id, title, totalNumber } = category;
          const remaining = remainingTokensByCategory.get(category.id);
          return (
            <div key={id}>
              <h4 className="dark-title-4">{title}</h4>
              <Translate value="debate.voteSession.remainingTokens" count={remaining} />

              <div className="tokens right">
                {[...Array(totalNumber).keys()].map(n => (
                  <Circle key={n + 1} size="35px" strokeColor={color} fillColor={n + 1 <= remaining ? color : undefined} />
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}
  </div>
);

export default AvailableTokens;