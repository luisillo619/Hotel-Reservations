import { useState } from "react";
import { signIn } from "next-auth/react";

const initialCredentials = {
  email: "",
  password: "",
};

function Login() {
  const [credentials, setCredentials] = useState(initialCredentials);

  const handleChange = (e) => {
    let { value, name } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   const res = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });
    console.log(res.error)
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          onChange={handleChange}
          type="email"
          value={credentials.email}
          name="email"
        />
        <input
          placeholder="Password"
          onChange={handleChange}
          type="password"
          value={credentials.password}
          name="password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
