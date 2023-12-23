import { userService } from "../services/user.service.js"
import { EDIT_USER } from "../store/store.js"

const { useSelector, useDispatch } = ReactRedux
const { useParams, useNavigate } = ReactRouterDOM
const { useState } = React


export function UserProfile() {

    const user = useSelector(storeState => storeState.userObj)
    const [infoToChange, setInfoToChange] = useState({ ...user })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function handleChange({ target }) {
        const { name: field, value } = target
        setInfoToChange(prevInfo => ({ ...prevInfo, [field]: value }))
    }



    function handleSubmit(ev) {
        ev.preventDefault()
        const userToSave = { ...user, ...infoToChange }
        console.log("userToSave:", userToSave)

        userService.update(userToSave)
            .then((user) => {
                console.log("user:", user)
                userService.addActivity('user updated his username from: ' + infoToChange.username + 'too: ' + user.username)
                dispatch({ type: EDIT_USER, user })
                navigate('/todo/' + user._id)

            })
    }
    const { username, activites } = infoToChange
    const activityTimes = userService.getActivityTimes(activites)
    console.log("activityTimes:", activityTimes)
    return (
        <section className="user-profile">
            <form className="user-edit" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={infoToChange.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <button>Save</button>
            </form>
            <ul className="user-activities">
                {
                    activityTimes.map((activity, idx) =>
                        <li key={idx}>
                            <span>{activity.timeStr}</span>
                            <span>{activity.txt}</span>
                        </li>)
                }
            </ul>
        </section>
    )
}