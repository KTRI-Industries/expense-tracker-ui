import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/login.ftl',
  component: KcPageStory,
  decorators,
  globals: {
    pageId: 'login.ftl',
  },
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithInvalidCredential: Story = {
  globals: {
    kcContext: {
      login: {
        username: 'johndoe',
      },
      messagesPerField: {
        existsError: (fieldName: string, ...otherFieldNames: string[]) => {
          const fieldNames = [fieldName, ...otherFieldNames];
          return fieldNames.includes('username') || fieldNames.includes('password');
        },
        getFirstError: (fieldName: string, ...otherFieldNames: string[]) => {
          const fieldNames = [fieldName, ...otherFieldNames];
          return fieldNames.includes('username') || fieldNames.includes('password')
            ? 'Invalid username or password.'
            : '';
        },
      },
    },
  },
};

export const WithSocialProviders: Story = {
  globals: {
    kcContext: {
      social: {
        displayInfo: true,
        providers: [
          {
            loginUrl: 'google',
            alias: 'google',
            providerId: 'google',
            displayName: 'Google',
            iconClasses: 'fa fa-google',
          },
          {
            loginUrl: 'microsoft',
            alias: 'microsoft',
            providerId: 'microsoft',
            displayName: 'Microsoft',
            iconClasses: 'fa fa-windows',
          },
        ],
      },
    },
  },
};

export const WithImmutablePresetUsername: Story = {
  globals: {
    kcContext: {
      auth: {
        attemptedUsername: 'max.mustermann@mail.com',
        showUsername: true,
      },
      usernameHidden: true,
      message: {
        type: 'info',
        summary: 'Please re-authenticate to continue',
      },
    },
  },
};
