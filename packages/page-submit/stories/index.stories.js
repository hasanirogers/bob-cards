import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import { PageSubmit } from '../src/PageSubmit.js';
import '../page-submit.js';

storiesOf('page-submit', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(PageSubmit))
  .add(
    'Alternative Title',
    () => html`
      <page-submit .title=${'Submit a black owned business for us to review.'}></page-submit>
    `,
  );
