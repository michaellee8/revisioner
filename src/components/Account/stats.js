import React from "react";
import firebase from "firebase";
import MoreIcon from "material-ui/svg-icons/navigation/expand-more";
import { List, ListItem } from "material-ui/List";
import { Card, CardActions, CardTitle } from "material-ui/Card";
const VisibilitySensor = require("react-visibility-sensor");

export default class Stats extends React.Component {
  componentWillMount() {
    this.getStats();
  }
  render() {
    return (
      <div>
        <Card>
          <CardTitle />
        </Card>
        <List>
          <VisibilitySensor>
            <ListItem>
              <MoreIcon />
            </ListItem>
          </VisibilitySensor>
        </List>
      </div>
    );
  }
}
