// COMPONENTS
import React, { Component } from 'react';

// FUNCTIONS
import axios from 'axios';

export default class OtherPhoto extends Component {
  state = {
    filename: ''
  }

  componentDidMount() {
    // console.log('IMG ID: ', this.props.id);
    this.findImage();
    console.log(this.props.id);
  };

  // fix later to attach userid to image incoming from props??
  findImage() {
    const userid = this.props.id;

    axios.get(`/api/${userid}/images`)
      .then(response => {
        const filename = response.data.filename;
        this.setState({ filename });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <img src=
        {
          this.state.filename ?
            `/images/${this.state.filename}`
            : 'https://cdn2.iconfinder.com/data/icons/ui-1/60/05-512.png'
        }
        style={{ minHeight: '150px', minWidth: '150px', padding: '15px' }}
        alt="profile"
      />
    )
  }
}