import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import styles from './styles.ts';
import userStore, { IUserStore } from '../../store/user.ts';
import sharedStyles from '../../shared/styles';

import * as FilePond from 'filepond';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondStyles from 'filepond/dist/filepond.min.css';
import FilePondImagePreviewStyles from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('bob-profile')
export default class BobProfile extends LitElement {
  static styles = [styles, sharedStyles, FilePondStyles, FilePondImagePreviewStyles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  profile: any = {};

  @state()
  filePond: any;

  @state()
  showUploadProfileImage: boolean = false;

  @query('form[action*=user]')
  userForm!: HTMLFormElement;

  @query('input[name=filepond]')
  profileInput!: HTMLInputElement;

  firstUpdated() {
    this.getProfile();
  }

  updated(changedProperties: any) {
    if (changedProperties.has('showUploadProfileImage') && this.showUploadProfileImage) {
      this.initFilePond();
    }
  }

  render() {
    return html`
      <kemet-card>
        <form method="post" action="wp-json/wp/v2/users" @submit=${(event: SubmitEvent) => this.updateProfile(event)}>
          <fieldset>
            <legend>Your Profile</legend>
            <div class="profile-image">${this.makeProfileImage()}</div>
            <p>
              <kemet-field label="First Name">
                <kemet-input slot="input" name="first_name" rounded value=${this.profile.first_name}></kemet-input>
              </kemet-field>
            </p>
            <br />
            <kemet-button>
              Update Profile <kemet-icon slot="right" icon="chevron-right"></kemet-icon>
            </kemet-button>
          </fieldset>
        </form>
      </kemet-card>
    `;
  }

  initFilePond() {
    FilePond.registerPlugin(
      FilePondPluginFileEncode,
      FilePondPluginFileValidateType,
      FilePondPluginImageExifOrientation,
      FilePondPluginImagePreview,
      FilePondPluginImageCrop,
      FilePondPluginImageResize,
      FilePondPluginImageTransform
    );

    this.filePond = FilePond.create(this.profileInput, {
      labelIdle: `Drag & Drop your picture or <span class="filepond--label-action">Browse</span>`,
      imagePreviewHeight: 170,
      imageCropAspectRatio: '1:1',
      imageResizeTargetWidth: 200,
      imageResizeTargetHeight: 200,
      stylePanelLayout: 'compact circle',
      styleLoadIndicatorPosition: 'center bottom',
      styleButtonRemoveItemPosition: 'center bottom'
    });
  }

  makeProfileImage() {
    const profileImage = this.profile?.meta?.bob_profile_image['0'];

    if (profileImage && !this.showUploadProfileImage) {
      return html`
        <button class="image" @click=${() => this.showUploadProfileImage = true}>
          <img class="profile" src="${profileImage}" alt="Profile Image" />
        </button>
        <button class="delete" aria-label="delete" @click=${(event: SubmitEvent) => this.deleteProfileImage(event)}>
          <kemet-icon icon="trash" size="32"></kemet-icon>
        </button>
      `;
    }

    this.initFilePond();

    return html`
      ${profileImage ? html`<button class="close" @click=${() => this.showUploadProfileImage = false} aria-label="delete"><kemet-icon icon="x-lg" size="32"></kemet-icon></button>` : ''}
      <input type="file" class="filepond" name="filepond" accept="image/png, image/jpeg, image/gif"/>
    `;
  }

  async getProfile() {
    if (!this.userState.user.user_id) {
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.token}`
      }
    };

    const userProfile = await fetch(`${API_URL}/wp-json/wp/v2/users/${this.userState.user.user_id.toString()}?context=edit`, options)
      .then((response) => response.json());

    this.profile = userProfile;

    console.log(this.profile);
  }

  async updateProfile(event: SubmitEvent) {
    event.preventDefault();

    if (!this.userState.user.user_id) {
      return;
    }

    // Profile Information
    // -------------------
    const formData = new FormData(this.userForm) as any;

    const options = {
      method: this.userForm.getAttribute('method')?.toUpperCase() || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.token}`
      },
      body: JSON.stringify(Object.fromEntries(formData))
    };

    const endpoint = this.userForm.getAttribute('action');

    await fetch(`${API_URL}/${endpoint}/${this.userState.user.user_id.toString()}?context=edit`, options)
      .then((response) => response.json())
      .catch((error) => console.error(error));


    // Upload Media
    // ---------------

    const hasFile = !!this.filePond.getFile()?.file;
    const uploadFormData = new FormData();

    if (hasFile) {
      uploadFormData.append('async-upload', this.filePond.getFile().file);
    }

    const uploadOptions = {
      method: 'POST',
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${this.userState.user.token}`
      },
      body: uploadFormData
    }

    let mediaUpload;

    if (hasFile) {
      mediaUpload = await fetch(`${API_URL}/wp-json/bob/v1/media-upload`, uploadOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
    }


    // Profile Image
    // -------------

    const profileImageOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.token}`
      },
      body: JSON.stringify({
        image_src: mediaUpload ? mediaUpload.data.url : '',
        image_id: mediaUpload ? mediaUpload.data.id : '',
        user_id: this.userState.user.user_id
      })
    };

    await fetch(`${API_URL}/wp-json/bob/v1/profile-image`, profileImageOptions)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  async deleteProfileImage(event: SubmitEvent) {
    event.preventDefault();
    this.showUploadProfileImage = true;
    this.profile.meta.bob_profile_image[0] = '';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.token}`
      },
      body: JSON.stringify({
        image_id: this.profile.meta.bob_profile_image_id[0],
        user_id: this.userState.user.user_id
      })
    }

    await fetch(`${API_URL}/wp-json/bob/v1/media-delete`, options);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-profile': BobProfile
  }
}
