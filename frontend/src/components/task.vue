<template>
  <button class="LogoutBtn" @click.prevent="logout">Logout</button>
  <h1 style="position: relative; right: 150px;">To-Do List Project</h1>

  <div>
    <form @submit.prevent="addTask">
      <div class="mb-3" style="display: flex; align-items: center; padding-left: 40px;">
        <input type="text" class="form-control" style="width: 300px; margin-right: 5px;" placeholder="Entrer une tâche" required v-model="taskName">
        <input type="date" required v-model="dateEnd" style="margin-right: 3px;">
        <input v-if="saveMode" type="submit" value="Save">
        <input v-else type="submit" value="Add">
      </div>
    </form>
  </div>

  <div>
    <table class="table" style="width: 600px;">
      <thead>
        <tr>
          <th scope="col">Done</th>
          <th scope="col">Task</th>
          <th scope="col">Date</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="index">
          <th scope="row">
            <input type="checkbox" v-model="task.isChecked">
          </th>
          <td :class="{ 'completed': task.isChecked }">{{ task.taskName }}</td>
          <td :class="{ 'completed': task.isChecked }">{{ task.dateEnd }}</td>
          <td>
            <button class="delete" @click.prevent="deleteTask(index)">Delete</button>
            <button class="modify" @click.prevent="modifyTask(index)">Modify</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "TaskstoDo",
  data() {
    return {
      taskName: '',
      dateEnd: '',
      saveMode: false,
      editIndex: null,
      tasks: [],
    };
  },
  methods: {
    async fetchTasks() {
  try {
    const token = localStorage.getItem('token');
    if(!token) {
      this.$router.push('/login');
      return;
    }
    const response = await axios.get('http://localhost:3000/api/tasks/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.tasks = response.data;
  } catch (error) {
    alert('Erreur lors du chargement des tâches' + error.message);
    console.error(error);
  }
}
,
    async addTask() {
  if (this.taskName.trim() === '' || this.dateEnd.trim() === '') return;

  const task = { taskName: this.taskName, dateEnd: this.dateEnd, isChecked: false };
  const token = localStorage.getItem('token');

  try {
    if (this.saveMode && this.editIndex !== null) {
      // Mode modification
      const taskId = this.tasks[this.editIndex]._id;
      await axios.put(`http://localhost:3000/api/tasks/${taskId}`, task, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.tasks[this.editIndex] = { ...task, _id: taskId }; 
    } else {
      // Ajout d'une nouvelle tâche
      const response = await axios.post('http://localhost:3000/api/tasks/', task, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.tasks.push(response.data);
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche", error);
  }

  // Réinitialisation des champs
  this.taskName = '';
  this.dateEnd = '';
  this.saveMode = false;
  this.editIndex = null;
},

async deleteTask(index) {
  const taskId = this.tasks[index]._id;
  const token = localStorage.getItem('token');

  try {
    await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.tasks.splice(index, 1);
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche", error);
  }
},

modifyTask(index) {
  this.taskName = this.tasks[index].taskName;
  this.dateEnd = this.tasks[index].dateEnd;
  this.saveMode = true;
  this.editIndex = index;
}
,
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  },
  mounted() {
    this.fetchTasks();
  }
};
</script>

<style scoped>
/* From Uiverse.io by mrhyddenn */
button {
  position: relative;
  padding: 10px 20px;
  border-radius: 7px;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 2px;
  background: transparent;
  color: #000000;
  overflow: hidden;
  box-shadow: 0 0 0 0 transparent;
  transition: all 0.2s ease-in;
}

.completed {
  text-decoration: line-through;
  color: gray;
}

.delete {
  border: 1px solid rgb(228, 28, 28);
  margin-right: 6px;
}

.delete:hover {
  background: rgb(200, 33, 33);
  box-shadow: 0 0 30px 5px rgba(231, 59, 12, 0.815);
}

.LogoutBtn {
  border: 1px solid rgb(228, 28, 28);
  color: white;
  margin-right: 20px;
  position: relative;
  top: 10px;
  left: 30px;
}

.LogoutBtn:hover {
  background: rgb(200, 33, 33);
  box-shadow: 0 0 30px 5px rgba(231, 59, 12, 0.815);
}

.modify {
  border: 1px solid rgb(51, 128, 228);
}

.modify:hover {
  background: rgb(51, 128, 228);
  box-shadow: 0 0 30px 5px rgba(51, 128, 228, 0.815);
}

button:hover {
  transition: all 0.2s ease-out;
}

button:active {
  box-shadow: 0 0 0 0 transparent;
}
</style>