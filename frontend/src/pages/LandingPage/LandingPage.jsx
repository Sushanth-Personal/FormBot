import styles from './landingpage.module.css'

const LandingPage = () => {
  return (
    <section className = {styles.landingPage}>
        <nav className = {styles.navBar}>
            <div className = {styles.logoContainer}>
                <img src="/logo.png" alt="" />
                <h1>FormBot</h1>
            </div>
            <div className = {styles.rightContainer}>
                <button className = {styles.signIn}>Sign in</button>
                <button className = {styles.createBot}>Create a FormBot</button>
            </div>
        </nav>
    </section>
  )
}

export default LandingPage;