import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  console.log("TabPanel", children, value, index);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabpanel: {
    width: 500,
  },
}));

export default function VerticalTabs({ tabData, children }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // console.log("tabData", tabData);

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {tabData.map((data, idx) => {
          console.log("data", data.Trainer);
          return (
            <Tab
              label={data.Trainer.FirstName + " " + data.Trainer.LastName}
              {...a11yProps(idx)}
              key={"TabLabel" + idx}
            />
          );
        })}
      </Tabs>
      {tabData.map((data, idx) => {
        return (
          <TabPanel
            value={value}
            index={idx}
            key={"TabPanel" + idx}
            className={classes.tabpanel}
          >
            {children}
          </TabPanel>
        );
      })}
    </div>
  );
}

VerticalTabs.propTypes = {
  children: PropTypes.node,
  tabData: PropTypes.any.isRequired,
};
