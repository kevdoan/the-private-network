// COMPONENTS
import React from "react";
import { Paper, Typography } from "@material-ui/core";

// FUNCTIONS
import { makeStyles } from '@material-ui/core/styles';

export default function Megatron(props) {
  const titles = {
    heading: {
      tag: 'h3',
      text: props.heading !== undefined ? props.heading : ''
    },

    subheading: {
      tag: 'subtitle2',
      text: props.subheading !== undefined ? props.subheading : ''
    },

    image: {
      src: props.image !== undefined ? props.image : '',
      position: props.imagePosition !== undefined ? 
        props.imagePosition : '0 0'
    }
  };

  const imgSrc = titles.image.src;
  const imgPos = titles.image.position;
  const megaHeight = props.megaHeight || '20vh';
  const megaMaxHeight = props.megaMaxHeight || '350px';

  const useStyles = makeStyles((theme) => ({
    megatron: {
      position: 'relative',
      padding: '24px',
      marginBottom: '24px',
      backgroundColor: "#3f51b5",
      backgroundImage: `url(${imgSrc})`,
      backgroundPosition: `${imgPos}`,
      backgroundBlendMode: 'lighten',
      backgroundSize: 'cover',
      height: `${megaHeight}`,
      maxHeight: `${megaMaxHeight}`,
      overflow: 'hidden'
    },

    title: {
      fontWeight: 'bold',
      zIndex: '2'
    },

    subtitle: {
      fontWeight: 'bold',
      zIndex: '2'
    }
  }));

  const classes = useStyles();

  return (
    <Paper className={classes.megatron} id='banner'>
      <Typography
        className={classes.title}
        variant="h3"
        gutterBottom
      >
        {titles.heading.text}
      </Typography>
      <Typography
        className={classes.subtitle}
        variant="subtitle1"
        gutterBottom
      >
        {titles.subheading.text}
      </Typography>
    </Paper>
  );
};
