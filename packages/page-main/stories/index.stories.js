import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import { PageMain } from '../src/PageMain.js';
import '../page-main.js';

storiesOf('page-main', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(PageMain))
  .add(
    'Alternative Title',
    () => html`
      <page-main .title=${'Something else'}></page-main>
    `,
  );
