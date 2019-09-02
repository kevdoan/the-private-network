// COMPONENTS
import React from 'react';
import { Paper, FormGroup, RadioGroup, List, Button } from '@material-ui/core';
import CommunityRadio from './communityradio';

// FUNCTIONS
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  communityList: {
    padding: '24px'
  },

  fixedSizeList: {
    maxHeight: '12vh',
    overflow: 'scroll'
  },

  button: {
    display: 'inline-block',
    verticalAlign: 'center',
    margin: theme.spacing(1.5)
  }
}));

export default function SelectFromExisting(props) {
  const { communities, handleFormChange, handleChosenCommunitySubmit } = props;

  const classes = useStyles();

  return (
    <Paper className={classes.communityList}>
      <h3>Choose A Community</h3>
      <form onSubmit={handleChosenCommunitySubmit}>
        <FormGroup>
          <List className={classes.fixedSizeList + 'list-unstyled text-left'} id="community-list">
            {
              communities.map(community => (
                <RadioGroup key={community.id}>
                  <CommunityRadio
                    {...props}
                    thisComm={community}
                  />
                </RadioGroup>
              ))
            }
          </List>
        </FormGroup>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type="submit"
        >
          Submit
        </Button>
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          onClick={handleFormChange}
        >
          Or Create Your Own!
        </Button>
      </form>
    </Paper>
  );
}