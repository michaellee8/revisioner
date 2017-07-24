import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardTitle, CardText } from 'material-ui/Card';

class About extends Component {
  render() {
    return (<Card>
              <CardHeader
                title="Michael Lee"
                subtitle="Author of this app"
                avatar="%PUBLIC_URL%/favicon.ico" />
              <CardTitle
                title="Revisioner"
                subtitle="Let LEARNING fun AGAIN" />
              <CardText>
                The aim of this app is to provide interactive and interesting elements into learning, such that students can study the trash-like DSE in a bit more interesting environment.
                Still in alpha stage.
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