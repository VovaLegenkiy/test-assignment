import React, { Component } from 'react';
import './ColorPicker.css';

export default class ColorPicker extends Component {
    constructor (props) {
        super(props);
        this.state = {
            value: '#ffffff',
            rgbColor: this.hexToRgb(this.props.value),
            colors: [
                {
                    colorName: 'white',
                    colorValue: '#ffffff'
                }
            ],
            showSliders: false,
            showColors: false
        };
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    handleSubmit (e) {
        e.preventDefault();
        this.setState((prevState) => ({
            value: this.rgbToHex(prevState.rgbColor)
        }));
        this.props.onChange(this.rgbToHex(this.state.rgbColor));
        this.closeList(e);
    }

    closeList (e) {
        e.preventDefault();
        document.removeEventListener('mousedown', this.handleClickOutside);
        this.setState((prevState) => ({
            rgbColor: this.hexToRgb(prevState.value),
            showColors: false,
            showSliders: false
        }));
    }

    chooseColor (e) {
        const target = e.target;
        if (target.tagName !== 'SPAN') {
            this.closeList(e);
            return;
        }
        const targetParent = target.parentElement;
        const colorName = targetParent.dataset.name;
        this.setState(prevState => ({
            rgbColor: this.hexToRgb(prevState.colors[colorName]),
            value: prevState.colors[colorName]
        }));
        this.props.onChange(this.state.colors[colorName]);
    }

    rangeChange (e) {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        const newValue = {};
        newValue[name] = +value;
        this.setState((prevState) => ({
            rgbColor: Object.assign(prevState.rgbColor, newValue)
        }));
    }

    handleClickOutside (event) {
        const rgb = this.rgbList;
        const colors = this.colorsList;
        if ((rgb && !rgb.contains(event.target)) || (colors && !colors.contains(event.target))) {
            this.closeList(event);
        }
    }

    componentWillUnmount () {
        document.removeEventListener('mousedown', this.handleClickOutside);
        this.removeEventListener('change', this.props.onChange);
    }

    componentWillMount () {
        this.setState({
            colors: this.props.colors,
            value: this.props.value,
        });
    }

    render () {
        const pickedColor = this.state.rgbColor;
        const pickedColorStyle = {
            backgroundColor: `rgb(${pickedColor.red},${pickedColor.green},${pickedColor.blue})`
        };
        const liStyle = {display: 'inline-block', position: 'relative'};
        return (
          <div className='container'>
              <ul style={{listStyle: 'none', display: 'flex'}}>
                  <li style={liStyle}><input type="text" disabled={true} defaultValue={this.defaultValue}
                                             value={this.props.value}/></li>
                  <li style={liStyle}>
                      <div className='picked-color' style={pickedColorStyle}
                           onClick={this.showColorSliders.bind(this)}></div>
                      {this.getRgbList()}
                  </li>
                  <li style={liStyle}>
                      <div className='colors' onClick={this.showColors.bind(this)}>▼</div>
                      {this.getColorsList()}
                  </li>
              </ul>
          </div>
        );
    }

    getRgbList () {
        const rgbColor = this.state.rgbColor;
        return this.state.showSliders ?
          (
            <form className='rgb-list' onChange={this.rangeChange.bind(this)}
                  onSubmit={this.handleSubmit.bind(this)} ref={node => {this.rgbList = node;}}>
                <ul className='list'>
                    {Object.keys(rgbColor).map((key, index) => {
                        return (
                          <li className='rgb-list__item' key={index}>
                              <span>{key.substring(0, 1).toUpperCase()}</span>
                              <input type="range" min={0} max={255} step={1} name={key}
                                     defaultValue={rgbColor[key]}/>
                          </li>
                        );
                    })}
                </ul>
                <button type='button' onClick={this.closeList.bind(this)}>Cancel</button>
                <button>Ok</button>
            </form>
          )
          : null;
    }

    getColorsList () {
        const colors = this.props.colors;
        return this.state.showColors ? (
          <form className='colors-list' onSubmit={this.handleSubmit.bind(this)}
                onClick={this.chooseColor.bind(this)} ref={node => {this.colorsList = node;}}>
              <ul className='list'>
                  {Object.keys(colors).map((colorName, index) => {
                      return (
                        <li className='colors-list__item' key={index} data-name={colorName}>
                            <span style={{flexGrow: '1'}}>{colorName.toUpperCase()}</span>
                            <span className='item__color' style={{
                                backgroundColor: colors[colorName],
                            }}>
                            </span>
                        </li>);
                  })}
              </ul>
          </form>
        ) : null;
    }

    showColorSliders () {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.setState((prevState) => ({
            showSliders: !prevState.showSliders
        }));
    }

    showColors () {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.setState((prevState) => ({
            showColors: !prevState.showColors
        }));
    }

    colorPartToHex (colorPart) {
        const hex = colorPart.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    rgbToHex (colors) {
        const firstPartOfColor = this.colorPartToHex(colors.red);
        const secondPartOfColor = this.colorPartToHex(colors.green);
        const thirdPartOfColor = this.colorPartToHex(colors.blue);
        return `#${firstPartOfColor}${secondPartOfColor}${thirdPartOfColor}`;
    }

    hexToRgb (hex) {
        const result = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec(hex);
        let red = result[1];
        let green = result[2];
        let blue = result[3];
        red = red.length === 1 ? parseInt(red + red, 16) : parseInt(red, 16);
        green = green.length === 1 ? parseInt(green + green, 16) : parseInt(green, 16);
        blue = blue.length === 1 ? parseInt(blue + blue, 16) : parseInt(blue, 16);
        return result ? {
            red: red,
            green: green,
            blue: blue
        } : null;
    }
}
