

export function TodoFilter({ handleChange,filterTitle }) {
    return (
        <section className="todo-filter">
            <h2>ToDo filter</h2>
            <form >
                <label htmlFor="title">Title </label>
                <input value={filterTitle} onChange={handleChange} type="text" id="title" name="title" />
                <button>Submit</button>
            </form>

            <label htmlFor="sort">Sort By:</label>
            <select name="sort" id="sort" onChange={handleChange} defaultValue={'name'}>
                <option value={'name'}>Name</option>
                <option value={'length'}>Length</option>
            </select>
        </section>
    )
}