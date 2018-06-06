import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './ColorPicker.css';

const STRING_SYSTEM = 16;
export default class ColorPicker extends Component {
    static get propTypes () {
        return {
            value: PropTypes.string,
            colors: PropTypes.object,
            onChange: PropTypes.func
        };
    }

    static get defaultProps () {
        return {
            value: '#fff',
            colors: {
                'red': '#f00',
                'green': '#0f0',
                'blue': '#00f'
            },
            onChange: () => {}
        };
    }

    constructor (props) {
        super(props);
        this.state = {
            value: '#ffffff',
            rgbColor: this.setHexToRgb(this.props.value),
            colors: [
                {
                    colorName: 'white',
                    colorValue: '#ffffff'
                }
            ],
            toggleSliders: false,
            toggleColors: false
        };
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    handleSubmit (e) {
        e.preventDefault();
        this.setState((prevState) => ({
            value: this.setRgbToHex(prevState.rgbColor)
        }));
        this.props.onChange(this.setRgbToHex(this.state.rgbColor));
        this.closeList();
    }

    closeList () {
        document.removeEventListener('mousedown', this.handleClickOutside);
        this.setState((prevState) => ({
            rgbColor: this.setHexToRgb(prevState.value),
            toggleColors: false,
            toggleSliders: false
        }));
    }

    setColor (e) {
        const {target} = e;
        if (target.tagName !== 'SPAN') {
            this.closeList();
            return;
        }
        const {parentElement} = target;
        const {colorName} = parentElement.dataset;
        this.setState(prevState => ({
            rgbColor: this.setHexToRgb(prevState.colors[colorName]),
            value: prevState.colors[colorName]
        }));
        this.props.onChange(this.state.colors[colorName]);
        this.closeList();
    }

    changeRgbValue (e) {
        const {target} = e;
        const {name, value} = target;
        this.setState((prevState) => {
              const {rgbColor} = prevState;
              rgbColor[name] = +value;
              return ({rgbColor});
          }
        );
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
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.changeRgbValue = this.changeRgbValue.bind(this);
        this.setColor = this.setColor.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeList = this.closeList.bind(this);
        this.setState({
            colors: this.props.colors,
            value: this.props.value,
        });
    }

    toggleDropdown (e) {
        document.addEventListener('mousedown', this.handleClickOutside);
        const {target} = e;
        const dropdownName = target.dataset.dropdownName || target.parentElement.dataset.dropdownName;
        this.setState((prevState) => {
            const state = prevState[dropdownName] = !prevState[dropdownName];
            return ({state});
        });
    }

    setColorPartToHex (colorPart) {
        const hex = colorPart.toString(STRING_SYSTEM);
        return hex.length === 1 ? '0' + hex : hex;
    }

    setRgbToHex (colors) {
        const firstPartOfColor = this.setColorPartToHex(colors.red);
        const secondPartOfColor = this.setColorPartToHex(colors.green);
        const thirdPartOfColor = this.setColorPartToHex(colors.blue);
        return `#${firstPartOfColor}${secondPartOfColor}${thirdPartOfColor}`;
    }

    setHexToRgb (hex) {
        const reg = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i;
        const result = reg.exec(hex);
        let red = result[1];
        let green = result[2];
        let blue = result[3];
        red = red.length === 1 ? parseInt(red + red, STRING_SYSTEM) : parseInt(red, STRING_SYSTEM);
        green = green.length === 1 ? parseInt(green + green, STRING_SYSTEM) : parseInt(green, STRING_SYSTEM);
        blue = blue.length === 1 ? parseInt(blue + blue, STRING_SYSTEM) : parseInt(blue, STRING_SYSTEM);
        return result ? {
            red,
            green,
            blue
        } : null;
    }

    getRgbList () {
        const {rgbColor} = this.state;
        return this.state.toggleSliders ?
          (
            <form className={'rgb-list'} onChange={this.changeRgbValue}
                  onSubmit={this.handleSubmit} ref={node => {this.rgbList = node;}}>
                <ul className={'list'}>
                    {Object.keys(rgbColor).map(key => {
                        return (
                          <li className={'rgb-list__item'} key={key}>
                              <span>{key.substring(0, 1).toUpperCase()}</span>
                              <input type={'range'} min={0} max={255} step={1} name={key}
                                     defaultValue={rgbColor[key]}/>
                          </li>
                        );
                    })}
                </ul>
                <button className={'btn btn__cancel'} type={'button'} onClick={this.closeList}>Cancel</button>
                <button className={'btn btn__ok'}>Ok</button>
            </form>
          )
          : null;
    }

    getColorsList () {
        const {colors} = this.props;
        return this.state.toggleColors
          ? (
            <div className={'colors-list'}
                 onClick={this.setColor} ref={node => {this.colorsList = node;}}>
                <ul className={'list'}>
                    {Object.keys(colors).map(colorName => {
                        return (
                          <li className={'colors-list__item'} key={colorName} data-color-name={colorName}>
                              <span className={'color-name'}>{colorName.toUpperCase()}</span>
                              <span className={'item__color'} style={{
                                  backgroundColor: colors[colorName]
                              }}/>
                          </li>);
                    })}
                </ul>
            </div>
          )
          : null;
    }

    render () {
        const {rgbColor} = this.state;
        const rgbColorStyle = {
            backgroundColor: `rgb(${rgbColor.red},${rgbColor.green},${rgbColor.blue})`
        };
        return (
          <div className={'container'}>
              <ul className={'color-picker__list'}>
                  <li className={'list__item'}>
                      <input type={'text'} disabled={true} defaultValue={this.defaultValue}
                             value={this.props.value}/>
                  </li>
                  <li className={'list__item'}>
                      <div className={'colors-container'}>
                          <div className={'picked-color'} style={rgbColorStyle}
                               onClick={this.toggleDropdown} data-dropdown-name={'toggleSliders'}/>
                      </div>
                      {this.getRgbList()}
                  </li>
                  <li className={'list__item'}>
                      <div className={'colors-container'}>
                          <div className={'colors'} onClick={this.toggleDropdown} data-dropdown-name={'toggleColors'}>
                              <span>▼</span>
                          </div>
                      </div>
                      {this.getColorsList()}
                  </li>
              </ul>
          </div>
        );
    }

}
