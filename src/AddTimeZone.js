import * as React from "react";

export default class AddTimeZone extends React.Component {
  render() {
    return (
      <div>
        Add Timezone!
        <button onClick={this.props.close}>Close</button>
      </div>
    );
  }
}
