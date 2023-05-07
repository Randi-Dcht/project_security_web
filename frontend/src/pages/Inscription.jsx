const Inscription = () =>
{
    return(
        <div>
            <h2 className="title is-2">Inscription :</h2>

            <div className="field">
                <label className="label">Pseudo</label>
                <div className="control">
                    <input className="input" type="text" placeholder="e.g Alex Smith"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Email</label>
                <div className="control">
                    <input className="input" type="email" placeholder="e.g. alexsmith@gmail.com"/>
                </div>
            </div>

            <button>inscription</button>
        </div>
    )
}
export default Inscription;