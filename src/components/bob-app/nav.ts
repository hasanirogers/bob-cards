import { html } from 'lit';
import { switchRoute } from '../../shared/utilities';

export default html`
  <button @click=${() => switchRoute('home', 'Businesses | BobCards')}>Home</button>
  <button @click=${() => switchRoute('mine', 'My Businesses | BobCards')}>My Business</button>
  <button @click=${() => switchRoute('add', 'Add Business | BobCards')}>Add Business</button>
  <button @click=${() => switchRoute('members', 'Members | BobCards')}>Members</button>
`;
