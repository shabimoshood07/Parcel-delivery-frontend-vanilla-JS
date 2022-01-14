const params = window.location.search
const id = new URLSearchParams(params).get('id')
const destinationInput = document.querySelector('.destination-input')
const successMsg = document.querySelector('#success')
const errorMsg = document.querySelector('#error')
const editLabel = document.querySelector('.edit-label')

const updateForm = document.querySelector('.update')
// TOKEN
const token = localStorage.getItem('token')
const details =JSON.parse(localStorage.getItem('details'))

editLabel.textContent = `Parcel id: ${id}`

updateForm.addEventListener('submit', async(e)=>{
    e.preventDefault()
    const destination = destinationInput.value
    console.log(destination)
    try {
        const parcel = await axios.put(`https://parcel-delivery.herokuapp.com/api/v1/parcels/${id}/destination`,{destination}, {
      headers: {
        Authorization: `Bearer ${token}`,
         },
        })
         successMsg.style.visibility = 'visible'

          setTimeout(function(){
            successMsg.style.visibility = 'hidden'
            
        }, 2000)
        destinationInput.value = ""
    } catch (error) {
         errorMsg.style.visibility = 'visible'
         errorMsg.textContent = `${error.response.data.msg}`
          setTimeout(function(){
            errorMsg.style.visibility = 'hidden'
            
        }, 2000)
        console.log(error.response.data.msg)
        
    }
})