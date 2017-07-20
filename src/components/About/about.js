import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';

class About extends Component {
  render() {
    return (<Card>
              <CardHeader
                          title="Michael Lee"
                          subtitle="Author of this app"
                          avatar="/favicon.ico" />
              <CardTitle
                         title="Revisioner"
                         subtitle="Let LEARNING fun AGAIN" />
              <CardText>
                <div>
                  The aim of this app is to provide interactive and interesting elements into learning, such that students can study the trash-like DSE in a bit more interesting environment.
                </div>
                <Divider />
                <div>
                  Still in alpha stage.
                </div>
              </CardText>
              <CardActions>
                <FlatButton
                            label="Github"
                            href="https://github.com/michaellee8/revisioner" />
              </CardActions>
            </Card>)
  }
}

export default About;