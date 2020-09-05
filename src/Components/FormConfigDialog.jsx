import React from "react";
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}))

function TabPanel(props) {
  const { value, index, bossConfig, setName, setImage, ...other } = props;
  const classes = useStyles();
  const [configs, setConfigs] = React.useState(bossConfig);

  const handleName = (event) => {
    setConfigs({
      ...configs,
      name: event.target.value,
    });
    setName(index, event.target.value);
  }

  const handleImage = (event) => {
    setConfigs({
      ...configs,
      image: event.target.value,
    });
    setImage(index, event.target.value);
  }

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <TextField
            fullWidth
            label='標題'
            defaultValue={bossConfig.name}
            onChange={handleName}
          >
          </TextField>
          <TextField
            fullWidth
            label='Boss圖像'
            onChange={handleImage}
            defaultValue={bossConfig.image}
            InputProps={{
              startAdornment: (
                <Avatar
                  className={classes.avatar}
                  src={configs.image}
                  alt={configs.name}
                />
              )
            }}
          >
          </TextField>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  bossConfig: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
  setImage: PropTypes.func.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const FormConfigDialog = props => {
  const { open, onClose } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  var oldConfigs = [
    { boss: 1, name: '一王', image: '' },
    { boss: 2, name: '二王', image: '' },
    { boss: 3, name: '三王', image: '' },
    { boss: 4, name: '四王', image: '' },
    { boss: 5, name: '五王', image: '' },
  ];
  const [value, setValue] = React.useState(0);
  const [configs, setConfigs] = React.useState(oldConfigs);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const setName = (index, name) => {
    setConfigs(preData => {
      preData[index] = {
        ...preData[index], name
      };
      return preData;
    })
  }

  const setImage = (index, image) => {
    setConfigs(preData => {
      preData[index] = {
        ...preData[index], image
      };
      return preData;
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen}>
      <DialogTitle>報名表設定</DialogTitle>
      <DialogContent>
        <DialogContentText>
          自訂自己的戰隊報名表，打造最適配的戰隊環境。
        </DialogContentText>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            scrollButtons="auto"
            variant="scrollable"
          >
            <Tab label="一" {...a11yProps(0)} />
            <Tab label="二" {...a11yProps(1)} />
            <Tab label="三" {...a11yProps(2)} />
            <Tab label="四" {...a11yProps(3)} />
            <Tab label="五" {...a11yProps(4)} />
          </Tabs>
        </AppBar>
        {
          [0, 1, 2, 3, 4].map(num => (
            <TabPanel
              key={num}
              value={value}
              index={num}
              bossConfig={configs[num]}
              setName={setName}
              setImage={setImage}
            />
          ))
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          取消
        </Button>
        <Button onClick={onSave} color="primary">
          存檔
        </Button>
      </DialogActions>
    </Dialog>
  );

  function handleClose() {
    setConfigs(oldConfigs);
    onClose() ;
  }

  function onSave() {
    console.log(configs);
    // Axios
    //   .post(`/api/forms/${form_id}/modify`, configs)
    //   .then(res => res.data)
    //   .then(data => {
    //     oldConfigs = data;
    //   })
    onClose();
  }
}

FormConfigDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default FormConfigDialog;
