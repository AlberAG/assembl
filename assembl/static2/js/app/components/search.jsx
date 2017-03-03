/* eslint no-underscore-dangle: 0, react/no-danger: 0 */
/* global __resourceQuery */
import React from 'react';
import { Localize, Translate, I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';

import {
  ActionBar,
  ActionBarRow,
  BoolMust,
  BoolMustNot,
  CheckboxFilter,
  CheckboxItemList,
  HasChildQuery,
  Hits,
  HitsStats,
  InitialLoader,
  Layout,
  LayoutBody,
  LayoutResults,
  MenuFilter,
  Pagination,
  Panel,
  RangeFilter,
  RangeQuery,
  ResetFilters,
  SearchBox,
  SearchkitManager,
  SearchkitProvider,
  // SelectedFilters,
  SideBar,
  SortingSelector,
  TagFilterConfig,
  TagFilter,
  TermQuery,
  TopBar
} from 'searchkit';
import get from 'lodash/get';
import truncate from 'lodash/truncate';
import Glyphicon from './common/glyphicon';

// Keep the style import here. The reason why it's not in main.scss is because
// we create a searchv1 bundle that includes only the Search component and its
// local styles for v1. There is an additional searchv1.scss file that overrides
// some styles for v1

import '../../../css/views/search.scss';

import DateRangeFilter from './search/DateRangeFilter';
import ProfileLine from './common/profileLine';
import { getConnectedUserId, getDebateId, getLocale } from '../reducers/contextReducer';
import { getPermissionsForConnectedUser } from '../reducers/usersReducer';
import { canUseExpertInterface } from '../utils/permissions';

const FRAGMENT_SIZE = 400;

const truncateText = (text) => {
  return truncate(text,
    { length: FRAGMENT_SIZE, separator: ' ', omission: ' [...]' });
};

const highlightedTextOrTruncatedText = (hit, field) => {
  let text = get(hit, `highlight.${field}`);
  if (text) {
    if (Array.isArray(text)) {
      // take the first highlight fragment
      text = text[0];
    }
    return text;
  }

  text = truncateText(hit._source[field]);
  return text;
};

let Link;
let getUrl;
if (__resourceQuery) { // v1
  // const querystring = require('querystring');
  // const params = querystring.parse(__resourceQuery.slice(1));
  // if (params.v === '1') {
  Link = (props) => {
    return <a href={props.to} dangerouslySetInnerHTML={props.dangerouslySetInnerHTML} />;
  };
  getUrl = (hit) => {
    const slug = document.getElementById('discussion-slug').value;
    const id = hit._source.id;
    switch (hit._type) {
    case 'synthesis':
      return `${slug}/posts/local:Content/${id}`;
    case 'user':
      return undefined;
    case 'idea':
      return `${slug}/idea/local:Idea/${id}`;
    default: // post
      return `${slug}/posts/local:Content/${id}`;
    }
  };
  // }
} else {
  Link = require('react-router').Link;  // eslint-disable-line
  getUrl = (hit) => {
    const id = hit._source.id;
    switch (hit._type) {
    case 'synthesis':
      return `posts/${id}`;
    case 'user':
      return `profile/${id}`;
    case 'idea':
      return `ideas/${id}`;
    default: // post
      return `posts/${id}`;
    }
  };
}

const PublishedInfo = (props) => {
  const { date, userId, userName, className } = props;
  return (
    <div className={className}>
      <Translate value="search.published_the" />{' '}<Localize value={date} dateFormat="date.format" />
      {' '}<Translate value="search.by" />{' '}
      <TagFilter key={userId} field="creator_id" value={userId}>
        <ProfileLine userId={userId} userName={userName} />
      </TagFilter>
    </div>
  );
};

const ImageType = (props) => {
  return (
    <img
      className={props.className}
      src={`/static2/img/icon-${props.type}.svg`}
      role="presentation"
    />
  );
};

const DumbPostHit = (props) => {
  const locale = props.locale;
  const source = props.result._source;
  let subject = get(props.result, `highlight.subject_${locale}`, get(props.result, 'highlight.subject_und'));
  if (!subject) {
    subject = get(source, `subject_${locale}`, source.subject_und);
  }
  let body = get(props.result, `highlight.body_${locale}`, get(props.result, 'highlight.body_und'));
  if (!body) {
    body = get(source, `body_${locale}`, source.body_und);
    body = truncateText(body);
  }
  return (
    <div className={props.bemBlocks.item().mix(props.bemBlocks.container('item'))}>
      <ImageType type={props.result._type} className={props.bemBlocks.item('imgtype')} />
      <div className={props.bemBlocks.item('title')}>
        <Link
          to={getUrl(props.result)}
          dangerouslySetInnerHTML={{ __html: subject }}
        />
      </div>
      <div className={props.bemBlocks.item('content')}>
        <p dangerouslySetInnerHTML={{ __html: body }} />
      </div>
      <PublishedInfo
        className={props.bemBlocks.item('info')}
        date={source.creation_date}
        userId={source.creator_id}
        userName={source.creator_name}
      />
      {/* <div>
        popularity: {source.sentiment_counts.popularity},
        like: {source.sentiment_counts.like},
        disagree: {source.sentiment_counts.disagree}
      </div> */}
    </div>
  );
};

const PostHit = connect(
  (state) => { return { locale: getLocale(state) }; }
)(DumbPostHit);

const SynthesisHit = (props) => {
  const source = props.result._source;
  return (
    <div className={props.bemBlocks.item().mix(props.bemBlocks.container('item'))}>
      <ImageType type={props.result._type} className={props.bemBlocks.item('imgtype')} />
      <div className={props.bemBlocks.item('title')}>
        <Link
          to={getUrl(props.result)}
          dangerouslySetInnerHTML={{ __html: highlightedTextOrTruncatedText(props.result, 'subject') }}
        />
      </div>
      <div className={props.bemBlocks.item('content')}>
        <p dangerouslySetInnerHTML={{ __html: highlightedTextOrTruncatedText(props.result, 'introduction') }} />
        <p dangerouslySetInnerHTML={{ __html: highlightedTextOrTruncatedText(props.result, 'conclusion') }} />
      </div>
      <PublishedInfo
        className={props.bemBlocks.item('info')}
        date={source.creation_date}
        userId={source.creator_id}
        userName={source.creator_name}
      />
    </div>
  );
};


const UserHit = (props) => {
  const source = props.result._source;
  const url = getUrl(props.result);
  const fullname = get(
    props.result, 'highlight.name', props.result._source.name);
  return (
    <div className={props.bemBlocks.item().mix(props.bemBlocks.container('item'))}>
      <ImageType type={props.result._type} className={props.bemBlocks.item('imgtype')} />
      <div className={props.bemBlocks.item('title')}>
        { url ?
          <Link
            to={getUrl(props.result)}
            dangerouslySetInnerHTML={{ __html: fullname }}
          />
        :
          <p dangerouslySetInnerHTML={{ __html: fullname }} />
        }
      </div>
      { source.creation_date ?
        <div className={props.bemBlocks.item('info')}>
          <Translate value="search.member_since" />{' '}<Localize value={source.creation_date} dateFormat="date.format" />
        </div>
      : null }
    </div>
  );
};

const IdeaHit = (props) => {
  const source = props.result._source;
  const shortTitle = highlightedTextOrTruncatedText(props.result, 'short_title');
  const definition = highlightedTextOrTruncatedText(props.result, 'definition');
  const announceTitle = highlightedTextOrTruncatedText(props.result, 'title');
  const announceBody = highlightedTextOrTruncatedText(props.result, 'body');
  return (
    <div className={props.bemBlocks.item().mix(props.bemBlocks.container('item'))}>
      <ImageType type={props.result._type} className={props.bemBlocks.item('imgtype')} />
      <div className={props.bemBlocks.item('title')}>
        <Link
          to={getUrl(props.result)}
          dangerouslySetInnerHTML={{ __html: shortTitle }}
        />
      </div>
      <div className={props.bemBlocks.item('content')}>
        { definition ?
          <div>
            <p dangerouslySetInnerHTML={{ __html: definition }} />
            { get(props.result, 'highlight.definition') && <p><Translate value="search.search_come_from_what_you_need_to_know" /></p> }
          </div>
          : null
        }
        { get(props.result, 'highlight.title') || get(props.result, 'highlight.body') ?
          <div>
            <p dangerouslySetInnerHTML={{ __html: announceTitle }} />
            <p dangerouslySetInnerHTML={{ __html: announceBody }} />
            <p><Translate value="search.search_come_from_announcement" /></p>
          </div>
          : null
        }
      </div>
      <div className={props.bemBlocks.item('info')}>
        {source.num_posts}
        <span className={props.bemBlocks.item('icon-message')}>
          <Glyphicon glyph="message" color="purple" size={20} desc="Number of contributions" />
        </span>
        {source.num_contributors}
        <span className={props.bemBlocks.item('icon-avatar')}>
          <Glyphicon glyph="avatar" color="purple" size={20} desc="Number of users" />
        </span>
      </div>
    </div>
  );
};

const HitItem = (props) => {
  switch (props.result._type) {
  case 'synthesis':
    return <SynthesisHit {...props} />;
  case 'user':
    return <UserHit {...props} />;
  case 'idea':
    return <IdeaHit {...props} />;
  default: // post
    return <PostHit {...props} />;
  }
};

const NoPanel = (props) => {
  return (
    <div>{props.children}</div>
  );
};


const queryFields = [
  'title',  // idea announcement
  'body',  // idea announcement
  'short_title',  // idea
  'definition',  // idea
  'name',  // user
  'subject',  // synthesis
  'introduction',  // synthesis
  'conclusion',  // synthesis
  'subject_und', // post
  'subject_fr', // post
  'subject_en', // post
  'body_und', // post
  'body_fr', // post
  'body_en' // post
];

// default is fragment_size 100 and number_of_fragments 5,see
// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-highlighting.html#_highlighted_fragments
const customHighlight = {
  fields: {
    body: { fragment_size: FRAGMENT_SIZE, number_of_fragments: 1 }
  }
};
// setting it for body field seems to apply the setting to all queryFields

export class SearchComponent extends React.Component {

  constructor(props) {
    super(props);
    const host = '/';
    this.searchkit = new SearchkitManager(host, { searchOnLoad: false });
    this.searchkit.setQueryProcessor((plainQueryObject) => {
      // rewrite the query to filter on the current discussion
      const modifiedQuery = plainQueryObject;
      const filters = [];
      // we need to rewrite the query as a bool query to be compatible ES 5
      if (modifiedQuery.filter) {
        // modifiedQuery.filter is always an Object,
        // it's a range filter for example
        // or a bool must when there is more than 1 filter
        filters.push(modifiedQuery.filter);
        delete modifiedQuery.filter;
      }
      filters.push({ term: { discussion_id: props.discussionId } });
      let simpleQueryString;
      if (modifiedQuery.query) {
        simpleQueryString = modifiedQuery.query.simple_query_string;
        delete modifiedQuery.query.simple_query_string;
      }
      modifiedQuery.query = { bool: { filter: filters } };
      if (simpleQueryString) {
        this.setState({ show: true, queryString: simpleQueryString.query });
        simpleQueryString.query = `${simpleQueryString.query}*`;
        modifiedQuery.query.bool.must = [
          { simple_query_string: simpleQueryString }
        ];
      } else {
        this.setState({ queryString: null });
      }
      return modifiedQuery;
    });
    const translate = I18n.t.bind(I18n);
    this.searchkit.translateFunction = (key) => {
      return translate(`search.${key}`);
    };
    this.state = { show: false, queryString: null };
  }

  render() {
    const { isExpert, connectedUserId, discussionId } = this.props;
    let messagesSelected = false;
    let usersSelected = false;
    if (this.searchkit.state) {
      messagesSelected = this.searchkit.state.type.indexOf('post') >= 0;
      usersSelected = this.searchkit.state.type.indexOf('user') >= 0;
    }
    const sorts = [
      { label: 'By relevance', field: '_score', order: 'desc', defaultOption: true },
      { label: 'Most recent first', field: 'creation_date', order: 'desc' },
      { label: 'Oldest first', field: 'creation_date', order: 'asc' }
    ];
    if (messagesSelected) {
      sorts.push(
        { label: 'Most popular messages',
          key: 'popularity_desc',
          fields: [
            { field: 'sentiment_counts.popularity', options: { order: 'desc' } },
            { field: 'creation_date', options: { order: 'desc' } }
          ]
        }
      );
      sorts.push(
        { label: 'Less popular messages',
          key: 'popularity_asc',
          fields: [
            { field: 'sentiment_counts.popularity', options: { order: 'asc' } },
            { field: 'creation_date', options: { order: 'desc' } }
          ]
        }
      );
    }
    return (
      <SearchkitProvider searchkit={this.searchkit}>
        <Layout size="l">
          <TopBar>
            <SearchBox
              autofocus={false}
              searchOnChange
              searchThrottleTime={500}
              queryFields={queryFields}
            />
            <button
              className="btn btn-default btn-sm" id="search-expand"
              onClick={() => {
                this.setState({ show: !this.state.show }, () => {
                  if (this.state.show && !this.searchkit.hasHits()) {
                    this.searchkit.reloadSearch();
                  }
                });
              }}
            >
              {this.state.show ?
                <Translate value="search.collapse_search" />
              :
                <Translate value="search.expand_search" />
              }
            </button>
          </TopBar>
          <LayoutBody className={!this.state.show ? 'hidden' : null}>
            <SideBar>
              <ResetFilters />
              {/* <SelectedFilters /> */}
              <MenuFilter
                listComponent={CheckboxItemList}
                field="_type"
                id="type"
                title={I18n.t('search.Categories')}
              />
              <Panel title={I18n.t('search.Messages')} className={messagesSelected ? null : 'hidden'}>
                <MenuFilter
                  containerComponent={NoPanel}
                  listComponent={CheckboxItemList}
                  field="sentiment_tags"
                  id="sentiment_tags"
                  title={I18n.t('search.Messages')}
                />
                { connectedUserId ?
                  <div className="sk-panel">
                    <CheckboxFilter
                      containerComponent={NoPanel}
                      id="mymessages"
                      title={I18n.t('search.My messages')}
                      label={I18n.t('search.My messages')}
                      filter={TermQuery('creator_id', connectedUserId)}
                    />
                    <CheckboxFilter
                      containerComponent={NoPanel}
                      id="messages-in-response"
                      title={I18n.t('search.Messages in response to my contributions')}
                      label={I18n.t('search.Messages in response to my contributions')}
                      filter={TermQuery('parent_creator_id', connectedUserId)}
                    />
                  </div> : null }
              </Panel>
              { isExpert ?
                <Panel title={I18n.t('search.Participants')} className={usersSelected ? null : 'hidden'}>
                  <CheckboxFilter
                    containerComponent={NoPanel}
                    id="creative-participants"
                    title={I18n.t('search.Creative participants')}
                    label={I18n.t('search.Creative participants')}
                    filter={
                      HasChildQuery('post', BoolMust([
                        TermQuery('discussion_id', discussionId),
                        TermQuery('parent_id', 0)
                      ]))
                    }
                  />
                  <CheckboxFilter
                    containerComponent={NoPanel}
                    id="reactive-participants"
                    title={I18n.t('search.Reactive participants')}
                    label={I18n.t('search.Reactive participants')}
                    filter={
                      BoolMust([
                        HasChildQuery('post', BoolMust([
                          TermQuery('discussion_id', discussionId),
                          RangeQuery('parent_id', { gt: 0 })
                        ])),
                        BoolMustNot(
                          HasChildQuery('post', BoolMust([
                            TermQuery('discussion_id', discussionId),
                            TermQuery('parent_id', 0)
                          ]))
                        )
                      ])
                    }
                  />
                  <CheckboxFilter
                    containerComponent={NoPanel}
                    id="learning-participants"
                    title={I18n.t('search.Learning participants')}
                    label={I18n.t('search.Learning participants')}
                    filter={
                      BoolMustNot([
                        HasChildQuery('post',
                          TermQuery('discussion_id', discussionId)
                        )
                      ])
                    }
                  />
                  <CheckboxFilter
                    containerComponent={NoPanel}
                    id="participants-peers"
                    title={I18n.t('search.Participants pleased by their peers')}
                    label={I18n.t('search.Participants pleased by their peers')}
                    filter={
                      HasChildQuery('post', BoolMust([
                        TermQuery('discussion_id', discussionId),
                        RangeQuery('sentiment_counts.like', { gt: 0 })
                      ]))
                    }
                  />
                </Panel>
              : null }
              <TagFilterConfig id="creator_id" title="Participant" field="creator_id" />
              <Panel title={I18n.t('search.Sort')}>
                <SortingSelector
                  options={sorts}
                  listComponent={CheckboxItemList}
                />
              </Panel>
              <RangeFilter
                field="creation_date"
                id="creation_date"
                title={I18n.t('search.Filter by date')}
                rangeComponent={DateRangeFilter}
                min={946684800000}
                max={new Date().getTime()}
              />
            </SideBar>
            <LayoutResults>
              <ActionBar>
                <ActionBarRow>
                  <HitsStats />
                </ActionBarRow>
              </ActionBar>
              <Hits
                hitsPerPage={5}
                highlightFields={queryFields}
                customHighlight={customHighlight}
                itemComponent={HitItem}
                mod="sk-hits-list"
              />
              <InitialLoader />
              <Pagination showNumbers />
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }

}

const mapStateToProps = (state) => {
  const permissions = getPermissionsForConnectedUser(state);
  return {
    isExpert: canUseExpertInterface(permissions),
    connectedUserId: getConnectedUserId(state),
    discussionId: getDebateId(state)
  };
};

const ConnectedSearch = connect(mapStateToProps)(SearchComponent);
export default ConnectedSearch;