'use strict';

const CliCommander = require('../index');

const TODO_TYPES = {
    FEATURE: 'feature',
    TECH:    'tech',
    BUG:     'bug',
};

const TODO_TYPES_HITS = Object.keys(TODO_TYPES).map(hit => hit.toLocaleLowerCase());

const todos = [];

const cli = new CliCommander();

const getRandomTodoId = () => Math.floor(Math.random() * Math.floor(1000));

cli.on('todo/add', async () => {
    const typeValue = await cli.prompt('Type:', TODO_TYPES_HITS);
    const type      = TODO_TYPES[typeValue.toUpperCase()];

    if (!type) {
        cli.write(`Invalid TODO type:"${typeValue}"`);
        return;
    }

    const title       = await cli.prompt('Title:');
    const description = await cli.prompt('Description:');

    const todo = {
        type,
        title,
        description,
        id: getRandomTodoId(),
    };

    todos.push(todo);

    cli.write(`TODO with id:"${todo.id}" added`);
});

cli.on('todo/edit', async () => {
    const existedTodoIds = todos.map(todo => todo.id);

    const todoId = await cli.prompt('TODO Id:', existedTodoIds);

    const todo = todos.find(todo => String(todo.id) === String(todoId));

    if (!todo) {
        cli.write(`TODO with id:"${todoId}" not found`);
        return;
    }

    const type        = await cli.prompt('Type:', TODO_TYPES_HITS, todo.type);
    const title       = await cli.prompt('Title:', null, todo.title);
    const description = await cli.prompt('Description:', null, todo.description);

    todo.type        = type;
    todo.title       = title;
    todo.description = description;

    cli.write(`TODO with id:"${todo.id}" updated`);
});

cli.on('todo/delete', async () => {
    const existedTodoIds = todos.map(todo => todo.id);

    const todoId = await cli.prompt('TODO Id:', existedTodoIds);

    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    if (!todos[todoIndex]) {
        cli.write(`TODO with id:"${todoId}" not found`);
        return;
    }

    todos.splice(todoIndex, 1);

    cli.write(`TODO with id:"${todoId}" deleted`);
});

cli.on('show/todos', () => {
    console.dir(todos);
});
