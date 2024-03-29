import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';

class MostrarLibro extends Component {
  
  devolverLibro = id => {
    
    // Extraer firestore
    const { firestore, libro } = this.props;

    // Copia del libro
    const libroActualizado = {...libro};

    // Eliminar la persona que está realizando la devolución de prestados
    const prestados = libro.prestados.filter(elemento => elemento.codigo !== id);

    libroActualizado.prestados = prestados;

    // Actualizar en firebase
    firestore.update({
      collection: 'libros',
      doc: libroActualizado.id
    }, libroActualizado)
  }

  render() { 

    // Extraer el libro
    const { libro } = this.props;

    if (!libro) return <Spinner />

    // Botón para solicitar un libro
    let btnPrestamo;

    if(libro.existencia - libro.prestados.length > 0) {
      btnPrestamo = <Link 
                      to={`/libros/prestamo/${libro.id}`} 
                      className="btn btn-success"
                      >
                        Solicitar Prestamo
                      </Link>
    } else {
      btnPrestamo = null;
    }


    return ( 

      <div className="row">
          <div className="col-md-6 mb-4">
            <Link to="/" className="btn btn-secondary">
              <i className="fas fa-arrow-circle-left"></i> {''}
              Volver al Listado
            </Link>
          </div>
          <div className="col-md-6 mb-4">
            <Link to={`/libros/editar/${libro.id}`} className="btn btn-primary float-right">
              <i className="fas fa-pencil-alt"></i> {''}
              Editar Libro
            </Link>
          </div>

          <hr className="mx-5 w-100"/>

          <div className="col-12">
            <h2 className="mb-4">
              {libro.titulo}
            </h2>

            <p>
              <span className="font-weight-bold">ISBN:</span> {''}

              {libro.ISBN}
            </p>

            <p>
              <span className="font-weight-bold">Editorial:</span> {''}

              {libro.editorial}
            </p>

            <p>
              <span className="font-weight-bold">Cantidad:</span> {''}

              {libro.existencia}
            </p>

            <p>
              <span className="font-weight-bold">Disponibles:</span> {''}

              {libro.existencia - libro.prestados.length}
            </p>

            {/* Botón para solicitar prestamo de libro*/}
            {btnPrestamo}

            {(libro.prestados.length > 0) ? <h3 className="mt-4 mb-2">Personas que tienen el libro</h3>
              : null}

            {/* Muestra las personas que tienen los libros */}
            {libro.prestados.map(prestado => (

              <div key={prestado.codigo} className="card my-2">
                <h4 className="card-header">
                  {prestado.nombre} {prestado.apellido}
                </h4>

                <div className="card-body">
                  <p>
                    <span className="font-weight-bold">Código:</span> {''}

                    {prestado.codigo}
                  </p>

                  <p>
                    <span className="font-weight-bold">Carrera:</span> {''}

                    {prestado.carrera}
                  </p>

                  <p>
                    <span className="font-weight-bold">Fecha de Solicitud:</span> {''}

                    {prestado.fecha_solicitud}
                  </p>
                </div>

                <div className="card-footer">
                  <button 
                    type="button"
                    className="btn btn-success font-weight-bold"
                    onClick={() => this.devolverLibro(prestado.codigo)}
                  >
                    Realizar Devolución
                  </button>
                </div>
              </div>

            ))}

          </div>
      </div>

    );
  }
}
 
MostrarLibro.propTypes = {
  firestore: PropTypes.object.isRequired
}

export default compose(
  firestoreConnect( props => [
    {
      collection: 'libros',
      storeAs: 'libro',
      doc: props.match.params.id
    }
  ]), 
  connect(({ firestore: {ordered} }, props) => ({
    libro: ordered.libro && ordered.libro[0]
  }))

)(MostrarLibro);