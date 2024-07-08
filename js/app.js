const pacienteInput = document.querySelector('#paciente');
const propietarioInput = document.querySelector('#propietario');
const emailInput = document.querySelector('#email');
const fechaInput = document.querySelector('#fecha');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#formulario-cita');
const formularioInput = document.querySelector('#formulario-cita input[type="submit"]')
const contenerdorCitas = document.querySelector('#citas');


const citaObj = {
    id: generarId(),
    paciente: '',
    propietario: '',
    email: '',
    fecha: '',
    sintomas: ''
}

//Eventos
pacienteInput.addEventListener('change', datosCita)
propietarioInput.addEventListener('change', datosCita)
emailInput.addEventListener('change', datosCita)
fechaInput.addEventListener('change', datosCita)
sintomasInput.addEventListener('change', datosCita)

formulario.addEventListener('submit', submitCita);

let editando = false

class Notificacion {
    constructor({ texto, tipo }) {
        this.texto = texto
        this.tipo = tipo
        this.mostrar()
    }

    mostrar() {
        //crear notificación
        const alerta = document.createElement('div')
        alerta.classList.add('alerta')

        //elminar alertas ducplicada
        const alertaPrevia = document.querySelector('.alerta');

        alertaPrevia?.remove()


        // si es un tipo de error , agrega una clase
        this.tipo === 'error' ? alerta.classList.add('alerta-roja') : alerta.classList.add('alerta-verde');

        //mensaje de error
        alerta.textContent = this.texto

        //insertar en el DOM
        formulario.parentElement.insertBefore(alerta, formulario)

        //quitar despues de 5 segundos
        setInterval(() => {
            alerta.remove()
        }, 3000);
    }
}

class AdminCitas {
    constructor() {
        this.citas = []
    }

    agregar(cita) {
        this.citas = [...this.citas, cita]
        this.mostrar();
    }

    editar(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
        this.mostrar()   
    }

    eliminar(id) {
        this.citas = this.citas.filter(cita => cita.id !== id)
        this.mostrar()
    }

    mostrar() {
        //limpiar el html previo
        while (contenerdorCitas.firstChild) {
            contenerdorCitas.removeChild(contenerdorCitas.firstChild)
        }

        //Si hay citas
        if(this.citas.length === 0) {
            contenerdorCitas.textContent = 'No hay pacientes'
            return;
        }

        //generando las citas
        this.citas.forEach(cita => {
            const divCita = document.createElement('div');
            divCita.classList.add('container-citas-paciente');

            const paciente = document.createElement('p');
            paciente.classList.add('container-citas-paciente')
            paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`;

            const propietario = document.createElement('p');
            propietario.classList.add('container-citas-paciente')
            propietario.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${cita.propietario}`;

            const email = document.createElement('p');
            email.classList.add('container-citas-paciente')
            email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${cita.email}`;

            const fecha = document.createElement('p');
            fecha.classList.add('container-citas-paciente')
            fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${cita.fecha}`;

            const sintomas = document.createElement('p');
            sintomas.classList.add('container-citas-paciente')
            sintomas.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${cita.sintomas}`;

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('button-editar');
            btnEditar.innerHTML = 'Editar '
            const clone = structuredClone(cita)
            btnEditar.onclick = () => cargarEdicion(clone);
            

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('button-eliminar');
            btnEliminar.innerHTML = 'Eliminar '
            btnEliminar.onclick = () => this.eliminar(cita.id)

            const contenedorBotones = document.createElement('DIV');
            contenedorBotones.classList.add('botones');

            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);


            // Agregar al HTML
            divCita.appendChild(paciente);
            divCita.appendChild(propietario);
            divCita.appendChild(email);
            divCita.appendChild(fecha);
            divCita.appendChild(sintomas);
            divCita.appendChild(contenedorBotones);
            contenerdorCitas.appendChild(divCita);
        });
    }
}


function datosCita(event) {
    citaObj[event.target.name] = event.target.value;
}

const citas = new AdminCitas();
function submitCita(event) {
    event.preventDefault();

    if (Object.values(citaObj).some(valor => valor.trim() === '')) {
        new Notificacion({
            texto: 'Todos los campos son obligatorios',
            tipo: 'error'
        })
        return;
    }

    if(editando) {
        citas.editar({...citaObj})
        new Notificacion({
            texto: 'Guardado Correctamente',
            tipo: 'exito'
        })
    } else {
        citas.agregar({ ...citaObj });
        new Notificacion({
            texto: 'Paciente Registrado',
            tipo: 'exito'
        })
    }

    formulario.reset();
    reiniciarObjetoCita();
    formularioInput.value = 'Registar Paciente'
    editando = false;
}


function reiniciarObjetoCita() {

    // citaObj.paciente = '';
    // citaObj.propietario = '';
    // citaObj.email = '';
    // citaObj.fecha = '';
    // citaObj.sintomas = '';

    Object.assign(citaObj, {
        id: generarId(),
        paciente: '',
        propietario: '',
        email: '',
        fecha: '',
        sintomas: ''
    })

}

function generarId() {
    return Math.random().toString(36).substring(2) + Date.now();
}

function cargarEdicion(cita) {
    Object.assign(citaObj, cita)

    pacienteInput.value = cita.paciente
    propietario.value = cita.propietario
    emailInput.value = cita.email
    fechaInput.value = cita.fecha
    sintomasInput.value = cita.sintomas

    editando = true

    formularioInput.value = 'Guardar Cambios'
}