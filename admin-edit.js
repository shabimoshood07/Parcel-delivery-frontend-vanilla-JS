const params = window.location.search
const id = new URLSearchParams(params).get('id')
const logoutBtn = document.querySelector('.logout')
const editLabel = document.querySelector('.edit-label')
const presentLocationInput = document.querySelector('.location-input')
const statusInput = document.querySelector('#status')
const updateForm = document.querySelector('.update')
const successMsg = document.querySelector('#success')
const errorMsg = document.querySelector('#error')
const updateBtn = document.querySelector('.update-btn')
const backBtn = document.querySelector('.back-btn')

editLabel.textContent = `Parcel id: ${id}`


// TOKEN
const token = localStorage.getItem('token')
const details =JSON.parse(localStorage.getItem('details'))
// LOGOUT
logoutBtn.addEventListener('click', function(){
  localStorage.clear('token')
  localStorage.clear('details')
  location.href = 'login.html'
})


updateForm.addEventListener('submit', async(e)=>{
  e.preventDefault()
  const status = statusInput.value
  const presentLocation = presentLocationInput.value
        updateBtn.textContent = 'Loading'
        backBtn.style.display = 'none'
    try {
        const parcelLocation = await axios.put(`https://parcel-delivery.herokuapp.com/api/v1/parcels/${id}/presentLocation`,{presentLocation}, {
      headers: {
        Authorization: `Bearer ${token}`,
         },
        })
         successMsg.style.visibility = 'visible'

          setTimeout(function(){
            successMsg.style.visibility = 'hidden'
            
        }, 2000)
    } catch (error) {
         errorMsg.style.visibility = 'visible'
         errorMsg.textContent = `${error.response.data.msg}`
          setTimeout(function(){
            errorMsg.style.visibility = 'hidden'
            
        }, 2000)
        
    }
    
    try {
            const parcelStatus = await axios.put(`https://parcel-delivery.herokuapp.com/api/v1/parcels/${id}/status`,{status}, {
      headers: {
        Authorization: `Bearer ${token}`,
         },
        })
    } catch (error) {
      console.log(error)
    }
        presentLocationInput.value = ""
       updateBtn.textContent = 'Update'
        backBtn.style.display = 'inline'
})


