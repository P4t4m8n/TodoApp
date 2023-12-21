

export function TodoFilter({ handleChange, onSetFilterSort,filterTitle }) {
    return (
        <section className="todo-filter">
            <h2>ToDo filter</h2>
            <form onSubmit={(onSetFilterSort)}>
                <label htmlFor="title">Title </label>
                <input value={filterTitle} onChange={handleChange} type="text" id="title" name="title" />
                <button>Submit</button>
            </form>

            <label htmlFor="sortBy">Sort By:</label>
            <select name="sortBy" id="sortBy" onChange={handleChange} defaultValue={'name'}>
                <option value={'name'}>Name</option>
                <option value={'length'}>Length</option>
            </select>
        </section>
    )
}