// COMPONENTS
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Modal from '../../modal';

// FUNCTIONS
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  image: {
    // background: 'linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url(https://source.unsplash.com/random)',
    backgroundImage: 'url(https://picsum.photos/id/177/2515/1830)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  logo: {
    postion: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    width: '100%',
    alignItems: 'center',
    background: 'rgba(124,124,124,0.5)',
    background: 'linear-gradient(180deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)',
    textAlign: 'center',
    padding: '24px 24px 72px',
  },
  name: {
    fontSize: '30px',
    color: '#1d1d1d'
  },
  slogan: {
    fontSize: '16px',
    color: '#DBDADA',
    color: '#3d3d3d'
  },

  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },

  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },

  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function Home({ handleSubmit, errorAlert }) {
  const classes = useStyles();

  console.log(handleSubmit);

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} >
        <Grid item xs={false} id="hide" className={classes.logo}>
          <img src="https://i.ibb.co/6WVS2GB/tpn2.png" />
          <span className={classes.name} >The Private Network</span>
          <p className={classes.slogan} >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam eum cupiditate quaerat laudantium ullam aut rem deleniti obcaecati quas voluptates dolores iure modi, aliquam, illo quae. Hic dicta corrupti eos.</p>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          {/* <Avatar className={classes.avatar}> */}
            {/* <LockOutlinedIcon /> */}
            <img src="https://i.ibb.co/6WVS2GB/tpn2.png" xs={false}/>
          {/* </Avatar> */}
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            {
              errorAlert ?
                <Modal error={errorAlert} />
                : ''
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

