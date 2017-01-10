import React from 'react';
import { Glyphicon } from 'react-bootstrap';

class Icons extends React.Component {
  render() {
    return (
      <div>
        <div className="title-2 underline" id="icons">ICONS</div>
        <section>
          <div className="rounded-icon"><Glyphicon glyph="search" /></div>
          <div className="white-icon"><Glyphicon glyph="question-sign" /></div>
          <div className="black-icon"><Glyphicon glyph="comment" /></div>
          <div className="black-icon"><Glyphicon glyph="log-in" /></div>
          <div className="black-icon"><Glyphicon glyph="user" /></div>
          <div className="black-icon"><Glyphicon glyph="eye-open" /></div>
        </section>
        <section>
          <div className="title-3">Code</div>
          <div className="box">
            <div>
              <div className="code">
                <span>&lt;</span>
                <span>div className=&quot;rounded-icon&quot;</span>
                <span>&gt;</span>
                <span>&lt;</span>
                <span>Glyphicon glyph=&quot;search&quot; /</span>
                <span>&gt;</span>
                <span>&lt;</span>
                <span>/div</span>
                <span>&gt;</span>
              </div>
              <div className="code">
                <span>&lt;</span>
                <span>div className=&quot;white-icon&quot;</span>
                <span>&gt;</span>
                <span>&lt;</span>
                <span>Glyphicon glyph=&quot;question-sign&quot; /</span>
                <span>&gt;</span>
                <span>&lt;</span>
                <span>/div</span>
                <span>&gt;</span>
              </div>
              <div className="code">
                <span>&lt;</span>
                <span>div className=&quot;black-icon&quot;</span>
                <span>&gt;</span>
                <span>&lt;</span>
                <span>Glyphicon glyph=&quot;comment&quot; /</span>
                <span>&gt;</span>
                <span>&lt;</span>
                <span>/div</span>
                <span>&gt;</span>
              </div>
              <div className="code">
                <span>&lt;</span>
                <span>div className=&quot;black-icon&quot;</span>
                <span>&gt;</span>
                <span>&lt;</span>
                <span>Glyphicon glyph=&quot;log-in&quot; /</span>
                <span>&gt;</span>
                <span>&lt;</span>
                <span>/div</span>
                <span>&gt;</span>
              </div>
              <div className="code">
                <span>&lt;</span>
                <span>div className=&quot;black-icon&quot;</span>
                <span>&gt;</span>
                <span>&lt;</span>
                <span>Glyphicon glyph=&quot;user&quot; /</span>
                <span>&gt;</span>
                <span>&lt;</span>
                <span>/div</span>
                <span>&gt;</span>
              </div>
              <div className="code">
                <span>&lt;</span>
                <span>div className=&quot;black-icon&quot;</span>
                <span>&gt;</span>
                <span>&lt;</span>
                <span>Glyphicon glyph=&quot;eye-open&quot; /</span>
                <span>&gt;</span>
                <span>&lt;</span>
                <span>/div</span>
                <span>&gt;</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Icons;