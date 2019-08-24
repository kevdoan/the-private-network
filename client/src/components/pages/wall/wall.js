// COMPONENTS
import React, { Component } from 'react';
import Card from '../../card.js';
import ProfileInfo from '../../profileinfo';
import MakePost from '../../makepost';
import PostDisplay from '../../postdisplay';

// FUNCTIONS
import ax from 'axios';
import CheckError from '../../../utils/checkerror';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: undefined,
      posts: undefined,
      errorAlert: undefined
    };
  }

  componentDidMount() {
    this.GetData();
  }

  GetData = async () => {
    try {
      const userData = await ax.get(`/api/communities/${this.props.CommunityId}/users/${this.props.UserId}/wall`);

      this.setState({
        userData: userData,
        posts: userData.data.wallPosts
      });
    }
    catch (error) {
      CheckError(error);
    }
  }

  handleSubmit = async event => {
    event.preventDefault();
    const form = event.target;

    const input = form.getElementsByTagName('textarea')[0];
    const post = {
      message: input.value
    };

    const submit = form.getElementsByTagName('button')[0];

    submit.style.visibility = 'hidden';
    await this.postToDB(post);
    submit.style.visibility = 'visible';
  }

  postToDB = async data => {
    this.setState({ errorAlert: undefined });

    try {
      const res = await ax.post(`/api/posts?CommunityId=` + this.props.CommunityId + `&UserId=` + this.props.UserId, data);

      this.setState({ posts: [res.data, ...this.state.posts] });
    }
    catch (error) {
      console.log(error.response);
      this.setState({ errorAlert: error.response.data });
    }
  }

  vote = async event => {
    event.preventDefault();
    const postInfo = event.target.dataset.id ?
      event.target
      : event.target.parentNode;

    try {
      const res = await ax.put(`/api/posts/${postInfo.dataset.id}/${postInfo.dataset.vote}`);

      this.state.posts.forEach((post, id) => {
        if (post.id === res.data.id) {
          const newPostsScore = this.state.posts;
          newPostsScore[id].score = res.data.score;

          this.setState({
            posts: newPostsScore
          });
        }
      });
    }
    catch (error) {
      console.log(error.response);
      this.setState({ errorAlert: error.response.data });
    }
  }

  deletePost = async event => {
    event.preventDefault();
    const postInfo = event.target.dataset.id ?
      event.target
      : event.target.parentNode;

    try {
      const res = await ax.delete(`/api/posts/${postInfo.dataset.id}`);

      this.state.posts.forEach((post, id) => {
        if (post.id === res.data.id) {
          const newRemovedPosts = this.state.posts;
          newRemovedPosts.splice(id, 1);

          console.log(newRemovedPosts);

          this.setState({
            posts: newRemovedPosts
          });
        }
      });
    }
    catch (error) {
      console.log(error.response);
      this.setState({ errorAlert: error.response.data });
    }
  }

  render() {
    return (
      <div>
        <Card className="text-dark text-left col-12 card" style={{ border: 'none' }}>
          {
            this.state.userData ?
              <ProfileInfo user={this.state.userData.data} />
              : ''
          }
          <MakePost handleSubmit={this.handleSubmit} errorAlert={this.state.errorAlert} postTo={'Wall'} />
          {
            this.state.posts ?
              <PostDisplay {...this.props} posts={this.state.posts} cantPost={true} vote={this.vote} deletePost={this.deletePost} />
              : ''
          }
        </Card>
      </div>
    )
  }
}
