let inputSearch = null, 
    buttonSearch = null, 
    panelUsers = null; 
    panelStatistics = null;
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
        console.log(event);
    };
}

function filterUsers(filterText){
    const filterTextLowerCase = filterText.toLowerCase();

    const filteredUsers = users.filter((user) => {
        return user.naemLowerCase.includes(filterTextLowerCase);
    });

    renderUsers(filteredUsers);
}

function renderUsers(users) {
    panelUsers.innerHTML = '';
    panelStatistics.innerHTML = '';

    const h2 = document.createElement('h2');
    const ul = document.createElement('ul');
    const p = document.createElement('p');
    p.classList.add('flex-align-top');

    let CountMans = 0;
    let CountWomans = 0;
    let CountAges = 0;
    let average = 0;

    users.forEach(user => {
        const li = document.createElement('li');
        li.classList.add('flex-align-top');
        
        const img = `<img src="${user.picture}" alt="${user.name}" class='userImg'>`;
        const userData = `<span>${user.name}, ${user.age} anos </span>`;

        li.innerHTML = `
            ${img} ${userData}
        `;

        ul.appendChild(li);

        if(user.gender === 'male'){
            CountMans++;
        }
        else{
            CountWomans++;
        }

        CountAges = CountAges+user.age;
        average = CountAges/users.length;
    })

    h2.textContent = `${users.length} usuário(s) encontrado(s)`;

    p.innerHTML = `
        <h2>Estatísticas</h2>
        <p>Sexo Masculino: ${CountMans}</p>
        <p>Sexo Femino: ${CountWomans}</p>
        <p>Soma das Idades: ${CountAges} anos</p>
        <p>Média das Idades: ${Math.round(average)} anos</p>
    `

    panelUsers.appendChild(h2);
    panelUsers.appendChild(ul);
    panelStatistics.appendChild(p);
}