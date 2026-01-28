// Load todos from localStorage on page load
window.addEventListener('load', function() {
    loadTodos();
    updateStats();
});

// Allow Enter key to add todo
document.getElementById('todoInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
});

function addTodo() {
    var input = document.getElementById("todoInput");
    var list = document.getElementById("todoList");
    var taskValue = input.value.trim();

    if (taskValue === '') {
        alert("Please write something first!");
        return;
    }

    // Create todo object
    var todo = {
        id: Date.now(),
        text: taskValue,
        completed: false
    };

    // Create list item
    var li = createTodoElement(todo);
    list.appendChild(li);

    // Save to localStorage
    saveTodos();
    updateStats();

    input.value = "";
    input.focus();
    showNotification("Task added successfully!");
}

function createTodoElement(todo) {
    var li = document.createElement("li");
    if (todo.completed) {
        li.classList.add('completed');
    }

    // Checkbox
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.onchange = function() {
        toggleTodo(todo.id);
    };

    // Text
    var span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;
    span.ondblclick = function() {
        editTodo(todo.id);
    };
    span.title = "Double-click to edit";

    // Delete button
    var deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function() {
        deleteTodo(todo.id);
    };

    li.dataset.id = todo.id;
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
}

function toggleTodo(id) {
    var todos = getTodos();
    var todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        updateStats();
        renderTodos();
        showNotification(todo.completed ? "Task marked as complete!" : "Task marked as incomplete!");
    }
}

function deleteTodo(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        var todos = getTodos();
        todos = todos.filter(t => t.id !== id);
        localStorage.setItem('todos', JSON.stringify(todos));
        updateStats();
        renderTodos();
        showNotification("Task deleted!");
    }
}

function editTodo(id) {
    var todos = getTodos();
    var todo = todos.find(t => t.id === id);
    if (todo) {
        var newText = prompt("Edit task:", todo.text);
        if (newText !== null && newText.trim() !== '') {
            todo.text = newText.trim();
            saveTodos();
            renderTodos();
            showNotification("Task updated!");
        }
    }
}

function saveTodos() {
    var list = document.getElementById("todoList");
    var todos = [];
    list.querySelectorAll('li').forEach(li => {
        var id = parseInt(li.dataset.id);
        var checkbox = li.querySelector('.checkbox');
        var text = li.querySelector('.todo-text').textContent;
        todos.push({
            id: id,
            text: text,
            completed: checkbox.checked
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    var stored = localStorage.getItem('todos');
    return stored ? JSON.parse(stored) : [];
}

function loadTodos() {
    var todos = getTodos();
    var list = document.getElementById("todoList");
    list.innerHTML = '';
    todos.forEach(todo => {
        var li = createTodoElement(todo);
        list.appendChild(li);
    });
}

function renderTodos() {
    loadTodos();
}

function updateStats() {
    var todos = getTodos();
    var total = todos.length;
    var completed = todos.filter(t => t.completed).length;
    var pending = total - completed;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('pendingCount').textContent = pending;

    var emptyState = document.getElementById('emptyState');
    if (total === 0) {
        emptyState.style.display = 'block';
        document.getElementById('todoList').style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        document.getElementById('todoList').style.display = 'block';
    }
}

function showNotification(message) {
    var notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("show");
    
    setTimeout(function() {
        notification.classList.remove("show");
    }, 3000);
}