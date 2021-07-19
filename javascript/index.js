const db = firebase.firestore()
const currentUser = {}
let tasks = []

function getUser(){
    firebase.auth().onAuthStateChanged((user) => {
        if (user){
            currentUser.uid = user.uid
            let userLabel = document.getElementById("navbarDropdown")
            userLabel.innerHTML = user.email
            readTasks()
        } else{
            swal.fire({
                icon:"success",
                title:"Redirecionando para a tela de autenticação"
            }).then(() =>{
                setTimeout(()=>{
                    window.location.replace("login.html")
                }, 1000)
            })
        }
    })
}

function createDelButton(tasks){
    const newButton = document.createElement("button")
    newButton.setAttribute('class', 'btn btn-light ms-3')
    newButton.appendChild(document.createTextNode("Excluir"))

    for (let task in tasks){
        newButton.setAttribute("onclick", `deleteTask("${tasks[task].id}")`)
    }
    return newButton
}

function renderTasks(tasks){
    let formLivro = document.getElementById('table_id')
    formLivro.innerHTML = ""

    var corpo_tabela = document.querySelector("tbody")

    for (let task in tasks){
        let linha = document.createElement("tr")
        let cellLivro = document.createElement("td")
        let cellAutor = document.createElement("td")
        let cellData = document.createElement("td")

        cellLivro.setAttribute("class", "table-column text-secondary p-2")
        cellAutor.setAttribute("class", "table-column text-secondary p-2")
        cellData.setAttribute("class", "table-column text-secondary p-2")

        let textLivro = document.createTextNode(Object.values(tasks[task].livro).join(''))
        let textAutor = document.createTextNode(Object.values(tasks[task].autor).join(''))
        let textData = document.createTextNode(Object.values(tasks[task].data).join(''))

        cellLivro.appendChild(textLivro)
        cellAutor.appendChild(textAutor)
        cellData.appendChild(textData)
        cellData.appendChild(createDelButton(tasks))
        linha.appendChild(cellLivro)
        linha.appendChild(cellAutor)
        linha.appendChild(cellData)

        corpo_tabela.appendChild(linha)
    }
}

async function readTasks(){
    tasks=[]
    document.getElementById("livro").value = ""
    document.getElementById("autor").value = ""
    document.getElementById("data").value = ""

    console.log(currentUser.uid)
    const logTasks = await db.collection("tasks").where('owner', '==', currentUser.uid).get()
    for (doc of logTasks.docs){
        tasks.push({
            id:doc.id,
            livro:doc.data().livro,
            autor:doc.data().autor,
            data:doc.data().data,
        })
    }
    renderTasks(tasks)
}

async function addTask(){
    const livro = document.getElementById("livro").value
    const autor = document.getElementById("autor").value
    const data = document.getElementById("data").value
    await db.collection("tasks").add({
        livro:livro,
        autor:autor,
        data:data,
        owner: currentUser.uid,
    })
    readTasks()
}

async function deleteTask(id){
    await db.collection('tasks').doc(id).delete()
    readTasks()
}

window.onload = function(){
    getUser()
    
}

