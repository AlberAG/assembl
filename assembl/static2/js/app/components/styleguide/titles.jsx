import React from 'react';

class Titles extends React.Component {
  render() {
    return (
      <div>
        <div className="title-2 underline" id="titles">TITLES</div>
        <section>
          <div className="title-1">Title 1</div>
          <div className="title-2">Title 2</div>
          <div className="title-3">Title 3</div>
        </section>
        <section>
          <div className="title-3">Code</div>
          <div className="box">
            <div>
              <div className="code">
                <span>&lt;</span><span>div className=&quot;title-1&quot;</span><span>&gt;</span>
              </div>
              <span>Title 1</span>
              <div className="code">
                <span>&lt;</span><span>/div</span><span>&gt;</span>
              </div>
            </div>
            <div>
              <div className="code">
                <span>&lt;</span><span>div className=&quot;title-2&quot;</span><span>&gt;</span>
              </div>
              <span>Title 2</span>
              <div className="code">
                <span>&lt;</span><span>/div</span><span>&gt;</span>
              </div>
            </div>
            <div>
              <div className="code">
                <span>&lt;</span><span>div className=&quot;title-3&quot;</span><span>&gt;</span>
              </div>
              <span>Title 3</span>
              <div className="code">
                <span>&lt;</span><span>/div</span><span>&gt;</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default Titles;