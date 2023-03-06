let inputSearch = null, 
    buttonSearch = null, 
    panelUsers = null; 
    panelStatistics = null;
    divLoader = null,
    divInteractive = null,
    users =[];

window.addEventListener('load', async () => {
    mapElements();
    await fetchUsers();

    addEvents();
});

function mapElements(){
    inputSearch = document.querySelector('#inputSearch');
    buttonSearch = document.querySelector('#buttonSearch');
    panelUsers = document.querySelector('#panelUsers');
    panelStatistics = document.querySelector('#panelStatistics');

    divInteractive = document.querySelector('#divInteractive');
    divLoader = document.querySelector('#divLoader');
    
}

async function fetchUsers(){
    const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');

    const json = await res.json();
    users = json.results.map(({login, name, dob, gender, picture}) => {
        const fullName = `${name.first} ${name.last}`;
        return {
            id: login.uuid,
            name : fullName,
            naemLowerCase: fullName.toLowerCase(),
            age: dob.age,
            gender: gender,
            picture: picture.large
        };
    })
    .sort((a,b) => {
        return a.name.localeCompare(b.name);
    });   
    
    showInteractive();
}

function showInteractive(){
    setTimeout(() =>{
        divLoader.classList.add('hidden');
        divInteractive.classList.remove('hidden');
    }, 1000);
}


function addEvents(){
    inputSearch.addEventListener('keyup', handleKeyUp);
    buttonSearch.addEventListener('click', buttonClick);
}

function handleKeyUp(event){
    const currentKey = event.key;

    if( currentKey !== 'Enter' ){
        return;
    }
    
    const filterText = event.target.value;
    
    if( filterText.trim() !== '' ){
        filterUsers(filterText);
    }
}

function buttonClick(event){
    const currentButton = event.type;
    const filterText = event.target.value;

    if(currentButton == 'click'){
        filterUsers(filterText);
    };
}

function filterUsers(filterText){
    const filterTextLowerCase = filterText.toLowerCase();

    const filteredUsers = users.filter((user) => {
        return user.naemLowerCase.includes(filterTextLowerCase);
    });
    renderUsers(filteredUsers);
    renderStatistic(filteredUsers);
}

function renderUsers(users) {
    panelUsers.innerHTML = '';
    panelStatistics.innerHTML = '';

    const h2 = document.createElement('h2');
    const ul = document.createElement('ul');
    const p = document.createElement('p');
    p.classList.add('flex-align-top');

    users.forEach(user => {
        const li = document.createElement('li');
        li.classList.add('flex-row');
        li.classList.add('flex-align-center');
        
        const img = `<img src="${user.picture}" alt="${user.name}" class='userImg'>`;
        const userData = `<span><strong>${user.name}, ${user.age} anos </strong></span>`;

        li.innerHTML = `
            ${img} ${userData}
        `;

        ul.appendChild(li);
    });

    h2.textContent = `${users.length} usuário(s) encontrado(s)`;
    panelUsers.appendChild(h2);
    panelUsers.appendChild(ul);
}

function renderStatistic(users){
    let CountMans = users.filter(user => user.gender === 'male').length;
    let CountWomans = users.filter(user => user.gender === 'female').length;
    let CountAges = users.reduce((acc, curr) => {
        return acc + curr.age
    }, 0);
    let average = CountAges/users.length || 0;

    panelStatistics.innerHTML = 
    `
        <h2>Estatísticas</h2>
        <ul>
            <li>Sexo Masculino: ${CountMans}</li>
            <li>Sexo Femino: ${CountWomans}</li>
            <li>Soma das Idades: ${CountAges} anos</li>
            <li>Média das Idades: ${Math.round(average)} anos</li>
        </ul>
    `
}