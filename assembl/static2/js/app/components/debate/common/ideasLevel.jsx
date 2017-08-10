import React from 'react';
import { Row, Col } from 'react-bootstrap';
import getValue from 'lodash/get';
import IdeaPreview from '../../common/ideaPreview';
import VisibilityComponent from '../../common/visibilityComponent';
import { get as getRoute } from '../../../utils/routeMap';
import { getDiscussionSlug } from '../../../utils/globalFunctions';
import '../../../../../css/components/ideas.scss';

class IdeasLevel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInline: props.isInline || false,
      selectedIdea: props.selectedIdea || null,
      isScrollLeftButtonVisible: props.isInline || false,
      isScrollRightButtonVisible: props.isInline || false
    };
    this.options = {};
    this.setOption('selectedIdea', props.selectedIdea || null);

    this.initializeConstants();

    this.onSeeSubIdeasClick = this.onSeeSubIdeasClick.bind(this);
    this.updateScrollButtonsVisibility = this.updateScrollButtonsVisibility.bind(this);
    this.moveAllChildren = this.moveAllChildren.bind(this);
    this.onScrollRightClick = this.onScrollRightClick.bind(this);
    this.onScrollLeftClick = this.onScrollLeftClick.bind(this);
    this.scrollToIdeaIndexIfNecessary = this.scrollToIdeaIndexIfNecessary.bind(this);
  }

  onSeeSubIdeasClick(ideaId, index, step = 0) {
    const wasInline = this.state.isInline || this.getOption('isAnimatingTowardsInline');

    if (!wasInline) {
      const goNextStep = () => {
        this.onSeeSubIdeasClick(ideaId, index, step + 1);
      };
      goNextStep.bind(this);

      if (!step) {
        /*
        Animation step 0:
          - Animate ideas top margins from various values to 0
          - Set row width to its current width, in anticipation of future animation
          - Set ideas left position to current 0, in anticipation of future scroll animation
        */
        const row = this.getRow();
        row.style.width = `${row.clientWidth}px`;
        row.style.transition = 'width 0.5s';
        row.childNodes.forEach((el) => {
          const el2 = el;
          el2.style.marginTop = '0';
          el2.style.left = '0';
        });

        setTimeout(goNextStep, 500);
        return;
      } else if (step === 1) {
        /*
        Animation step 1:
          - Set ideas positioning to a single row (set row display to inline-flex)
          - Set necessary values consequently to inline-flex, for animation consistency
        */
        this.initializeConstants();
        const row = this.getRow();
        row.childNodes.forEach((el) => {
          const el2 = el;
          el2.style.flexShrink = '0';
          el2.style.width = `${this.getOption('thematicWidth')}px`;
        });
        row.style.overflowX = 'hidden';
        row.style.display = 'inline-flex';

        setTimeout(goNextStep, 50);
        return;
      } else if (step === 2) {
        /*
        Animation step 2:
          - Animate carousel from full page width to custom value
        */

        const row = this.getRow();
        row.style.width = `${this.getOption('carouselWidth')}px`;

        this.scrollToIdeaIndexIfNecessary(index);

        const f = () => {
          this.onSeeSubIdeasClick(ideaId, index, step + 1);
          this.forceUpdate();
        };
        f.bind(this);

        setTimeout(f, 500);

        return;
      }
    }

    if (wasInline && ideaId === this.getOption('selectedIdea')) {
      this.goMultiline();
      return;
    }

    this.setOption('isAnimatingTowardsInline', true);
    this.me.classList.add('animating-towards-inline');

    this.setOption('selectedIdea', ideaId);

    this.initializeConstants();

    // make sure that the clicked thematic shows fully when inline (scroll at the correct position so that it is shown)
    if (!wasInline) {
      this.scrollToIdeaIndexIfNecessary(index);
    }
    this.updateScrollButtonsVisibility(this.state.isInline, true);
  }

  onScrollRightClick() {
    this.moveAllChildren(this.getRow(), -1 * this.getOption('animationDistance'));
  }

  onScrollLeftClick() {
    this.moveAllChildren(this.getRow(), this.getOption('animationDistance'));
  }

  getRow() {
    return this.me.childNodes[1];
  }

  getOption(name) {
    return getValue(this, ['options', name], null);
  }

  setOption(name, value) {
    this.options[name] = value;
  }

  scrollToIdeaIndexIfNecessary(index) {
    const thematicWidth = this.getOption('thematicWidth');
    const carouselWidth = this.getOption('carouselWidth');
    const ideaInitialX = index * thematicWidth;
    if (ideaInitialX + thematicWidth > carouselWidth) {
      const numberOfIdeasFullyShown = Math.floor(carouselWidth / thematicWidth);
      const middleIdeaX = Math.floor(numberOfIdeasFullyShown / 2) * thematicWidth;
      const targetScrollValue = -1 * (index * thematicWidth - middleIdeaX);
      this.moveAllChildren(this.getRow(), targetScrollValue, true);
    }
  }

  updateScrollButtonsVisibility(isInline, isAnimatingTowardsInline) {
    if (!(isInline || isAnimatingTowardsInline)) {
      this.scrollLeft.setState({ isVisible: false });
      this.scrollRight.setState({ isVisible: false });
    } else {
      const targetValueInt = this.getOption('scrollDisplacement');
      const displacementMin = this.getOption('displacementMin');
      const displacementMax = this.getOption('displacementMax');
      if (targetValueInt >= displacementMax) {
        this.scrollLeft.setState({ isVisible: false });
      } else {
        this.scrollLeft.setState({ isVisible: true });
      }

      if (targetValueInt <= displacementMin) {
        this.scrollRight.setState({ isVisible: false });
      } else {
        this.scrollRight.setState({ isVisible: true });
      }
    }
  }

  initializeConstants() {
    const carouselParentWidth = 1400; // TODO: read dynamically from DOM
    const scrollDisplacement = this.getOption('scrollDisplacement') || 0;
    const thematicWidth = 350; // TODO: read dynamically from DOM
    let carouselTargetWidth = (Math.floor(carouselParentWidth / thematicWidth) - 0.5) * thematicWidth;
    if (carouselTargetWidth < 1.5 * thematicWidth) {
      carouselTargetWidth = 1.5 * thematicWidth;
    }
    let len = 0;
    if (
      this.props &&
      'thematics' in this.props &&
      this.props.thematics &&
      'length' in this.props.thematics &&
      this.props.thematics.length
    ) {
      len = this.props.thematics.length;
    }
    const displacementMin = -1.0 * (len * thematicWidth - carouselTargetWidth);
    const displacementMax = 0;

    this.setOption('scrollDisplacement', scrollDisplacement);
    this.setOption('thematicWidth', thematicWidth);
    this.setOption('animationDistance', thematicWidth);
    this.setOption('carouselWidth', carouselTargetWidth);
    this.setOption('displacementMin', displacementMin);
    this.setOption('displacementMax', displacementMax);
  }

  moveAllChildren(element, distance, absolute) {
    let targetValue = 0;
    let currentValue = 0;
    const displacementMin = this.getOption('displacementMin');
    const displacementMax = this.getOption('displacementMax');
    if (element.childNodes && element.childNodes.length) {
      const el0 = element.childNodes[0];
      currentValue = el0.style.left;
      let targetValueInt = 0;
      if (!currentValue || absolute) {
        targetValueInt = distance;
      } else {
        targetValueInt = parseInt(currentValue, 10) + distance;
      }

      if (targetValueInt >= displacementMax) {
        targetValueInt = displacementMax;
      }

      if (targetValueInt <= displacementMin) {
        targetValueInt = displacementMin;
      }

      targetValue = `${targetValueInt}px`;
      this.setOption('scrollDisplacement', targetValueInt);

      element.childNodes.forEach((el) => {
        const el2 = el;
        if (!currentValue) {
          el2.style.left = 0; // first set to 0 for smooth CSS animation
          el2.style.left = targetValue;
        } else {
          el2.style.left = targetValue;
        }
      });

      this.updateScrollButtonsVisibility(this.state.isInline, this.getOption('isAnimatingTowardsInline'));
    }
  }

  render() {
    const { thematics, identifier, onSeeSubIdeasClick, level } = this.props;
    const { isScrollLeftButtonVisible, isScrollRightButtonVisible } = this.state;
    const selectedIdea = this.getOption('selectedIdea');
    const slug = getDiscussionSlug();
    let classNames = ['ideas-level'];
    if (this.getOption('isAnimatingTowardsInline')) {
      classNames.push('animating-towards-inline');
    }
    if (this.state.isInline) {
      classNames.push('is-inline');
    } else {
      classNames.push('multiline');
    }
    classNames = classNames.join(' ');

    const style = {};
    if (this.state.isInline || this.getOption('isAnimatingTowardsInline')) {
      style.width = this.getOption('carouselWidth');
    }

    return (
      <div
        className={classNames}
        style={style}
        ref={(el) => {
          this.me = el;
        }}
      >
        <VisibilityComponent
          isVisible={isScrollLeftButtonVisible}
          ref={(el) => {
            this.scrollLeft = el;
          }}
          className="scroll-left-container"
        >
          <div className="scroll-left" onClick={this.onScrollLeftClick} />
        </VisibilityComponent>
        <Row
          className="no-margin"
          ref={(el) => {
            this.row = el;
          }}
        >
          {thematics.map((thematic, index) => {
            return (
              <Col xs={12} sm={6} md={3} className={index % 4 === 0 ? 'theme no-padding clear' : 'theme no-padding'} key={index}>
                <IdeaPreview
                  imgUrl={thematic.imgUrl}
                  numPosts={thematic.numPosts}
                  numContributors={thematic.numContributors}
                  numChildren={thematic.numChildren}
                  isSelected={selectedIdea === thematic.id}
                  link={`${getRoute('debate', { slug: slug, phase: identifier })}${getRoute('theme', { themeId: thematic.id })}`}
                  title={thematic.title}
                  description={thematic.description}
                  onSeeSubIdeasClick={() => {
                    onSeeSubIdeasClick(thematic.id, level);
                    this.onSeeSubIdeasClick(thematic.id, index);
                  }}
                />
              </Col>
            );
          })}
        </Row>
        <VisibilityComponent
          isVisible={isScrollRightButtonVisible}
          ref={(el) => {
            this.scrollRight = el;
          }}
          className="scroll-right-container"
        >
          <div className="scroll-right" onClick={this.onScrollRightClick} />
        </VisibilityComponent>
      </div>
    );
  }
}

export default IdeasLevel;