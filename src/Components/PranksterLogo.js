import React, { Component } from 'react';

class PranksterLogo extends Component {
  updateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      maxMove: 500,
      transitionDuration: '.5s'
    });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener("resize", () => { this.updateDimensions() });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => { this.updateDimensions() });
  }

  onMouseEnter(e) {
    const maxX = this.state.width - 50;
    const maxY = this.state.height - 50;

    const cleft = this.getRandomInt(0, this.state.maxMove);
    const ctop = this.getRandomInt(0, this.state.maxMove);
    const ctrans = 'translate3d(' + cleft + 'px, ' + ctop + 'px, 0)';

    this.setState({
      css: {
        transform: ctrans,
        transitionDuration: this.state.transitionDuration
      }
    });

    var xPos = e.nativeEvent.offsetX - e.nativeEvent.scrollX + e.nativeEvent.clientX;
    console.log(e.nativeEvent.offsetX);
    console.log(e.nativeEvent);
    console.log(e.nativeEvent.clientX);
  }

  render() {
    const css = {
      animationDelay: this.props.delay + 's'
    }
    return (
      <img 
        src={this.props.logo} 
        className="App-logo" 
        alt={this.props.alt} 
        style={this.state.css && this.state.css}
        onMouseEnter={(e) => { this.onMouseEnter(e) }}
      />
    );
  }
}

export default PranksterLogo;
