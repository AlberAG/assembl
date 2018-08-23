// @flow
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';

import CookiesSelector from './cookiesSelector';
import { getCookieItem, setCookieItem } from '../../utils/globalFunctions';

// graphql
import acceptedCookiesQuery from '../../graphql/acceptedCookiesQuery.graphql';
import updateAcceptedCookies from '../../graphql/mutations/updateAcceptedCookies.graphql';
import withLoadingIndicator from '../common/withLoadingIndicator';

import type { CookieObject } from './cookieToggle';

type Props = {
  updateAcceptedCookies: Function,
  cookiesList: Array<string>
};

export type CookiesObject = {
  other?: Array<CookieObject>,
  essential?: Array<CookieObject>,
  analytics?: Array<CookieObject>
};

type State = {
  activeKey: ?string,
  show: boolean,
  cookies: ?CookiesObject
};

class CookiesSelectorContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const cookiesFromBrowser = getCookieItem('cookies_configuration');
    const cookiesList = props.cookiesList ?
      // if the user is logged in, we get the cookiesList from the query
      props.cookiesList
      // otherwise, we take it from the browser
      : cookiesFromBrowser && cookiesFromBrowser.split(',');

    const cookiesArray = cookiesList && cookiesList.map(
      cookie => ({ ...this.getCookieObject(cookie), accepted: this.isCookieAccepted(cookie), cookieType: cookie })
    );
    const cookiesByCategory = cookiesArray && this.getCookiesObjectFromArray(cookiesArray);

    this.state = {
      activeKey: 'essential',
      show: true,
      cookies: cookiesByCategory
    };
  }

  isCookieAccepted = (cookie: string) => {
    if (cookie.startsWith('ACCEPT')) {
      return true;
    }
    return false;
  }

  getCookieObject = (cookie: string) => {
    if (cookie.includes('SESSION_ON_DISCUSSION')) {
      return { category: 'other', name: 'userSession', hasChanged: false };
    }
    if (cookie.includes('LOCALE_ON_DISCUSSION')) {
      return { category: 'essential', name: 'locale', hasChanged: false };
    }
    if (cookie.includes('TRACKING_ON_DISCUSSION')) {
      return { category: 'analytics', name: 'piwik', hasChanged: false };
    }
    return { category: 'other', name: cookie, hasChanged: false };
  };

  getCookiesObjectFromArray = (cookiesArray: Array<CookieObject>) => {
    const cookiesObject = {};
    cookiesArray.forEach(function(cookie) { // eslint-disable-line
      const { category } = cookie;
      if (cookiesObject[category]) {
        cookiesObject[category] = [...cookiesObject[category], cookie];
      } else {
        cookiesObject[category] = [cookie];
      }
    });
    return cookiesObject;
  }

  handleToggle = (updatedCookie: CookieObject) => {
    const { cookies } = this.state;
    // Flow bugs with Object.values
    // $FlowFixMe
    const cookiesArray:Array<CookieObject> = cookies && Object.values(cookies)
      .reduce((flat, next) => flat.concat(next), []);
    const updatedCookiesArray = cookiesArray.map(
      (cookie: CookieObject) => (cookie.name === updatedCookie.name ? { ...updatedCookie, hasChanged: true } : cookie));
    const updatedCookiesByCategory = this.getCookiesObjectFromArray(updatedCookiesArray);
    this.setState({ cookies: updatedCookiesByCategory });
  }

  toggleCookieType = (cookie: string) =>
    (cookie.startsWith('ACCEPT') ? cookie.replace('ACCEPT', 'REJECT') : cookie.replace('REJECT', 'ACCEPT'));


  saveChanges = () => {
    const { cookies } = this.state;
    // Flow bugs with Object.values
    // $FlowFixMe
    const cookiesArray:Array<CookieObject> = cookies && Object.values(cookies)
      .reduce((flat, next) => flat.concat(next), []);
    const changedCookies = cookiesArray.filter((cookie: CookieObject) => cookie.hasChanged);
    const changedCookiesNewNames = changedCookies.map(cookie => this.toggleCookieType(cookie.cookieType));
    const newCookiesList = cookiesArray.filter((cookie: CookieObject) => !cookie.hasChanged).map(cookie => cookie.cookieType);
    changedCookiesNewNames.forEach((cookie) => { newCookiesList.push(cookie); });
    // Update the cookies in the back
    this.props.updateAcceptedCookies({ variables: { actions: newCookiesList } });
    // Update the cookies in the browser
    setCookieItem('cookies_configuration', newCookiesList);
  }

  handleCategorySelection = (category: string) => {
    const { show, activeKey } = this.state;
    this.setState({ activeKey: category, show: !show });
    return category !== activeKey && this.setState({ show: true });
  }

  render() {
    const { cookies, show, activeKey } = this.state;
    return (
      <CookiesSelector
        cookies={cookies}
        show={show}
        activeKey={activeKey}
        handleSave={this.saveChanges}
        handleToggle={this.handleToggle}
        handleCategorySelection={this.handleCategorySelection}
      />
    );
  }
}

const mapStateToProps = ({ context }) => ({
  id: context.connectedUserIdBase64
});

export default compose(connect(mapStateToProps),
  graphql(updateAcceptedCookies, {
    name: 'updateAcceptedCookies'
  }),
  graphql(acceptedCookiesQuery, {
    props: ({ data }) => {
      if (data.loading) {
        return { loading: true };
      }
      if (data.error) {
        return { error: data.error };
      }
      return {
        cookiesList: data.user.acceptedCookies
      };
    }
  }), withLoadingIndicator())(CookiesSelectorContainer);