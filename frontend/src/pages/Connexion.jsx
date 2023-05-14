const Connexion = () =>
{
    return(
        <div>
            <h2 className="title is-2">Connexion :</h2>

            <div className="field">
                <label className="label">Email</label>
                <div className="control">
                    <input className="input form-field" type="email" placeholder="e.g. alexsmith@gmail.com"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Mot de passe</label>
                <div className="control">
                    <input className="input form-field" type="password" placeholder="********"/>
                </div>
            </div>

            <button>connexion</button>
        </div>
    )
}
export default Connexion;