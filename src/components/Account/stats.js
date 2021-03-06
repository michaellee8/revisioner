import React from "react";
import firebase from "firebase";
import MoreIcon from "material-ui/svg-icons/navigation/expand-more";
import { List, ListItem } from "material-ui/List";
import CorrectIcon from "material-ui/svg-icons/action/done";
import WrongIcon from "material-ui/svg-icons/content/clear";
import TextField from "material-ui/TextField";
import {
  Card,
  CardActions,
  CardTitle,
  CardMedia,
  CardText,
  CardHeader
} from "material-ui/Card";
import { request } from "graphql-request";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
const VisibilitySensor = require("react-visibility-sensor");
const RADIAN = Math.PI / 180;
export default class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stats: [] };
  }
  componentWillMount() {
    this.getStats();
  }
  getStats() {
    console.log("getting stats");
    request(
      window.serverUrl,
      `
      query getQuestionStats($includeAll: SequelizeJSON) {
        all: questionSumbits(include: $includeAll) {
          user {
            userName
          }
          questionAnswer {
            questionAnswerText
            questionAnswerIsCorrect
            question {
              questionTitle
              questionContent
              questionSet {
                questionSetTitle
                user {
                  userName
                }
              }
            }
          }
          questionSumbitTimestamp
        }
      }
      `,
      {
        includeAll: [
          {
            model: "User",
            as: "user",
            where: {
              userFirebaseAuthId: firebase.auth().currentUser.uid
            }
          }
        ]
      }
    )
      .then(data => this.setState({ stats: data.all.reverse() }))
      .catch(err => {
        console.error(err);
        window.alert("Internal error, please try again later");
      });
  }
  render() {
    return (
      <div>
        <List>
          <ListItem disable={true}>
            <Card>
              <CardTitle title="Summary" />
              <CardText>
                <PieChart width={300} height={300}>
                  <Pie
                    data={[
                      {
                        name: "Correct",
                        value: this.state.stats.reduce(
                          (s, v) =>
                            (v.questionAnswer.questionAnswerIsCorrect ? 1 : 0) +
                            s,
                          0
                        )
                      },
                      {
                        name: "Wrong",
                        value: this.state.stats.reduce(
                          (s, v) =>
                            (!v.questionAnswer.questionAnswerIsCorrect
                              ? 1
                              : 0) + s,
                          0
                        )
                      }
                    ]}
                    width={200}
                    height={200}
                    cx={150}
                    cy={150}
                    labelLine={false}
                    fill="#111188"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                      index
                    }) => {
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                          scaleToFit={true}
                          width={1000}
                        >
                          {[
                            {
                              name: "Correct",
                              value: this.state.stats.reduce(
                                (s, v) =>
                                  (v.questionAnswer.questionAnswerIsCorrect
                                    ? 1
                                    : 0) + s,
                                0
                              )
                            },
                            {
                              name: "Wrong",
                              value: this.state.stats.reduce(
                                (s, v) =>
                                  (!v.questionAnswer.questionAnswerIsCorrect
                                    ? 1
                                    : 0) + s,
                                0
                              )
                            }
                          ][index].name +
                            " " +
                            [
                              {
                                name: "Correct",
                                value: this.state.stats.reduce(
                                  (s, v) =>
                                    (v.questionAnswer.questionAnswerIsCorrect
                                      ? 1
                                      : 0) + s,
                                  0
                                )
                              },
                              {
                                name: "Wrong",
                                value: this.state.stats.reduce(
                                  (s, v) =>
                                    (!v.questionAnswer.questionAnswerIsCorrect
                                      ? 1
                                      : 0) + s,
                                  0
                                )
                              }
                            ][index].value}
                        </text>
                      );
                    }}
                  >
                    <Cell fill="#22D322" />
                    <Cell fill="#FF2222" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </CardText>
            </Card>
          </ListItem>

          {this.state.stats.map(v => (
            <ListItem disable={true}>
              <Card>
                <CardHeader
                  subtitle={
                    "@" + v.questionAnswer.question.questionSet.questionSetTitle
                  }
                  title={v.questionAnswer.question.questionSet.user.userName}
                />
                <CardTitle title={v.questionAnswer.question.questionTitle} />
                <CardText>
                  <TextField
                    multiLine={true}
                    disabled={true}
                    textareaStyle={{ color: "black" }}
                    fullWidth={true}
                    underlineShow={false}
                    value={v.questionAnswer.question.questionContent}
                  />
                  <List>
                    <ListItem
                      disabled={true}
                      primaryText={
                        <div>
                          {v.questionAnswer.questionAnswerIsCorrect ? (
                            <CorrectIcon />
                          ) : (
                            <WrongIcon />
                          )}
                          <span>{v.questionAnswer.questionAnswerText}</span>
                        </div>
                      }
                    />
                  </List>
                </CardText>
              </Card>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}
