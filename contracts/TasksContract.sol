// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// este contrato tendra un CRUD, para crear, eliminar, actualizar tareas

contract TasksContract {

    // contract variables

    uint public taskCounter = 0;

    // constructor initializer 
    constructor() {
        createTask("Tarea de prueba", "Crea tus tareas");
    }

    // event that save data in transaction
    event TaskCreated (
        uint id,
        string title,
        string description,
        bool done,
        uint createdAt
    );

    event TaskToggleDone ( uint id, bool done);

    //datatype
    struct Task {  //each task
        uint id;
        string title;
        string description;
        bool done;
        uint createdAt;
    }

    // contract functions

    // list the tasks
    mapping (uint256 => Task ) public tasks; //tasks list
    
    // create task 
    function createTask(string memory _title, string memory _description) public {
        taskCounter++;
        tasks[taskCounter] = Task(taskCounter, _title, _description, false, block.timestamp);

        // save data in transaction with event created 
        emit TaskCreated(taskCounter, _title, _description, false, block.timestamp);
    }

    // update task 
    function toggleDone(uint256 _id) public {
        // find task
        Task memory _task = tasks[_id];
        // change boolean 
        _task.done = !_task.done;
        // save changes 
        tasks[_id] = _task;
        //save event in transaction
        emit TaskToggleDone(_id, _task.done);
    }


}

