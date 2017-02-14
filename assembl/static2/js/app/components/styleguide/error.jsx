import React from 'react';
import Error from '../common/error';

class ErrorComponent extends React.Component {
  render() {
    return (
      <div>
        <h2 className="dark-title-2 underline" id="error">ERROR</h2>
        <section>
          <Error errorMessage="ErrorMessage" />
        </section>
        <section>
          <h3 className="dark-title-3">Code</h3>
          <pre>
            &lt;Error errorMessage="ErrorMessage" /&gt;
          </pre>
        </section>
      </div>
    );
  }
}

export default ErrorComponent;