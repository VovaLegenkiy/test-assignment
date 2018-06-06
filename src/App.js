import React, { Component } from 'react';
import ColorPicker from './components/ColorPicker';

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            colorPresets: {
                'red': '#ff0000',
                'yellow': '#ffff00',
                'green': '#00ff00',
                'blue': '#0000ff'
            },
            value: '#ff0000'//hex value should be in long type '#ff0000' not in a short one '#f00'
        };
    }

    handleChange (color) {
        this.setState({
            value: color
        });
    }

    render () {
        return (
          <div>
              <ColorPicker colors={this.state.colorPresets} value={this.state.value}
                           onChange={this.handleChange.bind(this)}/>
          </div>
        );
    }
}

export default App;
