import { mount } from '@vue/test-utils';
import App from '@/App.vue';

describe('App.vue', () => {
  it('renders the app', () => {
    const wrapper = mount(App);
    expect(wrapper.find('#app').exists()).toBe(true);
  });
});