import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as  SQLite from 'expo-sqlite';
import {useState, useEffect } from 'react';

let db; // globale variable to be used db conection

export default function App() {

  const [todo, setTodo] = useState(''); // todo hold one item at a time , state variable to track new todo item
  const [todos, setTodos] = useState([]); // todos show the results of  all current list 


  useEffect(() => {

    async function createdb() { // it's a name of db
      db = await SQLite.openDatabaseAsync('exampleschema.db'); // db name as exampleschema
      console.log('Database is  Created: ', db);
      await createTable();
      await fetchTodos();
    };

    createdb(); // calling the function and store in useEffect

  }, []);

  // function to create table

  async function createTable() {
    if (!db) return;

    // execAsynce function of SQLite
    await db.execAsync (`   
      CREATE ATBLE IF NOT EXISTS todos (
       id INT IPRIMARY KEY AUTO_INCREMENT,
       todo TEXT NOT NULL);
       `);
  }


  // function to fetch all data from db table
  async function fetchTodos() {
    if (!db) return;
    const results = await db.getAllAsync('SELECT * FROM todos;'); // getAllAsync another function of SQLite
    setTodos(results);
  }

  // function to insert new todo item into the todo table
  async function addTodo (){
    if(!db || !todo) return;

    // insert new text input from 'todo' state
    await db.runAsync('INSERT INTO todos (todo) VALUES(?);', [todo]); // runAsync function of SQLite

    // refersh the 'todo' state to empty state afetr inserting the text/row
    setTodo(''); 

    // refresh the list of todos
    await fetchTodos();
    
  }

  return (
    <View style={styles.container}>
      <Text  style={styles.header}> Todo List App </Text>
      <TextInput  style={styles.todoInput}
       placeholder='Enter the task'
       value= {todo}
       onChangeText={setTodo}
      />

      <Button title='Add Todo' onPress={addTodo}/>

      <FlatList
      data={todos}
      keyExtractor={item => item.id.toString()}
      renderItem={({item})=>{
        return(
          <View style = {styles.todoItemContainer}>

            <Text style = {styles.todoItemText}> {item.todo}</Text>

          </View>
          
        );
      }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 50
  },
  header: { 
    fontSize: 20, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  todoInput: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'lightgray',
    marginVertical: 15,
    padding: 10,
    marginLeft: '5%',
    width: '90%'
  },
  todoItemContainer: {
    backgroundColor: 'lightyellow',
    marginTop: 10,
    marginLeft: 10,
    width: '60%',
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  todoItemText: {
      paddingTop: 10,
      paddingLeft: 10,
      paddingBottom: 10,
      fontSize: 18
  }
});