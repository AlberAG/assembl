// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { I18n, Translate } from 'react-redux-i18n';
import type { List, Map } from 'immutable';
import { Button } from 'react-bootstrap';

import ModulesPreview from './modulesPreview';
import SectionTitle from '../../administration/sectionTitle';
import SelectModulesForm from './selectModulesForm';
import {
  toggleLandingPageModule,
  moveLandingPageModuleDown,
  moveLandingPageModuleUp,
  createLandingPageModules
} from '../../../actions/adminActions/landingPage';
import { createRandomId } from '../../../utils/globalFunctions';

type Props = {
  enabledModules: List<Map>,
  moduleTypes: Array<Object>,
  locale: string,
  modulesById: Map<string, Map>,
  moveModuleDown: Function,
  moveModuleUp: Function,
  toggleModule: Function,
  createIntroductionModule: Function
};

export const DumbManageModules = ({
  enabledModules,
  moduleTypes,
  locale,
  modulesById,
  moveModuleDown,
  moveModuleUp,
  toggleModule,
  createIntroductionModule
}: Props) => (
  <div className="admin-box">
    <SectionTitle
      title={I18n.t('administration.landingPage.manageModules.title')}
      annotation={I18n.t('administration.annotation')}
    />
    <div className="admin-content form-container" style={{ maxWidth: '700px' }}>
      <p className="admin-paragraph">
        <Translate value="administration.landingPage.manageModules.helper" />
      </p>
      <div className="two-columns-admin">
        <div className="column-left">
          <SelectModulesForm lang={locale} moduleTypes={moduleTypes} modulesById={modulesById} toggleModule={toggleModule} />
          <div className="margin-xl">
            <Button className="button-submit button-dark" onClick={() => createIntroductionModule(enabledModules.size - 2)}>
              <Translate value="administration.landingPage.manageModules.textAndMultimediaBtn" />
            </Button>
          </div>
        </div>
        <div className="column-right">
          <ModulesPreview modules={enabledModules} moveModuleDown={moveModuleDown} moveModuleUp={moveModuleUp} />
        </div>
      </div>
    </div>
  </div>
);

const mapStateToProps = (state) => {
  const { enabledModulesInOrder, modulesById, modulesInOrder } = state.admin.landingPage;
  return {
    enabledModules: enabledModulesInOrder.map(id => modulesById.get(id)),
    modulesById: modulesById,
    moduleTypes: modulesInOrder
      .map((id) => {
        const module = modulesById.get(id);
        return module.get('moduleType');
      })
      .toJS()
  };
};

const mapDispatchToProps = dispatch => ({
  moveModuleDown: id => dispatch(moveLandingPageModuleDown(id)),
  moveModuleUp: id => dispatch(moveLandingPageModuleUp(id)),
  toggleModule: id => dispatch(toggleLandingPageModule(id)),
  createIntroductionModule: (nextOrder) => {
    const newId = createRandomId();
    return dispatch(createLandingPageModules(newId, nextOrder));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DumbManageModules);