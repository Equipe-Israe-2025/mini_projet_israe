import { mount } from '@vue/test-utils';
import Task from '@/components/task.vue';
import router from '@/router';

describe('Task.vue', () => {
  it('renders the task list', () => {
    const wrapper = mount(Task);
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="date"]').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('adds a new task', async () => {
    const wrapper = mount(Task);
    await wrapper.find('input[type="text"]').setValue('New Task');
    await wrapper.find('input[type="date"]').setValue('2023-12-31');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.vm.tasks).toContainEqual({ taskName: 'New Task', dateEnd: '2023-12-31' });
  });

  it('deletes a task', async () => {
    const wrapper = mount(Task);
    wrapper.vm.tasks = [{ taskName: 'Task 1', dateEnd: '2023-12-31' }];
    await wrapper.vm.$nextTick();
    await wrapper.find('.delete').trigger('click');
    expect(wrapper.vm.tasks.length).toBe(0);
  });

  it('modifies a task', async () => {
    const wrapper = mount(Task);
    wrapper.vm.tasks = [{ taskName: 'Task 1', dateEnd: '2023-12-31' }];
    await wrapper.vm.$nextTick();
    await wrapper.find('.modify').trigger('click');
    await wrapper.find('input[type="text"]').setValue('Modified Task');
    await wrapper.find('input[type="date"]').setValue('2024-01-01');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.vm.tasks[0].taskName).toBe('Modified Task');
    expect(wrapper.vm.tasks[0].dateEnd).toBe('2024-01-01');
  });

  it('logs out', async () => {
    const wrapper = mount(Task, {
      global: {
        plugins: [router]
      }
    });
    await wrapper.find('.LogoutBtn').trigger('click');
    expect(localStorage.getItem('token')).toBeNull();
    expect(wrapper.vm.$route.path).toBe('/login');
  });
});
