import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import { BobApp } from '../src/BobApp.js';
import '../bob-app.js';

storiesOf('bob-app', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(BobApp))
  .add(
    'Alternative Title',
    () => html`
      <bob-app .title=${'Something else'}></bob-app>
    `,
  );
