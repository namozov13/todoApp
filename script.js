const todoInput = document.getElementById("newTodo");
const form = document.querySelector(".newTodoBox form");
const list = document.querySelector('.todolist');
const err = document.querySelector('.err');

const itemsLeft = document.getElementById('itemsLeft');

const switchBtn = document.getElementById('switchMode');
const body = document.querySelector('body');
const themesvg = switchBtn.querySelector('img')

const mode = (modeName) => {
    if (modeName == 'dark') {
        body.classList.remove('lightMode');
        body.classList.add('darkMode');
        localStorage.setItem('theme', 'dark')
        themesvg.src='./assets/light-mode.svg'
    } else if (modeName === 'light') {
        body.classList.remove('darkMode');
        body.classList.add('lightMode');
        localStorage.setItem('theme', 'light')
        themesvg.src='./assets/dark-mode.svg'
    }
};

const theme = localStorage.getItem('theme') || 'light';
mode(theme);


switchBtn.addEventListener('click', () => {
    if (body.classList.contains('darkMode')) {
        mode('light');
    } else if (body.classList.contains('lightMode')) {
        mode('dark');
    }
})

let todos = JSON.parse(localStorage.getItem('todos')) || [
    { nameTodo: 'Hello, user, you can delete me.', completed: false }
];

const updateLS = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

const actCounter = () => {
    let activeTodos = todos.filter(item => !item.completed);
    itemsLeft.textContent = activeTodos.length;
};

actCounter();

const addTodoUI = (inpValue, isChecked) => {
    if (inpValue) {
        const LI = document.createElement('li');
        const label = document.createElement('label');
        const listmain = document.createElement('div');
        const input = document.createElement("input");
        const btnX = document.createElement('button');
        const img = document.createElement('img');
        const p = document.createElement('p');

        p.textContent = inpValue;
        p.classList = 'todoVal';
        listmain.classList = 'listmain';
        const radioBox = document.createElement('div');
        radioBox.classList = 'radioBox';

        img.setAttribute('src', './assets/delTodo.svg');
        img.setAttribute('alt', 'delbutton');
        btnX.classList = "x";

        input.type = "checkbox";
        input.checked = isChecked;

        listmain.append(input, radioBox, p);
        btnX.appendChild(img);
        label.append(listmain, btnX);
        LI.appendChild(label);
        list.prepend(LI);
    } else {
        err.classList.remove('hidden');
        setTimeout(() => {
            err.classList.add('hidden');
        }, 3000);
    }
};
const updateUi = (arr) => {
    arr.forEach(todo => {
        addTodoUI(todo.nameTodo, todo.completed);
    });
};

updateUi(todos);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let val = todoInput.value.trim();
    let isChecked = e.target[0].checked;

    let isRepeating = todos.some(item => item.nameTodo === val)

    if (val && !isRepeating) {
        todos.push({ nameTodo: val, completed: isChecked });
        updateLS();
        addTodoUI(val, isChecked);
        form.reset();
    } else {
        addTodoUI('', false);
    }
    actCounter();
});

list.addEventListener('click', (e) => {
    if (e.target.type === 'checkbox') {
        const li = e.target.closest('li');
        const todoText = li.querySelector('.todoVal').textContent;
        const item = todos.find(target => target.nameTodo === todoText);
        if (item) {
            item.completed = e.target.checked;
            updateLS();
        }
    }
    const btnX = e.target.closest('.x');
    const label = e.target.closest('label');
    if (btnX) {
        const li = btnX.closest('li');
        if (li) {
            const todoText = li.querySelector('.todoVal').textContent;
            todos = todos.filter(todo => todo.nameTodo !== todoText);
            updateLS();
            li.remove();
        }
    }

    actCounter();
});

const filter = (type) => {
    list.innerHTML = "";
    let copyTodos = todos;
    if (type === "active") {
        copyTodos = copyTodos.filter(item => item.completed === false)
    } else if (type === "completed") {
        copyTodos = copyTodos.filter(item => item.completed === true)
    }

    updateUi(copyTodos);
}

all.addEventListener('change', () => filter('all'));
byAct.addEventListener('change', () => filter('active'));
byComp.addEventListener('change', () => filter('completed'));

const clearBtn = document.getElementById('clearComp');


const clearComp = () => {
    todos = todos.filter(todo => !todo.completed)
    list.innerHTML = '';
    actCounter();
    updateLS();
    updateUi(todos);
}

clearBtn.addEventListener('click', clearComp);