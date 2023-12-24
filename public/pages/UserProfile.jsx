import { userService } from "../services/user.service.js"
import { update } from "../store/actions/user.actions.js"

const { useSelector, useDispatch } = ReactRedux
const { useParams, useNavigate } = ReactRouterDOM
const { useState } = React


export function UserProfile() {

    const user = useSelector(storeState => storeState.userMoudle.userObj)
    const [infoToChange, setInfoToChange] = useState({ ...user })
    const navigate = useNavigate()

    function handleChange({ target }) {
        const { name: field, value } = target
        setInfoToChange(prevInfo => ({ ...prevInfo, [field]: value }))
    }



    function handleSubmit(ev) {
        ev.preventDefault()
        const userToSave = { ...user, ...infoToChange }
        update(userToSave)
            .then((user) => {
                navigate('/todo/' + user._id)
            })
            .catch((err) => console.log('err: ', err))
    }

    const { activites } = infoToChange

    const activityTimes = userService.getActivityTimes(activites)

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
                {/* <input type="color" name="background-color" value="#e66465" />
                <input type="color" name="color" value="#e66465" /> */}
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