import api from '../../../utils/api'

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import styles from './AddPet.module.css'

import PetForm from '../../form/PetForm'

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage'

function EditPet() {
  const [pet, setPet] = useState({})
  const [token] = useState(localStorage.getItem('token') || '')
  const { id } = useParams()
  const { setFlashMessage } = useFlashMessage()
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get(`/pets/${id}`, {
        headers: {
          authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setPet(response.data.pet)
      })
  }, [token, id])

  async function updatePet(pet) {
    let msgType = 'success'

    const formData = new FormData()

    const petFormData = await Object.keys(pet).forEach((key) => {
      if (key === 'images') {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append(`images`, pet[key][i])
        }
      } else {
        formData.append(key, pet[key])
      }
    })

    formData.append('pet', petFormData)

    const data = await api
      .put(`pets/${pet._id}`, formData, {
        headers: {
          authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data)
        return response.data
      })
      .catch((err) => {
        console.log(err)
        msgType = 'error'
        return err.response.data
      })

    setFlashMessage(data.message, msgType)
    if(msgType !== 'error'){
      navigate('/pets/mypets')
    }
  }

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Editando o Pet: {pet.name}</h1>
        <p>Depois da edição os dados serão atualizados no sistema</p>
      </div>
      {pet.name && (
        <PetForm handleSubmit={updatePet} petData={pet} btnText="Editar" />
      )}
    </section>
  )
}

export default EditPet