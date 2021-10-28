const botones= document.querySelector('#botones');
const nombreUsuario= document.querySelector('#nombreUsuario');
const contenidoProtegido= document.querySelector('#contenidoProtegido');
const formulario= document.querySelector('#formulario');
const inputChat= document.querySelector('#inputChat');

firebase.auth().onAuthStateChanged((user)=> {
    if(user){
        console.log(user);
        botones.innerHTML= /*html*/`
            <button class="btn btn-outline-danger" id="btnCerrarSesion">Cerrar Sesion</button>
        `;
        cerrarSesion();
        nombreUsuario.innerHTML= user.displayName;
        contenidoProtegido.innerHTML= /*html*/`
            <p class="text-center lead mt-5">Bienvenido ${user.email}</p>
        `;
        formulario.classList= 'input-group py-3 fixed-bottom container';
        contenidoChat(user);
    }
    else{
        console.log("No existe user");
        botones.innerHTML= /*html*/`
            <button class="btn btn-outline-success mr-3" id="btnAcceder">Acceder</button>
        `;
        formulario.classList= 'input-group py-3 fixed-bottom container d-none';

        iniciarSesion();
        nombreUsuario.innerHTML= 'Chat';
        contenidoProtegido.innerHTML= /*html*/`
            <p class="text-center lead mt-5">Debes iniciar sesion</p>
        `;
    }
});


const contenidoChat= (user)=> {
    formulario.addEventListener('submit', async(e)=> {
        e.preventDefault();

        if(!inputChat.value.trim()){
            return
        }

        await firebase.firestore().collection('chat').add({
            texto: inputChat.value,
            uid: user.uid,
            fecha: Date.now()
        })
        .then(res=> console.log("hecho"))
        .catch(err=> console.log(err));

        formulario.reset();
    });
} 

const iniciarSesion= ()=> {
    const btnAcceder= document.querySelector('#btnAcceder');
    btnAcceder.addEventListener('click', async (e)=> {
        try {
            const provider= new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider);
        } catch (error) {
            console.log(error);
        }
    });
}


const cerrarSesion= ()=> {
    const btnCerrarSesion= document.querySelector('#btnCerrarSesion');
    btnCerrarSesion.addEventListener('click', ()=> {
        firebase.auth().signOut();
    });
}