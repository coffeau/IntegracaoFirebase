
function login() {
    if (firebase.auth().currentUser) {(
        firebase.auth().signOut()
    )}
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            swal.fire({
                icon:'success',
                title:'Login Realizado com Sucesso',
            }).then( () => {
                setTimeout(() => {
                    window.location.replace('index.html')
                }, 1000)
            })
        })
        .catch((error) => {
            const errorCode = error.code
            switch(errorCode){
                case "auth/wrong-password":
                    swal.fire({
                        icon:'error',
                        title:'Senha inválida',
                    })
                    break
                case "auth/wrong-email":
                    swal.fire({
                        icon:'error',
                        title:'E-mail inválido',
                    })
                    break
                case "auth/user-not-found":
                    swal.fire({
                        icon:'warning',
                        title:'Usuário não encontrado',
                        text: 'Deseja criar um usuário?',
                        showCancelButton: true,
                        cancelButtonText: "Não",
                        cancelButtonColor: '#d33',
                        confirmButtonText: "Sim",
                        confirmButtonColor: "#3085d6",
                    }).then((result) => {
                        if(result.value){
                            signUp(email, password)
                        }
                    })
                    break
                default:
                    swal.fire({
                        icon:'error',
                        title:error.message,
                    })
            }  
        })
}

function signUp(email, password){
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            swal.fire({
                icon:'success',
                title:'Usuário registrado com sucesso!',
            }).then(() => {
                setTimeout(() =>{
                    window.location.replace('index.html')
                }, 1000)
            })
        })

        .catch((error) => {
            const errorCode = error.code
            switch(errorCode){
                case "auth/weak-password":
                    swal.fire({
                        icon:'error',
                        title:'Senha fraca',
                        text:'A senha precisa ter pelo menos seis caracteres',
                    })
                    break
                default:
                    swal.fire({
                        icon:'error',
                        title:error.message,
                    })
            }
        })
}

function logout(){
    firebase.auth().signOut()
}