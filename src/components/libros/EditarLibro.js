import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';

class EditarLibro extends Component {
  state = {  }

  // refs
  tituloInput = React.createRef();
  editorialInput = React.createRef();
  ISBNInput = React.createRef();
  existenciaInput = React.createRef();

  actualizarLibro = e => {
    e.preventDefault();

    // Construir el nuevo objeto
    const libroActualizado = {
      titulo: this.tituloInput.current.value,
      editorial: this.editorialInput.current.value,
      ISBN: this.ISBNInput.current.value,
      existencia: this.existenciaInput.current.value
    }

    // Extraer firestore y history
    const { firestore, history, libro } = this.props;

    // Actualizar en firestore
    firestore.update({
      collection: 'libros',
      doc: libro.id
    }, libroActualizado)
      .then(() => history.push('/'))


  }

  render() { 

    // Obtener el libro
    const { libro } = this.props;

    if (!libro) return <Spinner />

    return ( 

      <div className="row">

        <div className="col-12 mb-4">
          <Link to={'/'} className="btn btn-secondary">
            <i className="fas fa-arrow-circle-left"></i> {''}
            Volver al Listado
          </Link>
        </div>

        <div className="col-12">

          <h2>
            <i className="fas fa-book"></i> {''}
            Editar Libro
          </h2>

          <div className="row justify-content-center">
            <div className="col-md-8 my-5">

            <form
              onSubmit={this.actualizarLibro}
            >

              <div className="form-group">
                <label>Título:</label>
                <input 
                  type="text"
                  className="form-control"
                  name="titulo"
                  placeholder="Título o Nombre del Libro"
                  required
                  defaultValue={libro.titulo}
                  ref={this.tituloInput}
                />
              </div>

              <div className="form-group">
                <label>Editorial:</label>
                <input 
                  type="text"
                  className="form-control"
                  name="editorial"
                  placeholder="Editorial del Libro"
                  required
                  defaultValue={libro.editorial}
                  ref={this.editorialInput}
                />
              </div>

              <div className="form-group">
                <label>ISBN:</label>
                <input 
                  type="text"
                  className="form-control"
                  name="ISBN"
                  placeholder="ISBN del Libro"
                  required
                  defaultValue={libro.ISBN}
                  ref={this.ISBNInput}
                />
              </div>

              <div className="form-group">
                <label>Cantidad:</label>
                <input 
                  type="number"
                  min="0"
                  className="form-control"
                  name="existencia"
                  placeholder="Cantidad de Libros"
                  required
                  defaultValue={libro.existencia}
                  ref={this.existenciaInput}
                />
              </div>

              <input 
                type="submit"
                value="Editar Libro"
                className="btn btn-success mb-5"
              />

            </form>

            </div>
          </div>

        </div>
      </div>

    );
  }
}
 
EditarLibro.propTypes = {
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

)(EditarLibro);