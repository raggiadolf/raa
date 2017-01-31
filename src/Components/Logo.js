import React, { Component } from 'react';

class Logo extends Component {
  render() {
    return (
      <a 
        href={this.props.url}
        target={!this.props.url.startsWith("mailto") ? "_blank" : "_self"}
      >
        <img 
          src={this.props.logo} 
          className="App-logo" 
          alt={this.props.alt} 
        />
      </a>
    );
  }
}

export default Logo;
