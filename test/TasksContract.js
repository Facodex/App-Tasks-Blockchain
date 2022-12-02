// get and save contract 
const TasksContract = artifacts.require('TasksContract');

// this is my test 
contract('TasksContract', () => {

    // deployed the contract
    before(async () => {
        this.tasksContract = await TasksContract.deployed();
    });

    // execution check
    it('migrate deployed successfully', async () => {

        const address = this.tasksContract.address;

        // this function is of mocha and chai framework
        // if address != null is correct
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    });

    it('Task default is ready', async () => {
        // save counter
        const taskCounter = await this.tasksContract.taskCounter();
        // call task with counter 
        const task = await this.tasksContract.tasks(taskCounter);

        // we compare
        assert.equal(task.id.toNumber(), taskCounter);
        assert.equal(task.title, 'Tarea de prueba');
        assert.equal(task.description, 'Crea tus tareas');
        assert.equal(task.done, false);
        assert.equal(taskCounter, 1);

    });

    it('Task created successfully', async () => {
        const result = await this.tasksContract.createTask('Tarea numero 2', "Lengua"); //this is a transaction
        const taskEvent = result.logs[0].args;
        const taskCounter = await this.tasksContract.taskCounter();

        assert.equal(taskCounter, 2);
        assert.equal(taskEvent.id.toNumber(), 2);
        assert.equal(taskEvent.title, 'Tarea numero 2');
        assert.equal(taskEvent.description, 'Lengua');
        assert.equal(taskEvent.done, false);
    });

    it('Task toggle done', async() => {
        const result = await this.tasksContract.toggleDone(1);  //change property "done" of the task 1
        const taskEvent = result.logs[0].args;                  //save result of the transaction
        const task = await this.tasksContract.tasks(1);         //get task changed for then check

        assert.equal(task.done, true);                          //check the task.done is true
        assert.equal(taskEvent.done, true);                     //check the event is true
        assert.equal(taskEvent.id, 1);                          //check id is correct
    });

})
