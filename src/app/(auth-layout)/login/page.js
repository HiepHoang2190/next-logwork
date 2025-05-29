import styles from "@/app/ui/login/login.module.css";
import LoginForm from "@/app/ui/login/loginForm/loginForm";

export const metadata = {
  title: "Lotus's Logwork Login Page",
  description: "Logwork page by Lotus Outsourcing",
};

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
