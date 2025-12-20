import { loginUser, registerUser } from "../data/api";

class AuthModel {
  async login(email, password) {
    // Memanggil API login dari api.js
    return await loginUser(email, password);
  }

  async register(name, email, password) {
    // Memanggil API register dari api.js
    return await registerUser(name, email, password);
  }
}

export default AuthModel;
