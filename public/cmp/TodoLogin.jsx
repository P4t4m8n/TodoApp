import { userService } from "../services/user.service.js"
import { login, signup } from "../store/actions/user.actions.js"

const { useState } = React
const { useNavigate } = ReactRouter

export function TodoLogin() {

    const [isSignup, setIsSignUp] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

    const navigate = useNavigate()
    
    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }


    function isLogin(ev) {
        ev.preventDefault()
        isSignup ? onSignup(credentials) : onLogin(credentials)
    }

    function onLogin(credentials) {
        login(credentials)
            .then(() => {
                navigate('/')
                console.log('Logged in successfully')
            })
            .catch((err) => { console.log(err) })

    }

    function onSignup(credentials) {
        signup(credentials)
            .then(() => {
                console.log('Signed in successfully')
            })
            .catch((err) => { console.log(err) })
    }

    return (

        <div className="login-page">

            <form className="login-form" onSubmit={isLogin}>
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    autoComplete="off"
                />
                {isSignup && <input
                    type="text"
                    name="fullname"
                    value={credentials.fullname}
                    placeholder="Full name"
                    onChange={handleChange}
                    required
                />}
                <button>{isSignup ? 'Signup' : 'Login'}</button>
            </form>
            <div className="login-btns">
                <a href="#" onClick={() => setIsSignUp(!isSignup)}>
                    {isSignup ?
                        'Already a member? Login' :
                        'New user? Signup here'
                    }
                </a>
            </div>
        </div>
    )
}