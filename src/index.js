import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
//import './canvas.js'

function DeleteButton(props) {
    return (
        <button
            className={"btn btn-danger btn-sm " + (props.visible ? '' : 'd-none')}
            onClick={props.onClick}
        >
            <i class="bi bi-trash3-fill"></i>
        </button>
    );
}

function EditInput(props) {
    return (
        <input
            className={(props.visible ? '' : 'd-none')}
            onChange={(event) => {
                props.onInput(event.target.value);
            }}
            type="text"
            defaultValue={props.value}
        />
    );
}

function EditButton(props) {
    return (
        <button
            className={"btn btn-info btn-sm " + (props.visible ? '' : 'd-none')}
            onClick={props.onClick}
        >
            <i class="bi bi-pencil-fill"></i>
        </button>
    );
}

function Brief(props) {
    return (
        <div
            className={"brief " + (props.visible ? '' : 'd-none')}
            onClick={(event) => {
                if (event.detail === 2) {
                    props.onDblClick();
                }
            }}
        >
            {props.value}
        </div>
    );
}

function AddButton(props) {
    return (
        <button
            class="btn btn-success"
            onClick={ props.onClick }
        >
            <i class="bi bi-plus-circle-fill"></i>
        </button>
    );
}

function AddBriefInput(props) {
    return (
        <input
            type="text"
            value={(props.value ? props.value : "")}
            onChange={(event) => { props.onChange(event.target.value) }}
        />
    );
}

class AddForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addedBrief: null,
        }
    }

    render() {
        return (
            <div id="new-todo-form" className="list-group">
                <div class="list-group-item active">
                    <AddBriefInput
                        onChange={(brief) => { this.setState({
                                addedBrief: brief,
                            });
                        }}
                        value={this.state.addedBrief}
                    />
                    <AddButton onClick={() => {
                            this.setState({
                                addedBrief: null,
                            });
                            this.props.onAdd(this.state.addedBrief)
                        }}
                    />
                </div>
            </div>
        );
    }
}

class Todo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editedBrief: this.props.brief,
            editionMode: false,
        };
    }

    handleInput(brief) {
        this.setState({
            editedBrief: brief,
        });
    }

    render() {
        return (
            <li className="todo list-group-item list-group-item-action">
                <Brief
                    visible={!this.state.editionMode}
                    value={this.props.brief}
                    onDblClick={() => {
                        this.setState({
                            editionMode: !this.state.editionMode,
                        });
                    }}
                />
                <DeleteButton
                    visible={!this.state.editionMode}
                    onClick={this.props.onDelete}
                />
                <EditInput
                    visible={this.state.editionMode}
                    value={this.props.brief}
                    onInput={(text) => { this.handleInput(text); }}
                />
                <EditButton
                    visible={this.state.editionMode}
                    onClick={() => {
                        this.props.onEdit(this.state.editedBrief);
                        this.setState({
                            editionMode: !this.state.editionMode,
                        });
                    }}
                />
            </li>
        );
    }
}

function TodoList(props) {
    const todoList = props.value.map((todo) => {
        return (
            <Todo
                key={todo.id}
                brief={todo.brief}
                onDelete={() => { props.onDelete(todo.id); }}
                onEdit={(brief) => { props.onEdit(todo.id, brief); }}
            />
        )
    });

    return (
        <ul className="list-group">
            {todoList}
        </ul>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastIntId: 1,
            todos: [
                {
                    id: 'A0',
                    brief: 'Read a book',
                },
                {
                    id: 'A1',
                    brief: 'Do the laundry',
                },
            ],
        };
    }

    generateId() {
        const lastIntId = this.state.lastIntId + 1;
        const id = "A" + lastIntId.toString();

        this.setState({
            lastIntId: lastIntId,
        });

        return id;
    }

    handleAdd(brief) {
        const todos = this.state.todos.slice();
        todos.push({
            id: this.generateId(),
            brief: brief
        });

        this.setState({
            todos: todos,
        });
    }

    handleDelete(id) {
        const todos = this.state.todos.slice()
            .filter(todo => todo.id !== id);

        this.setState({
            todos: todos,
        });
    }

    handleEdit(id, brief) {
        const todos = this.state.todos.slice();
        const index = todos.findIndex(todo => todo.id === id);
        todos[index].brief = brief;

        this.setState({
            todos: todos,
        });
    }

    render() {
        return (
            <div className="container">
            <h1 className="text-center display-1">Todo list coded with <a target="_blank" href="https://reactjs.org/">React</a></h1>
            <div id="container">

                <AddForm onAdd={(brief) => { this.handleAdd(brief); }} />
                <TodoList
                    value={this.state.todos}
                    onDelete={(id) => { this.handleDelete(id); }}
                    onEdit={(id, brief) => { this.handleEdit(id, brief); }}
                />
            </div>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
