App = {

    // the contracts of DAPP
    contracts: {},

    // object ethereum 
    web3Provider: "",

    // init function 
    init: async () => {
        await App.loadEthereum();
        await App.loadAccount();
        await App.loadContracts();
        App.render();
        App.renderTasks();
    },

    // save object ethereum
    loadEthereum: async () => {
        if(window.ethereum){
            App.web3Provider = window.ethereum;
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        }else if(window.web3){
            web3 = new Web3(window.web3.currentProvider);
        }else{
            alert("You don't have a ethereum WALLET, Try it installing METAMASK");
        }
    },

    // To know the count that make transaction 
    loadAccount: async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        App.account = accounts[0];
    },

    // load a contract
    loadContracts: async () => {
        // get contracts 
        const res = await fetch("TasksContract.json");
        const TasksContractJSON = await res.json();

        // set new property with all properties of the contract ready
        App.contracts.tasksContract = TruffleContract(TasksContractJSON);
        //create the property setProvider
        App.contracts.tasksContract.setProvider(App.web3Provider);
        //create the tasksContract property which is the contract already configured
        App.tasksContract = await App.contracts.tasksContract.deployed();
    },

    // this function render num account 
    render: () => {
        document.getElementById('account').innerHTML = App.account;
    },

    // this funciton get the tasks 
    renderTasks: async () => {
        const TaskCounter = await App.tasksContract.taskCounter();
        const TaskCounterNumber = TaskCounter.toNumber();
        
        let html = '';

        for(let i = 1; i <= TaskCounterNumber; i++){
            const task = await App.tasksContract.tasks(i);
            const taskId = task[0];
            const taskTitle = task[1];
            const taskDescription = task[2];
            const taskDone = task[3];
            const taskCreated = task[4];

            let taskElement = `
                <div class="card bg-dark rounded-0 mb-2">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>${taskTitle}</span>
                        <div class="form-check form-switch">
                            <input data-id="${taskId}" class="form-check-input" type='checkbox' ${taskDone && 'checked'} onchange="App.toggleDone(this)"/>
                        </div>
                    </div>

                    <div class="card-body">
                            <span>${taskDescription}</span>
                            <p class="text-muted">Task was created ${new Date(taskCreated * 1000).toLocaleString()}</p>
                    </div>
                </div>
            `;
            html += taskElement;
        }
        document.querySelector('#tasksList').innerHTML = html;
    },

    // this functions is of smartcontract tasksContracts.sol 
    createTask: async(title, description) => {
        const result = await App.tasksContract.createTask(title, description, {from: App.account});
    },


    toggleDone: async (element) => {
        const taskId = element.dataset.id;
        await App.tasksContract.toggleDone(taskId, {from: App.account});
        window.location.reload();
    }
    
}

// this could be executed like this in ui.js so document.addEventListener(DOMContentLoaded, () => {App.init()});
App.init();
