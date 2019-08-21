import React, { Component } from 'react';
import axios from 'axios';

export default class Imageload extends Component {
  constructor() {
    super();
    this.state = {
      filename: '',
      userData: undefined
    };
  }

  componentDidMount() {
    this.GetData();
  };

  GetData = async () => {
    try {
      const userData = await axios.get(`/api/users/profile/`);
      await this.setState({ userData });
      console.log(this.state.userData.data.id);
      this.findImage();
    }
    catch (error) {
      console.log(error.response);
    }

  };

  //fix later to attach userid to image incoming from props??
  findImage() {
    const userid = this.state.userData.data.id;

    axios.get(`/api/${userid}/images`)
      .then(response => {
        //console.log(response.data[0].filename);
        let filename = response.data[0].filename;
        this.setState({ filename });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        {console.log(this.state.filename)}
        {/* <img src={require(`../public/user/images/${this.state.filename}`)} alt="" /> */}
        <img src=
          {
            this.state.filename
              ? `/images/${this.state.filename}`
              : 'http://place-hold.it/200'
          }
          alt="profile"
          style={{ height: '200px', width: '200px', padding: '20px' }}
        />
      </div>
    )
  }
}
