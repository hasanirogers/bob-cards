import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import { PageContributors } from '../src/PageContributors.js';
import '../page-contributors.js';

storiesOf('page-submit', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(PageContributors))
  .add(
    'Alternative Title',
    () => html`
      <page-submit .title=${'Submit a black owned business for us to review.'}></page-submit>
    `,
  );
