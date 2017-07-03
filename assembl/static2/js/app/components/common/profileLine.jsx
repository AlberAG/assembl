import React from 'react';
import { Localize } from 'react-redux-i18n';
import '../../../../css/components/profileLine.scss';

const ProfileLine = (props) => {
  const { userId, userName, creationDate } = props;
  const src = `/user/id/${userId}/avatar/30`;
  return (
    <div className="profileLine">
      <div className="inline">
        <img
          src={src}
          width="30"
          height="30"
          alt={userName}
          onError={(e) => {
            const target = e.target;
            target.src = '/static2/img/icons/avatar.png';
          }}
        />
      </div>
      <div className="user">
        <div className="creator">{userName}</div>
        {creationDate &&
          <div className="date">
            <Localize value={creationDate} dateFormat="date.format" />
          </div>}
      </div>
    </div>
  );
};

export default ProfileLine;