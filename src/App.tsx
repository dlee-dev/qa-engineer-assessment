import React, { FC, useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import styled from "@emotion/styled";
import { AddInput } from "./components/AddInput";
import { TodoItem } from "./components/TodoItem";
import { TodoList } from "./components/TodoList";
import { Header } from "./components/Header";
import { Todo } from "./interface";

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: 300,
});

/**
* This is the initial todo state.
* Instead of loading this data on every reload,
* we should save the todo state to local storage,
* and restore on page load. This will give us
* persistent storage.
*/

const initialData: Todo[] = [
  {
    id: uuid(),
    label: "Buy groceries",
    checked: false,
  },
  {
    id: uuid(),
    label: "Reboot computer",
    checked: false,
  },
  {
    id: uuid(),
    label: "Ace CoderPad interview",
    checked: false,
  },
];

const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : initialData;
  });

  // Persist todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleChange = useCallback((id: string, checked: boolean) => {
    setTodos((prev) => {
      // Update the checked status of the todo
      const updatedTodos = prev.map((todo) =>
        todo.id === id ? { ...todo, checked } : todo
      );
  
      // Separate the unchecked and checked items
      const uncheckedItems = updatedTodos.filter(todo => !todo.checked);
      const checkedItems = updatedTodos.filter(todo => todo.checked);
  
      // Move the most recently checked item to the very bottom
      return [
        ...uncheckedItems,    // Unchecked items come first
        ...checkedItems.reverse(),  // Reversing the checked items to move the most recent to the bottom
      ];
    });
  }, []);
  

  const addTodo = useCallback((label: string) => {
    setTodos((prev) => [
      {
        id: uuid(),
        label,
        checked: false,
      },
      ...prev,
    ]);
  }, []);

  return (
    <Wrapper>
      <Header>Todo List</Header>
      <AddInput onAdd={addTodo} />
      <TodoList>
        {todos.map((todo) => (
          <TodoItem key={todo.id} {...todo} onChange={handleChange} />
        ))}
      </TodoList>
    </Wrapper>
  );
}

export default App;
