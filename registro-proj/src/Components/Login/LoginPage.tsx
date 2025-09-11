import './LoginPage.css';

function handleSubmit({}) {
  alert("Submit");
}

function LoginPage() {
    return (
      <>
        <div className="square">
          <form onSubmit={handleSubmit}>
            <label>Username
              <input type="text" placeholder="Username" />
            </label>
            <label>Password
              <input type="text" placeholder="Password" />
            </label>
            <button type="submit">Accedi</button>  
          </form>
        </div>
      </>
  );

  /**
   * Importante per il componente
   * body {
      margin: 0;
     * display: grid;
     * place-items: center;
      min-width: 320px;
      min-height: 100vh;
    }
   */
}

export default LoginPage;
