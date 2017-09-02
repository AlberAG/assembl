import React from 'react';
import { Translate } from 'react-redux-i18n';
import { Grid } from 'react-bootstrap';
import IdeasLevel from './ideasLevel';

class Ideas extends React.Component {
  constructor(props) {
    super(props);
    const { rootIdeaId } = this.props;
    this.state = { selectedIdeasId: [rootIdeaId], selectedIdeaIndex: 0 };
    this.listIdeasToDisplay = this.listIdeasToDisplay.bind(this);
    this.setSelectedIdeas = this.setSelectedIdeas.bind(this);
  }
  setSelectedIdeas(selectedIdeaId, ideaLevel, ideaIndex) {
    const nbLevel = this.state.selectedIdeasId.length;
    const arr = this.state.selectedIdeasId;
    this.setState({ selectedIdeaIndex: ideaIndex });
    if (arr.indexOf(selectedIdeaId) <= -1 && ideaLevel === nbLevel) {
      arr.push(selectedIdeaId);
      this.setState({
        selectedIdeasId: arr
      });
    } else if (ideaLevel < nbLevel) {
      const nbToRemove = this.state.selectedIdeasId.length - ideaLevel;
      arr.splice(ideaLevel, nbToRemove, selectedIdeaId);
      this.setState({
        selectedIdeasId: arr
      });
    }
  }
  listIdeasToDisplay(selectedIdeaId) {
    const { ideas } = this.props;
    const listedIdeas = [];
    ideas.forEach((idea) => {
      if (idea.parentId === selectedIdeaId) {
        listedIdeas.push(idea);
      }
    });
    return listedIdeas;
  }
  render() {
    const { identifier } = this.props;
    return (
      <section className="themes-section ideas-section">
        <Grid fluid className="background-grey">
          <div className="max-container">
            <div className="title-section">
              <div className="title-hyphen">&nbsp;</div>
              <h1 className="dark-title-1">
                <Translate value="debate.survey.themesTitle" />
              </h1>
            </div>
            <div className="content-section">
              {this.state.selectedIdeasId.map((ideaId, index) => {
                return (
                  <IdeasLevel
                    ideas={this.listIdeasToDisplay(ideaId)}
                    identifier={identifier}
                    setSelectedIdeas={this.setSelectedIdeas}
                    nbLevel={this.state.selectedIdeasId.length}
                    ideaLevel={index + 1}
                    key={index}
                    selectedIdeasId={this.state.selectedIdeasId}
                    selectedIdeaIndex={this.state.selectedIdeaIndex}
                  />
                );
              })}
            </div>
          </div>
        </Grid>
      </section>
    );
  }
}

export default Ideas;