const loginForm = document.querySelector('#login')
const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')
const errorMsg = document.querySelector('#error')
const successMsg = document.querySelector('#success')
const loginBtn = document.querySelector('.submit-btn')


loginForm.addEventListener('submit', async(e)=>{
    e.preventDefault()
    const email = emailInput.value
    const password = passwordInput.value
    loginBtn.textContent = "Loading..."


    try {
        const user = await axios.post('https://parcel-delivery.herokuapp.com/api/v1/auth/login', {email,password })

        successMsg.style.visibility = 'visible'

          setTimeout(function(){
            successMsg.style.visibility = 'hidden'
            
        }, 2000)
        console.log(user.data.user)
        console.log(user.data)
        
        emailInput.value =''
        passwordInput.value =''
        localStorage.setItem("token", user.data.token)
        localStorage.setItem("details", JSON.stringify({email:user.data.user.email, name:user.data.user.name }))

        if(user.data.user.role === "user"){
            location.href = 'user.html'
        }else{
            location.href = 'admin.html'
        }


    } catch (error) {
         errorMsg.style.visibility = 'visible'
         errorMsg.textContent = `${error.response.data.msg}`
          setTimeout(function(){
            errorMsg.style.visibility = 'hidden'
            
        }, 2000)
        console.log(error.response.data)
         emailInput.value =''
        passwordInput.value =''
    }
    loginBtn.textContent = "Login"

})