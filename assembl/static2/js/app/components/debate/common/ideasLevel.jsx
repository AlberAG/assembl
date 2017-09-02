import React from 'react';
import { Row, Col } from 'react-bootstrap';
import IdeaPreview from '../../common/ideaPreview';
import { get as getRoute } from '../../../utils/routeMap';
import { getDiscussionSlug } from '../../../utils/globalFunctions';
import VisibilityComponent from '../../common/visibilityComponent';
import { APP_CONTAINER_MAX_WIDTH, NB_IDEA_PREVIEW_TO_SHOW, APP_CONTAINER_PADDING, IDEA_PREVIEW_MAX_WIDTH } from '../../../constants';

const xsCol = 12;
const smCol = 6;
const mdCol = 3;

class IdeasLevel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderCount: 0,
      sliderLeftPosition: 0,
      sliderContainerWidth: 0,
      ideaPreviewWidth: 0
    };
  }
  componentWillMount() {
    if (window.innerWidth > APP_CONTAINER_MAX_WIDTH) {
      this.setState({
        sliderContainerWidth: APP_CONTAINER_MAX_WIDTH + this.getRightOverflowValue(),
        ideaPreviewWidth: APP_CONTAINER_MAX_WIDTH / NB_IDEA_PREVIEW_TO_SHOW
      });
    } else {
      this.setState({
        sliderContainerWidth: window.innerWidth - APP_CONTAINER_PADDING * 2,
        ideaPreviewWidth: (window.innerWidth - APP_CONTAINER_PADDING) / (NB_IDEA_PREVIEW_TO_SHOW + 0.5)
      });
    }
  }
  componentDidMount() {
    this.runTransition();
  }
  componentWillReceiveProps(nextProps) {
    const { ideaLevel, nbLevel, selectedIdeaIndex } = nextProps;
    const isCountShouldIncrease = ideaLevel < nbLevel;
    if (!isCountShouldIncrease) {
      this.setState({ sliderCount: 0, sliderLeftPosition: 0 });
    } else if (this.props.nbLevel <= 1) {
      setTimeout(() => {
        this.moveToSelectedIdea(selectedIdeaIndex);
      }, 500);
    }
  }
  getColClassNames(index) {
    const { ideaLevel } = this.props;
    this.index = index;
    let styles = 'theme';
    if (ideaLevel <= 1) {
      if (this.index % 4 === 0) {
        styles += ' clear';
      }
      if (this.index <= 3) {
        styles += ` theme-first-row-${this.index % 4}`;
      } else {
        styles += ` theme-${this.index % 4}`;
      }
    } else {
      styles = 'theme theme-inline';
    }
    return styles;
  }
  getRightOverflowValue() {
    const { sliderContainerWidth, ideaPreviewWidth } = this.state;
    let rightOverflowValue = 0;
    if (window.innerWidth > APP_CONTAINER_MAX_WIDTH) {
      rightOverflowValue = (window.innerWidth - APP_CONTAINER_MAX_WIDTH) / 2;
      if (rightOverflowValue > IDEA_PREVIEW_MAX_WIDTH / 2) {
        rightOverflowValue = IDEA_PREVIEW_MAX_WIDTH / 2;
      }
    } else {
      rightOverflowValue = sliderContainerWidth - ideaPreviewWidth * NB_IDEA_PREVIEW_TO_SHOW;
    }
    return rightOverflowValue;
  }
  getSliderWidth() {
    const { ideas } = this.props;
    const { ideaPreviewWidth } = this.state;
    return ideas.length * ideaPreviewWidth;
  }
  getHiddenSliderWidth() {
    const { sliderContainerWidth } = this.state;
    return this.getSliderWidth() - sliderContainerWidth;
  }
  getStartEndMovingValue() {
    const { ideas } = this.props;
    const { ideaPreviewWidth } = this.state;
    if (ideas.length === NB_IDEA_PREVIEW_TO_SHOW + 1) {
      return ideaPreviewWidth - this.getRightOverflowValue();
    }
    return ideaPreviewWidth - this.getRightOverflowValue() / 2;
  }
  moveToSelectedIdea(selectedIdeaIndex) {
    const { ideas } = this.props;
    const { sliderLeftPosition, ideaPreviewWidth } = this.state;
    let count = selectedIdeaIndex;
    let left = sliderLeftPosition;
    if (selectedIdeaIndex >= NB_IDEA_PREVIEW_TO_SHOW) {
      for (let i = 0; i < count; i += 1) {
        if (i === 0 || i === ideas.length - NB_IDEA_PREVIEW_TO_SHOW - 1) {
          left += this.getStartEndMovingValue();
        } else if (i < ideas.length - NB_IDEA_PREVIEW_TO_SHOW - 1) {
          left += ideaPreviewWidth;
        }
      }
      if (selectedIdeaIndex > ideas.length - NB_IDEA_PREVIEW_TO_SHOW) {
        count = ideas.length - NB_IDEA_PREVIEW_TO_SHOW;
      }
      this.setState({ sliderCount: count });
      this.setState({ sliderLeftPosition: left });
    }
  }
  runTransition() {
    const { nbLevel } = this.props;
    const themes = document.getElementById('row-1').getElementsByClassName('theme');
    if (nbLevel > 1) {
      setTimeout(() => {
        for (let i = 0; i < themes.length; i += 1) {
          themes[i].className = `theme theme-inline col-md-${mdCol} col-sm-${smCol} col-xs-${xsCol}`;
        }
      }, 10);
    }
  }
  isLeftLimitReached() {
    const { sliderLeftPosition } = this.state;
    return sliderLeftPosition === this.getStartEndMovingValue();
  }
  isRightLimitReached() {
    const { sliderLeftPosition } = this.state;
    return sliderLeftPosition >= this.getHiddenSliderWidth();
  }
  handleClickArrowLeft() {
    const { ideas } = this.props;
    const { sliderCount, sliderLeftPosition, ideaPreviewWidth } = this.state;
    let count = sliderCount;
    let left = sliderLeftPosition;
    if (count > 0) {
      count -= 1;
    }
    if (count === 0) {
      left = 0;
    } else if (count === ideas.length - NB_IDEA_PREVIEW_TO_SHOW - 1) {
      left -= this.getStartEndMovingValue();
    } else {
      left -= ideaPreviewWidth;
    }
    this.setState({ sliderCount: count });
    this.setState({ sliderLeftPosition: left });
  }
  handleClickArrowRight() {
    const { ideas } = this.props;
    const { sliderCount, sliderLeftPosition, ideaPreviewWidth } = this.state;
    let count = sliderCount;
    let left = sliderLeftPosition;
    if (!this.isRightLimitReached()) {
      count += 1;
    }
    if (count === 1 || count === ideas.length - NB_IDEA_PREVIEW_TO_SHOW) {
      left += this.getStartEndMovingValue();
    } else {
      left += ideaPreviewWidth;
    }
    this.setState({ sliderCount: count });
    this.setState({ sliderLeftPosition: left });
  }
  render() {
    const { ideas, identifier, setSelectedIdeas, nbLevel, ideaLevel, selectedIdeasId } = this.props;
    const { sliderLeftPosition, sliderCount, sliderContainerWidth, ideaPreviewWidth } = this.state;
    const slug = getDiscussionSlug();
    const isRightLimitReached = this.isRightLimitReached();
    const isArrowVisible = this.getSliderWidth() > sliderContainerWidth;
    return (
      <div className="slider-container relative" style={nbLevel > 1 ? { width: `${sliderContainerWidth}px` } : {}}>
        <VisibilityComponent isVisible={isArrowVisible && nbLevel > 1 && sliderCount > 0} classname="slider-arrow-container">
          <div
            className="slider-arrow slider-arrow-left"
            onClick={() => {
              this.handleClickArrowLeft();
            }}
          >
            <span className="assembl-icon-down-open" />
          </div>
        </VisibilityComponent>
        <div className="slider" style={{ left: `-${sliderLeftPosition}px`, transition: 'all .2s ease-out' }}>
          <Row id={`row-${ideaLevel}`} className={nbLevel > 1 ? 'no-margin row-inline' : 'no-margin'}>
            {ideas.map((idea, index) => {
              return (
                <Col
                  xs={xsCol}
                  sm={smCol}
                  md={mdCol}
                  key={index}
                  className={this.getColClassNames(index)}
                  style={nbLevel > 1 ? { width: ideaPreviewWidth } : {}}
                >
                  <IdeaPreview
                    imgUrl={idea.imgUrl}
                    numPosts={idea.numPosts}
                    numContributors={idea.numContributors}
                    numChildren={idea.numChildren}
                    link={`${getRoute('debate', { slug: slug, phase: identifier })}${getRoute('theme', { themeId: idea.id })}`}
                    title={idea.title}
                    description={idea.description}
                    setSelectedIdeas={setSelectedIdeas}
                    ideaId={idea.id}
                    ideaLevel={ideaLevel}
                    selectedIdeasId={selectedIdeasId}
                    ideaIndex={index}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
        <VisibilityComponent isVisible={isArrowVisible && nbLevel > 1 && !isRightLimitReached} classname="slider-arrow-container">
          <div
            className="slider-arrow slider-arrow-right"
            onClick={() => {
              this.handleClickArrowRight();
            }}
          >
            <span className="assembl-icon-up-open" />
          </div>
        </VisibilityComponent>
      </div>
    );
  }
}

export default IdeasLevel;