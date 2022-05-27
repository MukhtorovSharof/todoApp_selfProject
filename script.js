window.addEventListener("DOMContentLoaded", () => {
  "use strict";

  let tasks = [];
  let doneTasksStorage = [];

  if (JSON.parse(localStorage.getItem("tasks"))) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  } else {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  if (JSON.parse(localStorage.getItem("doneTasksStorage"))) {
    doneTasksStorage = JSON.parse(localStorage.getItem("doneTasksStorage"));
  } else {
    localStorage.setItem("doneTasksStorage", JSON.stringify(doneTasksStorage));
    doneTasksStorage = JSON.parse(localStorage.getItem("doneTasksStorage"));
  }

  let selected = 0;

  tasks = JSON.parse(localStorage.getItem("tasks"));
  doneTasksStorage = JSON.parse(localStorage.getItem("doneTasksStorage"));

  const notDoneTasks = document.querySelector("#not_done_tasks"),
    doneTasks = document.querySelector("#done_tasks"),
    addTaskInput = document.querySelector("#addTaskInput"),
    addTaskBtn = document.querySelector("#addTaskBtn"),
    divProgress = document.querySelector(".progress");

  getNotDoneTasks();
  getDoneTasks();
  updateProgressHandler();

  function updateProgressHandler() {
    let numberOfTasks = tasks.length + doneTasksStorage.length;
    let tasksCompleted = doneTasksStorage.length;
    let completed = (100 * tasksCompleted) / numberOfTasks;
    let html = "";
    html = `
      <div
        class="progress-bar bg-success"
        role="progressbar"
        aria-valuenow="40"
        aria-valuemin="0"
        aria-valuemax="100"
        style="width: ${completed}%"
      ></div>
  `;
    divProgress.innerHTML = html;
  }

  addTaskBtn.addEventListener("click", () => {
    let valInput = addTaskInput.value.trim();
    if (!selected) {
      if (valInput !== "") {
        let newTask = {};
        newTask.taskId = tasks.length + 1;
        newTask.taskName = valInput;
        newTask.status = false;
        tasks.push(newTask);
        getNotDoneTasks();
        updateProgressHandler();
        addTaskInput.value = "";
        localStorage.setItem("tasks", JSON.stringify(tasks));
      } else {
        alert("Please enter task!");
      }
    } else {
      tasks = tasks.map((task) => {
        if (task.taskId == selected) {
          return { ...task, taskName: valInput };
        } else {
          return task;
        }
      });
      addTaskBtn.innerHTML = "Add Task";
      addTaskInput.value = "";
      getNotDoneTasks();
    }
  });

  function getNotDoneTasks() {
    notDoneTasks.innerHTML = "";
    tasks.map((item, i) => {
      let doTaskDiv = document.createElement("div");
      doTaskDiv.className = "input-group mb-3";

      let doTaskInput = document.createElement("input");
      doTaskInput.className = "form-control";
      doTaskInput.readOnly = false;
      doTaskInput.type = "text";
      doTaskInput.value = `${i + 1}. ${item.taskName}`;

      doTaskInput.addEventListener("click", () => {
        let editTask = tasks.find((task) => task.taskId == item.taskId);
        addTaskInput.value = editTask.taskName;
        addTaskBtn.innerHTML = "Save";
        selected = item.taskId;
      });

      let doTaskBtn = document.createElement("button");
      doTaskBtn.className = "btn btn-success";
      doTaskBtn.type = "button";
      doTaskBtn.innerHTML = "Done";
      doTaskBtn.id = item.taskId;

      doTaskBtn.addEventListener("click", () => {
        tasks = JSON.parse(localStorage.getItem("tasks"));
        let doneTask = tasks.find((task) => task.taskId == item.taskId);
        doneTask.status = true;
        doneTasksStorage.push(doneTask);
        tasks = tasks.filter((task) => task.taskId != doneTask.taskId);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem(
          "doneTasksStorage",
          JSON.stringify(doneTasksStorage)
        );
        getDoneTasks();
        getNotDoneTasks();
        updateProgressHandler();
      });

      doTaskDiv.appendChild(doTaskInput);
      doTaskDiv.appendChild(doTaskBtn);

      notDoneTasks.appendChild(doTaskDiv);
    });
  }

  function getDoneTasks() {
    doneTasks.innerHTML = "";
    doneTasksStorage.map((item, i) => {
      let doTaskDiv = document.createElement("div");
      doTaskDiv.className = "input-group mb-3";

      let doTaskInput = document.createElement("input");
      doTaskInput.className = "form-control";
      doTaskInput.readOnly = true;
      doTaskInput.type = "text";
      doTaskInput.value = `${i + 1}. ${item.taskName}`;

      let doTaskBtnDelete = document.createElement("button");
      doTaskBtnDelete.className = "btn btn-danger";
      doTaskBtnDelete.type = "button";
      doTaskBtnDelete.innerHTML = "Delete";
      doTaskBtnDelete.id = item.taskId;

      doTaskBtnDelete.addEventListener("click", () => {
        doneTasksStorage = doneTasksStorage.filter(
          (task) => task.taskId != item.taskId
        );
        localStorage.setItem(
          "doneTasksStorage",
          JSON.stringify(doneTasksStorage)
        );
        getDoneTasks();
        updateProgressHandler();
      });

      let doTaskBtnReturn = document.createElement("button");
      doTaskBtnReturn.className = "btn btn-warning";
      doTaskBtnReturn.type = "button";
      doTaskBtnReturn.innerHTML = "Return";
      doTaskBtnReturn.id = item.taskId;

      doTaskBtnReturn.addEventListener("click", () => {
        let returnTask = doneTasksStorage.find(
          (task) => task.taskId == item.taskId
        );
        returnTask.status = false;
        doneTasksStorage = doneTasksStorage.filter(
          (doneTaskStorage) => doneTaskStorage.taskId !== returnTask.taskId
        );
        localStorage.setItem(
          "doneTasksStorage",
          JSON.stringify(doneTasksStorage)
        );
        tasks.push(returnTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        getDoneTasks();
        getNotDoneTasks();
        updateProgressHandler();
      });

      doTaskDiv.appendChild(doTaskInput);
      doTaskDiv.appendChild(doTaskBtnReturn);
      doTaskDiv.appendChild(doTaskBtnDelete);

      doneTasks.appendChild(doTaskDiv);
    });
  }
});
