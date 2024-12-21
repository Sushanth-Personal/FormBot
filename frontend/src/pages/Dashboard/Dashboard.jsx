import styles from "./dashboard.module.css";

const Dashboard = () => {
  return (
    <section className = {styles.dashboard}>
      <nav className = {styles.navBar}>
          <div className = {styles.workspaceSelector}>
          Dewank Rastogi's workspace
          </div>
          <div className = {styles.themeSelector}></div>
          <button className = {styles.share}>Share</button>
      </nav>
    </section>
  )
}

export default Dashboard