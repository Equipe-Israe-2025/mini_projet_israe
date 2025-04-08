import { mount } from '@vue/test-utils';
import Login from '@/components/login.vue';
import router from '@/router';

describe('Login.vue', () => {
  it('renders the login form', () => {
    const wrapper = mount(Login);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('logs in with correct credentials', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    });
    await wrapper.find('input[type="text"]').setValue('admin');
    await wrapper.find('input[type="password"]').setValue('admin');
    await wrapper.find('form').trigger('submit.prevent');
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(wrapper.vm.$route.path).toBe('/todo');
  });

  it('shows error with incorrect credentials', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    });
    await wrapper.find('input[type="text"]').setValue('wrong');
    await wrapper.find('input[type="password"]').setValue('wrong');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.vm.error).toBe('Invalid username or password');
  });
});