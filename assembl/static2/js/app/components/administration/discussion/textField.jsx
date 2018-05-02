// @flow
import React from 'react';
import { Button, FormGroup, FormControl, OverlayTrigger } from 'react-bootstrap';

import {
  deleteTextFieldTooltip,
  upTooltip,
  downTooltip,
  textFieldToggleOptionalTooltip,
  textFieldToggleRequiredTooltip
} from '../../common/tooltips';
import SwitchButton from '../../common/switchButton';

type Props = {
  id: string,
  isFirst: boolean,
  isLast: boolean,
  title: string,
  required: boolean
};

const TextField = ({ id, isFirst, isLast, title, required }: Props) => (
  <FormGroup bsClass="flex">
    <FormControl value={title} />
    <OverlayTrigger placement="top" overlay={required ? textFieldToggleOptionalTooltip : textFieldToggleRequiredTooltip}>
      {/* overlaytrigger does not seem to work with SwitchButton so we add a span... */}
      <span>
        <SwitchButton id={`required-switch-${id}`} checked={required} />
      </span>
    </OverlayTrigger>
    {!isLast ? (
      <OverlayTrigger placement="top" overlay={downTooltip}>
        <Button className="admin-icons">
          <span className="assembl-icon-down-bold grey" />
        </Button>
      </OverlayTrigger>
    ) : null}
    {!isFirst ? (
      <OverlayTrigger placement="top" overlay={upTooltip}>
        <Button className="admin-icons">
          <span className="assembl-icon-up-bold grey" />
        </Button>
      </OverlayTrigger>
    ) : null}
    <OverlayTrigger placement="top" overlay={deleteTextFieldTooltip}>
      <Button className="admin-icons">
        <span className="assembl-icon-delete grey" />
      </Button>
    </OverlayTrigger>
  </FormGroup>
);

export default TextField;