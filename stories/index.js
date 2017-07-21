import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import OptionsList from '../src/components/Practice/options-list'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { Button, Welcome } from '@storybook/react/demo';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={ linkTo('Button') } />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={ action('clicked') }>
                            Hello Button
                          </Button>)
  .add('with some emoji', () => <Button onClick={ action('clicked') }>
                                  😀 😎 👍 💯
                                </Button>);

storiesOf('Options List', module).add('with standard options', () => (
  <MuiThemeProvider>
    <OptionsList
      options={ ["O#1", "O#2", "O#3", "O#4"] }
      onOptionClick={ (i) => {
                        alert("Option" + i.toString() + " selected");
                        action("Option" + i.toString() + " selected");
                      } } />
  </MuiThemeProvider>));